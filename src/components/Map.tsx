import React from "react";
import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Box } from "@mui/material";
import LayerToggle from "./LayerToggle";
import { useMapLayers } from "../hooks/useMapLayers";
import {
  MANSFIELD_CENTER,
  BASEMAP_STYLES,
  MapProps,
  MapRef,
  BasemapStyle,
} from "../types/map";
import { GeolocateControl, NavigationControl } from "mapbox-gl";
import { SnowEffect } from "../utils/snowEffect";

const Map = forwardRef<MapRef, MapProps>(({ token, onTrailClick }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const hoverMarker = useRef<mapboxgl.Marker | null>(null);
  const snowEffect = useRef<SnowEffect | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(
    null
  );
  const [showTrails, setShowTrails] = useState(true);
  const [showDEM, setShowDEM] = useState(true);
  const [showContours, setShowContours] = useState(true);
  const [show3DTerrain, setShow3DTerrain] = useState(true);
  const [showSnow, setShowSnow] = useState(false);
  const [showCliffAreas, setShowCliffAreas] = useState(true);
  const [showSnowProbability, setShowSnowProbability] = useState(true);
  const [terrainExaggeration, setTerrainExaggeration] = useState(1.2);
  const [currentStyle, setCurrentStyle] = useState<BasemapStyle>("dark");

  const { setupMapLayers, maintainLayerOrder } = useMapLayers(
    map,
    token,
    onTrailClick,
    setSelectedFeatureId,
    currentStyle
  );

  useImperativeHandle(ref, () => ({
    updateHoverMarker: (coordinates: [number, number] | null) => {
      if (!map.current) return;
      hoverMarker.current?.remove();
      if (coordinates) {
        hoverMarker.current = new mapboxgl.Marker({
          color: "#2D5A27",
        })
          .setLngLat(coordinates)
          .addTo(map.current);
      }
    },
  }));

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: BASEMAP_STYLES[currentStyle],
      center: MANSFIELD_CENTER,
      zoom: 13,
      pitch: 60,
      bearing: 0,
      preserveDrawingBuffer: true,
    });

    map.current.on("load", () => {
      setupMapLayers();

      // Enable 3D terrain on load
      if (map.current) {
        map.current.setTerrain({
          source: "mapbox-dem",
          exaggeration: terrainExaggeration,
        });
        // Set pitch for better 3D visualization
        map.current.easeTo({
          pitch: 60,
          duration: 1000,
        });

        // Initialize snow effect
        snowEffect.current = new SnowEffect(map.current);

        // Set default layer visibility after a short delay to ensure layers are created
        setTimeout(() => {
          if (map.current) {
            // Show terrain raster layer
            if (map.current.getLayer("terrain-raster-layer")) {
              map.current.setLayoutProperty("terrain-raster-layer", "visibility", "visible");
            }
            // Show contours
            if (map.current.getLayer("contours")) {
              map.current.setLayoutProperty("contours", "visibility", "visible");
            }
            // Show cliff areas
            if (map.current.getLayer("cliff-areas-layer")) {
              map.current.setLayoutProperty("cliff-areas-layer", "visibility", "visible");
            }
            // Show snow probability
            if (map.current.getLayer("snow-probability-layer")) {
              map.current.setLayoutProperty("snow-probability-layer", "visibility", "visible");
            }
          }
        }, 100);
      }
    });

    // Add NavigationControl for 3D view manipulation (zoom, pitch, rotation)
    const navigationControl = new NavigationControl({
      visualizePitch: true,
      showZoom: true,
      showCompass: true,
    });
    map.current.addControl(navigationControl, "bottom-right");

    // Add GeolocateControl to the map
    const geolocateControl = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });
    map.current.addControl(geolocateControl, "bottom-right");

    return () => {
      snowEffect.current?.stop();
      map.current?.remove();
      map.current = null;
    };
  }, [token]);

  // Setup map layers when setupMapLayers changes (after initial load)
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      setupMapLayers();
    }
  }, [setupMapLayers]);

  const handleStyleChange = (style: string) => {
    if (!map.current) return;

    // Store the current state values (capture current state before async update)
    const currentZoom = map.current.getZoom();
    const currentCenter = map.current.getCenter();
    const currentPitch = map.current.getPitch();
    const currentBearing = map.current.getBearing();
    const was3DEnabled = show3DTerrain;
    const shouldShowTrails = showTrails;
    const shouldShowDEM = showDEM;
    const shouldShowContours = showContours;
    const shouldShowCliffAreas = showCliffAreas;
    const shouldShowSnowProbability = showSnowProbability;

    setCurrentStyle(style as BasemapStyle);
    map.current.setStyle(BASEMAP_STYLES[style as BasemapStyle]);

    // Restore the state after the style loads
    map.current.once("style.load", () => {
      setupMapLayers();
      map.current?.setZoom(currentZoom);
      map.current?.setCenter(currentCenter);
      map.current?.setPitch(currentPitch);
      map.current?.setBearing(currentBearing);

      // Restore 3D terrain if it was enabled
      if (was3DEnabled && map.current) {
        map.current.setTerrain({
          source: "mapbox-dem",
          exaggeration: terrainExaggeration,
        });
      }
    });

    // Wait for map to be idle (all layers loaded) before restoring visibility
    const restoreVisibility = () => {
      if (!map.current) return;

      // Check if all required layers exist, if not retry
      const requiredLayers = ["trails-line", "trails-line-border", "terrain-raster-layer", "contours", "cliff-areas-layer", "snow-probability-layer"];
      const allLayersExist = requiredLayers.every(layerId => map.current?.getLayer(layerId));

      if (!allLayersExist) {
        // Layers not ready yet, retry after a short delay
        setTimeout(restoreVisibility, 50);
        return;
      }

      // All layers exist, restore visibility using captured state values
      // Restore trails visibility
      if (shouldShowTrails) {
        if (map.current.getLayer("trails-line")) {
          map.current.setLayoutProperty("trails-line", "visibility", "visible");
        }
        if (map.current.getLayer("trails-line-border")) {
          map.current.setLayoutProperty("trails-line-border", "visibility", "visible");
        }
      }

      // Restore terrain visibility
      if (shouldShowDEM) {
        if (map.current.getLayer("terrain-raster-layer")) {
          map.current.setLayoutProperty("terrain-raster-layer", "visibility", "visible");
        }
      }

      // Restore contours visibility
      if (shouldShowContours) {
        if (map.current.getLayer("contours")) {
          map.current.setLayoutProperty("contours", "visibility", "visible");
        }
      }

      // Restore cliff areas visibility
      if (shouldShowCliffAreas) {
        if (map.current.getLayer("cliff-areas-layer")) {
          map.current.setLayoutProperty("cliff-areas-layer", "visibility", "visible");
        }
      }

      // Restore snow probability visibility
      if (shouldShowSnowProbability) {
        if (map.current.getLayer("snow-probability-layer")) {
          map.current.setLayoutProperty("snow-probability-layer", "visibility", "visible");
        }
      }

      maintainLayerOrder();
    };

    // Use idle event to ensure all layers are loaded
    map.current.once("idle", restoreVisibility);
  };

  const handleTrailsToggle = (checked: boolean) => {
    setShowTrails(checked);
    map.current?.setLayoutProperty(
      "trails-line",
      "visibility",
      checked ? "visible" : "none"
    );
    map.current?.setLayoutProperty(
      "trails-line-border",
      "visibility",
      checked ? "visible" : "none"
    );
    maintainLayerOrder();
  };

  const handleDEMToggle = (checked: boolean) => {
    setShowDEM(checked);
    // Hide the old terrain-dem layer
    map.current?.setLayoutProperty(
      "terrain-dem",
      "visibility",
      "none"
    );
    // Show/hide the new terrain raster layer
    map.current?.setLayoutProperty(
      "terrain-raster-layer",
      "visibility",
      checked ? "visible" : "none"
    );
    maintainLayerOrder();
  };

  const handleContoursToggle = (checked: boolean) => {
    setShowContours(checked);
    map.current?.setLayoutProperty(
      "contours",
      "visibility",
      checked ? "visible" : "none"
    );
    maintainLayerOrder();
  };

  const handle3DTerrainToggle = (checked: boolean) => {
    setShow3DTerrain(checked);
    if (!map.current) return;

    if (checked) {
      // Enable 3D terrain
      map.current.setTerrain({
        source: "mapbox-dem",
        exaggeration: terrainExaggeration,
      });
      // Animate to a tilted view for better 3D visualization
      map.current.easeTo({
        pitch: 60,
        duration: 1000,
      });
    } else {
      // Disable 3D terrain
      map.current.setTerrain(null);
      // Return to flat view
      map.current.easeTo({
        pitch: 0,
        duration: 1000,
      });
    }
  };

  const handleTerrainExaggerationChange = (value: number) => {
    setTerrainExaggeration(value);
    if (map.current && show3DTerrain) {
      map.current.setTerrain({
        source: "mapbox-dem",
        exaggeration: value,
      });
    }
  };

  const handleSnowToggle = (checked: boolean) => {
    setShowSnow(checked);
    if (checked) {
      snowEffect.current?.start(150);
    } else {
      snowEffect.current?.stop();
    }
  };

  const handleCliffAreasToggle = (checked: boolean) => {
    setShowCliffAreas(checked);
    map.current?.setLayoutProperty(
      "cliff-areas-layer",
      "visibility",
      checked ? "visible" : "none"
    );
  };

  const handleSnowProbabilityToggle = (checked: boolean) => {
    setShowSnowProbability(checked);
    map.current?.setLayoutProperty(
      "snow-probability-layer",
      "visibility",
      checked ? "visible" : "none"
    );
    maintainLayerOrder();
  };

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      <Box ref={mapContainer} sx={{ position: "absolute", inset: 0 }} />

      <LayerToggle
        currentStyle={currentStyle}
        onStyleChange={handleStyleChange}
        showTrails={showTrails}
        showDEM={showDEM}
        showContours={showContours}
        show3DTerrain={show3DTerrain}
        showSnow={showSnow}
        showCliffAreas={showCliffAreas}
        showSnowProbability={showSnowProbability}
        terrainExaggeration={terrainExaggeration}
        onTrailsToggle={handleTrailsToggle}
        onDEMToggle={handleDEMToggle}
        onContoursToggle={handleContoursToggle}
        on3DTerrainToggle={handle3DTerrainToggle}
        onSnowToggle={handleSnowToggle}
        onCliffAreasToggle={handleCliffAreasToggle}
        onSnowProbabilityToggle={handleSnowProbabilityToggle}
        onTerrainExaggerationChange={handleTerrainExaggerationChange}
      />
    </Box>
  );
});

Map.displayName = "Map";

export default Map;

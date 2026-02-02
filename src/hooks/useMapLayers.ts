import react from 'react';
import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { calculateElevationData } from '../utils/mapUtils';
import type { Trail, BasemapStyle } from '../types/map';

export const useMapLayers = (
  map: React.MutableRefObject<mapboxgl.Map | null>,
  token: string,
  onTrailClick: (trail: Trail) => void,
  setSelectedFeatureId: (id: string | null) => void,
  currentStyle: BasemapStyle
) => {
  // Helper function to maintain layer order (bottom to top: Terrain, Snow Probability, Cliff Areas, Contours, Trails Border, Trails)
  const maintainLayerOrder = useCallback(() => {
    if (!map.current) return;
    
    const layerOrder = [
      "terrain-raster-layer",
      "snow-probability-layer",
      "cliff-areas-layer",
      "contours",
      "trails-line-border",
      "trails-line"
    ];

    // Move each layer to maintain order (only if layer exists)
    for (let i = 0; i < layerOrder.length - 1; i++) {
      const currentLayer = layerOrder[i];
      const nextLayer = layerOrder[i + 1];
      
      if (map.current.getLayer(currentLayer) && map.current.getLayer(nextLayer)) {
        try {
          map.current.moveLayer(currentLayer, nextLayer);
        } catch (e) {
          // Layer might not exist yet, ignore
        }
      }
    }
  }, [map]);

  const setupMapLayers = useCallback(() => {
    if (!map.current) return;

    // Only set up layers if the style is fully loaded
    const setupSources = () => {
      if (!map.current?.getSource("mapbox-dem")) {
        map.current?.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
      }

      if (!map.current?.getSource("backCountry")) {
        map.current?.addSource("backCountry", {
          type: "geojson",
          data: "https://gist.githubusercontent.com/liampaus/db98df1f74962a1030ab5d858048c504/raw/7da27f7ae6bfe74f5b481fddc9fd43ab8a498f84/mansfieldTrails.geojson",
        });
      }

      if (!map.current?.getSource("contours")) {
        map.current?.addSource("contours", {
          type: "vector",
          url: "mapbox://mapbox.mapbox-terrain-v2",
        });
      }



      if (!map.current?.getSource("cliff-areas-raster")) {
        map.current?.addSource("cliff-areas-raster", {
          type: "raster",
          url: "mapbox://onwaterllc.cw2k0ya8",
          tileSize: 256,
        });
      }

      if (!map.current?.getSource("snow-probability-raster")) {
        map.current?.addSource("snow-probability-raster", {
          type: "raster",
          url: "mapbox://onwaterllc.3ky3i0pc",
          tileSize: 256,
        });
      }

      if (!map.current?.getSource("terrain-raster")) {
        map.current?.addSource("terrain-raster", {
          type: "raster",
          url: "mapbox://onwaterllc.3jn1vsji",
          tileSize: 256,
        });
      }
    };

    const setupLayers = () => {
      if (!map.current?.getLayer("hillshade")) {
        map.current?.addLayer({
          id: "hillshade",
          source: "mapbox-dem",
          type: "hillshade",
          layout: { visibility: "none" },
          paint: {
            "hillshade-exaggeration": 1.5,
            "hillshade-illumination-direction": 315,
            "hillshade-shadow-color": "#000000",
            "hillshade-highlight-color": "#ffffff",
            "hillshade-accent-color": "#000000",
          },
        });
      }

      if (!map.current?.getLayer("terrain-dem")) {
        map.current?.addLayer({
          id: "terrain-dem",
          source: "mapbox-dem",
          type: "hillshade",
          layout: { visibility: "none" },
          paint: {
            "hillshade-exaggeration": 0.5,
          },
        });
      }

      // Add layers in reverse order (bottom to top) to ensure correct stacking
      // 5. Terrain (bottommost)
      if (!map.current?.getLayer("terrain-raster-layer")) {
        map.current?.addLayer({
          id: "terrain-raster-layer",
          type: "raster",
          source: "terrain-raster",
          layout: {
            visibility: "none",
          },
          paint: {
            "raster-opacity": 1.0,
          },
        });
      }

      // 4. Snow Probability
      if (!map.current?.getLayer("snow-probability-layer")) {
        map.current?.addLayer({
          id: "snow-probability-layer",
          type: "raster",
          source: "snow-probability-raster",
          layout: {
            visibility: "none",
          },
          paint: {
            "raster-opacity": .6,
          },
        });
      }

      // 3. Cliff Areas
      if (!map.current?.getLayer("cliff-areas-layer")) {
        map.current?.addLayer({
          id: "cliff-areas-layer",
          type: "raster",
          source: "cliff-areas-raster",
          layout: {
            visibility: "none",
          },
          paint: {
            "raster-opacity": .5,
          },
        });
      }

      // 2. Contours
      if (!map.current?.getLayer("contours")) {
        // Use white contours for dark/satellite basemaps, black for outdoors
        const contourColor = currentStyle === "outdoors" ? "#000" : "#FFF";
        
        map.current?.addLayer({
          id: "contours",
          type: "line",
          source: "contours",
          "source-layer": "contour",
          layout: {
            visibility: "none",
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": contourColor,
            "line-width": [
              "match",
              ["get", "index"],
              [0, 5],
              1,
              0.5
            ],
            "line-opacity": 0.5
          },
        });
      } else {
        // Update contour color if layer already exists
        const contourColor = currentStyle === "outdoors" ? "#000" : "#FFF";
        map.current?.setPaintProperty("contours", "line-color", contourColor);
      }

      // 1. Trails Border (wider layer for colored border effect)
      if (!map.current?.getLayer("trails-line-border")) {
        map.current?.addLayer({
          id: "trails-line-border",
          type: "line",
          source: "backCountry",
          layout: {
            "line-join": "round",
            "line-cap": "round",
            visibility: "visible",
          },
          paint: {
            "line-color": [
              "case",
              ["==", ["get", "id"], ""],
              "#FF9800",
              "rgba(200, 200, 200, 0.6)"
            ],
            "line-width": [
              "case",
              ["==", ["get", "id"], ""],
              8,
              10
            ],
          },
        });
      }

      // 1. Trails (topmost, thinner black line on top of border)
      if (!map.current?.getLayer("trails-line")) {
        map.current?.addLayer({
          id: "trails-line",
          type: "line",
          source: "backCountry",
          layout: {
            "line-join": "round",
            "line-cap": "round",
            visibility: "visible",
          },
          paint: {
            "line-color": [
              "case",
              ["==", ["get", "id"], ""],
              "#FF9800",
              "black"
            ],
            "line-width": [
              "case",
              ["==", ["get", "id"], ""],
              6,
              4
            ],
          },
        });
      }

      // Ensure layers are in correct order
      maintainLayerOrder();
    };

    const handleDeselect = () => {
      if (!map.current) return;
      
      setSelectedFeatureId(null);

      // Reset to default colors (no trail selected)
      const defaultColorExpression = 'black';
      const defaultWidthExpression = 4;
      const defaultBorderColorExpression = 'rgba(200, 200, 200, 0.6)';
      const defaultBorderWidthExpression = 10;

      // Ensure border layer stays visible
      if (map.current.getLayer("trails-line-border")) {
        map.current.setLayoutProperty("trails-line-border", "visibility", "visible");
        map.current.setPaintProperty("trails-line-border", "line-color", defaultBorderColorExpression);
        map.current.setPaintProperty("trails-line-border", "line-width", defaultBorderWidthExpression);
      }
      map.current.setPaintProperty("trails-line", "line-color", defaultColorExpression);
      map.current.setPaintProperty("trails-line", "line-width", defaultWidthExpression);
    };

    const handleClick = async (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      if (!e.features?.length || !map.current) return;
      
      const feature = e.features[0];
      const coordinates: Array<[number, number]> = feature.geometry.type === "LineString" 
        ? feature.geometry.coordinates.map(coord => [coord[0], coord[1]] as [number, number])
        : [];

      const newFeatureId = feature.properties?.id;
      setSelectedFeatureId(newFeatureId);

      const colorExpression = [
        'case',
        ['==', ['get', 'id'], newFeatureId || ''],
        '#FF9800',
        'black'
      ];

      const widthExpression = [
        'case',
        ['==', ['get', 'id'], newFeatureId || ''],
        6,
        4
      ];

      const borderColorExpression = [
        'case',
        ['==', ['get', 'id'], newFeatureId || ''],
        '#FF9800',
        'rgba(200, 200, 200, 0.6)'
      ];

      const borderWidthExpression = [
        'case',
        ['==', ['get', 'id'], newFeatureId || ''],
        8,
        10
      ];

      // Ensure border layer stays visible
      if (map.current.getLayer("trails-line-border")) {
        map.current.setLayoutProperty("trails-line-border", "visibility", "visible");
        map.current.setPaintProperty("trails-line-border", "line-color", borderColorExpression);
        map.current.setPaintProperty("trails-line-border", "line-width", borderWidthExpression);
      }
      map.current.setPaintProperty("trails-line", "line-color", colorExpression);
      map.current.setPaintProperty("trails-line", "line-width", widthExpression);
      
      const elevationData = await calculateElevationData(coordinates, token);

      onTrailClick({
        name: feature.properties?.title || "Unknown Trail",
        description: feature.properties?.description || "A trail on Mount Mansfield",
        elevationData,
      });
    };

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      if (!map.current) return;
      
      // Check if the click hit any trail features
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['trails-line', 'trails-line-border']
      });
      
      // If no trail features were clicked, deselect
      if (features.length === 0) {
        handleDeselect();
      }
    };

    // Only set up sources and layers if style is loaded
    if (!map.current.isStyleLoaded()) {
      map.current.once('style.load', () => {
        setupSources();
        setupLayers();
      });
      return;
    }

    setupSources();
    setupLayers();

    // Clean up old handlers and add new ones
    if (map.current.getLayer("trails-line")) {
      map.current.off("click", "trails-line");
      map.current.off("click", "trails-line-border");
      map.current.off("click", handleMapClick);
      map.current.off("mouseenter", "trails-line");
      map.current.off("mouseenter", "trails-line-border");
      map.current.off("mouseleave", "trails-line");
      map.current.off("mouseleave", "trails-line-border");

      map.current.on("click", "trails-line", handleClick);
      map.current.on("click", "trails-line-border", handleClick);
      map.current.on("click", handleMapClick);
      map.current.on("mouseenter", "trails-line", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseenter", "trails-line-border", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "trails-line", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
      map.current.on("mouseleave", "trails-line-border", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
    }
  }, [map, token, onTrailClick, setSelectedFeatureId, currentStyle]);

  return { setupMapLayers, maintainLayerOrder };
};

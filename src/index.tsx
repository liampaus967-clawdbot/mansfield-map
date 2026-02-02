import React from "react";
import { useState, useRef, useCallback } from "react";
import { Box } from "@mui/material";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import TrailPanel from "./components/TrailPanel";
import Map from "./components/Map";

const Index = () => {
  const [selectedTrail, setSelectedTrail] = useState<any>(null);
  const mapRef = useRef<any>(null);

  const handleTrailClick = useCallback((trail: any) => {
    setSelectedTrail(trail);
  }, []);

  const handleTrailClose = useCallback(() => {
    setSelectedTrail(null);
  }, []);

  const handleElevationHover = useCallback((coordinates: [number, number] | null) => {
    mapRef.current?.updateHoverMarker(coordinates);
  }, []);

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100vh" }}>
      <Map
        ref={mapRef}
        token="pk.eyJ1Ijoib253YXRlcmxsYyIsImEiOiJja3poaWFjbnc0MjVrMm9tem5kenVqd3h3In0.2yMEyumU5erOQ6B5GadT5w"
        onTrailClick={handleTrailClick}
      />
      <TransitionGroup>
        {selectedTrail && (
          <CSSTransition
            key={selectedTrail.id}
            timeout={300}
            classNames="trail-panel"
          >
            <TrailPanel
              trail={selectedTrail}
              onClose={handleTrailClose}
              onHover={handleElevationHover}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </Box>
  );
};

export default Index;
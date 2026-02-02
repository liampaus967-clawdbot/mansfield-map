import React from "react";
import { Box, Paper, Typography, Switch, FormControlLabel } from "@mui/material";
import { CSSTransition } from "react-transition-group";
import { Route, Terrain, Landscape, ShowChart, ThreeDRotation } from "@mui/icons-material";

interface LayersPanelProps {
  showTrails: boolean;
  showDEM: boolean;
  showHillshade: boolean;
  showContours: boolean;
  show3DTerrain: boolean;
  onTrailsToggle: (checked: boolean) => void;
  onDEMToggle: (checked: boolean) => void;
  onHillshadeToggle: (checked: boolean) => void;
  onContoursToggle: (checked: boolean) => void;
  on3DTerrainToggle: (checked: boolean) => void;
}

const LayersPanel = ({
  showTrails,
  showDEM,
  showHillshade,
  showContours,
  show3DTerrain,
  onTrailsToggle,
  onDEMToggle,
  onHillshadeToggle,
  onContoursToggle,
  on3DTerrainToggle,
}: LayersPanelProps) => {
  const layers = [
    { label: "Trails", checked: showTrails, onChange: onTrailsToggle, icon: <Route sx={{ fontSize: 20 }} /> },
    { label: "3D Terrain", checked: show3DTerrain, onChange: on3DTerrainToggle, icon: <ThreeDRotation sx={{ fontSize: 20 }} />, highlight: true },
    { label: "Terrain", checked: showDEM, onChange: onDEMToggle, icon: <Terrain sx={{ fontSize: 20 }} /> },
    { label: "Hillshade", checked: showHillshade, onChange: onHillshadeToggle, icon: <Landscape sx={{ fontSize: 20 }} /> },
    { label: "Contours", checked: showContours, onChange: onContoursToggle, icon: <ShowChart sx={{ fontSize: 20 }} /> },
  ];

  return (
    <CSSTransition
      in={true}
      timeout={200}
      classNames="layers-panel"
      unmountOnExit
    >
      <div style={{ position: "absolute", top: 20, right: 88 }}>
        <Paper
          data-panel
          elevation={0}
          sx={{
            p: 2.5,
            width: 280,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#2D5A27',
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Map Layers
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {layers.map((layer) => (
              <Box
                key={layer.label}
                sx={{
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: layer.checked
                    ? (layer.highlight ? 'rgba(255, 152, 0, 0.4)' : 'rgba(45, 90, 39, 0.3)')
                    : 'rgba(0, 0, 0, 0.08)',
                  bgcolor: layer.checked
                    ? (layer.highlight ? 'rgba(255, 152, 0, 0.08)' : 'rgba(45, 90, 39, 0.05)')
                    : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: layer.highlight ? 'rgba(255, 152, 0, 0.5)' : 'rgba(45, 90, 39, 0.4)',
                    bgcolor: layer.highlight ? 'rgba(255, 152, 0, 0.08)' : 'rgba(45, 90, 39, 0.05)',
                  },
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={layer.checked}
                      onChange={(e) => layer.onChange(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: layer.highlight ? '#FF9800' : '#2D5A27',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: layer.highlight ? '#FF9800' : '#2D5A27',
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{
                        color: layer.checked
                          ? (layer.highlight ? '#FF9800' : '#2D5A27')
                          : 'text.secondary',
                        display: 'flex'
                      }}>
                        {layer.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: layer.checked ? 600 : 400,
                          color: layer.checked
                            ? (layer.highlight ? '#FF9800' : '#2D5A27')
                            : 'text.primary',
                        }}
                      >
                        {layer.label}
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, py: 1, px: 1.5, width: '100%' }}
                />
              </Box>
            ))}
          </Box>
        </Paper>
      </div>
    </CSSTransition>
  );
};

export default LayersPanel;
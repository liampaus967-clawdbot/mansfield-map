import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  Switch,
  Slider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import RouteIcon from "@mui/icons-material/Route";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import TerrainIcon from "@mui/icons-material/Terrain";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import { BasemapStyle } from "../types/map";

const BASEMAP_OPTIONS = [
  { value: "outdoors", label: "Outdoor", gradient: "linear-gradient(135deg, #a8d5a2 0%, #4a7c59 100%)" },
  { value: "satellite", label: "Satellite", gradient: "linear-gradient(135deg, #2d4a3e 0%, #1a2f25 100%)" },
  { value: "dark", label: "Dark", gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" },
];

interface LayerToggleProps {
  currentStyle: BasemapStyle;
  onStyleChange: (style: string) => void;
  showTrails: boolean;
  showDEM: boolean;
  showContours: boolean;
  show3DTerrain: boolean;
  showSnow: boolean;
  showCliffAreas: boolean;
  showSnowProbability: boolean;
  terrainExaggeration: number;
  onTrailsToggle: (checked: boolean) => void;
  onDEMToggle: (checked: boolean) => void;
  onContoursToggle: (checked: boolean) => void;
  on3DTerrainToggle: (checked: boolean) => void;
  onSnowToggle: (checked: boolean) => void;
  onCliffAreasToggle: (checked: boolean) => void;
  onSnowProbabilityToggle: (checked: boolean) => void;
  onTerrainExaggerationChange: (value: number) => void;
}

const LayerToggle: React.FC<LayerToggleProps> = ({
  currentStyle,
  onStyleChange,
  showTrails,
  showDEM,
  showContours,
  show3DTerrain,
  showSnow,
  showCliffAreas,
  showSnowProbability,
  terrainExaggeration,
  onTrailsToggle,
  onDEMToggle,
  onContoursToggle,
  on3DTerrainToggle,
  onSnowToggle,
  onCliffAreasToggle,
  onSnowProbabilityToggle,
  onTerrainExaggerationChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);

  const layers = [
    { label: "Trails", checked: showTrails, onChange: onTrailsToggle, icon: <RouteIcon />, color: "#10b981" },
    { label: "3D Terrain", checked: show3DTerrain, onChange: on3DTerrainToggle, icon: <ThreeDRotationIcon />, color: "#f59e0b" },
    { label: "Snow Effect", checked: showSnow, onChange: onSnowToggle, icon: <AcUnitIcon />, color: "#06b6d4" },
    { label: "Hillshade", checked: showDEM, onChange: onDEMToggle, icon: <TerrainIcon />, color: "#8b5cf6" },
    { label: "Contours", checked: showContours, onChange: onContoursToggle, icon: <ShowChartIcon />, color: "#ec4899" },
    { label: "Cliff Areas", checked: showCliffAreas, onChange: onCliffAreasToggle, icon: <WarningIcon />, color: "#ef4444" },
    { label: "Snow Probability", checked: showSnowProbability, onChange: onSnowProbabilityToggle, icon: <AcUnitIcon />, color: "#3b82f6" },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 1000,
        }}
      >
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            width: 48,
            height: 48,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)",
            color: "#1e293b",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              background: "rgba(255, 255, 255, 1)",
              transform: "scale(1.05)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.16), 0 2px 4px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <LayersIcon />
        </IconButton>
      </Box>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : 340,
            maxWidth: "100%",
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
            borderRight: "1px solid rgba(0, 0, 0, 0.06)",
            boxShadow: "4px 0 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <LayersIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#0f172a" }}>
              Map Layers
            </Typography>
          </Box>
          <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: "#64748b" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 2.5, overflowY: "auto", flex: 1 }}>
          {/* Basemap Section */}
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#94a3b8",
              mb: 1.5,
            }}
          >
            Basemap Style
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            {BASEMAP_OPTIONS.map((style) => (
              <Box
                key={style.value}
                onClick={() => onStyleChange(style.value)}
                sx={{
                  flex: 1,
                  cursor: "pointer",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: currentStyle === style.value ? "2px solid #10b981" : "2px solid transparent",
                  background: "rgba(0, 0, 0, 0.02)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box sx={{ height: 48, background: style.gradient }} />
                <Typography
                  sx={{
                    py: 0.75,
                    textAlign: "center",
                    fontSize: "0.75rem",
                    fontWeight: currentStyle === style.value ? 700 : 500,
                    color: currentStyle === style.value ? "#10b981" : "#64748b",
                  }}
                >
                  {style.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Layers Section */}
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#94a3b8",
              mb: 1.5,
            }}
          >
            Data Layers
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {layers.map((layer) => (
              <Box
                key={layer.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  borderRadius: "12px",
                  background: layer.checked ? `${layer.color}08` : "transparent",
                  border: `1px solid ${layer.checked ? `${layer.color}30` : "rgba(0, 0, 0, 0.04)"}`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: layer.checked ? `${layer.color}12` : "rgba(0, 0, 0, 0.02)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      color: layer.checked ? layer.color : "#94a3b8",
                      display: "flex",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {React.cloneElement(layer.icon, { sx: { fontSize: 20 } })}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: layer.checked ? 600 : 500,
                      color: layer.checked ? "#0f172a" : "#64748b",
                    }}
                  >
                    {layer.label}
                  </Typography>
                </Box>
                <Switch
                  checked={layer.checked}
                  onChange={(e) => layer.onChange(e.target.checked)}
                  size="small"
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: layer.color },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: layer.color },
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Terrain Exaggeration */}
          {show3DTerrain && (
            <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid rgba(0, 0, 0, 0.06)" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}>
                  Terrain Exaggeration
                </Typography>
                <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: "#f59e0b" }}>
                  {terrainExaggeration.toFixed(1)}x
                </Typography>
              </Box>
              <Slider
                value={terrainExaggeration}
                onChange={(_, value) => onTerrainExaggerationChange(value as number)}
                min={1}
                max={2}
                step={0.1}
                sx={{
                  color: "#f59e0b",
                  "& .MuiSlider-thumb": {
                    width: 16,
                    height: 16,
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0 0 0 8px rgba(245, 158, 11, 0.16)",
                    },
                  },
                  "& .MuiSlider-track": { height: 4 },
                  "& .MuiSlider-rail": { height: 4, backgroundColor: "rgba(0, 0, 0, 0.08)" },
                }}
              />
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid rgba(0, 0, 0, 0.06)",
            background: "rgba(0, 0, 0, 0.02)",
          }}
        >
          <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8", textAlign: "center" }}>
            Mt. Mansfield Trail Map
          </Typography>
        </Box>
      </Drawer>
    </>
  );
};

export default LayerToggle;

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Popover,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider,
  Slider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import Route from "@mui/icons-material/Route";
import ThreeDRotation from "@mui/icons-material/ThreeDRotation";
import Terrain from "@mui/icons-material/Terrain";
import ShowChart from "@mui/icons-material/ShowChart";
import AcUnit from "@mui/icons-material/AcUnit";
import Warning from "@mui/icons-material/Warning";
import { BasemapStyle } from "../types/map";

// Basemap preview colors (replacing images)
const BASEMAP_COLORS: Record<string, string> = {
  outdoors: "linear-gradient(135deg, #a8d5a2 0%, #4a7c59 100%)",
  satellite: "linear-gradient(135deg, #2d4a3e 0%, #1a2f25 100%)",
  dark: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
};

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
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const basemapStyles = [
    { value: "outdoors", label: "Outdoors" },
    { value: "satellite", label: "Satellite" },
    { value: "dark", label: "Dark" },
  ];

  const layers = [
    {
      label: "Trails",
      checked: showTrails,
      onChange: onTrailsToggle,
      icon: <Route />,
      color: "#2D5A27",
    },
    {
      label: "3D Terrain",
      checked: show3DTerrain,
      onChange: on3DTerrainToggle,
      icon: <ThreeDRotation />,
      color: "#FF9800",
    },
    {
      label: "Snow Effect",
      checked: showSnow,
      onChange: onSnowToggle,
      icon: <AcUnit />,
      color: "#00BCD4",
    },
    {
      label: "Terrain",
      checked: showDEM,
      onChange: onDEMToggle,
      icon: <Terrain />,
      color: "#2D5A27",
    },
    {
      label: "Contours",
      checked: showContours,
      onChange: onContoursToggle,
      icon: <ShowChart />,
      color: "#2D5A27",
    },
    {
      label: "Cliff Areas",
      checked: showCliffAreas,
      onChange: onCliffAreasToggle,
      icon: <Warning />,
      color: "#D32F2F",
    },
    {
      label: "Snow Probability",
      checked: showSnowProbability,
      onChange: onSnowProbabilityToggle,
      icon: <AcUnit />,
      color: "#2196F3",
    },
  ];

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: { xs: 12, sm: 20 },
          left: { xs: 12, sm: 20 },
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          borderRadius: { xs: "10px", sm: "12px" },
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
            borderColor: "rgba(45, 90, 39, 0.3)",
          },
        }}
      >
        <IconButton
          onClick={handleClick}
          size={isMobile ? "medium" : "large"}
          sx={{
            color: "#2D5A27",
            padding: { xs: "10px", sm: "14px" },
            width: { xs: "44px", sm: "56px" },
            height: { xs: "44px", sm: "56px" },
            transition: "all 0.2s ease",
            "& .MuiSvgIcon-root": {
              fontSize: { xs: "24px", sm: "28px" },
              transition: "all 0.2s ease",
            },
            "&:hover": {
              backgroundColor: "rgba(45, 90, 39, 0.08)",
              "& .MuiSvgIcon-root": {
                color: "#FF9800",
                transform: "scale(1.1)",
              },
            },
          }}
        >
          <LayersIcon />
        </IconButton>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isMobile ? "center" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isMobile ? "center" : "left",
        }}
        PaperProps={{
          sx: {
            width: isMobile ? "calc(100vw - 24px)" : 420,
            maxWidth: isMobile ? "calc(100vw - 24px)" : 420,
            maxHeight: isMobile ? "calc(100vh - 24px)" : "calc(100vh - 100px)",
            margin: isMobile ? "12px" : 0,
          },
        }}
      >
        <Paper
          sx={{
            width: "100%",
            maxHeight: isMobile ? "calc(100vh - 24px)" : "calc(100vh - 100px)",
            overflow: "auto",
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(12px)",
            color: "rgba(0, 0, 0, 0.87)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: isMobile 
              ? "0 8px 32px rgba(0, 0, 0, 0.25)" 
              : "0 8px 32px rgba(0, 0, 0, 0.15)",
            borderRadius: { xs: "16px", sm: "8px" },
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(0, 0, 0, 0.05)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(45, 90, 39, 0.3)",
              borderRadius: "4px",
              "&:hover": {
                background: "rgba(45, 90, 39, 0.5)",
              },
            },
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#2D5A27",
                fontWeight: 700,
                fontSize: { xs: "14px", sm: "16px" },
                letterSpacing: "0.025em",
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              Base Map
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1, sm: 1.5 },
                mb: { xs: 2, sm: 3 },
              }}
            >
              {basemapStyles.map((style) => (
                <Box
                  key={style.value}
                  onClick={() => onStyleChange(style.value)}
                  sx={{
                    cursor: "pointer",
                    border:
                      currentStyle === style.value
                        ? "2px solid #2D5A27"
                        : "2px solid rgba(0, 0, 0, 0.1)",
                    borderRadius: { xs: "10px", sm: "8px" },
                    overflow: "hidden",
                    flex: 1,
                    transition: "all 0.2s ease",
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                    "&:hover": {
                      borderColor:
                        currentStyle === style.value ? "#2D5A27" : "#FF9800",
                      transform: { xs: "none", sm: "translateY(-2px)" },
                      boxShadow:
                        currentStyle === style.value
                          ? "0 4px 12px rgba(45, 90, 39, 0.4)"
                          : "0 4px 12px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: { xs: 60, sm: 80 },
                      borderRadius: { xs: "8px 8px 0 0", sm: "6px 6px 0 0" },
                      overflow: "hidden",
                      position: "relative",
                      background: BASEMAP_COLORS[style.value],
                    }}
                  />
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{
                      py: { xs: 0.75, sm: 1 },
                      color:
                        currentStyle === style.value
                          ? "#2D5A27"
                          : "rgba(0, 0, 0, 0.6)",
                      fontWeight: currentStyle === style.value ? 600 : 500,
                      fontSize: { xs: "12px", sm: "13px" },
                    }}
                  >
                    {style.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: { xs: 1.5, sm: 2 }, borderColor: "rgba(0, 0, 0, 0.08)" }} />
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#2D5A27",
                fontWeight: 700,
                fontSize: { xs: "14px", sm: "16px" },
                letterSpacing: "0.025em",
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              Map Layers
            </Typography>
            <List sx={{ p: 0 }}>
              {layers.map((layer) => (
                <ListItem
                  key={layer.label}
                  sx={{
                    borderRadius: { xs: "10px", sm: "8px" },
                    mb: { xs: 0.75, sm: 1 },
                    py: { xs: 0.5, sm: 0 },
                    border: "1px solid",
                    borderColor: layer.checked
                      ? `${layer.color}40`
                      : "rgba(0, 0, 0, 0.08)",
                    bgcolor: layer.checked ? `${layer.color}08` : "transparent",
                    transition: "all 0.2s ease",
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                    "&:hover": {
                      backgroundColor: `${layer.color}08`,
                      borderColor: `${layer.color}60`,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: layer.checked ? layer.color : "rgba(0, 0, 0, 0.4)",
                      minWidth: { xs: 36, sm: 40 },
                      "& .MuiSvgIcon-root": {
                        fontSize: { xs: 20, sm: 24 },
                      },
                    }}
                  >
                    {layer.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={layer.label}
                    primaryTypographyProps={{
                      fontSize: { xs: "12px", sm: "13px" },
                      fontWeight: layer.checked ? 600 : 500,
                      color: layer.checked
                        ? layer.color
                        : "rgba(0, 0, 0, 0.87)",
                    }}
                  />
                  <Switch
                    edge="end"
                    checked={layer.checked}
                    onChange={(e) => layer.onChange(e.target.checked)}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: layer.color,
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: layer.color,
                        },
                    }}
                  />
                </ListItem>
              ))}
            </List>

            {/* Terrain Exaggeration Slider - only show when 3D terrain is enabled */}
            {show3DTerrain && (
              <Box
                sx={{
                  mt: { xs: 2, sm: 3 },
                  pt: { xs: 1.5, sm: 2 },
                  borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#FF9800",
                    fontWeight: 600,
                    fontSize: { xs: "12px", sm: "13px" },
                    mb: { xs: 1.5, sm: 2 },
                  }}
                >
                  Terrain Exaggeration: {terrainExaggeration.toFixed(1)}x
                </Typography>
                <Slider
                  value={terrainExaggeration}
                  onChange={(_, value) =>
                    onTerrainExaggerationChange(value as number)
                  }
                  min={1}
                  max={2}
                  step={0.1}
                  marks={[
                    { value: 1, label: "1x" },
                    { value: 1.5, label: "1.5x" },
                    { value: 2, label: "2x" },
                  ]}
                  sx={{
                    color: "#FF9800",
                    "& .MuiSlider-thumb": {
                      backgroundColor: "#FF9800",
                      width: { xs: 18, sm: 20 },
                      height: { xs: 18, sm: 20 },
                      "&:hover, &.Mui-focusVisible": {
                        boxShadow: "0 0 0 8px rgba(255, 152, 0, 0.16)",
                      },
                    },
                    "& .MuiSlider-track": {
                      backgroundColor: "#FF9800",
                      border: "none",
                      height: { xs: 4, sm: 4 },
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: "rgba(255, 152, 0, 0.2)",
                      height: { xs: 4, sm: 4 },
                    },
                    "& .MuiSlider-mark": {
                      backgroundColor: "rgba(255, 152, 0, 0.4)",
                      width: { xs: 4, sm: 4 },
                      height: { xs: 4, sm: 4 },
                    },
                    "& .MuiSlider-markLabel": {
                      fontSize: { xs: "10px", sm: "11px" },
                      color: "rgba(0, 0, 0, 0.6)",
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        </Paper>
      </Popover>
    </>
  );
};

export default LayerToggle;

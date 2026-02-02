import React from "react";
import { Box, IconButton, Typography, Drawer, Chip, useMediaQuery, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RouteIcon from "@mui/icons-material/Route";
import TerrainIcon from "@mui/icons-material/Terrain";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SpeedIcon from "@mui/icons-material/Speed";
import ElevationProfile from "./ElevationProfile";

interface TrailPanelProps {
  trail: {
    name: string;
    description: string;
    elevationData: Array<{ elevation: number; distance: number; coordinates: [number, number] }>;
  };
  onClose: () => void;
  onHover: (coordinates: [number, number] | null) => void;
}

const TrailPanel = ({ trail, onClose, onHover }: TrailPanelProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const totalDistance = trail.elevationData[trail.elevationData.length - 1]?.distance || 0;

  const slopes = trail.elevationData.map((point, index) => {
    if (index === 0) return 0;
    const elevationChange = point.elevation - trail.elevationData[index - 1].elevation;
    const horizontalDistance = (point.distance - trail.elevationData[index - 1].distance) * 1000;
    const slopeAngle = Math.atan2(Math.abs(elevationChange), horizontalDistance) * (180 / Math.PI);
    return elevationChange < 0 ? -slopeAngle : slopeAngle;
  });

  const positiveSlopes = slopes.filter(slope => slope > 0);
  const negativeSlopes = slopes.filter(slope => slope < 0);
  const isPredominantlyUphill = positiveSlopes.length >= negativeSlopes.length;
  const relevantSlopes = isPredominantlyUphill ? positiveSlopes : negativeSlopes;
  const averageSlope = relevantSlopes.length > 0
    ? relevantSlopes.reduce((sum, slope) => sum + slope, 0) / relevantSlopes.length
    : 0;
  const maxSlope = relevantSlopes.length > 0
    ? isPredominantlyUphill ? Math.max(...relevantSlopes) : Math.min(...negativeSlopes)
    : 0;

  const elevations = trail.elevationData.map(d => d.elevation);
  const minElevation = Math.min(...elevations);
  const maxElevation = Math.max(...elevations);
  const elevationGain = maxElevation - minElevation;

  const stats = [
    { label: "Distance", value: `${totalDistance.toFixed(1)} km`, icon: <RouteIcon />, color: "#10b981" },
    { label: "Elevation Gain", value: `${elevationGain.toFixed(0)} m`, icon: <TerrainIcon />, color: "#f59e0b" },
    { label: "Avg Slope", value: `${averageSlope.toFixed(1)}°`, icon: <TrendingUpIcon />, color: "#3b82f6" },
    { label: "Max Slope", value: `${Math.abs(maxSlope).toFixed(1)}°`, icon: <SpeedIcon />, color: "#ef4444" },
  ];

  return (
    <Drawer
      anchor="right"
      open={true}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : 400,
          maxWidth: "100%",
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid rgba(0, 0, 0, 0.06)",
          boxShadow: "-4px 0 32px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          p: 3,
          pb: 4,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Chip
            icon={<RouteIcon sx={{ fontSize: 14, color: "white !important" }} />}
            label="Trail"
            size="small"
            sx={{
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              fontWeight: 600,
              fontSize: "0.7rem",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              "& .MuiChip-icon": { color: "white" },
            }}
          />
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "white",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.25)",
                transform: "rotate(90deg)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "white",
            fontSize: "1.5rem",
            letterSpacing: "-0.02em",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {trail.name}
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Box sx={{ p: 3, pt: 0, mt: -2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.5,
            background: "white",
            borderRadius: "16px",
            p: 2,
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(0, 0, 0, 0.04)",
          }}
        >
          {stats.map((stat) => (
            <Box
              key={stat.label}
              sx={{
                p: 1.5,
                borderRadius: "12px",
                background: `${stat.color}08`,
                border: `1px solid ${stat.color}15`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
                <Box sx={{ color: stat.color, display: "flex" }}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: 14 } })}
                </Box>
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {stat.label}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 800, color: stat.color }}>
                {stat.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Description */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#94a3b8",
            mb: 1,
          }}
        >
          About This Trail
        </Typography>
        <Typography
          sx={{
            fontSize: "0.9rem",
            lineHeight: 1.7,
            color: "#475569",
          }}
        >
          {trail.description}
        </Typography>
      </Box>

      {/* Elevation Profile */}
      <Box sx={{ px: 3, pb: 3, flex: 1 }}>
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
          Elevation Profile
        </Typography>
        <Box
          sx={{
            background: "white",
            borderRadius: "16px",
            p: 2,
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
            border: "1px solid rgba(0, 0, 0, 0.04)",
          }}
        >
          <ElevationProfile data={trail.elevationData} onHover={onHover} />
        </Box>
      </Box>
    </Drawer>
  );
};

export default TrailPanel;


import React from "react";
import { Box, IconButton, Typography, Paper, Collapse, Divider, Chip } from "@mui/material";
import { Close, Terrain, TrendingUp, Route, Timeline } from "@mui/icons-material";
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
    ? isPredominantlyUphill
      ? Math.max(...relevantSlopes)
      : Math.min(...negativeSlopes)
    : 0;

  // Calculate elevation gain/loss
  const elevations = trail.elevationData.map(d => d.elevation);
  const minElevation = Math.min(...elevations);
  const maxElevation = Math.max(...elevations);
  const elevationGain = maxElevation - minElevation;

    return (
      <Collapse in={true} timeout="auto" unmountOnExit>
        <Paper
          elevation={0}
          sx={{
            position: "fixed",
            right: 0,
            top: 0,
            height: "100%",
            width: { xs: "100%", sm: 420 },
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
            borderLeft: "1px solid rgba(45, 90, 39, 0.1)",
            overflow: "auto",
            boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              background: "linear-gradient(135deg, #2D5A27 0%, #3a7230 100%)",
              color: "white",
              p: 3,
              pb: 4,
              zIndex: 10,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Chip
                  icon={<Route sx={{ fontSize: 16 }} />}
                  label="Trail"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    mb: 1.5,
                    fontWeight: 600,
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {trail.name}
                </Typography>
              </Box>
              <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  color: "white",
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.25)",
                    transform: "rotate(90deg)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* Stats Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, rgba(45, 90, 39, 0.08) 0%, rgba(45, 90, 39, 0.02) 100%)",
                  border: "1px solid rgba(45, 90, 39, 0.15)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(45, 90, 39, 0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Route sx={{ fontSize: 18, color: "#2D5A27", mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Distance
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#2D5A27" }}>
                  {totalDistance.toFixed(1)} km
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, rgba(255, 152, 0, 0.08) 0%, rgba(255, 152, 0, 0.02) 100%)",
                  border: "1px solid rgba(255, 152, 0, 0.15)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(255, 152, 0, 0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Terrain sx={{ fontSize: 18, color: "#FF9800", mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Elevation Gain
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#FF9800" }}>
                  {elevationGain.toFixed(0)} m
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(33, 150, 243, 0.02) 100%)",
                  border: "1px solid rgba(33, 150, 243, 0.15)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(33, 150, 243, 0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <TrendingUp sx={{ fontSize: 18, color: "#2196F3", mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Avg Slope
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#2196F3" }}>
                  {averageSlope.toFixed(1)}°
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, rgba(244, 67, 54, 0.08) 0%, rgba(244, 67, 54, 0.02) 100%)",
                  border: "1px solid rgba(244, 67, 54, 0.15)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(244, 67, 54, 0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Timeline sx={{ fontSize: 18, color: "#F44336", mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Max Slope
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#F44336" }}>
                  {Math.abs(maxSlope).toFixed(1)}°
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  color: "#2D5A27",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontSize: "0.75rem",
                }}
              >
                About This Trail
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.8,
                  fontSize: "0.95rem",
                }}
              >
                {trail.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Elevation Profile */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  color: "#2D5A27",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontSize: "0.75rem",
                }}
              >
                Elevation Profile
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(0, 0, 0, 0.02)",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                }}
              >
                <ElevationProfile data={trail.elevationData} onHover={onHover} />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Collapse>
    );
  };

  export default TrailPanel;
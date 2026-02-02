
import React from 'react';
import { useEffect, useRef, useState } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ElevationProfileProps {
  data: Array<{ elevation: number; distance: number; coordinates: [number, number] }>;
  onHover: (coordinates: [number, number] | null) => void;
}

const ElevationProfile = ({ data, onHover }: ElevationProfileProps) => {
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const theme = useTheme();

  // Calculate slope data
  const slopeData = data.map((point, index) => {
    if (index === 0) {
      return {
        ...point,
        slope: 0,
        color: '#4CAF50',
      };
    }

    const elevationChange = point.elevation - data[index - 1].elevation;
    const distanceChange = (point.distance - data[index - 1].distance) * 1000; // Convert to meters
    const slope = (elevationChange / distanceChange) * 100; // Calculate percentage slope

    // Calculate color based on slope with better gradient colors
    let color;
    const absSlope = Math.abs(slope);
    if (absSlope < 5) {
      color = '#4CAF50'; // Very gentle slope - green
    } else if (absSlope < 10) {
      color = '#8BC34A'; // Moderate slope - light green
    } else if (absSlope < 15) {
      color = '#FFC107'; // Steeper slope - amber
    } else if (absSlope < 20) {
      color = '#FF9800'; // Very steep slope - orange
    } else {
      color = '#F44336'; // Extremely steep slope - red
    }

    return {
      ...point,
      slope,
      color,
    };
  });

  const handleMouseMove = (props: any) => {
    if (props && props.activeTooltipIndex !== undefined && data[props.activeTooltipIndex]) {
      setActivePoint(props.activeTooltipIndex);
      onHover(data[props.activeTooltipIndex].coordinates);
    }
  };

  const handleMouseLeave = () => {
    setActivePoint(null);
    onHover(null);
  };

  // Default stroke color when no point is active
  const defaultStrokeColor = '#2D5A27';

  return (
    <Box sx={{ width: "100%", height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={slopeData}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2D5A27" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2D5A27" stopOpacity={0.05} />
            </linearGradient>
            {slopeData.map((point, index) => {
              if (index === 0) return null;
              const prevPoint = slopeData[index - 1];
              if (!prevPoint) return null;

              return (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`colorGradient-${index}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor={prevPoint.color} />
                  <stop offset="100%" stopColor={point.color} />
                </linearGradient>
              );
            })}
          </defs>
          <XAxis
            dataKey="distance"
            tickFormatter={(value) => `${value.toFixed(1)}`}
            stroke="rgba(0, 0, 0, 0.3)"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: 'rgba(0, 0, 0, 0.1)' }}
            label={{ value: 'Distance (km)', position: 'insideBottom', offset: -5, fontSize: 11, fill: 'rgba(0, 0, 0, 0.5)' }}
          />
          <YAxis
            dataKey="elevation"
            tickFormatter={(value) => `${value}`}
            stroke="rgba(0, 0, 0, 0.3)"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: 'rgba(0, 0, 0, 0.1)' }}
            label={{ value: 'Elevation (m)', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'rgba(0, 0, 0, 0.5)' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.98)',
                      backdropFilter: 'blur(10px)',
                      p: 1.5,
                      borderRadius: 1.5,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      border: '1px solid rgba(45, 90, 39, 0.2)',
                      minWidth: 140,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, gap: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        Elevation:
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#2D5A27' }}>
                        {data.elevation.toFixed(0)}m
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, gap: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        Distance:
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {data.distance.toFixed(2)}km
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        Slope:
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: data.color,
                        }}
                      >
                        {data.slope ? `${data.slope.toFixed(1)}%` : '0%'}
                      </Typography>
                    </Box>
                  </Box>
                );
              }
              return null;
            }}
            cursor={{ stroke: '#2D5A27', strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          <Area
            type="monotone"
            dataKey="elevation"
            stroke={activePoint !== null && slopeData[activePoint]
              ? slopeData[activePoint].color
              : defaultStrokeColor}
            strokeWidth={3}
            fill="url(#areaGradient)"
            fillOpacity={1}
            dot={false}
            activeDot={{
              r: 6,
              stroke: '#fff',
              strokeWidth: 2,
              fill: '#2D5A27',
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ElevationProfile;

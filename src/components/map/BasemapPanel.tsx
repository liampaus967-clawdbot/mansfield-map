
import React from "react";
import { Paper, Typography, Box, Collapse, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { BASEMAP_STYLES, BasemapStyle } from "../../types/map";
import { Terrain, Satellite, DarkMode } from "@mui/icons-material";

interface BasemapPanelProps {
  currentStyle: BasemapStyle;
  onStyleChange: (style: string) => void;
}

const BasemapPanel = ({ currentStyle, onStyleChange }: BasemapPanelProps) => {
  const basemapOptions = [
    { value: "outdoors", label: "Outdoors", icon: <Terrain /> },
    { value: "satellite", label: "Satellite", icon: <Satellite /> },
    { value: "dark", label: "Dark", icon: <DarkMode /> },
  ];

  return (
    <Collapse in={true} timeout="auto" unmountOnExit style={{ position: "absolute", top: 20, right: 88 }}>
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
          Basemap Style
        </Typography>
        <RadioGroup
          value={currentStyle}
          onChange={(e) => onStyleChange(e.target.value)}
        >
          {basemapOptions.map((option) => (
            <Box
              key={option.value}
              sx={{
                mb: 1,
                borderRadius: 1.5,
                border: '2px solid',
                borderColor: currentStyle === option.value ? '#2D5A27' : 'rgba(0, 0, 0, 0.08)',
                bgcolor: currentStyle === option.value ? 'rgba(45, 90, 39, 0.05)' : 'transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: currentStyle === option.value ? '#2D5A27' : 'rgba(45, 90, 39, 0.3)',
                  bgcolor: currentStyle === option.value ? 'rgba(45, 90, 39, 0.05)' : 'rgba(45, 90, 39, 0.02)',
                },
              }}
            >
              <FormControlLabel
                value={option.value}
                control={
                  <Radio
                    sx={{
                      color: 'rgba(0, 0, 0, 0.3)',
                      '&.Mui-checked': {
                        color: '#2D5A27',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: currentStyle === option.value ? '#2D5A27' : 'text.secondary' }}>
                      {option.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: currentStyle === option.value ? 600 : 400,
                        color: currentStyle === option.value ? '#2D5A27' : 'text.primary',
                      }}
                    >
                      {option.label}
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, py: 1, px: 1.5, width: '100%' }}
              />
            </Box>
          ))}
        </RadioGroup>
      </Paper>
    </Collapse>
  );
};

export default BasemapPanel;

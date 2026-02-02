
import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { LayersOutlined, Map as MapIcon } from '@mui/icons-material';

interface MapControlsProps {
  onBasemapClick: () => void;
  onLayersClick: () => void;
}

const MapControls = ({ onBasemapClick, onLayersClick }: MapControlsProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 20,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        zIndex: 1000,
      }}
    >
      <Tooltip title="Change Basemap" placement="left" arrow>
        <IconButton
          onClick={onBasemapClick}
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: '#2D5A27',
              color: 'white',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(45, 90, 39, 0.3)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          <MapIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Toggle Layers" placement="left" arrow>
        <IconButton
          onClick={onLayersClick}
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: '#2D5A27',
              color: 'white',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(45, 90, 39, 0.3)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          <LayersOutlined />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default MapControls;

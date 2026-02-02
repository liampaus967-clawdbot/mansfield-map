
export interface MapRef {
    updateHoverMarker: (coordinates: [number, number] | null) => void;
  }
  
  export interface Trail {
    name: string;
    description: string;
    elevationData: Array<{
      elevation: number;
      distance: number;
      coordinates: [number, number];
    }>;
  }
  
  export interface MapProps {
    token: string;
    onTrailClick: (trail: Trail) => void;
  }
  
  export const MANSFIELD_CENTER: [number, number] = [-72.8146, 44.5438];
  
  export const BASEMAP_STYLES = {
    outdoors: "mapbox://styles/mapbox/outdoors-v12",
    satellite: "mapbox://styles/mapbox/satellite-streets-v12",
    dark: "mapbox://styles/mapbox/dark-v11",
  } as const;
  
  export type BasemapStyle = keyof typeof BASEMAP_STYLES;
  
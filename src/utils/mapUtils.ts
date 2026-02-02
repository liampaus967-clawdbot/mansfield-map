
import mapboxgl from 'mapbox-gl';

export const toRad = (value: number): number => {
  return value * Math.PI / 180;
};

export const calculateDistance = (start: [number, number], end: [number, number]): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(end[1] - start[1]);
  const dLon = toRad(end[0] - start[0]);
  const lat1 = toRad(start[1]);
  const lat2 = toRad(end[1]);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const getElevationForPoint = async (coord: [number, number], token: string): Promise<number> => {
  try {
    // Increased radius to 500m to better capture contours at high elevations where they're sparse
    const query = await fetch(
      `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${coord[0]},${coord[1]}.json?layers=contour&limit=50&radius=500&access_token=${token}`,
      { method: 'GET' }
    );

    if (query.status !== 200) {
      console.warn(`Elevation query failed with status ${query.status} for coord:`, coord);
      return 0;
    }

    const data = await query.json();
    const allFeatures = data.features;

    if (!allFeatures || allFeatures.length === 0) {
      console.warn('No elevation features found for coord:', coord);
      return 0;
    }

    // Increased max elevation to 3000m to accommodate higher peaks
    // Mount Mansfield is ~1339m, but nearby peaks could be higher
    const validElevations = allFeatures
      .map((feature: any) => feature.properties.ele)
      .filter((ele: number) => ele != null && ele > 0 && ele < 3000);

    if (validElevations.length === 0) {
      console.warn('No valid elevations after filtering for coord:', coord, 'Raw elevations:',
        allFeatures.map((f: any) => f.properties.ele));
      return 0;
    }

    validElevations.sort((a: number, b: number) => a - b);
    const medianIndex = Math.floor(validElevations.length / 2);
    return validElevations[medianIndex];
  } catch (error) {
    console.error('Error fetching elevation:', error);
    return 0;
  }
};

export const calculateElevationData = async (coordinates: [number, number][], token: string) => {
  const sampledCoordinates = coordinates.reduce((acc: [number, number][], coord, index) => {
    if (index === 0) {
      acc.push(coord);
      return acc;
    }
    
    const prevCoord = coordinates[index - 1];
    const distance = calculateDistance(prevCoord, coord);
    
    if (distance > 0.05) {
      const steps = Math.ceil(distance / 0.05);
      for (let i = 1; i < steps; i++) {
        const fraction = i / steps;
        const lat = prevCoord[1] + (coord[1] - prevCoord[1]) * fraction;
        const lng = prevCoord[0] + (coord[0] - prevCoord[0]) * fraction;
        acc.push([lng, lat]);
      }
    }
    acc.push(coord);
    return acc;
  }, []);

  const elevationData = await Promise.all(
    sampledCoordinates.map(async (coord, index) => {
      const distance = index === 0 ? 0 : calculateDistance(sampledCoordinates[0], coord);
      const elevation = await getElevationForPoint(coord, token);
      
      return {
        elevation,
        distance,
        coordinates: coord,
      };
    })
  );
  
  return elevationData.filter((point, index, array) => {
    if (index === 0) return true;
    const prevPoint = array[index - 1];
    const distance = calculateDistance(prevPoint.coordinates, point.coordinates);
    return distance > 0.01;
  });
};

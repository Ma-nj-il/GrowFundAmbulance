/**
 * RESQ Nepal - Maps Configuration
 * Centralized location, radius configuration, and Google Maps API setup.
 */

export interface MapsConfig {
  googleMapsApiKey: string;
  googleMapsMapId: string;
  isGoogleMapsConfigured: boolean;
  defaultCenter: {
    lat: number;
    lng: number;
    address: string;
  };
  searchRadiusStepsKm: number[];
  maxSearchRadiusKm: number;
  expansionDelayMs: number;
}

// Google Maps API Key is read from environment or left empty to engage the demo fallback
const envObj = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
const GOOGLE_MAPS_KEY = (envObj.VITE_GOOGLE_MAPS_API_KEY ||
  envObj.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
  '') as string;

const GOOGLE_MAPS_ID = (envObj.VITE_GOOGLE_MAPS_MAP_ID ||
  envObj.EXPO_PUBLIC_GOOGLE_MAPS_MAP_ID ||
  '') as string;

export const MAPS_CONFIG: MapsConfig = {
  googleMapsApiKey: GOOGLE_MAPS_KEY,
  googleMapsMapId: GOOGLE_MAPS_ID,
  isGoogleMapsConfigured: Boolean(GOOGLE_MAPS_KEY && GOOGLE_MAPS_KEY.length > 10),
  // Default coordinates: Baneshwor & Maharajgunj area (Kathmandu, Nepal)
  defaultCenter: {
    lat: 27.6915,
    lng: 85.342,
    address: 'Baneshwor, Kathmandu, Nepal',
  },
  // Progressive ambulance search radius steps as required by spec
  searchRadiusStepsKm: [2, 5, 10, 15, 20],
  maxSearchRadiusKm: 20,
  expansionDelayMs: 2500, // delay between progressive radar rings
};

/**
 * Calculates geographic distance (Haversine formula) in kilometers
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Generates intermediate coordinates along a route for simulated ambulance live tracking
 */
export function generateRoutePoints(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  steps: number = 10
): Array<{ lat: number; lng: number }> {
  const points: Array<{ lat: number; lng: number }> = [];
  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    // Add small realistic curvature so it looks like city streets rather than laser straight
    const jitter = Math.sin(fraction * Math.PI) * 0.0018;
    points.push({
      lat: start.lat + (end.lat - start.lat) * fraction + jitter,
      lng: start.lng + (end.lng - start.lng) * fraction - jitter * 0.5,
    });
  }
  return points;
}

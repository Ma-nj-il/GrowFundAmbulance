/**
 * RESQ Nepal - Real Interactive Map Component with Simulated Vehicle Telemetry
 * Supports Google Maps integration, OpenStreetMap Leaflet rendering,
 * progressive radar radius expansion, and simulated route tracking.
 */

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Ambulance, Coordinates } from '../../types';
import { generateRoutePoints, MAPS_CONFIG } from '../../config/maps';

interface MapComponentProps {
  pickup: Coordinates;
  destination?: Coordinates;
  ambulances?: Ambulance[];
  searchRadiusKm?: number;
  isSearching?: boolean;
  assignedAmbulance?: Ambulance | null;
  simulationStep?: number;
  uiStyle?: 'light' | 'dark';
  onSelectLocation?: (coords: Coordinates) => void;
  interactive?: boolean;
  heightClass?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  pickup,
  destination,
  ambulances = [],
  searchRadiusKm,
  isSearching = false,
  assignedAmbulance = null,
  simulationStep = 0,
  uiStyle = 'light',
  onSelectLocation,
  interactive = true,
  heightClass = 'h-full',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const ambulanceMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const movingAmbulanceMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [pickup.lat, pickup.lng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
    });

    // Dark vs Light Tile Layers matching the screenshot visual identities
    const tileUrl =
      uiStyle === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png' // high clarity dark/modern
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
    }).addTo(map);

    if (onSelectLocation) {
      map.on('click', (e) => {
        onSelectLocation({
          lat: Number(e.latlng.lat.toFixed(5)),
          lng: Number(e.latlng.lng.toFixed(5)),
          address: `Lat: ${e.latlng.lat.toFixed(4)}, Lng: ${e.latlng.lng.toFixed(4)}`,
        });
      });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when pickup changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([pickup.lat, pickup.lng], 14);
    }
  }, [pickup.lat, pickup.lng]);

  // Render Pickup and Destination Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Pickup Icon matching screenshot 3/5 stick figure pin
    const pickupIcon = L.divIcon({
      className: 'resq-pickup-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="background: ${uiStyle === 'dark' ? '#FFFFFF' : '#111827'}; color: ${
            uiStyle === 'dark' ? '#000000' : '#FFFFFF'
          }; padding: 4px 6px; border-radius: 8px; font-weight: 700; font-size: 11px; box-shadow: 0 4px 12px rgba(0,0,0,0.35); border: 2px solid ${
            uiStyle === 'dark' ? '#111827' : '#FFFFFF'
          }; display: flex; align-items: center; gap: 4px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>You</span>
          </div>
          <div style="width: 2px; height: 10px; background: ${uiStyle === 'dark' ? '#FFFFFF' : '#111827'};"></div>
          <div style="width: 10px; height: 10px; border-radius: 50%; background: #3B82F6; border: 2px solid #FFFFFF;"></div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 40],
    });

    const pickupMarker = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon }).addTo(map);

    let destMarker: L.Marker | null = null;
    if (destination) {
      const destIcon = L.divIcon({
        className: 'resq-dest-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="background: #DC2626; color: #FFFFFF; padding: 4px 7px; border-radius: 8px; font-weight: 800; font-size: 11px; box-shadow: 0 4px 12px rgba(220,38,38,0.4); border: 2px solid #FFFFFF; display: flex; align-items: center; gap: 4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 10.5V8.8C19 6.7 17.3 5 15.2 5H8.8C6.7 5 5 6.7 5 8.8v1.7C3.8 11.1 3 12.5 3 14c0 1.9 1.3 3.5 3.1 3.9l-.6 1.8c-.2.5.1 1.1.6 1.3.5.2 1.1-.1 1.3-.6l.8-2.4h7.6l.8 2.4c.2.5.8.8 1.3.6.5-.2.8-.8.6-1.3l-.6-1.8c1.8-.4 3.1-2 3.1-3.9 0-1.5-.8-2.9-2-3.5zM7.5 14c-.8 0-1.5-.7-1.5-1.5S6.7 11 7.5 11s1.5.7 1.5 1.5S8.3 14 7.5 14zm9 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/></svg>
              <span>Hospital</span>
            </div>
            <div style="width: 2px; height: 10px; background: #DC2626;"></div>
            <div style="width: 10px; height: 10px; border-radius: 50%; background: #DC2626; border: 2px solid #FFFFFF;"></div>
          </div>
        `,
        iconSize: [60, 44],
        iconAnchor: [30, 40],
      });
      destMarker = L.marker([destination.lat, destination.lng], { icon: destIcon }).addTo(map);

      // Draw Route Polyline (Red in Screenshot 1, White in Screenshot 3)
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
      }
      const routePoints = generateRoutePoints(pickup, destination, 14);
      const poly = L.polyline(
        routePoints.map((p) => [p.lat, p.lng] as [number, number]),
        {
          color: uiStyle === 'dark' ? '#FFFFFF' : '#DC2626',
          weight: 5,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round',
        }
      ).addTo(map);
      routePolylineRef.current = poly;
    }

    return () => {
      pickupMarker.remove();
      if (destMarker) destMarker.remove();
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
        routePolylineRef.current = null;
      }
    };
  }, [pickup.lat, pickup.lng, destination?.lat, destination?.lng, uiStyle]);

  // Progressive Search Radar Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (radiusCircleRef.current) {
      radiusCircleRef.current.remove();
      radiusCircleRef.current = null;
    }

    if (isSearching && searchRadiusKm) {
      const radiusMeters = searchRadiusKm * 1000;
      const circle = L.circle([pickup.lat, pickup.lng], {
        radius: radiusMeters,
        color: '#DC2626',
        weight: 2,
        fillColor: '#EF4444',
        fillOpacity: 0.15,
        dashArray: '6, 8',
      }).addTo(map);
      radiusCircleRef.current = circle;

      // Fit map to include radius nicely
      map.fitBounds(circle.getBounds(), { padding: [20, 20], maxZoom: 15 });
    }
  }, [isSearching, searchRadiusKm, pickup.lat, pickup.lng]);

  // Ambulance Markers (available vs busy)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    ambulanceMarkersRef.current.forEach((marker) => marker.remove());
    ambulanceMarkersRef.current.clear();

    ambulances.forEach((amb) => {
      if (!amb.isOnline) return;
      const isAvailable = amb.status === 'available';

      const ambIcon = L.divIcon({
        className: 'resq-amb-icon',
        html: `
          <div style="background: ${isAvailable ? '#10B981' : '#F59E0B'}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.35); border: 2px solid #FFFFFF; transition: transform 0.3s;">
            <span style="font-size: 15px;">🚑</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([amb.currentLat, amb.currentLng], { icon: ambIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; line-height: 1.4;">
            <strong style="color: #111827;">${amb.vehiclePlate}</strong> (${amb.category})<br/>
            <span style="color: #4B5563;">Driver: ${amb.driverName}</span><br/>
            <span style="font-size: 11px; font-weight: 700; color: ${isAvailable ? '#10B981' : '#F59E0B'};">${
          isAvailable ? 'AVAILABLE FOR DISPATCH' : 'ON ACTIVE TRIP'
        }</span>
          </div>
        `);

      ambulanceMarkersRef.current.set(amb.id, marker);
    });
  }, [ambulances]);

  // Live Simulated Moving Ambulance during Active Trip
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (assignedAmbulance) {
      const startPt = { lat: assignedAmbulance.currentLat, lng: assignedAmbulance.currentLng };
      const targetPt = destination || pickup;
      const points = generateRoutePoints(startPt, targetPt, 10);
      const currentStep = Math.min(simulationStep, points.length - 1);
      const activeCoord = points[currentStep];

      if (!movingAmbulanceMarkerRef.current) {
        const movingIcon = L.divIcon({
          className: 'resq-moving-ambulance',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(220,38,38,0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="width: 38px; height: 38px; border-radius: 50%; background: #DC2626; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(220,38,38,0.5); border: 2px solid #FFFFFF; z-index: 2;">
                <span style="font-size: 18px;">🚑</span>
              </div>
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });

        movingAmbulanceMarkerRef.current = L.marker([activeCoord.lat, activeCoord.lng], { icon: movingIcon }).addTo(map);
      } else {
        movingAmbulanceMarkerRef.current.setLatLng([activeCoord.lat, activeCoord.lng]);
      }
    } else {
      if (movingAmbulanceMarkerRef.current) {
        movingAmbulanceMarkerRef.current.remove();
        movingAmbulanceMarkerRef.current = null;
      }
    }
  }, [assignedAmbulance, simulationStep, destination, pickup]);

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden`}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Demo Simulation Label as per spec Section 10 */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-black/75 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-md border border-white/10 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>DEMO MODE — Vehicle location is simulated</span>
        </div>
      </div>

      {/* Recenter Button matching Screenshot 3 navigation control */}
      <button
        onClick={() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([pickup.lat, pickup.lng], 15, { animate: true });
          }
        }}
        title="Recenter to my location"
        className={`absolute bottom-6 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition active:scale-95 ${
          uiStyle === 'dark' ? 'bg-[#1E232A] text-white border border-gray-700 hover:bg-gray-800' : 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
      </button>
    </div>
  );
};

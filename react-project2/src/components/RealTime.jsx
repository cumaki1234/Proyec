// RealTimeTrackerMap.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const RealTimeTrackerMap = () => {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    // Simulación de actualizaciones en tiempo real (puedes reemplazar esto con tu lógica de seguimiento real)
    const updateLocation = () => {
      // Simula una nueva ubicación
      const newLocation = {
        lat: location.lat + (Math.random() - 0.5) * 0.01,
        lng: location.lng + (Math.random() - 0.5) * 0.01,
      };

      setLocation(newLocation);
    };

    // Actualiza la ubicación cada 5 segundos (ajusta según tus necesidades)
    const intervalId = setInterval(updateLocation, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [location]);

  const customMarkerIcon = new L.Icon({
    iconUrl: 'https://api.iconify.design/ic/round-food-bank.svg',
    iconSize: [38, 95], // Tamaño del ícono
    iconAnchor: [22, 94], // Punto de anclaje del ícono
    popupAnchor: [-3, -60], // Punto de anclaje del popup
  });

  return (
    <MapContainer center={location} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
        attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors'
        id="mapbox/streets-v11"
        accessToken="your-mapbox-access-token"
      />
      <Marker position={location} icon={customMarkerIcon}>
        <Popup>Tu ubicación en tiempo real</Popup>
      </Marker>
    </MapContainer>
  );
};

export default RealTimeTrackerMap;

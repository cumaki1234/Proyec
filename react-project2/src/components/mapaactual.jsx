import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button, Input, message } from 'antd';

const MapaActual = ({ latitud, longitud, onSaveCoordinates }) => {
    const defaultLat = -1.0120960779505797;
    const defaultLng = -79.47119403153062;

    const mapRef = useRef(null);
    const [inputLat, setInputLat] = useState(latitud || defaultLat);
    const [inputLng, setInputLng] = useState(longitud || defaultLng);

  useEffect(() => {
    const currentLat = latitud || defaultLat;
    const currentLng = longitud || defaultLng;

    if (!mapRef.current) {
      const newMap = L.map('map').setView([currentLat, currentLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(newMap);

      if (latitud !== null && longitud !== null && latitud !== undefined && longitud !== undefined) {
        const marker = L.marker([currentLat, currentLng]).addTo(newMap);
        mapRef.current = { map: newMap, marker }; 
      } else {
        const messageMarker = L.marker([defaultLat, defaultLng]).addTo(newMap);
        mapRef.current = { map: newMap, marker: messageMarker };  
      }
      
      newMap.on('click', handleMapClick);
    } else {
      mapRef.current.map.setView([currentLat, currentLng], 13);

      if (mapRef.current.marker) {
        mapRef.current.marker.setLatLng([currentLat, currentLng]);
      }
    }
  }, [latitud, longitud, defaultLat, defaultLng]);

  const handleAnimateToMarker = () => {
    if (mapRef.current && mapRef.current.marker) {
      const marker = mapRef.current.marker;
      mapRef.current.map.setView(marker.getLatLng(), 13, { animate: true });
    }
  };

  const handleMapClick = (event) => {
    const clickedLat = event.latlng.lat;
    const clickedLng = event.latlng.lng;
    setInputLat(clickedLat);
    setInputLng(clickedLng);

    if (mapRef.current && mapRef.current.marker) {
      mapRef.current.map.removeLayer(mapRef.current.marker);
    }

    const newMarker = L.marker([clickedLat, clickedLng]).addTo(mapRef.current.map);
    mapRef.current.marker = newMarker;
  };

  const handleInputChange = (e, type) => {
    const value = e.target.value;
    if (type === 'lat') {
      setInputLat(value);
    } else if (type === 'lng') {
      setInputLng(value);
    }
  };

  const handleSaveCoordinates = () => {
    const newLat = parseFloat(inputLat);
    const newLng = parseFloat(inputLng);

    if (!isNaN(newLat) && !isNaN(newLng)) {
        onSaveCoordinates(newLat, newLng);
        message.loading('Cargando...');
    } else {
        message.error('Por favor, ingrese coordenadas válidas');
    }
};

  const handleSetCoordinates = () => {
    const newLat = parseFloat(inputLat);
    const newLng = parseFloat(inputLng);

    if (!isNaN(newLat) && !isNaN(newLng)) {
      if (mapRef.current && mapRef.current.marker) {
        mapRef.current.map.removeLayer(mapRef.current.marker);
      }

      const newMarker = L.marker([newLat, newLng]).addTo(mapRef.current.map);
      mapRef.current.marker = newMarker; 
      onSaveCoordinates(newLat, newLng);
    }
  };

  return (
    <div>
      <div>
        <Input
          placeholder="Latitud"
          value={inputLat}
          onChange={(e) => handleInputChange(e, 'lat')}
        />
        <Input
          placeholder="Longitud"
          value={inputLng}
          onChange={(e) => handleInputChange(e, 'lng')}
        />
        <Button onClick={handleSetCoordinates}>Cambiar Marcador</Button>
      </div>
      <div id="map" style={{ height: '536px' }}></div>
      {mapRef.current && mapRef.current.marker && (
        <Button onClick={handleAnimateToMarker}>Centrar en el Marcador</Button>
      )}
      <Button onClick={handleSaveCoordinates}>Guardar</Button>
    </div>
    
  );
};

export default MapaActual;

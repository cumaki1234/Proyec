import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button, Input, Row, Col } from 'antd';

const LocationPicker = ({ onLocationSelect }) => {
  const initialCoordenadas = [-1.0242723581631499, -79.46778345025588];
  const [coordenadas, setCoordenadas] = useState(initialCoordenadas);
  const [marcador, setMarcador] = useState(null);
  const [inputLat, setInputLat] = useState('');
  const [inputLng, setInputLng] = useState('');
  const mapRef = useRef();

  useEffect(() => {
    return () => {
      // Limpiar recursos si es necesario
    };
  }, []);

  const handleMapClick = (e) => {
    const newMarker = {
      id: new Date().getTime(),
      position: [e.latlng.lat, e.latlng.lng],
    };
  
    setMarcador(newMarker);
    onLocationSelect && onLocationSelect(newMarker.position);
  };

  const handleMarkerDragEnd = (e) => {
    const updatedMarker = { ...marcador, position: [e.target._latlng.lat, e.target._latlng.lng] };
    setMarcador(updatedMarker);
    onLocationSelect && onLocationSelect(updatedMarker.position);
  };

  const handleAddMarkerAtCenter = () => {
    const map = mapRef.current;
    if (map) {
      const center = map.getCenter();
      const newMarker = {
        id: new Date().getTime(),
        position: [center.lat, center.lng],
      };

      setMarcador(newMarker);
      map.flyTo([center.lat, center.lng], map.getZoom());

      // Llamar a la función de devolución de llamada del componente padre con las coordenadas
      onLocationSelect && onLocationSelect(newMarker.position);
    }
  };

  const handleInputChange = (e, type) => {
    const value = e.target.value;
    if (type === 'lat') {
      setInputLat(value);
    } else if (type === 'lng') {
      setInputLng(value);
    }
  };

  const handleSetCoordinates = () => {
    const lat = parseFloat(inputLat);
    const lng = parseFloat(inputLng);
  
    if (!isNaN(lat) && !isNaN(lng)) {
      // Actualizar el estado coordenadas directamente
      setCoordenadas([lat, lng]);
  
      setMarcador({
        id: new Date().getTime(),
        position: [lat, lng],
      });
  
      // Llamar a la función de devolución de llamada del componente padre con las coordenadas
      onLocationSelect && onLocationSelect([lat, lng]);
    }
  };
  

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Input
            placeholder="Latitud"
            value={inputLat}
            onChange={(e) => handleInputChange(e, 'lat')}
          />
        </Col>

        <Col span={8}>
          <Input
            placeholder="Longitud"
            value={inputLng}
            onChange={(e) => handleInputChange(e, 'lng')}
          />
        </Col>
        <br />
      </Row>
      <Button onClick={handleSetCoordinates} style={{ marginTop: '10px'}}>Establecer Coordenadas</Button>

      <Button onClick={handleAddMarkerAtCenter} style={{ marginTop: '10px', marginBottom:'10px' }}>
        Seleccionar ubicación en el Centro
      </Button>

      <MapContainer 
        ref={mapRef}
        center={coordenadas}
        zoom={13}
        style={{ height: '400px', width: '100%', marginTop: '10px' }}
        onClick={handleMapClick}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> contributors'
        />
        {marcador && (
          <Marker
            key={marcador.id}
            position={marcador.position}
            draggable={true}
            onDragend={handleMarkerDragEnd}
          >
            <Popup>
              Aquí puedes agregar contenido adicional para el marcador.
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {marcador && (
        <div style={{ marginTop: '10px' }}>
          <label>Ubicación de sucursal: {marcador.position[0]}, {marcador.position[1]}</label>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;

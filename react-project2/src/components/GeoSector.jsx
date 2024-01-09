import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapWithMarkers = () => {
    const [center, setCenter] = useState([-1.0241157747979186, -79.46108497663826]); // Coordenadas del centro del mapa
    const [markers, setMarkers] = useState([]);
    const [polyline, setPolyline] = useState([]);
  
    const handleGetCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
          setMarkers([{ latitude, longitude }]);
          updatePolyline([{ latitude, longitude }]);
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    };
  
    const handleCancel = () => {
      setMarkers([]);
      setPolyline([]);
    };
  
    const MapClickHandler = () => {
      useMapEvent('click', (event) => {
        const { lat, lng } = event.latlng;
        const newMarker = { latitude: lat, longitude: lng };
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
        updatePolyline([...markers, newMarker]);
      });
  
      return null;
    };
  
    const updatePolyline = (markerArray) => {
      if (markerArray.length > 1) {
        setPolyline(markerArray);
      }
    };


    const handleMarkerClick = (clickedIndex) => {
        if (markers.length > 1 && clickedIndex === markers.length - 1) {
          // Si haces clic en el último marcador, cierra el polígono conectándolo con el primer marcador
          updatePolyline([...markers, markers[0]]);
        }
      };
  
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ width: '200px', marginRight: '10px' }}>
            <h2>Ubicación Guardada</h2>
            {markers.map((marker, index) => (
              <ul key={index}>
                <li>{`Latitud: ${marker.latitude.toFixed(4)}`}</li>
                <li>{`Longitud: ${marker.longitude.toFixed(4)}`}</li>
              </ul>
            ))}
          </div>
          <div>
            <button onClick={handleGetCurrentLocation}>Obtener Ubicación Actual</button>
            <button onClick={handleCancel}>Cancelar</button>
            <MapContainer center={center} zoom={13} style={{ height: '500px', width: '300%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClickHandler />
              {markers.map((marker, index) => (
                <Marker key={index} position={[marker.latitude, marker.longitude]}  eventHandlers={{
                    click: () => handleMarkerClick(index),}}>
                  <Popup>{`Latitud: ${marker.latitude.toFixed(4)}, Longitud: ${marker.longitude.toFixed(4)}`}</Popup>
                </Marker>
              ))}
              {polyline.length > 1 && (
                <Polyline
                  pathOptions={{ color: 'red' }}
                  positions={polyline.map((marker) => [marker.latitude, marker.longitude])}
                  key={polyline.map((marker) => `${marker.latitude}_${marker.longitude}`).join('_')}
                />
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    );
};

export default MapWithMarkers;

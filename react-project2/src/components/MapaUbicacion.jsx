import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

const MapComponent = () => {
  const mapRef = useRef(null);
  const [center, setCenter] = useState([0, 0]); // Cambiado para inicializar el centro en un valor neutral
  const [sucursales, setSucursales] = useState([]);

  const customMarkerIcon = new Icon({
    iconUrl: 'https://api.iconify.design/ic/round-food-bank.svg',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -60],
  });

  useEffect(() => {
    // Realizar la llamada a la API y actualizar el estado con las sucursales
    fetch('http://127.0.0.1:8000/sucursal/sucusarleslist/')
      .then(response => response.json())
      .then(data => {
        setSucursales(data.sucursales);
        // Establecer el centro en la primera sucursal (puedes ajustar esto según tus necesidades)
        setCenter([parseFloat(data.sucursales[0].id_ubicacion.latitud), parseFloat(data.sucursales[0].id_ubicacion.longitud)]);
      })
      .catch(error => console.error('Error fetching sucursales:', error));
  }, []);

  const handleLocationClick = (lat, lng) => {
    const newCenter = [lat, lng];
    const newZoom = 15;  
    mapRef.current.flyTo(newCenter, newZoom);
    console.log(`Ir a la ubicación: ${lat}, ${lng}`);
  };

  return (
    <div className="flex flex-wrap">
      <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4" style={{ maxHeight: '670px', overflowY: 'auto' }}>
        {sucursales.map(sucursal => (
        <div key={sucursal.id_sucursal} className="mb-4 bg-gray-200 p-4">
            <h3 className="text-lg font-bold mb-2">{sucursal.snombre}</h3>
            <p className="mb-2">{sucursal.sdireccion}</p>
            {sucursal.imagensucursal && (
            <img src={`data:image/png;base64, ${sucursal.imagensucursal}`} alt={`Imagen de ${sucursal.snombre}`} className="mb-2" />
          )}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => handleLocationClick(parseFloat(sucursal.id_ubicacion.latitud), parseFloat(sucursal.id_ubicacion.longitud))}
            >
            Ir a la ubicación
            </button>
        </div>
        ))}
      </div>

      <div className="w-full sm:w-1/2 md:w-3/4 lg:w-3/4">
        <MapContainer center={center} zoom={5} style={{ height: '670px', width: '100%' }} ref={mapRef}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {sucursales.map(sucursal => (
            <Marker key={sucursal.id_sucursal} position={[parseFloat(sucursal.id_ubicacion.latitud), parseFloat(sucursal.id_ubicacion.longitud)]} icon={customMarkerIcon}>
              <Popup>{sucursal.snombre}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;

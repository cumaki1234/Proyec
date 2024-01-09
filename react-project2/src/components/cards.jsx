import React, { useState, useEffect } from 'react';
import { Card, Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import MapUbiS from '../components/MapaUbicacion';

const LocationCard = () => {
  const [sucursales, setSucursales] = useState([]);
  const [markerCoordinates, setMarkerCoordinates] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null); // Nuevo estado

  const handleMarkerClick = (coordinates) => {
    setMarkerCoordinates(coordinates);
    setSelectedMarker(coordinates); // Almacenar las coordenadas seleccionadas
  };
  useEffect(() => {
    fetch('http://127.0.0.1:8000/sucursal/sucusarleslist/')
      .then(response => response.json())
      .then(data => {
        if (data && data.sucursales) {
          setSucursales(data.sucursales);
        } else {
          console.error('Respuesta inesperada de la API de sucursales:', data);
        }
      })
      .catch(error => console.error('Error al obtener la información de las sucursales:', error));
  }, []);

  const cardImageStyle = {
    height: '150px',
    objectFit: 'cover',
  };

  return (
    <Container className="location-card-container">
      <div className="location-card-scroll">
        <div className="location-card">
          {sucursales.map((sucursal) => (
            <Card key={sucursal.id_sucursal} style={{ width: '18rem', margin: '10px' }}>
              <Card.Img
                variant="top"
                src={sucursal.imagensucursal}
                alt={`Imagen de la sucursal ${sucursal.id_sucursal}`}
                style={cardImageStyle}
              />
              <Card.Body>
                <Card.Title>{sucursal.sdireccion}</Card.Title>
                <Card.Text>
                  Dirección de la sucursal y cualquier información adicional que desees.
                </Card.Text>
                <div className="text-center">
                  <Button
                    variant="primary"
                    className="card-button"
                    onClick={() => handleMarkerClick([
                      parseFloat(sucursal.id_ubicacion.latitud),
                      parseFloat(sucursal.id_ubicacion.longitud),
                    ])}
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" /> Encuéntranos
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
      <div className="location-map">
  <MapUbiS sucursales={sucursales} selectedMarker={markerCoordinates} />
</div>

    </Container>
  );
};
export default LocationCard;
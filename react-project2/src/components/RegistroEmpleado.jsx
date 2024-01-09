import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import '../EstiloRegistroEmpleados.css';



const RegistroEmpleado = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    rol: 'Cocinero', // Valor predeterminado en el listbox
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar lógica para guardar los datos del empleado
    console.log('Datos del empleado:', formData);
    // Luego puedes enviar los datos a tu backend o realizar las acciones necesarias
  };

  return (
    <Card className="form-card">
<MyNavbar/>
      <Card.Body>
        <Card.Title>Registro de Empleado</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formApellido">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Ingrese el teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRol">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
            >
              <option value="Cocinero">Cocinero</option>
              <option value="Cajero">Cajero</option>
              <option value="Repartidor">Repartidor</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Form>
      </Card.Body>
      <BottomBar2/>
    </Card>
    
  );
};

export default RegistroEmpleado;


import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';

const { Option } = Select;

const CrearEmpleadoForm = ({ }) => {
  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    // Obtener la lista de sucursales al cargar el componente
    const fetchSucursales = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/sucursal/sucusarleslist/');
        const data = await response.json();
        setSucursales(data.sucursales);
      } catch (error) {
        console.error('Error al obtener la lista de sucursales:', error);
      }
    };

    fetchSucursales();
  }, []); // Se ejecuta solo al montar el componente

  const onFinish = async (values) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/empleado/crear/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Empleado creado exitosamente');
      } else {
        console.error('Error al crear empleado:', data.error || 'Hubo un error al realizar la solicitud');
      }
    } catch (error) {
      console.error('Error al crear empleado:', error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Form name="crearEmpleadoForm" onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical">
      <Form.Item
        label="Nombre de Usuario"
        name="nombreusuario"
        rules={[
          { required: true, message: 'Ingresa el nombre de usuario' },
          { max: 300, message: 'El nombre de usuario no puede tener más de 300 caracteres' },
          {
            validator: async (_, value) => {
              try {
                const response = await fetch('http://127.0.0.1:8000/Login/cuentaexist/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    nombreusuario: value,
                  }),
                });

                const data = await response.json();

                if (data.mensaje === '1') {
                  throw new Error('El nombre de usuario ya está en uso');
                }
              } catch (error) {
                throw error.message;
              }
            },
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Contraseña"
        name="contrasenia"
        rules={[{ required: true, message: 'Ingresa la contraseña' }, { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Tipo de Empleado"
        name="tipo_empleado"
        rules={[{ required: true, message: 'Selecciona el tipo de empleado' }]}
      >
        <Select>
          <Option value="D">Delivery</Option>
          <Option value="M">Mesero</Option>
          <Option value="X">Jefe de Cocina</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Observación"
        name="observacion"
        rules={[{ max: 500, message: 'La observación no puede tener más de 500 caracteres' }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        label="Correo de Recuperación"
        name="correorecuperacion"
        rules={[
          { type: 'email', message: 'Ingresa un correo válido' },
          { max: 256, message: 'El correo de recuperación no puede tener más de 256 caracteres' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Sucursal" name="id_sucursal" rules={[{ required: true, message: 'Selecciona la sucursal' }]}>
        <Select>
          {sucursales.map((sucursal) => (
            <Option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
              {sucursal.snombre}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Nombre"
        name="nombre"
        rules={[{ required: true, message: 'Ingresa el nombre' }, { max: 300, message: 'El nombre no puede tener más de 300 caracteres' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Apellido"
        name="apellido"
        rules={[{ required: true, message: 'Ingresa el apellido' }, { max: 300, message: 'El apellido no puede tener más de 300 caracteres' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Teléfono"
        name="telefono"
        rules={[
          { required: true, message: 'Ingresa el número de teléfono' },
          { max: 10, message: 'El número de teléfono no puede tener más de 10 caracteres' },
          {
            validator: async (_, value) => {
              try {
                const response = await fetch('http://127.0.0.1:8000/Login/phoneExist/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    ctelefono: value,
                  }),
                });

                const data = await response.json();

                if (data.mensaje === '1') {
                  throw new Error('El número de telefono ya está registrado');
                }
              } catch (error) {
                throw error.message;
              }
            },
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Crear Empleado
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CrearEmpleadoForm;
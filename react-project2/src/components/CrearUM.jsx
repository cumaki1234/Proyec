import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';

const CrearUnidadMedida = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/producto/crearum/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Unidad de medida creada con éxito');
        form.resetFields(); // Reset the form fields
      } else {
        const errorData = await response.json();
        console.error('Error al crear la unidad de medida:', errorData);
        message.error('Error al crear la unidad de medida');
      }
    } catch (error) {
      console.error('Error al crear la unidad de medida:', error);
      message.error('Error al crear la unidad de medida');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, maxLength) => {
    const inputValue = e.target.value;
    if (inputValue.length > maxLength) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div>
      <Form
        form={form}
        name="crearUnidadMedida"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Nombre de la Unidad de Medida"
          name="nombre_um"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese el nombre de la Unidad de Medida',
            },
          ]}
        >
          <Input
            placeholder="Ej. Kilogramo, Litro, etc."
            maxLength={100}
            onChange={(e) => handleInputChange(e, 100)}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Crear Unidad de Medida
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CrearUnidadMedida;

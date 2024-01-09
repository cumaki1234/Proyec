import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Table, Space, message, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

// Función para convertir Base64 a URL de datos
const base64ToUrl = (base64String, mimeType) => {
  return `data:${mimeType};base64,${base64String}`;
};

const CrearAvisos = () => {
  const [form] = Form.useForm();
  const [avisos, setAvisos] = useState([]);

  const onFinish = async (values) => {
    const { titulo, descripcion, imagen } = values;
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('imagen', imagen.file);

    try {
      const response = await fetch('http://127.0.0.1:8000/avisos/crear/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        message.success('Aviso creado con éxito');
        form.resetFields();
        obtenerAvisos();
      } else {
        message.error(`Error al crear aviso: ${data.error}`);
      }
    } catch (error) {
      console.log(error);
      message.error('Error en la solicitud de creación de aviso');
    }

  };

  const obtenerAvisos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/avisos/avisos/');
      const data = await response.json();
      if (response.ok) {
        setAvisos(data.avisos_principales);
      } else {
        message.error(`Error al obtener la lista de avisos: ${data.error}`);
      }
    } catch (error) {
      message.error('Error en la solicitud de lista de avisos');
    }
  };

  useEffect(() => {
    obtenerAvisos();
  }, []);

  const columns = [
    {
      title: 'Título',
      dataIndex: 'titulo',
      key: 'titulo',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Imagen',
      dataIndex: 'imagen',
      key: 'imagen',
      render: (text, record) => (
        <Space size="middle">
          {record.imagen && (
            <Image
              src={base64ToUrl(record.imagen, 'image/png')}
              alt={`Imagen para ${record.titulo}`}
              style={{ maxWidth: '100px' }}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h3>Crear Nuevo Aviso</h3>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Título" name="titulo" rules={[
          { required: true, message: 'Por favor, ingresa el título' },
          { max: 150, message: 'El título no puede tener más de 150 caracteres' },
        ]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[
            { required: true, message: 'Por favor, ingresa la descripción' },
            { max: 500, message: 'La descripción no puede tener más de 500 caracteres' },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Imagen" name="imagen" valuePropName="file">
          <Upload
            maxCount={1}
            beforeUpload={() => false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Crear Aviso
          </Button>
        </Form.Item>
      </Form>


      {/* Tabla de avisos */}
      <h3>Lista de Avisos Principales</h3>
      <Table columns={columns} dataSource={avisos} rowKey="id_aviso" />
    </div>
  );
};
export default CrearAvisos;
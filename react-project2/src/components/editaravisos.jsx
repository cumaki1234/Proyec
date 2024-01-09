import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

// Función para convertir Base64 a URL de datos
const base64ToUrl = (base64String, mimeType) => {
  return `data:${mimeType};base64,${base64String}`;
};

const EditarAvisos = () => {
  const [avisos, setAvisos] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editAvisoId, setEditAvisoId] = useState(null);

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

  const handleEditar = (id_aviso) => {
    setEditAvisoId(id_aviso);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setEditAvisoId(null);
  };

  const handleFinish = async (values) => {
    try {
      const { titulo, descripcion, nueva_imagen } = values;
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('descripcion', descripcion);
      formData.append('nueva_imagen', nueva_imagen.file);

      const response = await fetch(`http://127.0.0.1:8000/avisos/editar/${editAvisoId}/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        message.success('Aviso editado con éxito');
        setVisible(false);
        obtenerAvisos();
      } else {
        message.error(`Error al editar aviso: ${data.error}`);
      }
    } catch (error) {
      message.error('Error en la solicitud de edición de aviso');
    }
  };

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
            <img
              src={base64ToUrl(record.imagen, 'image/png')}
              alt={`Imagen para ${record.titulo}`}
              style={{ maxWidth: '100px' }}
            />
          )}
        </Space>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEditar(record.id_aviso)}>
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Tabla de avisos */}
      <h3>Lista de Avisos Principales</h3>
      <Table columns={columns} dataSource={avisos} rowKey="id_aviso" />

      {/* Modal de edición */}
      <Modal
        title="Editar Aviso"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
  {/* Campos de edición */}
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
    <TextArea />
  </Form.Item>
  <Form.Item label="Nueva Imagen" name="nueva_imagen" valuePropName="file" rules={[
    { required: true, message: 'Por favor, selecciona una nueva imagen' },
    ({ file }) => {
      const isImage = /\.(png|jpg|jpeg)$/i.test(file.name);
      if (!isImage) {
        return Promise.reject('Por favor, selecciona una imagen válida.');
      }
      return Promise.resolve();
    },
  ]}>
    <Upload maxCount={1} beforeUpload={() => false} accept="image/*">
      <Button icon={<UploadOutlined />}>Seleccionar Nueva Imagen</Button>
    </Upload>
  </Form.Item>
  <Form.Item>
    <Button type="primary" htmlType="submit">
      Guardar Cambios
    </Button>
  </Form.Item>
</Form>
      </Modal>
    </div>
  );
};

export default EditarAvisos;

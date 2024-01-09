import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Upload, message, Modal } from 'antd';
import { CheckOutlined, UploadOutlined } from '@ant-design/icons';
import CrearTipoProducto from '../components/creartipoproducto';

const { Option } = Select;

const CrearCategoria = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [tiposYCategorias, setTiposYCategorias] = useState([]);
  const [idTipoProducto, setIdTipoProducto] = useState('');
  const [catNombre, setCatNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenCategoria, setImagenCategoria] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const handleOk = () => {
    // Puedes realizar acciones adicionales aquí si es necesario
    setModalVisible(false);
  };

  const handleCancel = () => {
    // Puedes realizar acciones adicionales aquí si es necesario
    setModalVisible(false);
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/producto/listatiposycategorias/')
      .then(response => response.json())
      .then(data => setTiposYCategorias(data.tipos_y_categorias))
      .catch(error => console.error('Error al obtener tipos y categorías:', error));
  }, []);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleChange = (info) => {
    if (info.fileList.length > 1) {
      // Si hay más de un archivo en la lista, conserva solo el último
      info.fileList = [info.fileList.shift()];
    }
    setImagenCategoria(info.fileList.length > 0 ? info.fileList[0].originFileObj : null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append('id_tipoproducto', values.idTipoProducto);
      formData.append('catnombre', values.catNombre);
      formData.append('descripcion', values.descripcion);
      formData.append('imagencategoria', imagenCategoria);

      const response = await fetch('http://127.0.0.1:8000/producto/crearcategoria/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Categoría creada con éxito');
        // Limpiar el formulario y la imagen después del éxito
        form.resetFields();
        setImagenCategoria(null);
        // Puedes realizar otras acciones después de un éxito, si es necesario
      } else {
        message.error(data.error || 'Hubo un error al realizar la solicitud');
      }
    } catch (error) {
      message.error('Hubo un error al realizar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <h1>Crear Categoría</h1>
      <Form form={form} onFinish={handleSubmit} onFinishFailed={onFinishFailed} layout="vertical">
        <Form.Item
          label="Tipo de Producto"
          name="idTipoProducto"
          rules={[{ required: true, message: 'Selecciona un tipo de producto' }]}
        >
          <Select
            placeholder="Selecciona un tipo de producto"
            value={idTipoProducto}
            onChange={(value) => setIdTipoProducto(value)}
          >
            {tiposYCategorias.map(tipoCategoria => (
              <Option key={tipoCategoria.id_tipoproducto} value={tipoCategoria.id_tipoproducto}>
                {tipoCategoria.tpnombre}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={showModal}>
            Agregar nuevo Tipo de producto
          </Button>
        </Form.Item>
        <Form.Item
          label="Nombre de la Categoría"
          name="catNombre"
          rules={[
            { required: true, message: 'Ingrese el nombre de la categoría' },
            {
              validator: async (_, value) => {
                try {
                  const response = await fetch('http://127.0.0.1:8000/producto/categoriaExist/', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      catnombre: value,
                    }),
                  });

                  const data = await response.json();

                  if (data.mensaje === '1') {
                    throw new Error('La categoría ya está registrada');
                  }
                } catch (error) {
                  throw error.message;
                }
              },
            },
            { max: 300, message: 'El nombre de la categoría no puede exceder los 300 caracteres' },
          ]}
        >
          <Input value={catNombre} onChange={(e) => setCatNombre(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[
            { max: 500, message: 'La descripción no puede exceder los 500 caracteres' },
          ]}
        >
          <Input.TextArea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </Form.Item>
        <Form.Item label="Imagen de la Categoría" name="imagenCategoria" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload
            accept="image/*"
            listType="picture"
            beforeUpload={() => false}
            fileList={imagenCategoria ? [{ uid: '1', originFileObj: imagenCategoria }] : []}
            onChange={handleChange}
          >
            <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Crear Categoría
          </Button>
        </Form.Item>
      </Form>
      <Modal

        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[

        ]}
      >
        <CrearTipoProducto />
      </Modal>
      {mensaje && (
        <div style={{ display: 'flex', alignItems: 'center', color: 'green' }}>
          <CheckOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
          <p>{mensaje}</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default CrearCategoria;

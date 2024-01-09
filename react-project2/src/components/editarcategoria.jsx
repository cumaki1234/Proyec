import React, { useState, useEffect } from 'react';
import { Table, Space, Image, Button, Form, Input, Select, Modal, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const EditarCategoria = ({ onCancel }) => {
  const [categorias, setCategorias] = useState([]);
  const [tiposProductos, setTiposProductos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const fetchCategorias = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/producto/listar_categorias/');
      const data = await response.json();
      setCategorias(data.categorias);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  useEffect(() => {
    const fetchTiposProductos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/producto/listarproductos/');
        const data = await response.json();
        setTiposProductos(data.tipos_productos);
      } catch (error) {
        console.error('Error fetching tipos de productos:', error);
      }
    };

    fetchTiposProductos();
    fetchCategorias();
  }, []);

  const handleEdit = (record) => {
    setSelectedCategoria(record);
  };

  const handleCancelEdit = () => {
    setSelectedCategoria(null);
  };

  const handleUpdateCategoria = async (values) => {
    try {
      const formData = new FormData();
      formData.append('catnombre', values.catnombre);
      formData.append('descripcion', values.descripcion);
      formData.append('id_tipoproducto', values.id_tipoproducto);

      if (values.imagen && values.imagen[0]?.originFileObj) {
        formData.append('imagencategoria', values.imagen[0].originFileObj);
      }

      const response = await fetch(
        `http://127.0.0.1:8000/producto/editar_categoria/${selectedCategoria.id_categoria}/`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log('Categoría editada con éxito:', data);
        fetchCategorias();
        handleCancelEdit();
        Modal.success({
          title: 'Éxito',
          content: 'Categoría editada con éxito',
        });
      } else {
        console.error('Error al editar categoría:', data.error);
        Modal.error({
          title: 'Error',
          content: `Error al editar categoría: ${data.error}`,
        });
      }
    } catch (error) {
      console.error('Error en la solicitud de edición:', error);
      Modal.error({
        title: 'Error',
        content: 'Error en la solicitud de edición',
      });
    }
  };

  const CategoriaForm = ({ onFinish, onCancel, initialValues, tiposProductos }) => {
    const [form] = Form.useForm();

    const validateImageFormat = (_, fileList) => {
      const isValidFormat = fileList.every(file => file.type.startsWith('image/'));
      if (!isValidFormat) {
        return Promise.reject('Solo se permiten archivos de imagen');
      }
      return Promise.resolve();
    };

    return (
      <Form
        form={form}
        name="editarCategoriaForm"
        onFinish={(values) => {
          onFinish(values);
        }}
        initialValues={initialValues}
      >
        <Form.Item
          label="Nombre"
          name="catnombre"
          rules={[
            {
              required: true,
              message: 'Por favor ingresa el nombre de la categoría',
            },
            { max: 300, message: 'El nombre de la categoría no puede exceder los 300 caracteres' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[{ max: 500, message: 'La descripción no puede exceder los 500 caracteres' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Tipo de Producto"
          name="id_tipoproducto"
          rules={[
            {
              required: true,
              message: 'Por favor selecciona el tipo de producto',
            },
          ]}
        >
          <Select>
            {tiposProductos.map((tipo) => (
              <Select.Option key={tipo.id_tipoproducto} value={tipo.id_tipoproducto}>
                {tipo.tpnombre}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
        label="Imagen de la Categoría"
        name="imagen"
        valuePropName="fileList"
        getValueFromEvent={(e) => e && e.fileList}
        rules={[{ validator: validateImageFormat }]}
      >
        <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
          <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
        </Upload>
      </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar cambios
          </Button>
          <Button onClick={onCancel}>
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'catnombre',
      key: 'catnombre',
    },
    {
      title: 'Imagen',
      dataIndex: 'imagencategoria',
      key: 'imagencategoria',
      render: (imagencategoria) => (
        <Image src={`data:image/png;base64, ${imagencategoria}`} alt="Imagen de la categoría" width={50} />
      ),
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  const selectedCategoriaWithValidTipo = {
    ...selectedCategoria,
    id_tipoproducto:
      selectedCategoria?.id_tipoproducto &&
        tiposProductos.find((tipo) => tipo.id_tipoproducto === selectedCategoria.id_tipoproducto)
        ? selectedCategoria.id_tipoproducto
        : tiposProductos[0]?.id_tipoproducto,
  };

  return (
    <>
      <Table dataSource={categorias} columns={columns} />
      {selectedCategoria && (
        <Modal
          title="Editar Categoría"
          visible={!!selectedCategoria}
          onCancel={handleCancelEdit}
          footer={null}
        >
          <CategoriaForm
            initialValues={selectedCategoriaWithValidTipo}
            tiposProductos={tiposProductos}
            onFinish={handleUpdateCategoria}
            onCancel={handleCancelEdit}
          />
        </Modal>
      )}
    </>
  );

};

export default EditarCategoria;

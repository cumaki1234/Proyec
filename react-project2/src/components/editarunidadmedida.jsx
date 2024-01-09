import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Form, Input, Modal } from 'antd';

const EditarUnidadesMedida = () => {
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const fetchUnidadesMedida = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/producto/listarum/');
      const data = await response.json();
      setUnidadesMedida(data.unidades_medida);
    } catch (error) {
      console.error('Error al obtener la lista de unidades de medida:', error);
    }
  };

  const openEditModal = (unidad) => {
    setSelectedUnidad(unidad);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setSelectedUnidad(null);
    setEditModalVisible(false);
  };

  const handleEdit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('nombreum', values.nombre_um);

      const response = await fetch(`http://127.0.0.1:8000/producto/editarum/${selectedUnidad.id_um}/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Unidad de medida editada con éxito:', data);
        fetchUnidadesMedida();
        closeEditModal();
        Modal.success({
          title: 'Éxito',
          content: 'Unidad de medida editada con éxito',
        });
      } else {
        console.error('Error al editar unidad de medida:', data.error);
        Modal.error({
          title: 'Error',
          content: `Error al editar unidad de medida: ${data.error}`,
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

  useEffect(() => {
    fetchUnidadesMedida();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id_um',
      key: 'id_um',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre_um',
      key: 'nombre_um',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text, record) => (
        <Button onClick={() => openEditModal(record)}>Editar</Button>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={unidadesMedida} columns={columns} />

      <Modal
        title="Editar Unidad de Medida"
        visible={editModalVisible}
        onCancel={closeEditModal}
        footer={null}
      >
        <Form onFinish={handleEdit} initialValues={selectedUnidad}>
          <Form.Item label="Nombre de la Unidad" name="nombre_um" rules={[{ required: true, message: 'Por favor ingresa el nombre de la unidad.' }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar Cambios
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default EditarUnidadesMedida;

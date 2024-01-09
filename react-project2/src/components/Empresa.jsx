import React, { useState, useEffect } from 'react';
import { Table, Spin, Space, Typography, Button, Modal, Form, Input, message, Image, Upload } from 'antd';
import { LoadingOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import Sucursales from './sucursales';


const { Title } = Typography;

const Empresa = () => {
  const [empresaInfo, setEmpresaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  const obtenerInformacionEmpresa = async () => {
    try {
      const respuesta = await fetch('http://127.0.0.1:8000/empresa/infoEmpresa/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const datos = await respuesta.json();
      setEmpresaInfo(datos.empresa_info);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener la información de la empresa:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerInformacionEmpresa();
  }, []);

  const mostrarModalEditar = () => {
    setEditModalVisible(true);
    form.setFieldsValue({
      enombre: empresaInfo.enombre,
      direccion: empresaInfo.direccion,
      etelefono: empresaInfo.etelefono,
      correoelectronico: empresaInfo.correoelectronico,
      fechafundacion: empresaInfo.fechafundacion,
      sitioweb: empresaInfo.sitioweb,
      eslogan: empresaInfo.eslogan,
    });
  };

  const manejarEdicion = async (values) => {
    const formData = new FormData();
    if (values.enombre) {
      formData.append('enombre', values.enombre);
    }

    if (values.direccion) {
      formData.append('direccion', values.direccion);
    }

    if (values.etelefono) {
      formData.append('etelefono', values.etelefono);
    }

    if (values.correoelectronico) {
      formData.append('correoelectronico', values.correoelectronico);
    }

    if (values.fechafundacion) {
      formData.append('fechafundacion', values.fechafundacion);
    }

    if (values.sitioweb) {
      formData.append('sitioweb', values.sitioweb);
    }

    if (values.eslogan) {
      formData.append('eslogan', values.eslogan);
    }

    // Agregar el campo 'logo' solo si se selecciona un archivo
    if (values.logo && values.logo.length > 0) {
      formData.append('elogo', values.logo[0].originFileObj);
    }

    try {
      const respuesta = await fetch(`http://127.0.0.1:8000/empresa/editar/`, {
        method: 'POST',
        body: formData,
      });

      if (respuesta.ok) {
        message.success('Datos de la empresa actualizados correctamente');
        setEditModalVisible(false);
        // Obtener información actualizada después de la edición
        obtenerInformacionEmpresa();
      } else {
        message.error('Error al editar la información de la empresa');
        // Puedes manejar la respuesta de otra manera si es necesario
        console.log(await respuesta.text());
      }
    } catch (error) {
      message.error('Error al editar la información de la empresa:', error);
    }
  };

  const manejarCancelacion = () => {
    setEditModalVisible(false);
  };

  const columns = [
    {
      title: 'Campo',
      dataIndex: 'campo',
      key: 'campo',
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      render: (text, record) => {
        if (record.campo === 'Logo' && empresaInfo.elogo) {
          return <Image src={`data:image/png;base64,${text}`} width={50} />;
        }
        return text;
      },
    },
  ];

  const dataSource = empresaInfo
    ? [
      { key: '1', campo: 'Nombre', valor: empresaInfo.enombre },
      { key: '2', campo: 'Dirección', valor: empresaInfo.direccion || 'No disponible' },
      { key: '3', campo: 'Teléfono', valor: empresaInfo.etelefono || 'No disponible' },
      { key: '4', campo: 'Correo Electrónico', valor: empresaInfo.correoelectronico || 'No disponible' },
      { key: '5', campo: 'Fecha de Fundación', valor: empresaInfo.fechafundacion },
      { key: '6', campo: 'Sitio Web', valor: empresaInfo.sitioweb || 'No disponible' },
      { key: '7', campo: 'Eslogan', valor: empresaInfo.eslogan || 'No disponible' },
      { key: '8', campo: 'Logo', valor: empresaInfo.elogo || 'No disponible' },
    ]
    : [];

  return (
    <Space size="middle" style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
      {loading ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      ) : (
        <div>
          <Title level={4} style={{ marginBottom: '20px' }}>
            Información de la Empresa
          </Title>

          <Table columns={columns} dataSource={dataSource} bordered pagination={false} />
          <p />
          <Button type="primary" icon={<EditOutlined />} onClick={mostrarModalEditar}>
            Editar Información
          </Button>
          <Modal
            title="Editar Información de la Empresa"
            visible={editModalVisible}
            onCancel={manejarCancelacion}
            footer={null}
          >
            <Form form={form} onFinish={manejarEdicion}>
              <Form.Item label="Nombre" name="enombre" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Dirección" name="direccion">
                <Input />
              </Form.Item>
              <Form.Item label="Teléfono" name="etelefono"
                rules={[{
                  pattern: /^[0-9]+$/,
                  message: 'Por favor, ingresa solo números en el teléfono',
                }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Correo Electrónico" name="correoelectronico" type="email"
                rules={[{ type: 'email', message: 'Por favor, ingresa un correo electrónico válido' },]}>
                <Input />
              </Form.Item>
              <Form.Item label="Fecha de Fundación" name="fechafundacion" type="date">
                <Input />
              </Form.Item>
              <Form.Item label="Sitio Web" name="sitioweb">
                <Input />
              </Form.Item>
              <Form.Item label="Eslogan" name="eslogan">
                <Input />
              </Form.Item>
              <Form.Item
                name="logo"
                valuePropName="fileList"
                getValueFromEvent={(e) => e && e.fileList}
                noStyle
              >
                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  maxCount={1}
                  accept=".png, .jpg, .jpeg"
                >
                  <Button icon={<UploadOutlined />}>Subir Imagen</Button>
                </Upload>
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Guardar Cambios
              </Button>
            </Form>
          </Modal>
        </div>
      )}
      <Space size="large" style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
          <Sucursales/>
      </Space>
    </Space>

  );
};

export default Empresa;
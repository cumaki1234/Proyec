import React from 'react';
import { Form, Input, Select, Button, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Map from './Map'

const { Option } = Select;

const Crearsucursal = () => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const formData = new FormData();

            formData.append('razonsocial', values.razonsocial);
            formData.append('sruc', values.ruc);
            formData.append('capacidad', values.capacidad);
            formData.append('scorreo', values.correo);
            formData.append('ctelefono', values.telefono);
            formData.append('sdireccion', values.direccion);
            formData.append('snombre', values.nombre);
            formData.append('imagen', values.imagen[0].originFileObj);

            const respuesta = await fetch('http://127.0.0.1:8000/sucursal/crear/', {
                method: 'POST',
                body: formData,
            });

            if (respuesta.ok) {
                message.success('Sucursal creada exitosamente');
                form.resetFields();
            } else {
                message.error('Error al crear la sucursal');
                console.log('Llegamos a este fallo', await respuesta.text());
            }
        } catch (error) {
            message.error('Error al crear la sucursal:', error);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return (
        <div>
            <h2>Crear Sucursal</h2>
            <Form
                name="crearsucursal"
                form={form}
                onFinish={onFinish}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{
                    capacidad: 'P',
                }}
            >
                <Form.Item
                    label="Razón Social"
                    name="razonsocial"
                    rules={[
                        { required: true, message: 'Por favor, ingresa la razón social' },
                        {
                            max: 300,
                            message: 'La razón social no puede tener más de 300 caracteres',
                        },
                        {
                            validator: async (_, value) => {
                                try {
                                    const response = await fetch('http://127.0.0.1:8000/sucursal/sucursalExist/', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            srazon_social: value,
                                        }),
                                    });

                                    const data = await response.json();

                                    if (data.mensaje === '1') {
                                        throw new Error('La razón social ya fue usada en otra sucursal');
                                    }
                                } catch (error) {
                                    throw error.message;
                                }
                            },
                        },
                    ]}
                >
                    <Input maxLength={300} />
                </Form.Item>

                <Form.Item
                    label="RUC"
                    name="ruc"
                    rules={[{ required: true, message: 'Por favor, ingresa el RUC' },
                    {
                        max: 20,
                        message: 'El RUC no puede tener más de 20 caracteres',
                    },
                    {
                        validator: async (_, value) => {
                            try {
                                const response = await fetch('http://127.0.0.1:8000/sucursal/sucursalExist/', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        sruc: value,
                                    }),
                                });

                                const data = await response.json();

                                if (data.mensaje === '1') {
                                    throw new Error('El ruc, ya fue usado en otra sucursal');
                                }
                            } catch (error) {
                                throw error.message;
                            }
                        },
                    }]}
                >
                    <Input maxLength={20} />
                </Form.Item>

                <Form.Item
                    label="Capacidad"
                    name="capacidad"
                    rules={[{ required: true, message: 'Por favor, selecciona la capacidad' }]}
                >
                    <Select>
                        <Option value="P">Principal</Option>
                        <Option value="S">Secundaria</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Correo"
                    name="correo"
                    rules={[
                        { required: true, message: 'Por favor, ingresa el correo' },
                        {
                            max: 300,
                            message: 'El correo no puede tener más de 300 caracteres',
                        },
                    ]}
                >
                    <Input type="email" maxLength={300} />
                </Form.Item>

                <Form.Item
                    label="Teléfono"
                    name="telefono"
                    rules={[
                        {
                            pattern: /^[0-9]+$/, // Expresión regular que permite solo números
                            message: 'Por favor, ingresa solo números en el teléfono',
                        },
                        {
                            max: 300,
                            message: 'El teléfono no puede tener más de 300 caracteres',
                        },
                    ]}
                >
                    <Input maxLength={300} />
                </Form.Item>

                <Form.Item
                    label="Dirección"
                    name="direccion"
                    rules={[
                        { required: true, message: 'Por favor, ingresa la dirección' },
                        {
                            max: 300,
                            message: 'La dirección no puede tener más de 300 caracteres',
                        },
                    ]}
                >
                    <Input maxLength={300} />
                </Form.Item>

                <Form.Item
                    label="Nombre"
                    name="nombre"
                    rules={[{ required: true, message: 'Por favor, ingresa el nombre' },
                    {
                        max: 300,
                        message: 'El nombre no puede tener más de 300 caracteres',
                    },
                    {
                        validator: async (_, value) => {
                            try {
                                const response = await fetch('http://127.0.0.1:8000/sucursal/sucursalExist/', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        snombre: value,
                                    }),
                                });

                                const data = await response.json();

                                if (data.mensaje === '1') {
                                    throw new Error('El nombre, ya fue usado en otra sucursal');
                                }
                            } catch (error) {
                                throw error.message;
                            }
                        },
                    }]}
                >
                    <Input maxLength={300} />
                </Form.Item>
                <Form.Item
                    label="Imagen"
                    name="imagen"
                    accept="image/*"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[
                        { required: true, message: 'Por favor, sube una imagen' },
                        {
                            validator: (_, value) => {
                                // Validar que el archivo subido sea una imagen
                                const isValidImage = value && value.length > 0 && value[0].type.startsWith('image/');
                                if (!isValidImage) {
                                    return Promise.reject('Por favor, sube solo archivos de imagen');
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Upload.Dragger name="files" multiple={false} accept="image/*">
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Haz clic o arrastra una imagen para subirla</p>
                    </Upload.Dragger>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Crear Sucursal
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Crearsucursal;

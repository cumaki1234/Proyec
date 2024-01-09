import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Modal, Form, Input, Button, Select } from 'antd';

const EditarEmpleado = () => {
    const [sucursales, setSucursales] = useState([]);
    const [empleados, setEmpleados] = useState(null);
    const [visible, setVisible] = useState(false);
    const [editedEmpleado, setEditedEmpleado] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseEmpleados = await fetch('http://127.0.0.1:8000/empleado/listar-empleados/');
                if (!responseEmpleados.ok) {
                    throw new Error('Error fetching empleados');
                }
                const dataEmpleados = await responseEmpleados.json();
                setEmpleados(dataEmpleados.empleados);
            } catch (error) {
                console.error('Error fetching empleados:', error);
            }

            try {
                const responseSucursales = await fetch('http://127.0.0.1:8000/sucursal/sucusarleslist/');
                if (!responseSucursales.ok) {
                    throw new Error('Error fetching sucursales');
                }
                const dataSucursales = await responseSucursales.json();
                // Asegúrate de ajustar esto según la estructura exacta de la respuesta de la API de sucursales
                const sucursales = dataSucursales.sucursales || [];
                setSucursales(sucursales);
            } catch (error) {
                console.error('Error fetching sucursales:', error);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = (empleado) => {
        console.log('Empleado seleccionado para editar:', empleado);

        setEditedEmpleado(empleado);
        form.setFieldsValue({
            nombre: empleado.nombre,
            apellido: empleado.apellido,
            telefono: empleado.telefono,
            sucursales: empleado.sucursal,
        });
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleSave = async () => {
        try {
            console.log('Valores antes de la solicitud POST:');
            console.log('Tipo de empleado:', 'X');
            console.log('ID del empleado:', editedEmpleado.id);
            console.log('Datos del formulario:', form.getFieldsValue());

            const response = await fetch('http://127.0.0.1:8000/empleado/editar-empleado/' + editedEmpleado.tipo + '/' + editedEmpleado.id + '/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form.getFieldsValue()),
            });

            if (!response.ok) {
                throw new Error('Error updating empleado');
            }

            // Recargar la lista de empleados después de la edición
            const fetchData = async () => {
                try {
                    const response = await fetch('http://127.0.0.1:8000/empleado/listar-empleados/');
                    if (!response.ok) {
                        throw new Error('Error fetching empleados');
                    }
                    const data = await response.json();
                    setEmpleados(data.empleados);
                    setVisible(false);
                } catch (error) {
                    console.error('Error fetching empleados:', error);
                }
            };

            fetchData();
        } catch (error) {
            console.error('Error updating empleado:', error);
        }
    };

    if (!empleados) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            {Object.keys(empleados).map((tipoEmpleado, index) => (
                <Card key={index} title={tipoEmpleado} style={{ margin: '16px 0' }}>
                    <Row gutter={16}>
                        {empleados[tipoEmpleado].map((empleado, i) => (
                            <Col span={8} key={i}>
                                <Card onClick={() => handleEditClick(empleado)}>
                                    <Card.Meta
                                        avatar={<Avatar>{empleado.nombre[0]}</Avatar>}
                                        id={`id: ${empleado.id}`}
                                        tipo={`tipo: ${empleado.tipo}`}
                                        sucursal={`sucursal: ${empleado.sucursal}`}
                                        title={`${empleado.nombre} ${empleado.apellido}`}
                                        description={`Teléfono: ${empleado.telefono}`}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>
            ))}
            <Modal
                title="Editar Empleado"
                visible={visible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancelar
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSave}>
                        Guardar
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Nombre" name="nombre">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Apellido" name="apellido">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Teléfono" name="telefono">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Sucursales" name="sucursales">
                        <Select>
                            {sucursales.map((sucursal) => (
                                <Select.Option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                                    {sucursal.snombre}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default EditarEmpleado;

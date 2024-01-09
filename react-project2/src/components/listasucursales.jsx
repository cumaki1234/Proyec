import React, { useState, useEffect } from 'react';
import { Space, Button, Table, Modal, message, Switch, Form, Input } from 'antd';
import mapa from './res/mapa.png';
import AdminSucursal from './adminsucursal';
import CrearSucursal from './CrearSucursal';

const ListSucursales = () => {
    const [loading, setLoading] = useState(true);
    const [modalSVisible, setModalSVisible] = useState(false);
    const [modalCrearVisible, setModalCrearVisible] = useState(false);
    const [sucursalesData, setSucursalesData] = useState([]);
    const [currentSucursal, setCurrentSucursal] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setLoading(true);
        fetch('http://127.0.0.1:8000/sucursal/sucusarleslist/')
            .then((response) => response.json())
            .then((data) => {
                setSucursalesData(data.sucursales);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error al obtener los datos de sucursales:', error);
                setLoading(false);
            });
    };

    const handleCancel = () => {
        setModalCrearVisible(false);
        fetchData();
        message.success('Actualizando...');
    };

    const handleSwitchChange = (checked, record) => {
        const formData = new FormData();
        formData.append('id_sucursal', record.id_sucursal);
        formData.append('sestado', checked ? '1' : '0');
        fetch('http://127.0.0.1:8000/sucursal/actsucursal/', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                fetchData();
                message.success('Actualizando...');
            })
            .catch((error) => {
                console.error('Error al enviar la solicitud POST:', error);
            });
    };

    const columns = [
        { title: 'ID', dataIndex: 'id_sucursal', key: 'id_sucursal' },
        { title: 'Razón Social', dataIndex: 'srazon_social', key: 'srazon_social' },
        { title: 'Dirección', dataIndex: 'sdireccion', key: 'sdireccion' },
        { title: 'Nombre', dataIndex: 'snombre', key: 'snombre' },
        {
            title: 'Ubicación',
            dataIndex: 'id_ubicacion',
            key: 'id_ubicacion',
            render: (id_ubicacion, record) => (
                <>
                    {id_ubicacion && (
                        <img
                            onClick={() => handleUbicacionClick(id_ubicacion.latitud, id_ubicacion.longitud, record.id_sucursal)}
                            src={mapa}
                            style={{ maxWidth: '40px', maxHeight: '40px' }}
                        />
                    )}
                </>
            ),
        },
        {
            title: 'Imágenes',
            dataIndex: 'imagensucursal',
            key: 'imagensucursal',
            render: (imagensucursal) =>
                imagensucursal && (
                    <img
                        src={`data:image/png;base64,${imagensucursal}`}
                        alt="Sucursal"
                        style={{ maxWidth: '50px', maxHeight: '50px' }}
                    />
                ),
        },
        {
            title: 'Estado',
            dataIndex: 'sestado',
            key: 'sestado',
            render: (sestado, record) => (
                <Switch
                    defaultChecked={sestado === '1'}
                    checked={sestado === '1'}
                    onChange={(checked) => handleSwitchChange(checked, record)}
                />
            ),
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <>
                    <Button type="primary" onClick={() => handleShowModal(record.id_sucursal)}>
                        Ver Detalles
                    </Button>
                </>
            ),
        },
    ];

    const handleShowModal = (idSucursal) => {
        setCurrentSucursal(idSucursal);
        setModalSVisible(true);
    };

    const handleShowCrearModal = () => {
        setModalCrearVisible(true);
    };

    const handleCreateSucursal = () => {
        form.validateFields()
            .then((values) => {
                // Enviar los datos al servidor para crear la sucursal
                fetch('http://127.0.0.1:8000/sucursal/crearsucursal/', {
                    method: 'POST',
                    body: JSON.stringify(values),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.success) {
                            message.success('Sucursal creada con éxito');
                            setModalCrearVisible(false);
                            fetchData();
                        } else {
                            message.error('Error al crear la sucursal');
                        }
                    })
                    .catch((error) => {
                        console.error('Error al enviar la solicitud POST:', error);
                        message.error('Error al crear la sucursal');
                    });
            })
            .catch((error) => {
                console.error('Error al validar el formulario:', error);
            });
    };

    return (
        <div>
            <h2>Sucursales</h2>
            <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
                <Button type="primary" style={{ width: '100%' }} onClick={() => setModalCrearVisible(true)}>
                    Crear Nueva Sucursal
                </Button>
            </Space>
            <Table
                columns={columns}
                dataSource={sucursalesData}
                bordered
                loading={loading}
                rowKey={(record) => record.id_sucursal}
            />
            <Modal
                title="Detalles de la Sucursal"
                visible={modalSVisible}
                onCancel={() => {
                    fetchData();
                    message.success('Actualizando...');
                    setModalSVisible(false);
                }}
                footer={null}
                width={100000}
            >
                {currentSucursal !== null ? (
                    <AdminSucursal idsucursal={currentSucursal} />
                ) : (
                    <p>No hay sucursal seleccionada.</p>
                )}
            </Modal>
            <Modal
                title="Crear Nueva Sucursal"
                visible={modalCrearVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <CrearSucursal />
            </Modal>
        </div>
    );
};

export default ListSucursales;

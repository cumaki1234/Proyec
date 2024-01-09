import React, { useState, useEffect } from 'react';
import { Space, Button, Table, Modal, message, Switch } from 'antd';
import CrearSucursal from './CrearSucursal';
import mapa from './res/mapa.png';
import MapaActual from './mapaactual';

const Sucursales = () => {
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [sucursalesData, setSucursalesData] = useState([]);
    const [ubicacionVisible, setUbicacionVisible] = useState(false);
    const [ubicacionAltitud, setUbicacionAltitud] = useState(null);
    const [ubicacionLongitud, setUbicacionLongitud] = useState(null);
    const [currentSucursal, setCurrentSucursal] = useState(null);

    const handleUbicacionClick = (altitud, longitud, id_sucursal) => {
        setUbicacionLongitud(longitud);
        setUbicacionAltitud(altitud);
        setCurrentSucursal(id_sucursal);
        setUbicacionVisible(true);
    };

    const handleUbicacionCancel = () => {
        setUbicacionVisible(false);
    };

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });

    useEffect(() => {
        fetchData();
    }, [pagination.current, pagination.pageSize]);

    const fetchData = () => {
        setLoading(true);
        setSucursalesData([]);

        const { current, pageSize } = pagination;
        const url = `http://127.0.0.1:8000/sucursal/sucusarleslist/?page=${current}&pageSize=${pageSize}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setSucursalesData(data.sucursales);
                setLoading(false);
                setPagination({
                    ...pagination,
                    total: data.total, // Total de filas sin paginación
                });
            })
            .catch((error) => {
                console.error('Error al obtener los datos de sucursales:', error);
                setLoading(false);
            });
    };

    const handleSwitchChange = (checked, record) => {
        console.log(
            `Switch cambiado para la sucursal ${record.id_sucursal}. Nuevo estado: ${checked}`
        );
        const formData = new FormData();
        formData.append('id_sucursal', record.id_sucursal);
        formData.append('sestado', checked ? '1' : '0');
        fetch('http://127.0.0.1:8000/sucursal/actsucursal/', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                console.log('Respuesta completa de la API:', response);
                return response.json();
            })
            .then((data) => {
                fetchData();
                message.success('Actualizando...');
                console.log('Respuesta de la API:', data);
            })
            .catch((error) => {
                console.error('Error al enviar la solicitud POST:', error);
            });
    };

    const handleSaveUbicacion = (latitud, longitud) => {
        if (!currentSucursal) {
            message.error('Error: No se pudo recoger la sucursal');
            return;
        }
        Modal.confirm({
            title: 'Confirmar',
            content: '¿Estás seguro de que deseas actualizar la ubicación de esta sucursal?',
            onOk() {
                const formData = new FormData();
                formData.append('id_sucursal', currentSucursal);
                formData.append('latitud', latitud);
                formData.append('longitud', longitud);

                fetch('http://127.0.0.1:8000/sucursal/editarubicacion/', {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.json())
                    .then(data => {
                        fetchData();
                        handleUbicacionCancel();
                        message.success('Ubicación actualizada con éxito');
                        console.log('Respuesta de la API:', data);
                    })
                    .catch(error => {
                        console.error('Error al enviar la solicitud POST:', error);
                        message.error('Error al actualizar la ubicación')
                    });
            },
            onCancel() {
                message.success('Actualización de ubicación cancelada');
            },
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
    ];

    const openModal = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
        fetchData();
    };

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    return (
        <div>
            <h2>Sucursales</h2>
            <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
                <Button type="primary" style={{ width: '100%' }} onClick={openModal}>
                    Crear Nueva Sucursal
                </Button>
            </Space>
            <div style={{ overflowX: 'auto' }}>
                <Table
                    columns={columns}
                    dataSource={sucursalesData}
                    bordered
                    pagination={pagination}
                    loading={loading}
                    onChange={handleTableChange}
                    style={{ maxWidth: '100%' }}
                    rowKey={(record) => record.id_sucursal}
                />
            </div>
            <Modal
                title="Ubicación"
                visible={ubicacionVisible}
                onCancel={handleUbicacionCancel}
                footer={null}
                width={1000}
            >
                {ubicacionAltitud !== null && ubicacionLongitud !== null ? (
                    <MapaActual latitud={ubicacionAltitud} longitud={ubicacionLongitud} onSaveCoordinates={handleSaveUbicacion} />
                ) : (
                    <>
                        <MapaActual latitud={ubicacionAltitud} longitud={ubicacionLongitud} onSaveCoordinates={handleSaveUbicacion} />
                        <p>No hay ubicación agregada. Selecciona tu ubicación.</p>
                    </>


                )}
            </Modal>
            <Modal
                title="Crear Nueva Sucursal"
                visible={modalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <CrearSucursal />
            </Modal>
        </div>
    );
};

export default Sucursales;

import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, Space, Table, Modal, Form } from 'antd';
import {
    SearchOutlined,
    EditOutlined,
    FilePdfOutlined,
    FileExcelOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const TablaPro = () => {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [imagePreviewVisible, setImagePreviewVisible] = useState(false);

    // Función para obtener los datos de la API
    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/producto/listar/');
            const result = await response.json();
            setData(result.productos);
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
        }
    };

    useEffect(() => {
        fetchData();  // Llamada a la API al montar el componente
    }, []);  // El segundo parámetro [] asegura que useEffect se ejecute solo una vez al montar el componente

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleEdit = (record) => {
        setSelectedRecord(record);
        setIsModalVisible(true);
        setImageUrl(record.imagenp);
        form.setFieldsValue(record);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
    
            const updatedData = data.map((item) =>
                item.key === selectedRecord.key ? { ...item, ...values, imagenp: imageUrl } : item
            );
    
            console.log('Datos actualizados:', updatedData);
    
            // Supongamos que tu backend tiene una función updateProduct
            const updatedProduct = updatedData.find(item => item.key === selectedRecord.key);
    
            // Llama a la función updateProduct para actualizar el producto en el backend
            await updateProduct(updatedProduct);
    
            console.log('Producto actualizado en el backend');
            // Actualiza el estado con los datos actualizados si es necesario
            setData(updatedData);
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            // Maneja el error de validación de campos (mostrar mensaje de error, etc.)
            // o cualquier otro error que pueda ocurrir durante la actualización
        }
    };
    

    const updateProduct = async (updatedProduct) => {
        console.log('Actualizando producto en el backend:', updatedProduct);
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/producto/editarproducto/${updatedProduct.id_producto}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });
    
            if (!response.ok) {
                throw new Error(`Error al actualizar el producto en el backend. Código: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Respuesta exitosa del servidor:', data);
            return data;
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw error;
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageUrl(URL.createObjectURL(file));
        }
        form.setFieldsValue({ imagenp: file });
    };

    const handleDownloadPDF = () => {
        // Lógica para descargar como PDF
        console.log('Descargando como PDF');
        setIsReportModalVisible(false);
    };

    const handleDownloadExcel = () => {
        // Lógica para descargar como Excel
        console.log('Descargando como Excel');
        setIsReportModalVisible(false);
    };

    const handlePreviewImage = (url) => {
        setImagePreviewVisible(true);
    };

    const handleCancelPreview = () => {
        setImagePreviewVisible(false);
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Buscar ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Buscar
                    </Button>
                    <Button size="small" style={{ width: 90 }} onClick={() => handleReset(clearFilters)}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex] &&
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current.select(), 100);
            }
        },
        render: (text, record) => dataIndex === 'imagenp' ? (
            <img
                src={text}
                alt="producto"
                style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                onClick={() => handlePreviewImage(record.imagenp)}
            />
        ) : (
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            )
        ),
    });

    const columns = [
        {
            title: 'Categoria',
            dataIndex: 'id_categoria',
            key: 'id_categoria',
            width: '10%',
            ...getColumnSearchProps('category'),
        },
        {
            title: 'Imagen',
            dataIndex: 'imagenp',
            key: 'imagenp',
            render: (imagenp) => (
                <img
                    src={imagenp}
                    alt="producto"
                    style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                    onClick={() => handlePreviewImage(imagenp)}
                />
            ),
            width: '10%',
        },
        {
            title: 'Puntos Producto',
            dataIndex: 'puntosp',
            key: 'puntosp',
            width: '10%',
            ...getColumnSearchProps('points'),
        },
        {
            title: 'Código Principal',
            dataIndex: 'codprincipal',
            key: 'codprincipal',
            width: '10%',
            ...getColumnSearchProps('productCode'),
        },
        {
            title: 'Nombre del Producto',
            dataIndex: 'nombreproducto',
            key: 'nombreproducto',
            width: '15%',
            ...getColumnSearchProps('productName'),
        },
        {
            title: 'Descripción',
            dataIndex: 'descripcionproducto',
            key: 'descripcionproducto',
            width: '20%',
            ...getColumnSearchProps('descripcionproducto'),
        },
        {
            title: 'Precio Unitario',
            dataIndex: 'preciounitario',
            key: 'preciounitario',
            width: '10%',
            ...getColumnSearchProps('preciounitario'),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (text, record) => (
                <Button
                    type="primary"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(record)}
                >
                    Editar
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={() => setIsReportModalVisible(true)}>
                Generar Reportes
            </Button>

            <Table columns={columns} dataSource={data} />

            <Modal
                title="Editar Producto"
                visible={isModalVisible}
                onOk={handleSave}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Imagen" name="imagenp">
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="Imagen del producto"
                                style={{ width: '100px', cursor: 'pointer' }}
                                onClick={() => handlePreviewImage(imageUrl)}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Puntos Producto" name="puntosp">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Nombre del Producto" name="nombreproducto">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Descripción" name="descripcionproducto">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Precio Unitario" name="preciounitario">
                        <Input />
                    </Form.Item>
                    {/* Agrega más campos según sea necesario */}
                </Form>
            </Modal>

            <Modal
                title="Generar Reportes"
                visible={isReportModalVisible}
                onCancel={() => setIsReportModalVisible(false)}
                footer={null}
            >
                <div style={{ textAlign: 'center' }}>
                    <Button icon={<FilePdfOutlined />} onClick={handleDownloadPDF}>
                        Descargar PDF
                    </Button>
                    <Button icon={<FileExcelOutlined />} onClick={handleDownloadExcel}>
                        Descargar Excel
                    </Button>
                </div>
            </Modal>

            <Modal
                visible={imagePreviewVisible}
                title="Vista Previa de la Imagen"
                onCancel={handleCancelPreview}
                footer={null}
            >
                {imageUrl && <img src={imageUrl} alt="Imagen del producto" style={{ width: '100%' }} />}
            </Modal>
        </div>
    );
};

export default TablaPro;

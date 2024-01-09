import React, { useState, useEffect } from 'react';
import { Card, Image, Pagination, Select, Button, Form, Input, Modal, Checkbox, Upload, Badge } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Option } = Select;

const EditarProducto = () => {
    const [productos, setProductos] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [umList, setUmList] = useState([]);
    const [categoriaList, setCategoriaList] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [initialFormValues, setInitialFormValues] = useState(null);
    const [form] = Form.useForm();

    const fetchData = async (page) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/producto/listar/?page=${page}`);
            const data = await response.json();
            setProductos(data.productos);
            setTotal(data.total);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        form.resetFields();
        if (!editModalVisible) {
            fetchData(currentPage);
        }
    }, [productos]);

    useEffect(() => {
        const fetchUmList = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/producto/listarum/');
                const data = await response.json();
                setUmList(data.unidades_medida);
            } catch (error) {
                console.error('Error fetching UM data:', error);
            }
        };

        const fetchCategoriaList = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/producto/listar_categorias/');
                const data = await response.json();
                setCategoriaList(data.categorias);
            } catch (error) {
                console.error('Error fetching category data:', error);
            }
        };

        fetchUmList();
        fetchCategoriaList();
        fetchData(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleEditClick = (productId) => {

        const productoToEdit = productos.find((producto) => producto.id_producto === productId);
        setEditingProductId(productId);
        setInitialFormValues(productoToEdit);
        setEditModalVisible(true);
    };

    const handleCancelEdit = () => {
        fetchData(currentPage);
        setEditingProductId(null);
        setInitialFormValues(null);
        setEditModalVisible(false);
    };

    const validateImageFormat = (_, fileList) => {
        const isValidFormat = fileList.every(file => file.type.startsWith('image/'));
        if (!isValidFormat) {
            return Promise.reject('Solo se permiten archivos de imagen');
        }
        return Promise.resolve();
    };

    const handleSaveEdit = async (productId, formValues) => {
        try {
            const formData = new FormData();
            Object.entries(formValues).forEach(([key, value]) => {
                if (key === 'iva' || key === 'ice' || key === 'irbpnr') {
                    value = value ? '1' : '0';
                }
                formData.append(key, value);
            });

            const imagenpInput = formValues['imagenp'];
            if (imagenpInput && imagenpInput[0] && imagenpInput[0].originFileObj) {
                formData.append('imagenp', imagenpInput[0].originFileObj);
            }

            const response = await fetch(`http://127.0.0.1:8000/producto/editarproducto/${productId}/`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setEditingProductId(null);
                setInitialFormValues(null);
                setEditModalVisible(false);
                fetchData(currentPage);
            } else {
                console.error('Error updating product:', response.status, response.statusText);
                const responseData = await response.json();
                console.error('Server response:', responseData);
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };


    const getCategoriaNombre = (idCategoria) => {
        const categoria = categoriaList.find((categoria) => categoria.id_categoria === idCategoria);
        return categoria ? categoria.catnombre : '';
    };

    const showModalContent = (producto) => {

        return (
            <Form form={form} onFinish={(values) => handleSaveEdit(producto.id_producto, values)}>
                <Form.Item label="Nombre del Producto" name="nombreproducto" initialValue={producto.nombreproducto}>
                    <Input />
                </Form.Item>
                <Form.Item label="Descripción del Producto" name="descripcionproducto" initialValue={producto.descripcionproducto}>
                    <Input />
                </Form.Item>
                <Form.Item label="Unidad de Medida" name="id_um" initialValue={producto.id_um}>
                    <Select>
                        {umList.map((um) => (
                            <Option key={um.id_um} value={um.id_um}>
                                {um.nombre_um}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Categoría" name="id_categoria" initialValue={producto.id_categoria}>
                    <Select>
                        {categoriaList.map((categoria) => (
                            <Option key={categoria.id_categoria} value={categoria.id_categoria}>
                                {categoria.catnombre}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="IVA" name="iva" valuePropName="checked" initialValue={producto.iva === '1'}>
                    <Checkbox />
                </Form.Item>
                <Form.Item label="ICE" name="ice" valuePropName="checked" initialValue={producto.ice === '1'}>
                    <Checkbox />
                </Form.Item>
                <Form.Item label="IRBPNR" name="irbpnr" valuePropName="checked" initialValue={producto.irbpnr === '1'}>
                    <Checkbox />
                </Form.Item>
                <Form.Item label="Puntos" name="puntosp" initialValue={producto.puntosp}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Imagen del Producto"
                    name="imagenp"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e && e.fileList}
                >
                    <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
                        <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Guardar
                    </Button>
                    <Button onClick={handleCancelEdit}>Cancelar</Button>
                </Form.Item>
            </Form>
        );
    };
    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {productos.map((producto) => (
                    <Card
                        key={producto.id_producto}
                        hoverable
                        style={{ width: 240, margin: '16px' }}
                        cover={<img alt={producto.nombreproducto} src={`data:image/png;base64,${producto.imagenp}`} />}
                        onClick={() => handleEditClick(producto.id_producto)}
                    >
                        <Meta title={producto.nombreproducto} description={producto.descripcionproducto} />
                        <Badge count={producto.puntosp} showZero color='#faad14' />
                        <Badge count={'$' + producto.preciounitario} showZero color='#06CE15' style={{ margin: '10px' }} />
                        <Badge count={getCategoriaNombre(producto.id_categoria)} showZero color='#CE6F04' />

                    </Card>
                ))}
            </div>
            <Pagination current={currentPage} total={total} onChange={handlePageChange} pageSize={8} style={{ marginTop: '16px', textAlign: 'center' }} />
            <Modal
                title="Editar Producto"
                visible={editModalVisible}
                onCancel={handleCancelEdit}
                footer={null}
            >
                {editingProductId !== null && initialFormValues
                    ? showModalContent(initialFormValues)
                    : null}
            </Modal>
        </div>
    );
};

export default EditarProducto;
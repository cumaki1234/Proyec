import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Row, Col, Card, Upload, Image, Modal, message, Pagination } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';

import './nuevoComboForm.css';
import TextArea from 'antd/es/input/TextArea';

const { Option } = Select;

const NuevoComboForm = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [comboFileList, setComboFileList] = useState([]);
    const [categoryFileList, setCategoryFileList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [categoriaCombo] = Form.useForm();
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [searchText, setSearchText] = useState('');
    const [total, setTotal] = useState(0);
    const [comboForm] = Form.useForm();


    useEffect(() => {
        const handleBeforeUnload = (event) => {
            const message = '¿Estás seguro de que quieres abandonar la página? Los cambios no guardados se perderán.';
            event.returnValue = message;
            return message;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const fetchProductos = async (page = 1, size = 8, search = '') => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/producto/listar/?page=${page}&size=${size}&search=${search}`);
            if (response.ok) {
                const data = await response.json();
                setProductos(data.productos);
                setTotal(data.total);
            } else {
                console.error('Error al obtener productos');
            }
        } catch (error) {
            console.error('Error en la petición:', error);
        }
    };

    const handleClearSelectedProducts = () => {
        setSelectedProducts([]);
    };

    useEffect(() => {
        fetchProductos(currentPage, pageSize, searchText);
    }, [currentPage, pageSize, searchText]);


    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    const fetchCategorias = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/combos/listcategoria/');
            if (response.ok) {
                const data = await response.json();
                setCategorias(data.categorias_combos);
            } else {
                console.error('Error al obtener las categorías');
            }
        } catch (error) {
            console.error('Error en la petición:', error);
        }
    };
    useEffect(() => {
        fetchCategorias();
    }, []);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => setComboFileList(newFileList);
    const handleChangeCategory = ({ fileList: newFileList }) => setCategoryFileList(newFileList);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );


    const onFinishProductos = async () => {
        try {
            const isValid = await comboForm.validateFields();


            const formData = new FormData();

            console.log("veamos que pasa: " + comboForm.getFieldValue('nombrecb'));

            formData.append('id_cat_combo', categoriaSeleccionada);
            formData.append('descripcion_combo', comboForm.getFieldValue('descripcion_combo'));
            formData.append('nombre_cb', comboForm.getFieldValue('nombrecb'));
            formData.append('puntos_cb', comboForm.getFieldValue('puntoscb'));
            formData.append('precio_unitario', comboForm.getFieldValue('precio_unitario'));
            formData.append('imagen_c', comboFileList.length > 0 ? comboFileList[0].originFileObj : null);

            const detalleCombo = selectedProducts.map((product) => ({
                id_producto: product.id_producto,
                cantidad: categoriaCombo.getFieldValue(`quantity_${product.id_producto}`),
            }));

            formData.append('detalle_combo', JSON.stringify(detalleCombo));

            const response = await fetch('http://127.0.0.1:8000/combos/crearcombo/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Respuesta del servidor:', data);
                message.success('Combo creado con éxito');
                comboForm.resetFields();
                setComboFileList([]);
                setSelectedProducts([]);
                // Puedes hacer alguna acción adicional si es necesario

            } else {
                const data = await response.json();
                console.error('Error en la respuesta del servidor:', data);
                message.error('Error al crear el combo');
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            message.error('Error, algo salió mal');
        }
    };

    const showModal = () => {
        setModalVisible(true);
    };

    const handleModalCancel = () => {
        setModalVisible(false);
    };
    const onFinishCategoria = async (values) => {
        try {

            const formData = new FormData();
            formData.append('cat_nombre', values.catnombre);
            formData.append('descripcion', values.descripcion);

            if (values.imagencategoria && values.imagencategoria.length > 0) {
                formData.append('imagencategoria', values.imagencategoria[0].originFileObj);
            }

            const response = await fetch('http://127.0.0.1:8000/combos/crearcat/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Respuesta del servidor:', data);
                message.success('Categoría de combo creada con éxito');
                categoriaCombo.resetFields();
                setCategoryFileList([]);
                fetchCategorias();

            } else {
                const data = await response.json();
                console.error('Error en la respuesta del servidor:', data);
                message.error('Error al crear la categoría de combo');
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            message.error('Error al conectar con el servidor');
        }

    };
    const handleSelectProduct = (product) => {
        const isProductSelected = selectedProducts.some((selectedProduct) => selectedProduct.id_producto === product.id_producto);

        if (isProductSelected) {
            // Si el producto ya está seleccionado, incrementa la cantidad en 1
            setSelectedProducts((prevSelected) =>
                prevSelected.map((selectedProduct) =>
                    selectedProduct.id_producto === product.id_producto
                        ? { ...selectedProduct, cantidad: selectedProduct.cantidad + 1 }
                        : selectedProduct
                )
            );
        } else {
            // Si el producto no está seleccionado, agrégalo con una cantidad de 1
            setSelectedProducts((prevSelected) => [...prevSelected, { ...product, cantidad: 1 }]);
        }
    };

    const handleDeselectProduct = (productId) => {
        // Elimina el producto seleccionado
        setSelectedProducts((prevSelected) => prevSelected.filter((product) => product.id_producto !== productId));
    };
    return (
        <div className="combo-container">
            <h2>Nuevo Combo</h2>
            <Form
                form={comboForm}
                name="encabezadoCombo"
                onFinish={onFinishProductos}
                onFinishFailed={(errorInfo) => {
                    console.log('Failed:', errorInfo);
                }}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}>
                <Form.Item
                    name="nombrecb"
                    label="Nombre del Combo"
                    rules={[
                        {
                            validator: async (_, value) => {
                                if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
                                    throw new Error('El nombre del combo solo puede contener letras, números y espacios');
                                }
                            },
                        },
                        {
                            validator: async (_, value) => {
                                if (value.length > 300) {
                                    throw new Error('El nombre del combo no puede tener más de 300 caracteres');
                                }
                            },
                        },
                        {
                            required: true,
                            message: 'Por favor, ingrese un nombre al combo',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="descripcion_combo"
                    label="Descripcion"
                    rules={[
                        {
                            max: 300,
                            message: 'La descripción no puede tener más de 300 caracteres',
                        },
                    ]}
                >
                    <TextArea />
                </Form.Item>

                <Form.Item
                    name="id_catcombo"
                    label="Categoría del Combo"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, seleccione una categoría',
                        }
                    ]
                    }
                >
                    <Select onChange={(value) => setCategoriaSeleccionada(value)}>
                        {categorias.map((categoria) => (
                            <Option key={categoria.id_catcombo} value={categoria.id_catcombo}>
                                {categoria.catnombre}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="link" onClick={showModal}>
                        Agregar Nueva Categoría
                    </Button>
                </Form.Item>
                <Form.Item
                    name="puntoscb"
                    label="Puntos del Combo"
                    rules={[
                        {
                            validator: async (_, value) => {
                                if (value < 0) {
                                    throw new Error('Los puntos del combo no pueden ser negativos');
                                }
                            },
                        },
                    ]}
                >
                    <Input type="number" min={0} />
                </Form.Item>

                <Form.Item
                    name="precio_unitario"
                    label="Precio unitario"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, ingrese el precio unitario',
                        },
                        {
                            pattern: /^(\d+|\d+\.\d{1,2})$/,
                            message: 'Ingrese un número válido con hasta dos decimales',
                        },
                        {
                            validator: async (_, value) => {
                                if (value < 0) {
                                    throw new Error('El precio unitario no puede ser negativo');
                                }
                            },
                        },
                    ]}
                >
                    <Input type="number" placeholder="Cantidad" min={0} />
                </Form.Item>

                <Form.Item name="imagenc" label="Imagen del combo">
                    <Upload
                        listType="picture-circle"
                        fileList={comboFileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        beforeUpload={(file) => {
                            const isImage = /\.(png|jpg|jpeg)$/i.test(file.name);
                            if (!isImage) {

                                return true;
                            }
                            return false;
                        }}
                        onError={(file) => {
                            message.error('Por favor, selecciona una imagen válida.');
                            setComboFileList([]);
                        }}
                    >
                        {comboFileList.length >= 1 ? null : uploadButton}
                    </Upload>
                </Form.Item>

                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <Row gutter={16}>
                    <Col span={12}>

                        <Card title="Todos los Productos">
                            <Input
                                placeholder="Buscar productos"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ marginBottom: '16px' }}
                            />
                            <Row>
                                {productos.map((producto) => (
                                    <Col key={producto.id_producto} span={30} >
                                        <Card
                                            hoverable
                                            style={{ margin: '0 16px 16px 0', height: '250px', width: '250px' }}
                                            cover={
                                                <div>
                                                    <Image
                                                        alt={producto.nombreproducto}
                                                        src={`data:image/png;base64,${producto.imagenp}`}
                                                        style={{ width: '150px', height: '100px' }}
                                                    />

                                                </div>
                                            }

                                        >
                                            <Button
                                                type="primary"
                                                onClick={() => handleSelectProduct(producto)}
                                            >
                                                Seleccionar
                                            </Button>
                                            <Card.Meta title={producto.nombreproducto} description={`ID: ${producto.id_producto}`} />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={total}
                            onChange={(page, size) => setCurrentPage(page)}
                            showSizeChanger
                            onShowSizeChange={(current, size) => setPageSize(size)}
                        />
                    </Col>
                    <Col span={12}>
                        <Card title="Productos Seleccionados">
                            {selectedProducts.length > 0 ? (
                                selectedProducts.map((selectedProduct) => (
                                    <div key={selectedProduct.id_producto} style={{ borderBottom: '1px solid #d9d9d9', padding: '8px 0', display: 'flex', alignItems: 'center' }}>
                                        <div style={{ marginRight: '16px' }}>
                                            <Image src={`data:image/png;base64,${selectedProduct.imagenp}`} alt={selectedProduct.nombreproducto} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <p style={{ margin: 0, fontWeight: 'bold' }}>{selectedProduct.nombreproducto}</p>
                                                <CloseOutlined style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => handleDeselectProduct(selectedProduct.id_producto)} />
                                            </div>
                                            <Form.Item name={`quantity_${selectedProduct.id_producto}`} initialValue={1}>
                                                <Input type="number" placeholder="Cantidad" min={1} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No hay productos seleccionados</p>
                            )}
                        </Card>
                    </Col>
                </Row>
                <Button type="primary" onClick={onFinishProductos}>
                    Guardar combo
                </Button>
            </Form>
            <Modal open={modalVisible} onCancel={handleModalCancel} footer={null}>
                <h2>Nuevo categoría de combo</h2>
                <Form form={categoriaCombo} name="categoriaCombo" onFinish={onFinishCategoria} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Form.Item name="catnombre" label="Nombre"
                        rules={[{ required: true, message: 'Por favor, ingresa un nombre de categoría' },
                        { max: 300, message: 'El nombre de la categoría no puede tener más de 300 caracteres' },
                        {
                            validator: async (_, value) => {
                                try {
                                    const response = await fetch('http://127.0.0.1:8000/combos/categoriaExist/', {
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
                                        throw new Error('La categoría ya está en registrada');
                                    }
                                } catch (error) {
                                    throw error.message;
                                }
                            },
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="descripcion" label="Descripción"
                        rules={[
                            { max: 500, message: 'La descripción no puede tener más de 500 caracteres' }
                        ]}
                    >
                        <TextArea />
                    </Form.Item>
                    <Form.Item
                        name="lbimg"
                        label="Imagen"
                    >
                        <Upload
                            name="imagencategoria"
                            listType="picture-circle"
                            fileList={categoryFileList}
                            onPreview={handlePreview}
                            onChange={handleChangeCategory}
                            beforeUpload={(file) => {
                                const isImage = /\.(png|jpg|jpeg)$/i.test(file.name);
                                if (!isImage) {
                                    message.error('Por favor, selecciona una imagen válida.');
                                    return false; // Evitar la carga del archivo no válido
                                }
                                return true; // Permitir la carga del archivo válido
                            }}
                            accept=".png, .jpg, .jpeg"
                        >
                            {categoryFileList.length >= 1 ? null : uploadButton}
                        </Upload>
                    </Form.Item>

                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Guardar categoría
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>


        </div>
    );
};

export default NuevoComboForm;

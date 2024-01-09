import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Form,
  Input,
  Upload,
  Divider,
  message,
} from 'antd';
import { UploadOutlined,PlusOutlined } from '@ant-design/icons';

// Función para convertir Base64 a URL de datos
const base64ToUrl = (base64String, mimeType) => {
  return `data:${mimeType};base64,${base64String}`;
};
const { TextArea } = Input;

const AvisosPrincipalesAdmin = () => {
  const [data, setData] = useState('');
  const [count, setCount] = useState(2);
  const [newItem, setNewItem] = useState('');


  const handleInputChange = (e) => {
    setNewItem(e.target.value);

   
  };



  const handleAddItem = () => {
    const newItemObject = {
      key: count,
      Título:newItem,
      
    };

    setData([...data, newItemObject]);
    setCount(count+1);
    setNewItem('');
   

  };


//PATANADA DE CHATGPT
const [fileList, setFileList] = useState([]);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && [e.file];
  };

  const columns = [
    {
      title: 'Título',
      dataIndex: 'Título',
      width: '15%',
      
    },
    {
      title: 'Descripción',
      dataIndex: 'Descripción',
      width: '15%',
      
    },
    {
      title: 'Imagen',
      dataIndex: 'Imagen',
      width: '20%',
      render: (text, record) => (
        <img src={record.image} alt={`Imagen ${record.key}`} style={{ maxWidth: '100px' }} />
      ),
    },
    
    
    ];


  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Solo puedes subir imágenes');
       // Borrar la lista de archivos
       setFileList([]);
    }
    return isImage;
  };

//HASTA AQUI LLEGA LA PATANADA


  const [nuevoAviso, setNuevoAviso] = useState({
    titulo: '',
    descripcion: '',
    imagen: null,
  });

  const [avisos, setAvisos] = useState([]);

  {/*const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoAviso((prevAviso) => ({ ...prevAviso, [name]: value }));
  };*/}

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setNuevoAviso((prevAviso) => ({ ...prevAviso, imagen: file }));
  };

  const handleCrearAviso = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('titulo', nuevoAviso.titulo);
      formData.append('descripcion', nuevoAviso.descripcion);
      formData.append('imagen', nuevoAviso.imagen);

      const response = await fetch('http://127.0.0.1:8000/avisos/crear/', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado de autorización
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Aviso creado con éxito:', data.mensaje);
        // Puedes realizar acciones adicionales después de crear el aviso
        // Actualizar la lista de avisos después de crear uno nuevo
        obtenerAvisos();
      } else {
        console.error('Error al crear aviso:', data.error);
      }
    } catch (error) {
      console.error('Error en la solicitud de creación de aviso:', error);
    }
  };

  // Función para obtener la lista de avisos
  const obtenerAvisos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/avisos/avisos/');
      const data = await response.json();
      if (response.ok) {
        setAvisos(data.avisos_principales);
      } else {
        console.error('Error al obtener la lista de avisos:', data.error);
      }
    } catch (error) {
      console.error('Error en la solicitud de lista de avisos:', error);
    }
  };

  // Obtener la lista de avisos al montar el componente y al actualizar después de crear uno nuevo
  useEffect(() => {
    obtenerAvisos();
  }, []); // La dependencia vacía asegura que se ejecute solo una vez al montar el componente

  return (
  <>
      <Divider orientation="left">
        <h3>Crear Nuevo Aviso</h3>
      </Divider>

     
      <Form onSubmit={handleCrearAviso}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 140,
        }}
        layout="horizontal"
        style={{
          justifyContent: 'space-between',
          
        }}
      >
        
        <Form.Item label="Título"
        style={{maxWidth: '600px'}}
        >
          <Input 
          type="text"
          value={newItem}          
          onChange={handleInputChange}
          required
          />
        </Form.Item>
      
        
     
        <Form.Item label="Descripción"
        style={{maxWidth: '600px'}}
        >
          <TextArea 
          id="descripcion"
          name="descripcion"
          value={nuevoAviso.descripcion}
          onChange={handleInputChange}
          required
          rows={4} />
        </Form.Item>
        
        <Form.Item
        style={{maxWidth: '600px'}}
        label="Imagen"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          action="/upload.do"
          listType="picture-card"
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={({ fileList }) => setFileList(fileList)}
        >
          {fileList.length >= 1 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </Form.Item>
        <Form.Item className='text-end'>
          <Button onClick={handleAddItem}>Crear Aviso</Button>
        </Form.Item>
        
      </Form>
      
      

      {/* Tabla de avisos */}
      <Divider orientation="left">
        <h3>Lista de Avisos Principales</h3>
      </Divider>
     


      <Table columns={columns} dataSource={data} size="middle" />

      {/*<table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Imagen</th>
          </tr>
        </thead>
        <tbody>
          {avisos.map((aviso) => (
            <tr key={aviso.id_aviso}>
              <td>{aviso.titulo}</td>
              <td>{aviso.descripcion}</td>
              <td>
                {/* Mostrar la imagen si está presente */}
                {/*aviso.imagen && (
                 {/*} <img
                    src={base64ToUrl(aviso.imagen, 'image/png')} // Cambia 'image/png' según el tipo MIME correcto
                    alt={`Imagen para ${aviso.titulo}`}
                    style={{ maxWidth: '100px' }} // Ajusta el tamaño según sea necesario
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
                </table>*/}

     
    </>
  );
};

export default AvisosPrincipalesAdmin;

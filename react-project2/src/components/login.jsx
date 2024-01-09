import React from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { Link } from 'react-router-dom';
import '../login.css';

const LoginForm = ({ onLogin, onShowRegistration  }) => {
  const onFinish = async (values) => {
    try {
      // Realizar la solicitud a la API para iniciar sesión
      const response = await fetch('http://127.0.0.1:8000/Login/iniciar_sesion/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreusuario: values.username,
          contrasenia: values.password,
        }),
      });

      const data = await response.json();
      console.log(data); // Verifica si el token está presente en la respuesta

      if (response.ok) {
        const token = data.token;
        console.log('Token almacenado:', token);

        localStorage.setItem('token', token);
        onLogin(data);
      } else {
        // Manejar errores de inicio de sesión
        console.error('Error en inicio de sesión:', data.mensaje);
      }
    } catch (error) {
      console.error('Error en la solicitud de inicio de sesión:', error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    (
      <Form
        name="loginForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="max-w-md mx-auto bg-white rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Inicio de Sesión</h2>
  
        <Form.Item
          label="Usuario"
          name="username"
          rules={[{ required: true, message: 'Por favor, ingresa tu usuario' }]}
        >
          <Input className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200" />
        </Form.Item>
  
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Por favor, ingresa tu contraseña' }]}
        >
          <Input.Password className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200" />
        </Form.Item>
  
        <Form.Item>
          <Button type="primary" htmlType="submit" 
         
          className="w-full bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200">
            Iniciar sesión
          </Button>
        </Form.Item>
  
        <Form.Item>
        
            <Button type="default" htmlType="button" className="w-full rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                    onClick={onShowRegistration}
                    >
              Registrarse
            </Button>
          
        </Form.Item>
  
        <Alert
          message="¿No tienes cuenta? Regístrate para disfrutar de más funciones."
          type="info"
          showIcon
          className="mt-2"
        />
      </Form>
    )
  );
};

export default LoginForm;

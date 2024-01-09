import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Registro = ({onGoBackToLogin }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [telefono, setTelefono] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [tipoCliente, setTipoCliente] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rucCedula, setRucCedula] = useState('');
  const [correoRecuperacion, setCorreoRecuperacion] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const handleRegistro = async (e) => {
    e.preventDefault();

    try {
      // Realizar la solicitud a la API para crear un nuevo usuario
      const response = await fetch('http://127.0.0.1:8000/Login/crear/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreusuario: nombreUsuario,
          contrasenia: contrasenia,
          ctelefono: telefono,
          crazon_social: razonSocial,
          tipocliente: tipoCliente,
          snombre: nombre,
          capellido: apellido,
          ruc_cedula: rucCedula,
          correorecuperacion: correoRecuperacion,
          ubicacion: ubicacion,
        }),
      });

      const data = await response.json();

      // Verificar si la solicitud fue exitosa
      if (response.ok) {
        // Manejar el éxito (puedes redirigir al usuario a otra página, mostrar un mensaje, etc.)
        console.log('Usuario creado con éxito:', data.mensaje);
      } else {
        // Manejar errores de registro
        console.error('Error en el registro:', data.error);
      }
    } catch (error) {
      console.error('Error en la solicitud de registro:', error);
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center">
    <div className="bg-white rounded-md w-full">
      <h2 className="font-bold mb-4 text-center text-gray-800">Registro</h2>

      <form onSubmit={handleRegistro} className="space-y-4">
        {/* Campos del formulario */}
        <div>
          <label htmlFor="nombreUsuario" className="block text-sm font-medium text-gray-700">Nombre de Usuario:</label>
          <input
            type="text"
            id="nombreUsuario"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label htmlFor="contrasenia" className="block text-sm font-medium text-gray-700">Contraseña:</label>
          <input
            type="password"
            id="contrasenia"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Agrega más campos según sea necesario */}

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200">
          Registrarse
        </button>

        <div className="text-center mt-4">
          ¿Ya tienes cuenta? <Link onClick={onGoBackToLogin} className="text-blue-500 hover:underline">Iniciar sesión</Link>
        </div>
      </form>
    </div>
  </div>
  
  );
};

export default Registro;

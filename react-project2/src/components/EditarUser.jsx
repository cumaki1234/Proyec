// ProfileEditor.js

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ProfileEditor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedImage(URL.createObjectURL(file));
      }
    },
  });

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="flex h-screen bg-gray-200">
      <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md w-1/3">
        <div className="mb-4 relative" {...getRootProps()}>
          {/* Foto de perfil circular */}
          <div
            className={`w-40 h-40 rounded-full overflow-hidden cursor-pointer transition-transform ${
              isHovered ? 'transform scale-105' : ''
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Agregar una condición para mostrar la imagen o el mensaje */}
            <img
              src={selectedImage || "URL_DE_LA_IMAGEN"}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
              style={{ width: '100%', height: '100%' }}
            />
            {/* Mensaje si no hay imagen de perfil */}
            {!selectedImage && (
              <div className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-500 text-xs">
                Agregar foto de perfil
              </div>
            )}
          </div>
          <input {...getInputProps()} />
        </div>
        <div>
          {/* Mensaje de cambio de foto */}
          {isHovered && (
            <div className="text-xs text-gray-500 mb-2">
              Cambiar foto de perfil
            </div>
          )}
          {/* Resto de la interfaz para editar perfil */}
          {/* Añade aquí los campos y botones necesarios para editar el perfil */}
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;

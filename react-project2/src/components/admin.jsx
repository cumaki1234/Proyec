import React from 'react';
import AvisosPrincipalesAdmin from './AvisosPrincipalesAdmin';
import CrearTipoProductoForm from './CrearTipoProducto';
import CrearCategoriaForm from './CrearCategoria';
import Sidebar from './MenuAdministrador';
const Admin = () => {
  return (
    <div>

      <h2>Bienvenido Admin</h2>
      {/* Contenido específico para el administrador */}
      <AvisosPrincipalesAdmin />
      <CrearTipoProductoForm />
      <CrearCategoriaForm />
    </div>
  );
};

export default Admin;

import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  AppstoreAddOutlined,
  BellOutlined,
  EditOutlined,
  TableOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  FolderOpenOutlined,
  HddOutlined,
  ShopOutlined,
  NodeIndexOutlined

} from '@ant-design/icons';

import CrearTipoProducto from './creartipoproducto';
import CrearEmpleadoForm from './crearempleado';
import CrearCategoria from './crearcategoria';
import EditarTipoProducto from './editartipoproducto';
import EditarCategoria from './editarcategoria';
import CrearAvisos from './crearavisosprincipales';
import EditarAvisos from './editaravisos';
import CrearMesa from './crearmesa';
import NuevoComboForm from './crearcombo';
import Empresa from './Empresa';
import CrearProductoForm from './CrearProducto';
import EditarEmpleado from './EditarEmpleado';
import CrearUnidadMedida from './CrearUM';
import EditarCombo from './editarcombo';
import EditarProducto from './editarproducto';
import ListSucursales from './listasucursales';
import EditarUnidadesMedida from './editarunidadmedida';
import EditarMesa from './editarmesa';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const Admin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleSubMenuClick = (key) => {
    setSelectedSubMenu(key);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/Login/rol/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: localStorage.getItem('token'), // Obtener el token almacenado
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rol = data.rol;

          // Puedes realizar acciones con el rol recibido si es necesario

          // Ejemplo de redirección basada en el rol
          if (rol !== 'S') {
            window.location.href = '/';
          }
        } else {
          // Manejar errores de la solicitud a la API
          window.location.href = '/';
        }
      } catch (error) {
        // Manejar errores de la solicitud
        console.error('Error en la solicitud:', error);
      }
    };

    // Llamar a la función fetchData al cargar el componente
    fetchData();
  }, []); // Dependencia vacía para que se ejecute solo una vez al montar el componente
  const handleClearLocalStorage = () => {
    // Limpiar todo el localStorage
    window.location.href = '/';
    localStorage.clear();

    console.log('LocalStorage limpiado.');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleSidebar}
        style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0 }}
      >
        <div className="logo" />
        <button onClick={handleClearLocalStorage}>
          Salir
        </button>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedSubMenu]}>
          <SubMenu key="sub1" icon={<TeamOutlined />} title="Empleados">
            <Menu.Item key="1.1" icon={<UsergroupAddOutlined />} onClick={() => handleSubMenuClick('1.1')}>Crear Empleado</Menu.Item>
            <Menu.Item key="1.2" icon={<UsergroupAddOutlined />} onClick={() => handleSubMenuClick('1.2')}>Editar Empleado</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<AppstoreAddOutlined />} title="Productos">
            <SubMenu key="2" title="Producto">
              <Menu.Item key="2.1" icon={<AppstoreAddOutlined />} onClick={() => handleSubMenuClick('2.1')}>
                Crear Producto
              </Menu.Item>
              <Menu.Item key="2.2" icon={<EditOutlined />} onClick={() => handleSubMenuClick('2.2')}>
                Editar Producto
              </Menu.Item>
            </SubMenu>
            <SubMenu key="3" title="Categoría">
              <Menu.Item key="3.1" icon={<AppstoreAddOutlined />} onClick={() => handleSubMenuClick('3.1')}>
                Crear Categoría
              </Menu.Item>
              <Menu.Item key="3.2" icon={<EditOutlined />} onClick={() => handleSubMenuClick('3.2')}>
                Editar Categoría
              </Menu.Item>
            </SubMenu>
            <SubMenu key="4" title="Tipo">
              <Menu.Item key="4.1" icon={<AppstoreAddOutlined />} onClick={() => handleSubMenuClick('4.1')}>
                Crear Tipo
              </Menu.Item>
              <Menu.Item key="4.2" icon={<EditOutlined />} onClick={() => handleSubMenuClick('4.2')}>
                Editar Tipo
              </Menu.Item>
            </SubMenu>
            <SubMenu key="9" title="Unidad de medida">
              <Menu.Item key="9.1" icon={<NodeIndexOutlined />} onClick={() => handleSubMenuClick('9.1')}>
                Crear Unidad de medida
              </Menu.Item>
              <Menu.Item key="9.2" icon={<NodeIndexOutlined />} onClick={() => handleSubMenuClick('9.2')}>
                Editar Unidad de medida
              </Menu.Item>
            </SubMenu>
          </SubMenu>
          <SubMenu key="sub5" icon={<FolderOpenOutlined />} title="Avisos Principales">
            <Menu.Item key="5.1" onClick={() => handleSubMenuClick('5.1')}>Crear Aviso</Menu.Item>
            <Menu.Item key="5.2" onClick={() => handleSubMenuClick('5.2')}>Editar Aviso</Menu.Item>
          </SubMenu>

          {/* Nueva opción para Crear Mesa */}
          <SubMenu key="sub6" icon={<TableOutlined />} title="Mesas">
            <Menu.Item key="6.1" onClick={() => handleSubMenuClick('6.1')}>Crear Mesa</Menu.Item>
            <Menu.Item key="6.2" onClick={() => handleSubMenuClick('6.2')}>Editar Mesa</Menu.Item>
          </SubMenu>
          <SubMenu key="sub7" icon={<HddOutlined />} title="Combos">
            <Menu.Item key="7.1" onClick={() => handleSubMenuClick('7.1')}>Crear Combo</Menu.Item>
            <Menu.Item key="7.2" onClick={() => handleSubMenuClick('7.2')}>Editar Combo</Menu.Item>
          </SubMenu>
          <SubMenu key="sub8" icon={<ShopOutlined />} title="Empresa">
            <Menu.Item key="8.1" onClick={() => handleSubMenuClick('8.1')}>Ver empresa</Menu.Item>
            <Menu.Item key="8.2" onClick={() => handleSubMenuClick('8.2')}>Ver sucursales</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? '80px' : '200px', transition: 'margin-left 0.2s' }}>
        <Content style={{ margin: '16px' }}>
          <div>
            <h2>Bienvenido Admin</h2>
            {selectedSubMenu === '1.1' && <CrearEmpleadoForm />}
            {selectedSubMenu === '1.2' && <EditarEmpleado />}
            {selectedSubMenu === '2.1' && <CrearProductoForm />}
            {selectedSubMenu === '2.2' && <EditarProducto />}
            {selectedSubMenu === '3.1' && <CrearCategoria />}
            {selectedSubMenu === '3.2' && <EditarCategoria />}
            {selectedSubMenu === '4.1' && <CrearTipoProducto />}
            {selectedSubMenu === '4.2' && <EditarTipoProducto />}
            {selectedSubMenu === '5.1' && <CrearAvisos />}
            {selectedSubMenu === '5.2' && <EditarAvisos />}
            {selectedSubMenu === '6.1' && <CrearMesa />}
            {selectedSubMenu === '6.2' && <EditarMesa />}
            {selectedSubMenu === '7.1' && <NuevoComboForm />}
            {selectedSubMenu === '7.2' && <EditarCombo />}
            {selectedSubMenu === '8.1' && <Empresa />}
            {selectedSubMenu === '8.2' && <ListSucursales />}
            {selectedSubMenu === '9.1' && <CrearUnidadMedida />}
            {selectedSubMenu === '9.2' && <EditarUnidadesMedida />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;

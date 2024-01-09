// Importa las bibliotecas necesarias
import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import logo from '../assets/images/descargar.jpg';
import CrearTipoProducto from '../components/CrearTipoProducto';
import AvisosPrincipalesAdmin from '../components/AvisosPrincipalesAdmin';
import CrearCategoria from '../components/CrearCategoria';

const { Header, Sider, Content } = Layout;

const Sidebar = () => {

//PATANADA DED CHATGPT
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');

  const handleMenuClick = (key) => {
    setSelectedMenuItem(key);
  };

  const renderContent = () => {
    switch (selectedMenuItem) {
      case '1':
        return <AvisosPrincipalesAdmin/>;
      case '2':
        return <CrearTipoProducto/>;
      case '3':
        return <CrearCategoria/>;
      default:
        return null;
    }
  };
//AQUI TERMINA LA PATANADA

  // Estado para controlar la visibilidad del sidebar
  const [collapsed, setCollapsed] = useState(false);

  // Función para alternar la visibilidad del sidebar
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo">
          <img src={logo} alt="Logo" style={{ height: '32px', margin: '16px', borderRadius: '50%' }} />
        </div>
        <Menu theme="dark" mode="inline" 
        selectedKeys={[selectedMenuItem]}
        onClick={({ key }) => handleMenuClick(key)}
        defaultSelectedKeys={['1']}>

          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Inicio</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/perfil">Perfil</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}>
            <Link to="/configuracion">Configuración</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Contenido principal */}
      <Layout className="site-layout">
     
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {collapsed ? (
            <MenuUnfoldOutlined className="trigger" 
            style={{ color: '#fff' }}
            onClick={toggleSidebar} />
          ) : (
            <MenuFoldOutlined className="trigger" 
            style={{ color: '#fff' }}
            onClick={toggleSidebar} />
          )}
        </Header>
        <Content style={{ margin: '16px' }}>
        {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;

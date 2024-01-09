// Importa las librerías necesarias
import React, { useState } from 'react';
import { Layout, Menu, Row, Col, Image, Dropdown, Button, Badge, theme, Breadcrumb,Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import {
  MenuOutlined,
  ShoppingOutlined,
  EnvironmentOutlined, 
  ReconciliationOutlined,
  BellOutlined,
  UserOutlined,
  InstagramOutlined, 
  FacebookOutlined, 
  TwitterOutlined,
} from '@ant-design/icons';


import logo from '../assets/images/descargar.jpg'

const { Header , Content, Footer } = Layout;

const BottomBar2 = () => {
  const renderTooltip = (text) => (
    <Tooltip id="tooltip">{text}</Tooltip>
  );
  return (
<Layout>
    {/*BottomBar*/}
<Footer style={{ textAlign: 'center', background: '#001529', color: 'white' }}
>
      <Row  justify="space-between" align="middle">
        <Col>
        <Tooltip title="Síguenos en Intagram">
          <a href='/Registro' ><InstagramOutlined style={{ fontSize: '24px', color: '#e1306c' }} /></a>
          </Tooltip>
          
          <Tooltip title="Síguenos en Facebook">
          <FacebookOutlined style={{ fontSize: '24px', color: '#1877f2' }} />
          </Tooltip>
        </Col>
        <Col>
          
          <ReconciliationOutlined  style={{ fontSize: '24px', color: '#1890ff' }} />

        </Col>
        <Col> 
        <Tooltip title="Encuentranos">
          <Link to='/Mapa'><EnvironmentOutlined style={{ fontSize: '24px', color: '#52c41a' }} /></Link>
        </Tooltip>
        </Col>
      </Row>

    </Footer>
    </Layout>
  );
};

export default BottomBar2;

// HorizontalNavbar.js

import React, { useState } from 'react';
import { Drawer, List, Checkbox } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import god from '../assets/images/god1.jpg';
import god2 from '../assets/images/god3.jpg';
import god3 from '../assets/images/god2.jpg';
import BottomBar2 from './BottomBar2';
import ProductsList from './ListaProductos';
const MenuNavBar = () => {
  const imagesWithText = [
    { src: god, text: 'Texto 1' },
    { src: god2, text: 'Texto 2' },
    { src: god3, text: 'Texto 3' },
    { src: god, text: 'Texto 1' },
    { src: god2, text: 'Texto 2' },
    { src: god3, text: 'Texto 3' },
    { src: god, text: 'Texto 1' },
    { src: god2, text: 'Texto 2' },
    { src: god3, text: 'Texto 3' },
    { src: god, text: 'Texto 1' },
    { src: god2, text: 'Texto 2' },
    { src: god3, text: 'Texto 3' },
    { src: god, text: 'Texto 1' },
    { src: god2, text: 'Texto 2' },
    { src: god3, text: 'Texto 3' },
    { src: god, text: 'Texto 1' },
    { src: god2, text: 'Texto 2' },
    { src: god3, text: 'Texto 3' },
    { src: god, text: 'Texto 1' },
    { src: god2, text: 'Texto 2' },
    { src: god3, text: 'Texto 3' },
    { src: god, text: 'Texto 1' },
    { src: god2, text: 'Texto 2' },
    { src: god3, text: 'Texto 3' },
  ];
  const [drawerVisible, setDrawerVisible] = useState(false);
  const handleDrawerOpen = () => {
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };





  return (
    <>
    <div className="p-10">
    <h2 className="text-lg font-bold mb-4">Promociones</h2>
    <div className="flex overflow-x-auto">
      {imagesWithText.map((item, index) => (
        <div key={index} className="flex-shrink-0 mr-4">
          <img src={item.src} alt={`imagen-${index}`} className="w-24 h-24 object-cover rounded-md mb-2" />
          <p className="text-sm text-center">{item.text}</p>
        </div>
      ))}
    </div>

    <div className="flex justify-between items-center mb-4">
      <h3 className="text-md font-bold">Menu</h3>
      <button
          onClick={handleDrawerOpen}
          className="bg-gray-900 text-white px-4 py-2  mt-4 rounded-full transition duration-300 ease-in-out hover:bg-gray-800"
        >
          <span className="flex items-center">
            <span className="mr-2">
              <FilterOutlined />
            </span>
            Filtrar
          </span>
        </button>
    </div>
    <Drawer
      title="Opciones de Filtro"
      placement="right"
      closable={true}
      onClose={handleDrawerClose}
      visible={drawerVisible}
    >
      <List>
        <List.Item>
          <Checkbox>Option 1</Checkbox>
        </List.Item>
        <List.Item>
          <Checkbox>Option 2</Checkbox>
        </List.Item>
        
      </List>
    </Drawer>
    <ProductsList/>
    
  </div>
  
        <BottomBar2/>
    
 </>


        
      
    
  );
};


export default MenuNavBar;

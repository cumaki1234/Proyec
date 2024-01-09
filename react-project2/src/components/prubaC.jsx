import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import BottomBar2 from '../components/BottomBar2';
import logo from '../assets/images/descargar.jpg';
import xd from '../assets/images/xd.jpg';
import xd2 from '../assets/images/xd2.jpg';
import god from '../assets/images/god1.jpg';
import god2 from '../assets/images/god3.jpg';
import god3 from '../assets/images/god2.jpg';

import BestSellersComponent from '../components/mejoresPro'; 

const bestSellers = [
  {
    id: 1,
    name: 'Producto 1',
    description: 'Descripción del producto 1',
    imageSrc: god ,
  },
  {
    id: 2,
    name: 'Producto 2',
    description: 'Descripción del producto 2',
    imageSrc: logo,
  },
  {
    id: 3,
    name: 'Producto 3',
    description: 'Descripción del producto 3',
    imageSrc: god2,
  },
  {
    id: 4,
    name: 'Producto 4',
    description: 'Descripción del producto 4',
    imageSrc: god3,
  },
];



const AvisosCarrusel = () => {
  const [avisos, setAvisos] = useState([]);

  // Función para obtener los avisos principales de la API
  const fetchAvisosPrincipales = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/avisos/avisos/');
      const data = await response.json();
      setAvisos(data.avisos_principales);
    } catch (error) {
      console.error('Error al obtener los avisos principales', error);
    }
  };

  useEffect(() => {
    fetchAvisosPrincipales();
  }, []); // Se ejecutará solo una vez al montar el componente

 
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  return (
<div className="bg-white">
    <div className="w-full">
      <Slider {...settings}>
        {avisos.map((aviso) => (
          <div key={aviso.id_aviso}>
            <img
              className="w-full  h-80 object-cover"
              src={`data:image/png;base64, ${aviso.imagen}`}
              alt={aviso.titulo}
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{aviso.titulo}</h2>
              <p className="mt-2">{aviso.descripcion}</p>
            </div>
          </div>
        ))}
      </Slider>
    
    </div>
    <div className="mb-4 mt-10 ml-4 mr-4  p-6 bg-white rounded-lg shadow-lg"> {/* "relative w-120 h-80 md:w-160 lg:w-200 mb-8 " */}
          <h2 className="text-2xl font-semibold text-center mb-4 relative">
          Productos más vendidos
          <span className="block h-px bg-gray-700 w-full absolute bottom-0"></span>
        </h2>
        <BestSellersComponent products={bestSellers} />
      </div>
    <BottomBar2/>
    </div>
   
  );
};

export default AvisosCarrusel;

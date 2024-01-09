import React, { useState, useEffect } from 'react';
import { Image } from 'antd';
import logo from '../assets/images/descargar.jpg';
import xd from '../assets/images/xd.jpg';
import xd2 from '../assets/images/xd2.jpg';
import god from '../assets/images/god1.jpg';
import god2 from '../assets/images/god3.jpg';
import god3 from '../assets/images/god2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import BottomBar2 from '../components/BottomBar2';
import BestSellersComponent from '../components/mejoresPro'; // Ajusta la ruta según tu estructura

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



const Carousel = () => {
    const [cart, setCart] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
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
  fetchAvisosPrincipales(); // Llama a la función al cargar el componente
}, []); // El segundo argumento es un array vacío para asegurarse de que se llame solo una vez

    const handleAddToCart = (product) => {
      setCart((prevCart) => [...prevCart, product]);
    };
  
    const cartTotal = cart.reduce((total, product) => total + product.quantity, 0);



 
  
    const prevImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? avisos.length - 1 : prevIndex - 1));
    };
  
    const nextImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex === avisos.length - 1 ? 0 : prevIndex + 1));
    };
  
    const openModal = () => {
      setModalOpen(true);
    };
  
    const closeModal = () => {
      setModalOpen(false);
    };
  
    useEffect(() => {
      const interval = setInterval(() => {
        nextImage();
      }, 3000);
  
      return () => clearInterval(interval);
    }, [currentIndex]);
  
    return (
      <div className="relative w-120 h-80 md:w-160 lg:w-200 mb-8 mt-8">
        
        {avisos.map((aviso, index) => (
        <div
          key={index}
          className="flex items-center justify-center h-full rounded-md overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition duration-300 ease-in-out"

        >
          <img src={`data:image/png;base64, ${aviso.imagen}`} alt={`slide-${currentIndex}`} className="object-cover w-full h-full" />
        </div>
      ))}

      {avisos.length > 0 && (
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-2 text-white text-center">
          <p className="text-sm text-left">{avisos[currentIndex]?.titulo}</p>
          <p className="text-sm text-left">{avisos[currentIndex]?.descripcion}</p>
        </div>
      )}


        <button
          onClick={prevImage}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gray-800 text-white rounded-full"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gray-800 text-white rounded-full"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
  
        
     
      <BottomBar2/>
      </div>
      
  );
};

export default Carousel;

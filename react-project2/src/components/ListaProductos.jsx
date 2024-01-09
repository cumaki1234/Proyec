import React, { useState, useEffect } from 'react';
import LoginForm from './Login';

const ProductsList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Realizar la solicitud a la API al montar el componente
    fetch('http://127.0.0.1:8000/producto/listar/')
      .then(response => response.json())
      .then(data => setProducts(data.productos))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
    setModalVisible(false);
  };

  const handleAddToCart = () => {
    const userLoggedIn = true; // Reemplaza con la lógica real de tu aplicación

    if (!userLoggedIn) {
      setLoginModalVisible(true);
    } else {
      console.log(`Añadir al carrito: ${selectedProduct.nombreproducto}, Cantidad: ${quantity}`);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product.id_producto}
          onClick={() => handleCardClick(product)}
          className="cursor-pointer transition-transform transform hover:scale-105"
        >
          <div className="bg-white p-4 rounded-lg shadow-md">
          <img
              src={`data:image/png;base64,${product.imagenp}`}  
              alt={`Imagen de ${product.nombreproducto}`}
              className="w-full h-32 object-cover mb-2 rounded-md"
            />
            <h3 className="text-lg font-semibold mb-1">{product.nombreproducto}</h3>
            <p className="text-gray-500 mb-2">{product.descripcionproducto}</p>
            <p className="text-green-500 font-bold">{`$${product.preciounitario}`}</p>
          </div>
        </div>
      ))}
      {selectedProduct && modalVisible && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75">
        <div className="bg-white p-8 rounded-md shadow-md flex">
        <div className="flex-shrink-0">
          <img
            src={`data:image/png;base64,${selectedProduct.imagenp}`} 
            alt={`Imagen de ${selectedProduct.name}`}
            className="w-80 h-47 object-cover rounded-md"
          />
        </div>
            <div className="ml-4 flex-grow">
              <h2 className="text-2xl font-semibold mb-2">{selectedProduct?.nombreproducto}</h2>
              <p className="text-green-500 font-bold mb-2">{selectedProduct.preciounitario}</p>
              <p className={products.length > 0 ? 'text-green-500' : 'text-red-500'}>
                {products.length > 0 ? 'Productos en stock' : 'No hay productos en stock'}
              </p>
              <h3 className="text-xl font-semibold mb-1">Descripción</h3>
              <p className="mb-2">{selectedProduct.descripcionproducto}</p>
              <h3 className="text-xl font-semibold mb-1">Información adicional</h3>
              <textarea
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    className="w-full h-24 border border-gray-300 p-2 mt-2"
                    placeholder="Añade detalles adicionales..."
                />
              <div className="mt-4 flex items-center">
                <div className="mr-4">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 p-1"
                  />
                </div>
                <button
                  onClick={handleAddToCart}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="absolute top-4 right-4 text-gray-700 text-2xl hover:text-gray-900 transition duration-300 ease-in-out"
          >
            &#10006;
          </button>
        </div>
      )}

    </div>
  );
};

export default ProductsList;

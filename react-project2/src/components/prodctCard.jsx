import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = () => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity || 1, 
    });
    // También puedes realizar otras acciones al agregar al carrito
    // Por ejemplo, mostrar un mensaje de éxito, actualizar el estado, etc.
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-md mt-8">
      <img className="h-48 w-full object-cover" src={product.image} alt={product.name} />
      <div className="p-6">
        <h2 className="font-semibold text-xl">{product.name}</h2>
        <p className="text-gray-600">{product.description}</p>
        <p className="mt-2 text-gray-900">${product.price.toFixed(2)}</p>
        <div className="flex items-center mt-4">
          <label htmlFor="quantity" className="mr-2">
            Cantidad:
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)) || 1)}
            className="w-16 border rounded-md p-1"
          />
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

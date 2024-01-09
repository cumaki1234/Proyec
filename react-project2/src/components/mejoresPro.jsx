// components/BestSellersComponent.js
import React from 'react';

const BestSellersComponent = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <div key={product.id} className="relative overflow-hidden bg-gray-200">
          <img
            src={product.imageSrc}
            alt={product.name}
            className="object-cover w-full h-48 sm:h-64 md:h-72 lg:h-96"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 bg-black bg-opacity-50">
            <h3 className="text-lg font-bold mb-2">{product.name}</h3>
            <p className="text-sm">{product.description}</p>
            <a href="#" className="mt-2 underline">Ver detalles</a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BestSellersComponent;

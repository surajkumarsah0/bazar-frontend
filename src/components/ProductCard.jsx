import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {toast,Toaster} from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Product added to cart!');
  };

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
              SALE
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate font-heading">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 font-body overflow-x-hidden">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-blue-600 font-heading">
                  Rs.{displayPrice}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-500 line-through font-body">
                    Rs.{product.price}
                  </span>
                )}
              </div>
              <p className="text-xs text-green-500 mt-1">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <Toaster />
    </Link>
  );
};

export default ProductCard;
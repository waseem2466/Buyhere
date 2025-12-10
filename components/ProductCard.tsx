import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { Product } from '../types.ts';
import { CURRENCY_SYMBOL } from '../constants.ts';
import { useCart } from '../context/CartContext.tsx';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const discountPrice = product.discount 
    ? product.price_retail * (1 - product.discount / 100) 
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if clicked on button
    addToCart(product, 1);
  };

  return (
    <Link 
      to={`/product/${product.slug}`}
      className="group block relative glass-card rounded-2xl p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-900/20"
    >
      {/* Badge */}
      {product.discount && (
        <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          -{product.discount}% OFF
        </span>
      )}

      {/* Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-white dark:bg-gray-800 mb-4 transition-colors">
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button 
            onClick={handleAddToCart}
            className="p-3 bg-white text-gray-800 rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-all transform hover:scale-110"
            title="Add to Cart"
          >
            <Plus size={20} />
          </button>
          <div className="p-3 bg-white text-gray-800 rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-all transform hover:scale-110">
            <Eye size={20} />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-1 pb-2">
        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1 uppercase tracking-wide">{product.category}</p>
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2 line-clamp-1 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            {discountPrice && (
              <span className="text-sm text-gray-400 line-through">
                {CURRENCY_SYMBOL} {product.price_retail.toLocaleString()}
              </span>
            )}
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {CURRENCY_SYMBOL} {(discountPrice || product.price_retail).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
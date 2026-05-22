import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { useCart } from '../context/CartContext';
import StudioFrame from './StudioFrame';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const discountPrice = product.discount 
    ? product.price_retail * (1 - product.discount / 100) 
    : null;

  const isAllSizesOutOfStock = product.sizes && product.sizes.filter(s => s.trim() !== '').length > 0 && 
    product.sizes.filter(s => s.trim() !== '').every(size => product.outOfStockSizes?.includes(size));
  const isOutOfStock = product.stock <= 0 || isAllSizesOutOfStock;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (isOutOfStock) return;
    
    // Choose first in-stock variant
    const availableSizes = product.sizes?.filter(s => s.trim() !== '' && !product.outOfStockSizes?.includes(s)) || [];
    const defaultSize = availableSizes.length > 0 ? availableSizes[0] : (product.sizes?.[0] || '');
    const defaultColor = product.colors?.[0] || '';
    const defaultMaterial = product.materials?.[0] || '';
    
    addToCart(product, 1, defaultSize || undefined, defaultColor || undefined, defaultMaterial || undefined);
  };

  const hasStudioFrame = product.studioFrame && product.studioFrame !== 'none';

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={{
        initial: { y: 0, scale: 1 },
        hover: isOutOfStock ? {} : { y: -8, scale: 1.015 },
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="h-full flex flex-col"
    >
      <Link 
        to={`/product/${product.slug}`}
        className={`group glass-card rounded-[2rem] overflow-hidden flex flex-col h-full relative transition-all duration-300 ${isOutOfStock ? 'opacity-80' : 'hover:shadow-2xl'}`}
      >
        {/* Discount Badge */}
        {product.discount && !isOutOfStock && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [1, 1.04, 1],
              opacity: 1
            }}
            transition={{
              scale: {
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut"
              },
              opacity: { duration: 0.3 }
            }}
            className="absolute top-4 right-4 z-10 bg-purple-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md cursor-default pointer-events-none"
          >
            🏷️ {product.discount}% OFF
          </motion.div>
        )}

        {/* Sold Out Badge */}
        {isOutOfStock && (
          <div className="absolute top-4 left-4 z-10 bg-red-650 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-md">
            SOLD OUT
          </div>
        )}
        
        {/* Image Area */}
        <div className={`relative aspect-square overflow-hidden ${hasStudioFrame ? 'p-0' : 'p-8 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent group-hover:from-white/50 dark:group-hover:from-white/10'} transition-colors`}>
          {hasStudioFrame ? (
            <motion.div 
              variants={{
                initial: { scale: 1 },
                hover: { scale: 1.04 }
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 25 }}
              className="w-full h-full"
            >
              <StudioFrame 
                src={product.images[0]} 
                alt={product.title} 
                frame={product.studioFrame}
                reflection={product.studioReflection ?? true}
                shadow={product.studioShadow ?? true}
                scale={product.studioScale ?? 90}
              />
            </motion.div>
          ) : (
            <motion.img 
              variants={{
                initial: { scale: 1 },
                hover: { scale: 1.08 }
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 25 }}
              src={product.images[0]} 
              alt={product.title} 
              className="w-full h-full object-contain drop-shadow-xl"
              referrerPolicy="no-referrer"
            />
          )}

          {/* Sold out semi-transparent visual overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-white/95 dark:bg-black/90 px-5 py-2.5 rounded-2xl text-xs font-black tracking-widest text-red-650 border border-red-500/20 shadow-2xl">
                TEMPORARILY OUT OF STOCK
              </span>
            </div>
          )}
          
          {/* Quick Add Button (Visible on Hover and only if in stock) */}
          {!isOutOfStock && (
            <motion.button 
              onClick={handleAddToCart}
              variants={{
                initial: { opacity: 0, scale: 0.8, y: 15 },
                hover: { opacity: 1, scale: 1, y: 0 }
              }}
              whileHover={{ 
                scale: 1.15, 
                rotate: 90, 
                backgroundColor: '#7c3aed', 
                color: '#ffffff' 
              }} 
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center shadow-2xl z-20 cursor-pointer"
              aria-label="Add to cart"
            >
              <Plus size={24} />
            </motion.button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex-grow">
            <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 mb-2 uppercase tracking-widest">
              {product.category}
            </p>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg leading-snug mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {product.title}
            </h3>
          </div>

          <div className="flex items-end gap-2 mt-4">
            {discountPrice ? (
              <>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {CURRENCY_SYMBOL} {discountPrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through mb-1">
                  {product.price_retail.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {CURRENCY_SYMBOL} {product.price_retail.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
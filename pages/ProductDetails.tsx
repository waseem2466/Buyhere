import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, ArrowLeft, Share2 } from 'lucide-react';
import { storeService } from '../services/storeService.ts';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { CURRENCY_SYMBOL } from '../constants.ts';

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (slug) {
      storeService.getProductBySlug(slug).then(data => {
        setProduct(data || null);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>;
  
  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 text-gray-800 dark:text-gray-100">
      <h2 className="text-2xl font-bold">Product not found</h2>
      <button onClick={() => navigate('/shop')} className="text-purple-600 dark:text-purple-400 hover:underline">Back to Shop</button>
    </div>
  );

  const discountPrice = product.discount 
    ? product.price_retail * (1 - product.discount / 100) 
    : product.price_retail;

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden glass-card p-2 bg-white/50 dark:bg-white/5">
            <img 
              src={product.images[activeImage]} 
              alt={product.title} 
              className="w-full h-full object-cover rounded-2xl shadow-sm"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === idx ? 'border-purple-600 ring-2 ring-purple-600/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="glass-panel p-8 rounded-3xl h-fit animate-fade-in-up">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
              {product.category}
            </span>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
              <Share2 size={20} />
            </button>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{product.title}</h1>
          
          <div className="flex items-end gap-4 mb-6">
            <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">
              {CURRENCY_SYMBOL} {discountPrice.toLocaleString()}
            </span>
            {product.discount && (
              <span className="text-xl text-gray-400 line-through mb-1">
                {CURRENCY_SYMBOL} {product.price_retail.toLocaleString()}
              </span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-lg">
            {product.description}
          </p>

          <div className="space-y-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            {/* Quantity */}
            <div className="flex items-center gap-6">
              <span className="font-medium text-gray-700 dark:text-gray-300">Quantity</span>
              <div className="flex items-center gap-4 bg-white/60 dark:bg-white/10 rounded-xl px-4 py-2 border border-white dark:border-gray-600">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-1 hover:text-purple-600 dark:hover:text-purple-400 dark:text-gray-200 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="font-bold text-lg w-8 text-center text-gray-900 dark:text-white">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="p-1 hover:text-purple-600 dark:hover:text-purple-400 dark:text-gray-200 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {product.stock} pieces available
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button 
                onClick={() => addToCart(product, qty)}
                className="flex-1 bg-gray-900 dark:bg-white dark:text-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-gray-800 dark:hover:bg-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
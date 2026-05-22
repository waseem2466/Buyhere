import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, ArrowLeft, Share2 } from 'lucide-react';
import { storeService } from '../services/storeService';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { CURRENCY_SYMBOL } from '../constants';
import StudioFrame from '../components/StudioFrame';

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Variant States
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');

  useEffect(() => {
    if (slug) {
      storeService.getProductBySlug(slug)
        .then(data => {
          setProduct(data || null);
          if (data) {
            const availableSizes = data.sizes?.filter(s => !data.outOfStockSizes?.includes(s)) || [];
            if (availableSizes.length > 0) {
              setSelectedSize(availableSizes[0]);
            } else if (data.sizes && data.sizes.length > 0) {
              setSelectedSize(data.sizes[0]);
            }
            if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
            if (data.materials && data.materials.length > 0) setSelectedMaterial(data.materials[0]);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("ProductDetails: failed to fetch product details:", err);
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

  const hasStudioFrame = product.studioFrame && product.studioFrame !== 'none';

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
          <div className="aspect-square rounded-3xl overflow-hidden glass-card p-0 bg-white/50 dark:bg-white/5 relative">
            {hasStudioFrame ? (
              <StudioFrame 
                src={product.images[activeImage]} 
                alt={product.title} 
                frame={product.studioFrame}
                reflection={product.studioReflection ?? true}
                shadow={product.studioShadow ?? true}
                scale={product.studioScale ? product.studioScale * 1.1 : 100} // slight scale boost for detail page
              />
            ) : (
              <img 
                src={product.images[activeImage]} 
                alt={product.title} 
                className="w-full h-full object-cover rounded-2xl shadow-sm"
              />
            )}
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
            {/* COLOR VARIANT PICKER */}
            {product.colors && product.colors.filter(c => c.trim() !== '').length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Available Colors</span>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.filter(c => c.trim() !== '').map((colour) => (
                    <button
                      key={colour}
                      type="button"
                      onClick={() => setSelectedColor(colour)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                        selectedColor === colour 
                          ? 'border-purple-600 bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-2 ring-purple-600/20' 
                          : 'border-gray-250 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {colour}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SIZE VARIANT PICKER */}
            {product.sizes && product.sizes.filter(s => s.trim() !== '').length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Select Size</span>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.filter(s => s.trim() !== '').map((sz) => {
                    const isSizeOutOfStock = product.outOfStockSizes?.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        disabled={isSizeOutOfStock}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all relative ${
                          isSizeOutOfStock
                            ? 'border-gray-200 dark:border-zinc-800 bg-gray-100/50 dark:bg-zinc-900/10 text-gray-400 dark:text-gray-600 line-through cursor-not-allowed opacity-50'
                            : selectedSize === sz 
                              ? 'border-purple-600 bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-2 ring-purple-600/20 cursor-pointer' 
                              : 'border-gray-250 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 text-gray-700 dark:text-gray-300 hover:border-gray-400 cursor-pointer'
                        }`}
                      >
                        {sz}
                        {isSizeOutOfStock && (
                          <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 text-[8px] bg-red-650 text-white rounded-md whitespace-nowrap scale-90 leading-tight font-extrabold shadow-sm">
                            SOLD OUT
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MATERIAL VARIANT PICKER */}
            {product.materials && product.materials.filter(m => m.trim() !== '').length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Material Premium Option</span>
                <div className="flex flex-wrap gap-2.5">
                  {product.materials.filter(m => m.trim() !== '').map((mat) => (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => setSelectedMaterial(mat)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                        selectedMaterial === mat 
                          ? 'border-purple-600 bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-2 ring-purple-600/20' 
                          : 'border-gray-250 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-6 pt-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Quantity</span>
              <div className="flex items-center gap-4 bg-white/60 dark:bg-white/10 rounded-xl px-4 py-2 border border-white dark:border-gray-600">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={product.stock <= 0}
                  className="p-1 hover:text-purple-600 dark:hover:text-purple-400 dark:text-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus size={18} />
                </button>
                <span className="font-bold text-lg w-8 text-center text-gray-900 dark:text-white">{product.stock <= 0 ? 0 : qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  disabled={product.stock <= 0}
                  className="p-1 hover:text-purple-600 dark:hover:text-purple-400 dark:text-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus size={18} />
                </button>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {product.stock <= 0 ? (
                  <span className="text-red-500 font-bold">Sold Out</span>
                ) : (
                  `${product.stock} pieces available`
                )}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button 
                onClick={() => addToCart(product, qty, selectedSize || undefined, selectedColor || undefined, selectedMaterial || undefined)}
                disabled={product.stock <= 0 || (selectedSize ? product.outOfStockSizes?.includes(selectedSize) : false)}
                className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${
                  (product.stock <= 0 || (selectedSize ? product.outOfStockSizes?.includes(selectedSize) : false))
                    ? 'bg-gray-150 dark:bg-zinc-800 text-gray-400 dark:text-gray-600 cursor-not-allowed shadow-none'
                    : 'bg-gray-900 dark:bg-white dark:text-gray-900 text-white hover:bg-gray-800 dark:hover:bg-gray-200 hover:shadow-2xl hover:-translate-y-1'
                }`}
              >
                <ShoppingBag size={20} />
                {product.stock <= 0 
                  ? 'Temporarily Sold Out' 
                  : (selectedSize && product.outOfStockSizes?.includes(selectedSize)) 
                    ? 'Selected Size Sold Out' 
                    : 'Add to Cart'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { MAP_EMBED_URL, APP_NAME, LOGO_URL } from '../constants.ts';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-white/40 bg-white/20 dark:bg-black/20 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <img 
              src={LOGO_URL} 
              alt="Logo" 
              className="h-16 w-auto rounded-xl object-contain mb-4" 
            />
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              {APP_NAME}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Experience premium shopping with our curated collection of high-quality products. Delivered with care to your doorstep.
            </p>
            <div className="flex gap-4 pt-2">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="p-2 glass-card rounded-full hover:bg-purple-100 dark:hover:bg-white/10 transition-colors text-purple-600 dark:text-purple-400">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Shop</Link></li>
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                <MapPin className="shrink-0 text-purple-600 dark:text-purple-400" size={20} />
                <span>411/7 Kandy Road, Mollipothana,<br />Kanthale</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Phone className="shrink-0 text-purple-600 dark:text-purple-400" size={20} />
                <span>+94 71 933 6848 / 077 933 6848</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <MessageCircle className="shrink-0 text-purple-600 dark:text-purple-400" size={20} />
                <span>+94 76 495 0844</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Mail className="shrink-0 text-purple-600 dark:text-purple-400" size={20} />
                <span>smileandsupplies@outlook.com</span>
              </li>
            </ul>
          </div>

          {/* Map Embed */}
          <div className="h-64 md:h-full rounded-2xl overflow-hidden glass-card p-2">
            <iframe
              title="Store Location"
              src={MAP_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200/20 dark:border-gray-700/20 text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved. Designed with liquid glass aesthetics.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
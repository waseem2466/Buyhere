import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { APP_NAME } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-black/20 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-base shadow-md">
                SO
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{APP_NAME}</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xs leading-relaxed">
              Your premium destination for luxury fashion, footwear, handbags, household electricals, baby essentials, and everyday lifestyle collections.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-white/50 dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-600 dark:text-gray-300 hover:text-purple-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/50 dark:bg-white/10 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/50 dark:bg-white/10 hover:bg-sky-100 dark:hover:bg-sky-900/30 text-gray-600 dark:text-gray-300 hover:text-sky-600 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Shop All</Link></li>
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">My Account</Link></li>
              <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <MapPin size={20} className="text-purple-600 shrink-0 mt-0.5" />
                <span>411/7 Kandy Road,<br/>Mollipothana, Kanthale</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone size={20} className="text-purple-600 shrink-0" />
                <span>+94 71 933 6848</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail size={20} className="text-purple-600 shrink-0" />
                <span>info@wrsmile.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-200/50 dark:border-gray-700/50 mt-12 pt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
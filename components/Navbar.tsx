import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User as UserIcon, Sun, Moon, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { APP_NAME, LOGO_URL } from '../constants.ts';

const Navbar: React.FC = () => {
  const { cartCount, toggleCart } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    // Only show Admin link if user is admin
    ...(isAdmin ? [{ name: 'Admin', path: '/admin' }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={LOGO_URL} 
            alt="Logo" 
            className="h-10 w-auto rounded-lg object-contain group-hover:scale-105 transition-transform" 
          />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 tracking-tight hidden sm:block">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-purple-600 dark:hover:text-purple-400 ${
                location.pathname === link.path ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-full hover:bg-white/50 dark:hover:bg-white/10"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="hidden sm:block p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-full hover:bg-white/50 dark:hover:bg-white/10">
            <Search size={20} />
          </button>
          
          <button 
            onClick={() => toggleCart(true)}
            className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-full hover:bg-white/50 dark:hover:bg-white/10"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="hidden sm:block text-right cursor-pointer hover:opacity-75 transition-opacity">
                <p className="text-xs font-bold text-gray-800 dark:text-white leading-none">{user.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">{user.role}</p>
              </Link>
              <Link to="/profile" className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-full hover:bg-white/50 dark:hover:bg-white/10">
                 <UserIcon size={20} />
              </Link>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-lg"
            >
              <UserIcon size={16} /> Login
            </Link>
          )}

          <button 
            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 glass-card rounded-2xl p-4 flex flex-col gap-4 md:hidden animate-fade-in-down z-50">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg font-medium p-2 rounded-lg ${
                 location.pathname === link.path ? 'bg-white/50 dark:bg-white/10 text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {!user && (
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium p-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 flex items-center gap-2"
            >
              <UserIcon size={20} /> Login / Sign Up
            </Link>
          )}
          {user && (
            <>
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium p-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 flex items-center gap-2"
            >
              <UserIcon size={20} /> My Profile
            </Link>
             <button
              onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
              className="text-lg font-medium p-2 rounded-lg text-red-500 bg-red-50 dark:bg-red-900/20 flex items-center gap-2 text-left"
            >
              <LogOut size={20} /> Logout
            </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
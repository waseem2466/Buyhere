import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Sun, Moon, User as UserIcon, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../constants';

const Navbar: React.FC = () => {
  const { cartCount, toggleCart } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex justify-center ${isScrolled ? 'py-4' : 'py-6'}`}>
      <nav 
        className={`w-[95%] max-w-7xl transition-all duration-300 px-6 ${
          isScrolled 
            ? 'nav-glass rounded-full py-3 shadow-xl' 
            : 'bg-transparent py-2'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
              SO
            </div>
            <span className={`text-xl font-bold tracking-tight transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-100'} text-gray-900 dark:text-white hidden sm:block`}>
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Links - Centered */}
          <div className="hidden md:flex items-center gap-1">
            <div className="p-1.5 rounded-full bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/5 backdrop-blur-md shadow-sm flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-md transform scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/30 dark:hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    location.pathname === '/admin'
                      ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-all"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
            </button>

            <button 
              onClick={() => toggleCart(true)}
              className="relative p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-all group"
              aria-label="Open Cart"
            >
              <ShoppingCart size={20} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg border-2 border-white dark:border-gray-900 group-hover:scale-110 transition-transform">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

            {user ? (
              <Link to="/profile" className="hidden sm:block">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-[2px] cursor-pointer hover:shadow-lg transition-all">
                  <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center text-sm font-bold text-gray-700 dark:text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              </Link>
            ) : (
              <Link 
                to="/login"
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <span>Login</span>
              </Link>
            )}

            <button 
              className="md:hidden p-2.5 text-gray-700 dark:text-gray-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-4 right-4 glass-panel rounded-3xl animate-fade-in-down shadow-2xl p-4 z-40 border border-white/20">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`p-4 rounded-2xl font-semibold transition-colors flex items-center justify-between ${
                  location.pathname === link.path
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="p-4 rounded-2xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              >
                Admin Dashboard
              </Link>
            )}
            <hr className="border-gray-100 dark:border-gray-700/50 my-2" />
            {user ? (
              <>
                <Link to="/profile" className="p-4 rounded-2xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600">
                    <UserIcon size={16} />
                  </div>
                  My Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full p-4 rounded-2xl font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-3 text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-500">
                    <LogOut size={16} />
                  </div>
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="p-4 rounded-2xl font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-center shadow-lg mt-2"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
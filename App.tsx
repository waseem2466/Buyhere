import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import Navbar from './components/Navbar.tsx';
import CartSidebar from './components/CartSidebar.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import Shop from './pages/Shop.tsx';
import ProductDetails from './pages/ProductDetails.tsx';
import Checkout from './pages/Checkout.tsx';
import Admin from './pages/Admin.tsx';
import Contact from './pages/Contact.tsx';
import Login from './pages/Login.tsx';
import Profile from './pages/Profile.tsx';
import Privacy from './pages/Privacy.tsx';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <HashRouter>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
              <Navbar />
              <CartSidebar />
              
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetails />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/privacy" element={<Privacy />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </HashRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
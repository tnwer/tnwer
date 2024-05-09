import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SavedPage from './pages/SavedPage';
import Cart from './pages/Cart';
import PrchaseHistory from './pages/PrchaseHistory';
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext'; 
import Logo from "./assets/logos/mainLogo.svg"
import Signup from './pages/Signup';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider> 
      <Router>
        {showSplash ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              backgroundColor: '#f5f5f5',
            }}
          >
            <img src={Logo} />
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/saved" element={<SavedPage />} /> 
            <Route path="/cart" element={<Cart />} /> 
            <Route path="/prchase-history" element={<PrchaseHistory />} /> 
            <Route path="/profile" element={<Profile />} /> 
            <Route path="/productDetails/:id" element={<ProductDetails />} />
            <Route path="/signup" element={<Signup />} /> 
            <Route path="*" element={<NotFound />} /> 
          </Routes>
        )}
      </Router>
    </AuthProvider>
  );
}

export default App;

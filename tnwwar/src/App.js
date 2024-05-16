import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SavedPage from './pages/SavedPage';
import Cart from './pages/Cart';
import PrchaseHistory from "./pages/PrchaseHistory"
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './context/PrivateRoute';
import Logo from './assets/logos/mainLogo.svg';
import CheckOut from './pages/CheckOut';


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
            <img src={Logo} alt="Logo" />
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/saved" element={<PrivateRoute element={<SavedPage />} />} />
            <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
              <Route path="/purchase-history" element={<PrivateRoute element={<PrchaseHistory />} />} />
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
            <Route path="/check-out" element={<PrivateRoute element={<CheckOut />} />} />
            <Route path="/productDetails/:id" element={<ProductDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </Router>
    </AuthProvider>
  );
}

export default App;

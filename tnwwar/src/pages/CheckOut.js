import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CheckoutPage() {
    const [checkoutUrl, setCheckoutUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            try {
                const response = await axios.get('http://localhost:8080/create-checkout-session');
                setCheckoutUrl(response.data);
            } catch (error) {
                console.error('Error fetching checkout session:', error);
            }
        };
        fetchCheckoutSession();
    }, []);

    const handleCheckout = () => {
        navigate('/cart'); // Redirect to cart if checkout fails
    };

    return (
        <div className="container mt-5">
            <h1>Checkout</h1>
            <p>Complete your purchase by clicking the button below:</p>
            {checkoutUrl ? (
                <a href={checkoutUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                    Proceed to Checkout
                </a>
            ) : (
                <button className="btn btn-primary" onClick={handleCheckout}>
                    Retry Checkout
                </button>
            )}
            <Link to="/cart" className="btn btn-secondary ml-2">Back to Cart</Link>
        </div>
    );
}

export default CheckoutPage;

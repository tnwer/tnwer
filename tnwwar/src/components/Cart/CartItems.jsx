import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useAddToCart from '../../hooks/useAddToCart';
import useRemoveFromCart from '../../hooks/useRemoveFromCart';


function CartItems() {
    const { authToken } = useAuth();
    const { addToCart } = useAddToCart();
    const { removeFromCart } = useRemoveFromCart();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleCheckout = () => {
        navigate('/check-out');
    };
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                if (!authToken) {
                    throw new Error('No auth token available');
                }

                const response = await fetch('http://localhost:8080/cart', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }

                const cartData = await response.json();

                const productDetailsPromises = cartData.map(item =>
                    fetch(`http://localhost:8080/productDetails/${item.cart_product}`, {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }).then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch product details');
                        }
                        return response.json();
                    }).then(productDetails => ({
                        ...item,
                        productDetails
                    }))
                );

                const cartItemsWithDetails = await Promise.all(productDetailsPromises);
                setCartItems(cartItemsWithDetails);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [authToken]);

    const handleIncreaseQuantity = async (productId) => {
        try {
            const updatedItem = await addToCart(productId);
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.cart_product === productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } catch (error) {
            console.error('Error increasing quantity:', error.message);
        }
    };

    const handleDecreaseQuantity = async (productId) => {
        try {
            const updatedItem = await removeFromCart(productId);
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.cart_product === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                ).filter(item => item.quantity > 0)
            );
        } catch (error) {
            console.error('Error decreasing quantity:', error.message);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.productDetails.price * item.quantity), 0);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="cart-container">
            <div className="cart-items-section">
                <ul>
                    {cartItems.map((item) => (
                        <li key={item._id} className="cart-item">
                            {item.productDetails ? (
                                <>
                                    <img src={item.productDetails.img_url} alt={item.productDetails.product_name} />
                                    <div className='inner-data'>
                                        <h3>{item.productDetails.product_name}</h3>
                                        <p>{item.productDetails.description}</p>
                                        <p className='price'>${item.productDetails.price} </p>
                                        <div className="quantity-controls">
                                            <button onClick={() => handleDecreaseQuantity(item.cart_product)}>-</button>
                                            <span>Quantity: {item.quantity}</span>
                                            <button onClick={() => handleIncreaseQuantity(item.cart_product)}>+</button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p>Loading product details...</p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="billing-section">
                <h3>Billing</h3>
                {cartItems.map((item) => (
                    <div key={item._id}>
                        <p>{item.productDetails.product_name} X {item.quantity}</p>
                    </div>
                ))}
                <hr />
                <p>Total: ${calculateTotal()}</p>
                <button className="checkout-button" onClick={handleCheckout}>Check Out</button>
            </div>

        </div>
    );
}

export default CartItems;

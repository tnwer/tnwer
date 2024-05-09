import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Offertab() {
    const [allProducts, setAllProducts] = useState([]);
    const [randomProduct, setRandomProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        // Fetch all products when the component mounts
        axios.get('http://localhost:8080/allProducts')
            .then(response => {
                setAllProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching all products:', error);
            });
    }, []);

    useEffect(() => {
        if (allProducts.length > 0) {
            // Select a random product from the list
            const randomIndex = Math.floor(Math.random() * allProducts.length);
            setRandomProduct(allProducts[randomIndex]);
        }
    }, [allProducts]);

    const handleAddToCart = () => {
      
        console.log(`Added ${quantity} ${randomProduct.product_name} to cart`);
    };

    const handleIncrementQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    const handleQuantityClick = (e) => {
       
        e.stopPropagation();
    };

    return (
        <div>
            {randomProduct ? (
                <Link to={`/productDetails/${randomProduct._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="Offer-card">
                        <img src={randomProduct.img_url} alt={randomProduct.product_name} style={{ width: '200px' }} />
                        <div>
                            <h2 className='product_name'>{randomProduct.product_name}</h2>
                            <p className='product_description'>{randomProduct.description}</p>
                            <p className='product_price'>Price: ${randomProduct.price}</p>
                            <div className="quantity-controls">
                                <label htmlFor="quantity">Quantity:</label>
                                <div>
                                    <button onClick={handleDecrementQuantity}>-</button>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        min="1"
                                        value={quantity}
                                        onClick={handleQuantityClick} 
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    />
                                    <button onClick={handleIncrementQuantity}>+</button>
                                </div>
                            </div>
                            <button onClick={handleAddToCart} className='offer_addtoCart'>Add to Cart</button>
                        </div>
                    </div>
                </Link>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default Offertab;

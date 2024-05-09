import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import ProductCard from '../cards/ProductCard';

function ProductCarousel() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/allProducts')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

   
    const groupedProducts = [];
    for (let i = 0; i < products.length; i += 4) {
        groupedProducts.push(products.slice(i, i + 5)); 
    }

    return (
        <div className="container p-3 mx-4">
            <div id="productCarousel" className="carousel slide small-carousel" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {groupedProducts.map((group, index) => (
                        <div key={index} className={`carousel-item${index === 0 ? ' active' : ''}`}>
                            <div className="d-flex justify-content-around">
                                {group.map((product, productIndex) => (
                                    <Link key={productIndex} to={`/productDetails/${product._id}`}>
                                        <ProductCard product={product} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button className="carousel-control-prev small-carousel-control" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next small-carousel-control" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
}

export default ProductCarousel;

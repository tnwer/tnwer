// ProductCarousel.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from './../cards/ProductCard';

function ProductCarousel() {
    const [products, setProducts] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselRef = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:8080/allProducts')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    // Chunk function to split array into groups
    const chunkArray = (arr, size) => {
        const chunkedArr = [];
        for (let i = 0; i < arr.length; i += size) {
            chunkedArr.push(arr.slice(i, i + size));
        }
        return chunkedArr;
    };

    const groupedProducts = chunkArray(products, 4);

    const handleNext = () => {
        setCurrentSlide((prev) => (prev === groupedProducts.length - 1 ? 0 : prev + 1));
    };

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev === 0 ? groupedProducts.length - 1 : prev - 1));
    };

    return (
        <div className="product-carousel">
            <div className="carousel" ref={carouselRef} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {groupedProducts.map((group, index) => (
                    <div key={index} className="slide">
                        <div className="slide-content">
                            {group.map((product, productIndex) => (
                                <Link key={productIndex} to={`/productDetails/${product._id}`}>
                                    <ProductCard product={product} />
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <button className="prev-btn" onClick={handlePrev}>&#10094;</button>
            <button className="next-btn" onClick={handleNext}>&#10095;</button>
        </div>
    );
}

export default ProductCarousel;

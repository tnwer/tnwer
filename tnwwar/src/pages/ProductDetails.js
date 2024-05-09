import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProductDetails() {
    const { id } = useParams(); // Extract the id parameter from the URL
    const [product, setProduct] = useState(null);

    useEffect(() => {
        // Fetch product details using the id
        axios.get(`http://localhost:8080/productDetails/${id}`)
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
            });
    }, [id]);


    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Product Details</h2>
            <img src={product.img_url} alt={product.product_name} style={{ width: '200px' }} />
            <p>Name: {product.product_name}</p>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Category: {product.product_category.category_name}</p>

        </div>
    );
}

export default ProductDetails;

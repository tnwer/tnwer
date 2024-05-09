import React from 'react';

function ProductCard({ product }) {
    return (
        <div className="card p-3 ">
            <img src={product.img_url} alt={product.product_name} className="card-img-top mx-auto" style={{ width: "150px" }} />
            <div className="card-body text-center">
                <h6 className="card-title">{product.product_name}</h6>
                <button>Add to Cart</button>
            </div>
        </div>
    );
}

export default ProductCard;

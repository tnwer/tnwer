import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import productimage from "../../assets/images/product.png"

function RightAside() {
    const [dailyDeals, setDailyDeals] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/allProducts')
            .then(response => {
                // Shuffle the products array
                const shuffledProducts = response.data.sort(() => Math.random() - 0.5);
                // Get the first 5 products
                const randomProducts = shuffledProducts.slice(0, 5);
                // Set the fetched random products in state
                setDailyDeals(randomProducts);
            })
            .catch(error => {
                console.error('Error fetching random products:', error);
            });
    }, []);


    return (
        <div className="r_aside-right-aside">
            <div className="special-offer-box">
                <h4 className='special_offer_title'>Special Offer</h4>
                <img src={productimage} alt="Special Offer" />
                
                <p>Buy It Now ➡️ </p>

            </div>

            
            <div className="r_aside-daily-deals">
                <h2>Daily Deals</h2>
                {dailyDeals.map((deal, index) => (
                    <Link key={index} to={`/productDetails/${deal._id}`} className="r_aside-deal-item-link">
                        <div className="r_aside-deal-item">
                            <img src={deal.img_url} alt={deal.product_name} className="r_aside-deal-item-img" />
                            <div className="r_aside-deal-item-info">
                                <h3>{deal.product_name}</h3>
                                <p>${deal.price}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default RightAside;

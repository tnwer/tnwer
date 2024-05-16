import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSave, faShoppingCart, faHistory, faUser } from '@fortawesome/free-solid-svg-icons'; 


import mainLogo from '../../assets/logos/mainLogo.svg';

function Aside({ activeTab, handleTabChange }) {
    return (
        <div className="aside-container">
            <div className="logo">
                <img src={mainLogo} alt="Logo" />
            </div>
            <div className={`tab ${activeTab === 'home' && 'active'}`} onClick={() => handleTabChange('home')}>
                <FontAwesomeIcon icon={faHome} className="fa-light" style={{ color: '#5c5c5c', marginRight: '10px' }} />
                Home
            </div>
            <div className={`tab ${activeTab === 'saved' && 'active'}`} onClick={() => handleTabChange('saved')}>
                <FontAwesomeIcon icon={faSave} className="fa-light" style={{ color: '#5c5c5c', marginRight: '10px' }} />
                Saved
            </div>
            <div className={`tab ${activeTab === 'cart' && 'active'}`} onClick={() => handleTabChange('cart')}>
                <FontAwesomeIcon icon={faShoppingCart} className="fa-light" style={{ color: '#5c5c5c', marginRight: '10px' }} />
                Cart
            </div>
            <div className={`tab ${activeTab === 'profile' && 'active'}`} onClick={() => handleTabChange('profile')}>
                <FontAwesomeIcon icon={faUser} className="fa-light" style={{ color: '#5c5c5c', marginRight: '10px' }} />
                Profile
            </div>

            <div className={`tab ${activeTab === 'purchase-history' && 'active'}`} onClick={() => handleTabChange('purchase-history')}>
                <FontAwesomeIcon icon={faHistory} className="fa-light" style={{ color: '#5c5c5c', marginRight: '10px' }} />
                Purchase History
            </div>
        </div>
    );
}

export default Aside;

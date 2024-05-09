// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Header() {
    return (
        <div className="header-container">
            <div className="search-box">
                <input type="text" placeholder="Search..." />
            </div>
            <div className="login-button">
                <Link to="/login">
                    <FontAwesomeIcon icon={faUser} className="user-icon" />
                    Login
                </Link>
            </div>
        </div>
    );
}

export default Header;

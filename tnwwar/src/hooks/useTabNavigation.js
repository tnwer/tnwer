// useTabNavigation.js

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function useTabNavigation() {
    const [activeTab, setActiveTab] = useState('home');
    const navigate = useNavigate();
    const location = useLocation();

    // cahnge the active tab
    useState(() => {
        const path = location.pathname.substring(1);
        setActiveTab(path || 'home'); 
    }, [location.pathname]); 

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        switch (tab) {
            case 'home':
                navigate('/');
                break;
            case 'saved':
                navigate('/saved');
                break;
            case 'cart':
                navigate('/cart');
                break;
            case 'purchaseHistory':
                navigate('/prchase-history'); 
                break;
            case 'profile':
                navigate('/profile');
                break;
            default:
                break;
        }
    };

    return { activeTab, handleTabChange };
}

export default useTabNavigation;

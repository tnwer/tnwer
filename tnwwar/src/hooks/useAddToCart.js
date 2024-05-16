import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const useAddToCart = () => {
    const { authToken } = useAuth();

    const addToCart = async (productId) => {
        try {
            if (!authToken) {
                throw new Error('No auth token available');
            }

            const response = await axios.post(`http://localhost:8080/cartIncrement/${productId}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            return response.data;
        } catch (error) {
            throw new Error('Error adding to cart: ' + error.message);
        }
    };

    return { addToCart };
};

export default useAddToCart;

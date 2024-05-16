import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const useRemoveFromCart = () => {
    const { authToken } = useAuth();

    const removeFromCart = async (productId) => {
        try {
            if (!authToken) {
                throw new Error('No auth token available');
            }

            const response = await axios.put(`http://localhost:8080/cartDecrement/${productId}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            return response.data;
        } catch (error) {
            throw new Error('Error removing from cart: ' + error.message);
        }
    };

    return { removeFromCart };
};

export default useRemoveFromCart;

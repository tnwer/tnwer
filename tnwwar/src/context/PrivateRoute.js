import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ element }) {
    const { authToken } = useAuth();

    return authToken ? element : <Navigate to="/login" />;
}

export default PrivateRoute;

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!Cookies.get('AdminAccessToken');

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth/sign-in" />
        )
      }
    />
  );
};

export default ProtectedRoute;
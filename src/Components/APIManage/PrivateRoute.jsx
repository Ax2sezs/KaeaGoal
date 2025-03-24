// src/Components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the useAuth hook

function PrivateRoute({ children }) {
  const { user } = useAuth(); // Access the user from AuthContext

  // If the token does not exist, redirect to the login page
  if (!user || !user.token) {
    return <Navigate to="/" />;
  }

  // If the user is authenticated, render the children (the protected component)
  return children;
}

export default PrivateRoute;

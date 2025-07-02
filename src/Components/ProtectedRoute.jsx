import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner-large"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
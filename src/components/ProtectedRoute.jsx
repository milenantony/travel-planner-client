// client/src/components/ProtectedRoute.jsx

import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute() {
  // <-- Get isLoading from the context
  const { user, isLoading } = useContext(AuthContext);

  // <-- NEW: If the context is still checking for a user, show a loading message
  if (isLoading) {
    return <div className="container">Loading...</div>;
  }

  // If loading is finished and there is still no user, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If loading is finished and there IS a user, show the protected page
  return <Outlet />;
}
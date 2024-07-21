import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Auth';
import Spinner from '../components/Spinner'; // Assuming you have a Spinner component

const Admin = () => {
  const { userRole, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (userRole !== 'admin') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default Admin;
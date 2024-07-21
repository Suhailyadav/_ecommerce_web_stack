import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Auth';
import { Outlet, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

const Private = () => {
  const [ok, setOk] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    console.log('Current token:', token);
    const authCheck = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/users/user-auth');
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setOk(false);
      }
    };

    if (token) {
      authCheck();
    }
  }, [token]);

  return ok ? <Outlet /> : <Spinner />;
};

export default Private;

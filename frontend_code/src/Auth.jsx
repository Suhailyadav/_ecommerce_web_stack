// import React, { createContext, useContext, useState } from 'react';
// import axios from 'axios';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const isLoggedIn = !!token;

//   const storeTokenInLS = (serverToken) => {
//     localStorage.setItem('token', serverToken);
//     setToken(serverToken);
//   };
//   console.log('Current token:', token);
//   axios.defaults.headers.common['Authorization'] = token

//   const LogoutUser = () => {
//     setToken("");
//     localStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, LogoutUser, token }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const authContextValue = useContext(AuthContext);
//   if (!authContextValue) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return authContextValue;
// };
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);
  const isLoggedIn = !!token;
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token) // Use jwt-decode to decode
        setUserRole(decodedToken?.role || null);
        setUserId(decodedToken?.id || null);
        axios.defaults.headers.common['Authorization'] = `${token}`;
      } catch (error) {
        console.error('Token decoding failed:', error);
        setUserRole(null);
        setUserId= null
      }
    } else {
      axios.defaults.headers.common['Authorization'] = '';
    }
  }, [token]);

  const storeTokenInLS = (serverToken) => {
    localStorage.setItem('token', serverToken);
    setToken(serverToken);
  };

  const LogoutUser = () => {
    setToken("");
    setUserRole(null); // Clear role on logout
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = ''; // Clear Authorization header on logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, LogoutUser, token, userRole, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContextValue;
};
  


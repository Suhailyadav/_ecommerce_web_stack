import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './Auth';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { token } = useAuth(); // Get token from AuthContext

  useEffect(() => {
    if (token) {
      fetchCart(); // Fetch cart items when token is available
    }
  }, [token]);

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/cart', {
        headers: {
          'Authorization': `${token}`
        }
        
      });
        console.log('Response Data:', response.data.data.items[0].product)
        setCartItems(response.data.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      await axios.post('http://localhost:3000/api/v1/cart/add', { productId, quantity }, {
        headers: {
          'Authorization': `${token}`
        }
      });
      fetchCart(); // Refresh cart after adding
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.post(`http://localhost:3000/api/v1/cart/remove`, {productId}, {
        headers: {
          'Authorization': `${token}`
        }
      });
      fetchCart(); // Refresh cart after removing
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, setCartItems, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

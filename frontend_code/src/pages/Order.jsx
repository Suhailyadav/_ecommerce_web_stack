import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import './Order.css'; // Make sure to create and import relevant CSS
import DropIn from 'braintree-web-drop-in-react'
import axios from 'axios';
import { useAuth } from '../Auth';
import { Navigate } from 'react-router-dom';

const Order = () => {

  const { cartItems, setCartItems } = useCart();
  const [clientToken, setClientToken] = useState('');
  const { token, userId } = useAuth();
  const [instance, setInstance] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDropIn, setShowDropIn] = useState(false);
 console.log(userId)



  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const tax = subtotal * 0.1; // Example tax rate
    const shipping = 10; // Flat shipping rate
    const total = subtotal + tax + shipping;
    
    return { subtotal, tax, shipping, total };
  };

  const { subtotal, tax, shipping, total } = calculateTotals();
  
  console.log(total)
  const getToken = async () =>{
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/braintree/token`)
      setClientToken(data?.clientToken)
      console.log(data.clientToken)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getToken();
  }, [token])

  const handlePayment = async () => {
    if (!instance) {
      console.error('Braintree instance is not available.');
      return;
    }

    setLoading(true);

    try {
      // Get payment method nonce from Braintree instance
      const { nonce } = await instance.requestPaymentMethod();

      // Send nonce, amount, and user ID to backend
      const { data } = await axios.post('http://localhost:3000/api/v1/braintree/payment', {
        nonce,
        amount: total.toFixed(2),
        buyerId: userId, // Send user ID from AuthContext
      });

      // Handle successful payment
      console.log('Payment successful:', data);
      alert('Payment successful!');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <table className="order-summary-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.product._id}>
              <td>{item.product.name}</td>
              <td>{item.quantity}</td>
              <td>${item.product.price.toFixed(2)}</td>
              <td>${(item.product.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="3">Subtotal</th>
            <td>${subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <th colSpan="3">Tax</th>
            <td>${tax.toFixed(2)}</td>
          </tr>
          <tr>
            <th colSpan="3">Shipping</th>
            <td>${shipping.toFixed(2)}</td>
          </tr>
          <tr>
            <th colSpan="3">Total</th>
            <td>${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      {/* {clientToken && !showDropIn ? (
        <button className="payment-btn" onClick={() => setShowDropIn(true)} disabled={loading}>
          {loading ? 'Loading...' : 'Show Payment Options'}
        </button>
      ) : (
        clientToken && (
          <>
            <DropIn
              options={{
                authorization: clientToken,
                paypal: {
                  flow: 'vault',
                },
              }}
              onInstance={setInstance}
            />
            <button className="payment-btn" onClick={handlePayment} disabled={loading}>
              {loading ? 'Processing...' : 'Make Payment'}
            </button>
          </>
        )
      )} */}
      {clientToken && showDropIn ? (
        <>
          <DropIn
            options={{
              authorization: clientToken,
              paypal: {
                flow: 'vault',
              },
            }}
            onInstance={(instance) => setInstance(instance)}
          />
          <button className='payment-btn' onClick={handlePayment} disabled={loading}>
            {loading ? 'Processing ...' : 'Make Payment'}
          </button>
        </>
      ) : (
        <button className='payment-btn' onClick={() => setShowDropIn(true)}>
          Show Payment Options
        </button>
      )}
    </div>
      
  );
};

export default Order;

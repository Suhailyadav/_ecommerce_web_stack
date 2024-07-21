import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './Auth.jsx'
import { CartProvider } from './CartContext'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
     <CartProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
     </CartProvider>
  </AuthProvider>
)

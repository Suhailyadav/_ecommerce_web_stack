import React from 'react';
import { NavLink } from 'react-router-dom';
import hamburger from '../assets/hamburger.png'
import './Navbar.css'
import { useCart } from '../CartContext';
import { useAuth } from '../Auth';

  
const Navbar = () => {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const {isLoggedIn, userRole} = useAuth();
  const [showNavbar, setShowNavbar] = React.useState(false);
  

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <>
      <nav className="navbar">
      <div className="container">
        <div className="logo">
        </div>
        <div className="menu-icon" 
        onClick={handleShowNavbar}>
        <img src={hamburger} alt="Menu" />
        </div>
        <div className={`nav-elements  ${showNavbar && "active"}`}>
          <ul>
          <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
            <NavLink to='/products'>Products</NavLink>
          </li> 
          {userRole === 'admin' && (
            <>
          <li>
            <NavLink to='/create'>Create Product</NavLink>
          </li> 
          </>
          )}
          <li>
              <NavLink to='/cart'>Cart<span className="cart-count">({cartCount})</span></NavLink>
            </li>
            {isLoggedIn ? ( 
            <li>
              <NavLink to='/logout'>Logout</NavLink>
            </li>
            ): (
            <>
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            </>
            )
            }
            
          </ul>
        </div>
      </div>
    </nav>
    </>
  )
}

export default Navbar

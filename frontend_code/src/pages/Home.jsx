import React from 'react'
import { Link } from 'react-router-dom'; 
import './Home.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth';


const Home = () => {
  const { isLoggedIn } = useAuth();
  const Navigate = useNavigate();

  const handleShopNowClick = () => {
    if (isLoggedIn) {
      Navigate.push('/products');
    } else {
      Navigate.push('/login');
    }
  };
  return (
    <>
       <header id="home" className="hero-section">
  <div className="container">
    <h1>Welcome to Wish - Your One-Stop Shop for All Your Wish!</h1>
    <p>Discover a world of amazing products at unbeatable prices. Whether you're looking for the latest fashion trends, cutting-edge electronics, home essentials, or unique gifts, we've got you covered.</p>
    <Link to='/products' className="homebtn"  onClick={handleShopNowClick}>Shop Now</Link>
  </div>
</header>

    </>
  )
}

export default Home

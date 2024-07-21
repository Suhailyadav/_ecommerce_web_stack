import React, {useState, useEffect} from 'react';
import { useCart } from '../CartContext'; // Import useCart to access cart functions
import './ProductList.css'; //

const ProductList = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  const handleAddToCart = (productId) => {
    addToCart(productId, 1); // Add one quantity of the product to the cart
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/products`);  // Fetching from the correct endpoint
        if (!response.ok) {
          throw new Error('Error fetching products');
        }
        const data = await response.json();
        console.log(data); 
        if (data && Array.isArray(data.data)) {
          setProducts(data.data);  
        } else {
          console.error('Data is not an array:', data.data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="productlist-list">
    {products.map((product) => (
      <div key={product._id} className="productlist-card">
        <div className='productlist-image-div'>
        <img src={product.image} alt={product.name} className="productlist-image" />
        </div>
        <h2 className="productlist-name">{product.name}</h2>
        <p className="productlist-description">{product.description}</p>
        <p className="productlist-price">${product.price}</p>
        <button 
            className="add-to-cart-btn"
            onClick={() => handleAddToCart(product._id)}
          >
            Add to Cart
          </button>
      </div>
    ))}
  </div>
  );
};

export default ProductList;


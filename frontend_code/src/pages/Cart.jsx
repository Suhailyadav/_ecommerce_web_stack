import React from "react";
import { useCart } from "../CartContext";
import "./Cart.css"; // Ensure this CSS file contains the styles
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, setCartItems } = useCart();

  const handleIncrease = (productId) => {
    addToCart(productId, 1);
  };

  const handleDecrease = (productId, quantity) => {
    if (quantity > 0) {
      addToCart(productId, -1);
    }
  };

  const emptyCart = async () => {
    try {
      await Promise.all(cartItems.map(item => removeFromCart(item.product._id)));
      setCartItems([]);
    } catch (error) {
      console.error('Error emptying cart:', error);
    }
  };


  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      return acc + (item.quantity * item.product.price);
    }, 0);
  };

  const cartTotalQty = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotalAmount = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

  return (
    <div className="view row justify-content-center m-0">
      <div className="col-md-8 mt-5 mb-5">
        <div className="cart">
          <div className="card-header bg-dark p-3">
            <div className="card-header-flex">
              <h5 className="text-white m-0">
                Cart Calculation {cartItems.length > 0 ? `(${cartItems.length})` : ''}
              </h5>
              {cartItems.length > 0 && (
                <button
                  className="btn btn-danger mt-0 btn-sm"
                  onClick={emptyCart} // Implement emptyCart function if needed
                >
                  <i className="fa fa-trash-alt mr-2"></i>
                  <span>Empty Cart</span>
                </button>
              )}
            </div>
          </div>
          <div className="card-body p-0">
            {cartItems.length === 0 ? (
              <table className="table cart-table mb-0">
                <tbody>
                  <tr>
                    <td colSpan="6">
                      <div className="cart-empty">
                        <i className="fa fa-shopping-cart"></i>
                        <p>Your Cart Is empty</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="table cart-table mb-0">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Product</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th className="text-right">
                      <span id="amount" className="amount">Total Amount</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => {
                    const { product, quantity } = item;
                    console.log(product._id)
                    return (
                      <tr key={product._id}>
                        <td>
                          <button
                            className="prdct-delete"
                            onClick={() => console.log(removeFromCart(product._id))
                            }
                          
                          >
                            <i className="fa fa-trash-alt"></i>
                          </button>
                        </td>
                        <td>
                          <div className="product-img">
                            <img src={product.image} alt={product.name} />
                          </div>
                        </td>
                        <td>
                          <div className="cart-product-name">
                            <p>{product.name}</p>
                          </div>
                        </td>
                        <td>${product.price}</td>
                        <td>
                          <div className="prdct-qty-container">
                            <button
                              className="prdct-qty-btn"
                              type="button"
                              onClick={() => handleDecrease(item.product._id, item.quantity)}>
                              <i className="fa fa-minus"></i>
                            </button>
                            <input
                              type="text"
                              name="qty"
                              className="qty-input-box"
                              value={quantity}
                              readOnly
                            />
                            <button
                              className="prdct-qty-btn"
                              type="button"
                              onClick={() => handleIncrease(item.product._id, item.quantity)}>
                              <i className="fa fa-plus"></i>
                            </button>
                          </div>
                        </td>
                        <td className="text-right">
                          ${(quantity * product.price).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="foottable">
                  <tr>
                    <th className="nbsp">&nbsp;</th>
                    <th className="nbsp" colSpan="3">&nbsp;</th>
                    <th className="itemth">
                      Items in Cart<span className="ml-2 mr-2">:</span>
                      <span className="text-danger">{cartTotalQty}</span>
                    </th>
                    <th className="text-right">
                      Total Price<span className="ml-2 mr-2">:</span>
                      <span className="text-danger">$ {calculateTotal().toFixed(2)}</span>
                    </th>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>
      </div>
      <Link to="/order-summary">
          <button  className="order-summary-btn">
            Order Summary
          </button>
        </Link>
    </div>
    
  );
};

export default Cart;

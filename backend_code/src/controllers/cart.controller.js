import { Cart } from '../models/cart.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';


const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  if (!productId || !quantity) {
    throw new ApiError(400, 'Product ID and quantity are required');
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  const updatedCart = await Cart.findById(cart._id).populate('items.product');

  return res.status(200).json(new ApiResponse(200, updatedCart, 'Item added to cart successfully'));
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  if (!productId) {
    throw new ApiError(400, 'Product ID is required');
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  await cart.save();
  const updatedCart = await Cart.findById(cart._id).populate('items.product');

  return res.status(200).json(new ApiResponse(200, updatedCart, 'Item removed from cart successfully'));
});

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  return res.status(200).json(new ApiResponse(200, cart, 'Cart retrieved successfully'));
});

export { addToCart, removeFromCart, getCart };
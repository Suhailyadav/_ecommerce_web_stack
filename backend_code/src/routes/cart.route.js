import { Router } from "express";
import { addToCart, removeFromCart, getCart } from '../controllers/cart.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/add',verifyJWT, addToCart);
router.post('/remove',verifyJWT, removeFromCart);
router.get('/', verifyJWT,  getCart);

export default router;

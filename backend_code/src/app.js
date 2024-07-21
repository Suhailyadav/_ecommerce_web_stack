import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());


import userRouter from './routes/user.route.js'

app.use('/api/v1/users', userRouter)

import productRouter from './routes/product.route.js'

app.use('/api/v1/products', productRouter)

import cartRouter from './routes/cart.route.js'; 
app.use('/api/v1/cart', cartRouter);

import paymentRouter from './routes/payment.route.js'

app.use('/api/v1/braintree', paymentRouter)



export { app }

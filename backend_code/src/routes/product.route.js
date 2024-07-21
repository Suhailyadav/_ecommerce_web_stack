import { Router } from "express";
import { createProduct, getProducts } from '../controllers/product.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";



const router = Router()

router.route('/create').post(verifyJWT, verifyAdmin,
  upload.fields([
    {
      name: 'image',
      maxCount: 1
    }
  ]),
  createProduct)

router.route('/').get(getProducts)

export default router;
import { Router } from "express";
import { braintreePaymentController, braintreeTokenController } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.get('/token',braintreeTokenController)

router.post('/payment', verifyJWT, braintreePaymentController)


export default router;
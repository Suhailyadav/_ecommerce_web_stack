import braintree from 'braintree'

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { PaymentReceipt } from '../models/PaymentReceipt.model.js';


const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

// export const braintreeTokenController = asyncHandler(async (req, res) => {
//   try {
//     gateway.clientToken.generate({}, function(err, response){
//       if(err) {
//         res.status(500).send(err)
//       } else {
//         res.send(response)
//       }
//     });
//   } catch (error) {
//     throw new ApiError(500, 'Error generating client token');
//   }
// });


// export const braintreePaymentController = asyncHandler(async (req, res) => {
// try { 
//   const { cart, nonce } = req.body;

//   let total = 0
//   cart.map((i) =>{
//    total += i.price;
//   })
  
//     let newTransaction = await gateway.transaction.sale({
//       amount: total,
//       paymentMethodNonce: nonce,
//       option: { 
//         submitForSettlement: true 
//       }
//   } 
//   ,function (error, result) {
//     if(result) {
//       const order = new Order({
//         products: cart,
//         payment: result,
//         buyer: req.user._id
//       }).save()
//       res.json({ok:true})
//     } else {
//       res.status(500).send(error)
//     }
//   }

// )

//   } catch (error) {
//     throw new ApiError(500, 'Transaction failed');
//   }
// });

export const braintreeTokenController = asyncHandler(async (req, res) => {
    try {
      gateway.clientToken.generate({}, function(err, response){
        if(err) {
          res.status(500).send(err)
        } else {
          res.send(response)
        }
      });
    } catch (error) {
      throw new ApiError(500, 'Error generating client token');
    }
  });

export const braintreePaymentController = asyncHandler(async (req, res) => {
  const { nonce, amount } = req.body;
  const buyerId = req.user._id; // Assuming you attach user to the request in verifyJWT middleware

  if (!nonce || !amount || !buyerId) {
    throw new ApiError(400, 'Payment nonce, amount, and buyerId are required');
  }

  try {
    const result = await gateway.transaction.sale({
      amount,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });

    if (result.success) {
      const receipt = new PaymentReceipt({
        transactionId: result.transaction.id,
        amount: result.transaction.amount,
        buyerId,
      });

      await receipt.save();

      return res.status(200).json(new ApiResponse(200, { receipt }, 'Payment processed successfully'));
    } else {
      throw new ApiError(500, result.message || 'Payment failed');
    }
  } catch (error) {
    throw new ApiError(500, 'Payment processing failed');
  }
});
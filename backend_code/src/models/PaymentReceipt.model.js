// models/PaymentReceipt.js
import mongoose from 'mongoose';

const paymentReceiptSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  amount: { type: String, required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export const PaymentReceipt = mongoose.model('PaymentReceipt', paymentReceiptSchema);



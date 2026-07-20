import mongoose from 'mongoose';
import { MONGO_URI } from './config';

// ===== Schema =====
const TransactionSchema = new mongoose.Schema({
  txId: { type: String, required: true, unique: true, index: true },
  amount: { type: Number, required: true },
  amountReceived: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'paid', 'expired', 'refunded', 'overpaid'],
    default: 'pending',
  },
  fromAddress: { type: String },
  toAddress: { type: String, required: true },
  txHash: { type: String },
  confirmations: { type: Number, default: 0 },
  description: { type: String },
  customerEmail: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  callbackUrl: { type: String },
  redirectUrl: { type: String },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date },
});

export const Transaction =
  mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

// ===== Cached Connection (prevents duplicate connections in serverless) =====
let cached = (global as any).__mongoose;
if (!cached) cached = (global as any).__mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

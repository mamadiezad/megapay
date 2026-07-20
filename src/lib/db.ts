import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  txId: { type: String, required: true, unique: true, index: true },
  amount: { type: Number, required: true },
  amountReceived: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'paid', 'expired', 'refunded', 'overpaid'], default: 'pending' },
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

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

export async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  const { MONGO_URI } = await import('../lib/config');
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');
}

import mongoose from 'mongoose';
import { config } from './config';

// ===== Transaction =====
const TxSchema = new mongoose.Schema({
  txId: { type: String, required: true, unique: true, index: true },
  merchantId: { type: String, index: true },
  amount: { type: Number, required: true },
  amountReceived: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'paid', 'expired', 'overpaid', 'refunded'], default: 'pending', index: true },
  blockchain: { type: String, default: 'tron' },
  fromAddress: { type: String },
  toAddress: { type: String, required: true },
  txHash: { type: String },
  confirmations: { type: Number, default: 0 },
  description: { type: String },
  customerEmail: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  callbackUrl: { type: String },
  redirectUrl: { type: String },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  paidAt: { type: Date },
}, { timestamps: true });
TxSchema.index({ status: 1, expiresAt: 1 });
TxSchema.index({ merchantId: 1, createdAt: -1 });

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TxSchema);

// ===== Merchant =====
const MerchantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  wallets: [{
    address: { type: String, required: true },
    blockchain: { type: String, default: 'tron' },
    label: { type: String },
  }],
  apiKeys: [{
    key: { type: String, required: true },
    name: { type: String },
    isActive: { type: Boolean, default: true },
    lastUsed: { type: Date },
  }],
  webhookUrl: { type: String },
  isActive: { type: Boolean, default: true },
  totalPaid: { type: Number, default: 0 },
  totalTransactions: { type: Number, default: 0 },
}, { timestamps: true });

export const Merchant = mongoose.models.Merchant || mongoose.model('Merchant', MerchantSchema);

// ===== WebhookLog =====
const WebhookSchema = new mongoose.Schema({
  txId: { type: String, index: true },
  url: { type: String },
  status: { type: String, enum: ['success', 'failed', 'pending'] },
  responseCode: { type: Number },
  attempts: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 5 },
  nextRetryAt: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

export const WebhookLog = mongoose.models.WebhookLog || mongoose.model('WebhookLog', WebhookSchema);

// ===== Connection =====
let cached = (global as any).__mongo;
if (!cached) cached = (global as any).__mongo = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(config.mongo.uri).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export type PaymentStatus = 'pending' | 'paid' | 'expired' | 'refunded' | 'overpaid';

export interface ITransaction {
  _id: string;
  txId: string;           // Unique payment link ID
  amount: number;          // Amount in USDT
  amountReceived: number;  // Actual amount received
  status: PaymentStatus;
  fromAddress?: string;    // Payer wallet address
  toAddress: string;       // Merchant wallet
  txHash?: string;         // TRON transaction hash
  confirmations: number;
  description?: string;    // What the payment is for
  customerEmail?: string;
  metadata?: Record<string, any>;  // Custom data (e.g., order ID)
  callbackUrl?: string;    // Webhook URL for merchant
  redirectUrl?: string;    // URL to redirect after payment
  expiresAt: Date;
  createdAt: Date;
  paidAt?: Date;
}

export interface IWebhookLog {
  _id: string;
  txId: string;
  url: string;
  status: 'success' | 'failed';
  responseCode: number;
  attempts: number;
  createdAt: Date;
}

export interface IApiKey {
  _id: string;
  key: string;
  name: string;
  merchantWallet: string;
  isActive: boolean;
  createdAt: Date;
}

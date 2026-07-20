import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { connectDB, Transaction, Merchant } from '@/lib/db';
import { config } from '@/lib/config';
import { isValidTronAddress } from '@/lib/blockchain/tron';
import { Errors, errorResponse } from '@/lib/utils/errors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    const authKey = req.headers['x-api-key'] as string;
    const merchant = await Merchant.findOne({ 'apiKeys.key': authKey, 'apiKeys.isActive': true });
    if (!merchant) return res.status(401).json(Errors.INVALID_API_KEY);

    const { amount, blockchain = 'tron', description, callbackUrl, redirectUrl, metadata } = req.body;

    // Validate
    if (!amount || amount < config.payment.minAmount || amount > config.payment.maxAmount) {
      return res.status(400).json(Errors.INVALID_AMOUNT);
    }

    // Get default wallet for blockchain
    const walletEntry = merchant.wallets.find(w => w.blockchain === blockchain);
    const toAddress = req.body.wallet || walletEntry?.address;
    if (!toAddress) return res.status(400).json({ error: 'No wallet configured for ' + blockchain });
    if (!isValidTronAddress(toAddress)) return res.status(400).json(Errors.INVALID_ADDRESS);

    const txId = uuidv4().slice(0, 8).toUpperCase();
    const expiresAt = new Date(Date.now() + config.payment.expiryMinutes * 60 * 1000);

    await Transaction.create({
      txId, merchantId: merchant._id.toString(),
      amount, toAddress, blockchain: blockchain || 'tron',
      description: description || 'Payment', callbackUrl, redirectUrl,
      metadata: metadata || {}, expiresAt,
    });

    // Update merchant stats
    await Merchant.updateOne({ _id: merchant._id }, { $inc: { totalTransactions: 1 } });

    res.json({
      success: true,
      data: {
        txId, amount, toAddress, blockchain,
        expiresAt,
        paymentUrl: `${config.server.url}/pay/${txId}`,
        status: 'pending',
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(errorResponse(err));
  }
}

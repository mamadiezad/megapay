import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, Transaction } from '@/lib/db';
import { checkPayment } from '@/lib/blockchain';
import { Errors, errorResponse } from '@/lib/utils/errors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    await connectDB();
    const { txId } = req.query;
    if (!txId || typeof txId !== 'string') return res.status(400).json(Errors.INVALID_TXID);

    const tx = await checkPayment(txId);
    if (!tx) return res.status(404).json(Errors.TX_NOT_FOUND);

    // Check expiry
    if (tx.status === 'pending' && new Date() > tx.expiresAt) {
      tx.status = 'expired';
      await tx.save();
    }

    res.json({
      status: tx.status,
      tx: {
        txId: tx.txId, amount: tx.amount, amountReceived: tx.amountReceived,
        txHash: tx.txHash, blockchain: tx.blockchain,
      },
    });
  } catch (err) {
    res.status(500).json(errorResponse(err));
  }
}

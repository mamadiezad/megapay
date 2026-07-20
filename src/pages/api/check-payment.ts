import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, Transaction } from '@/lib/db';
import { getIncomingUsdtTransfers, fromSun } from '@/lib/tron';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  await connectDB();

  const { txId } = req.query;
  if (!txId || typeof txId !== 'string') return res.status(400).json({ error: 'Invalid txId' });

  const tx = await Transaction.findOne({ txId: txId.toUpperCase() });
  if (!tx) return res.status(404).json({ error: 'Transaction not found' });

  // If already paid, return
  if (tx.status === 'paid') {
    return res.json({ status: 'paid', tx: { txId: tx.txId, amount: tx.amount, amountReceived: tx.amountReceived } });
  }

  // Check if expired
  if (new Date() > tx.expiresAt && tx.status === 'pending') {
    tx.status = 'expired';
    await tx.save();
    return res.json({ status: 'expired' });
  }

  // Scan blockchain for incoming USDT
  try {
    const transfers = await getIncomingUsdtTransfers(tx.toAddress, tx.createdAt.getTime());
    
    for (const transfer of transfers) {
      const value = fromSun(transfer.value);
      if (value >= tx.amount && transfer.confirmed) {
        tx.status = value > tx.amount ? 'overpaid' : 'paid';
        tx.amountReceived = value;
        tx.txHash = transfer.tx_id;
        tx.fromAddress = transfer.from;
        tx.paidAt = new Date(transfer.block_timestamp);
        tx.confirmations = 1;
        await tx.save();

        // Fire webhook
        if (tx.callbackUrl) {
          fetch(tx.callbackUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              txId: tx.txId,
              status: tx.status,
              amount: tx.amount,
              amountReceived: tx.amountReceived,
              txHash: tx.txHash,
              fromAddress: tx.fromAddress,
            }),
          }).catch(() => {});
        }

        return res.json({ status: tx.status, tx });
      }
    }
  } catch (err) {
    console.error('TRON scan error:', err);
  }

  res.json({ status: 'pending', tx: { txId: tx.txId, amount: tx.amount } });
}

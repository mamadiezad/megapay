import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, Transaction } from '@/lib/db';
import { getIncomingUsdtTransfers, fromSun } from '@/lib/tron';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await connectDB();

  const { txId } = req.query;
  if (!txId || typeof txId !== 'string') {
    return res.status(400).json({ error: 'Invalid txId' });
  }

  const uid = txId.toUpperCase();
  const tx = await Transaction.findOne({ txId: uid });
  if (!tx) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  // Already paid — return immediately
  if (tx.status === 'paid' || tx.status === 'overpaid') {
    return res.json({
      status: tx.status,
      tx: {
        txId: tx.txId,
        amount: tx.amount,
        amountReceived: tx.amountReceived,
        txHash: tx.txHash,
      },
    });
  }

  // Check expiry
  if (new Date() > tx.expiresAt && tx.status === 'pending') {
    tx.status = 'expired';
    await tx.save();
    return res.json({ status: 'expired', expiresAt: tx.expiresAt });
  }

  // Scan TRON blockchain for incoming USDT
  try {
    const transfers = await getIncomingUsdtTransfers(
      tx.toAddress,
      tx.createdAt.getTime()
    );

    for (const transfer of transfers) {
      const value = fromSun(transfer.value);
      if (value < tx.amount) continue;
      if (!transfer.tx_id) continue;

      // Determine status
      const newStatus = value > tx.amount ? 'overpaid' : 'paid';

      // Update transaction
      tx.status = newStatus;
      tx.amountReceived = value;
      tx.txHash = transfer.tx_id;
      tx.fromAddress = transfer.from;
      tx.paidAt = new Date();
      tx.confirmations = 1;
      await tx.save();

      // Fire webhook asynchronously (don't block response)
      if (tx.callbackUrl) {
        fetch(tx.callbackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            txId: tx.txId,
            status: newStatus,
            amount: tx.amount,
            amountReceived: value,
            txHash: tx.txHash,
            fromAddress: tx.fromAddress,
          }),
        }).catch(() => {});
      }

      return res.json({
        status: newStatus,
        tx: {
          txId: tx.txId,
          amount: tx.amount,
          amountReceived: value,
          txHash: tx.txHash,
          fromAddress: tx.fromAddress,
        },
      });
    }
  } catch (err) {
    console.error('TRON scan error:', err);
  }

  return res.json({
    status: 'pending',
    tx: { txId: tx.txId, amount: tx.amount },
  });
}

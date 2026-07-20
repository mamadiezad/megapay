import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { connectDB, Transaction } from '@/lib/db';
import { API_KEY, SITE_URL } from '@/lib/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // API Key authentication
  const authKey = req.headers['x-api-key'];
  if (authKey !== API_KEY) return res.status(401).json({ error: 'Invalid API key' });

  await connectDB();

  const { amount, description, callbackUrl, redirectUrl, customerEmail, metadata, wallet } = req.body;

  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
  if (!wallet) return res.status(400).json({ error: 'Recipient wallet required' });

  const txId = uuidv4().slice(0, 8).toUpperCase();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes expiry

  const tx = await Transaction.create({
    txId,
    amount,
    toAddress: wallet,
    description: description || 'Payment',
    callbackUrl,
    redirectUrl,
    customerEmail,
    metadata: metadata || {},
    expiresAt,
  });

  res.json({
    success: true,
    data: {
      txId: tx.txId,
      amount: tx.amount,
      toAddress: tx.toAddress,
      expiresAt: tx.expiresAt,
      paymentUrl: `${SITE_URL}/pay/${tx.txId}`,
      status: tx.status,
    },
  });
}

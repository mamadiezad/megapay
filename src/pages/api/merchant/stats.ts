import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, Transaction, Merchant } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authKey = req.headers['x-api-key'] as string;
  await connectDB();
  const merchant = await Merchant.findOne({ 'apiKeys.key': authKey });
  if (!merchant) return res.status(401).json({ error: 'Unauthorized' });

  const [total, paid, volume] = await Promise.all([
    Transaction.countDocuments({ merchantId: merchant._id.toString() }),
    Transaction.countDocuments({ merchantId: merchant._id.toString(), status: 'paid' }),
    Transaction.aggregate([
      { $match: { merchantId: merchant._id.toString(), status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amountReceived' } } },
    ]),
  ]);

  res.json({ total, paid, volume: volume[0]?.total || 0, pending: total - paid });
}

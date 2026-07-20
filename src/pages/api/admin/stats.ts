import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, Transaction, Merchant } from '@/lib/db';
import { config } from '@/lib/config';
import { errorResponse } from '@/lib/utils/errors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers['x-admin-key'] !== config.auth.masterKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    await connectDB();
    const [totalTx, paidTx, totalMerchants, volume, todayTx, hourly] = await Promise.all([
      Transaction.countDocuments(),
      Transaction.countDocuments({ status: 'paid' }),
      Merchant.countDocuments(),
      Transaction.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amountReceived' } } },
      ]),
      Transaction.countDocuments({ createdAt: { $gte: new Date(Date.now() - 86400000) } }),
      Transaction.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 86400000) } } },
        { $group: { _id: { $hour: '$createdAt' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({
      totalTransactions: totalTx,
      paidTransactions: paidTx,
      totalMerchants,
      totalVolume: volume[0]?.total || 0,
      todayTransactions: todayTx,
      hourlyActivity: hourly.map((h: any) => ({ hour: h._id, count: h.count })),
    });
  } catch (err) {
    res.status(500).json(errorResponse(err));
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { connectDB, Merchant } from '@/lib/db';
import { config } from '@/lib/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const key = req.headers['x-master-key'];
  if (key !== config.auth.masterKey) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await connectDB();
    const { name, email, wallet, blockchain = 'tron' } = req.body;
    if (!name || !wallet) return res.status(400).json({ error: 'Name & wallet required' });

    const apiKey = 'mega_' + uuidv4().replace(/-/g, '').slice(0, 24);

    const merchant = await Merchant.create({
      name, email,
      wallets: [{ address: wallet, blockchain, label: 'Default' }],
      apiKeys: [{ key: apiKey, name: 'Default' }],
    });

    res.json({ success: true, merchantId: merchant._id, apiKey });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Multi-chain interface — TRON, BSC, Ethereum
import { config, BlockchainId } from '../config';
import { cacheGet, cacheSet } from '../cache';
import { isValidTronAddress } from './tron';

export interface TxCheck {
  hash: string;
  from: string;
  to: string;
  value: number;
  confirmed: boolean;
  timestamp: number;
}

export interface BlockchainProvider {
  name: string;
  getIncomingTxs(wallet: string, since: number): Promise<TxCheck[]>;
  isValidAddress(addr: string): boolean;
  explorerUrl(hash: string): string;
}

const providers: Partial<Record<BlockchainId, BlockchainProvider>> = {};

export async function getProvider(chain: BlockchainId): Promise<BlockchainProvider | null> {
  if (providers[chain]) return providers[chain]!;
  const bc = config.blockchains[chain];
  if (!bc.enabled) return null;

  if (chain === 'tron') {
    const { TronProvider } = await import('./tron');
    providers.tron = new TronProvider(bc);
  }
  // BSC & ETH providers can be added later
  return providers[chain] || null;
}

export async function checkPayment(txId: string) {
  const { connectDB, Transaction, Merchant } = await import('../db');
  await connectDB();
  const tx = await Transaction.findOne({ txId: txId.toUpperCase() });
  if (!tx) return null;
  if (tx.status === 'paid') return tx;

  const provider = await getProvider(tx.blockchain as BlockchainId);
  if (!provider) return tx;

  const cacheKey = `tx:${tx.toAddress}:${tx.blockchain}`;
  const cached = await cacheGet<TxCheck[]>(cacheKey);
  const txs = cached || await provider.getIncomingTxs(tx.toAddress, tx.createdAt.getTime());
  if (!cached) await cacheSet(cacheKey, txs, 15);

  for (const t of txs) {
    if (t.value >= tx.amount && t.confirmed) {
      tx.status = t.value > tx.amount ? 'overpaid' : 'paid';
      tx.amountReceived = t.value;
      tx.txHash = t.hash;
      tx.fromAddress = t.from;
      tx.paidAt = new Date();
      await tx.save();
      await fireWebhook(tx);
      return tx;
    }
  }
  return tx;
}

async function fireWebhook(tx: any) {
  if (!tx.callbackUrl) return;
  const payload = { txId: tx.txId, status: tx.status, amount: tx.amount, amountReceived: tx.amountReceived, txHash: tx.txHash };
  for (let i = 0; i < config.webhook.maxRetries; i++) {
    try {
      const res = await fetch(tx.callbackUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(config.webhook.retryDelayMs),
      });
      if (res.ok) return;
    } catch {}
    await new Promise(r => setTimeout(r, config.webhook.retryDelayMs * (i + 1)));
  }
}

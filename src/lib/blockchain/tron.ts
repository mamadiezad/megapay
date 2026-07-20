// TRON blockchain provider
import { TxCheck, BlockchainProvider } from './index';

interface Trc20Tx { tx_id: string; from: string; to: string; value: string; block_timestamp: number; confirmed: boolean; }

export function isValidTronAddress(addr: string): boolean {
  return /^T[a-zA-Z0-9]{33}$/.test(addr);
}

export class TronProvider implements BlockchainProvider {
  name = 'TRON';
  constructor(private bc: any) {}

  isValidAddress(addr: string): boolean { return isValidTronAddress(addr); }

  explorerUrl(hash: string): string { return `${this.bc.explorer}/tx/${hash}`; }

  async getIncomingTxs(wallet: string, since: number): Promise<TxCheck[]> {
    const params = new URLSearchParams({
      limit: '50', only_confirmed: 'true',
      contract_address: this.bc.usdtContract,
      min_timestamp: String(since),
    });
    try {
      const res = await fetch(`${this.bc.rpc}/v1/accounts/${wallet}/transactions/trc20?${params}`);
      const data = await res.json();
      if (!Array.isArray(data.data)) return [];
      return data.data
        .filter((tx: Trc20Tx) => tx.confirmed && tx.to === wallet)
        .map((tx: Trc20Tx) => ({
          hash: tx.tx_id, from: tx.from, to: tx.to,
          value: Number(tx.value) / 1_000_000,
          confirmed: tx.confirmed, timestamp: tx.block_timestamp,
        }));
    } catch { return []; }
  }
}

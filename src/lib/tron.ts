import { TRON_CONFIG } from './config';

const { TRON_GRID, USDT_CONTRACT } = TRON_CONFIG;

export interface Trc20Transaction {
  tx_id: string;
  from: string;
  to: string;
  value: string;
  block_timestamp: number;
  confirmed: boolean;
  token_info?: { symbol: string; decimals: number };
}

export async function getIncomingUsdtTransfers(
  walletAddress: string,
  sinceTimestamp?: number
): Promise<Trc20Transaction[]> {
  try {
    const params = new URLSearchParams({
      limit: '50',
      only_confirmed: 'true',
      contract_address: USDT_CONTRACT,
      ...(sinceTimestamp ? { min_timestamp: String(sinceTimestamp) } : {}),
    });

    const res = await fetch(
      `${TRON_GRID}/v1/accounts/${walletAddress}/transactions/trc20?${params}`
    );
    const data = await res.json();

    if (!data.data || !Array.isArray(data.data)) return [];

    // Filter only confirmed USDT transfers
    return data.data.filter((tx: Trc20Transaction) => {
      if (!tx.confirmed) return false;
      if (tx.to !== walletAddress) return false;
      return true;
    });
  } catch {
    return [];
  }
}

export function fromSun(sunValue: string): number {
  return Number(sunValue) / 1_000_000;
}

export function toSun(usdtValue: number): number {
  return Math.floor(usdtValue * 1_000_000);
}

export function isValidTronAddress(address: string): boolean {
  return /^T[a-zA-Z0-9]{33}$/.test(address);
}

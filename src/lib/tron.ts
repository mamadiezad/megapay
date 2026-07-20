// TRON blockchain utilities
const TRON_GRID = 'https://api.trongrid.io';
const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

export interface Trc20Transaction {
  tx_id: string;
  from: string;
  to: string;
  value: string;
  block_timestamp: number;
  confirmed: boolean;
}

// Check if a transaction exists on TRON blockchain
export async function checkTrc20Transaction(txHash: string): Promise<Trc20Transaction | null> {
  try {
    const res = await fetch(`${TRON_GRID}/v1/transactions/${txHash}`);
    const data = await res.json();
    return data.data?.[0] || null;
  } catch {
    return null;
  }
}

// Get TRC20 transfers for a wallet (incoming USDT)
export async function getIncomingUsdtTransfers(
  walletAddress: string,
  minTimestamp?: number
): Promise<Trc20Transaction[]> {
  const params = new URLSearchParams({
    limit: '50',
    only_confirmed: 'true',
    contract_address: USDT_CONTRACT,
    to_address: walletAddress,
    ...(minTimestamp ? { min_timestamp: String(minTimestamp) } : {}),
  });

  try {
    const res = await fetch(`${TRON_GRID}/v1/accounts/${walletAddress}/transactions/trc20?${params}`);
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

// Convert TRON sun/wei to USDT value
export function fromSun(sunValue: string): number {
  return Number(sunValue) / 1_000_000;
}

export function toSun(usdtValue: number): number {
  return Math.floor(usdtValue * 1_000_000);
}

// Validate TRON address
export function isValidTronAddress(address: string): boolean {
  return /^T[a-zA-Z0-9]{33}$/.test(address);
}

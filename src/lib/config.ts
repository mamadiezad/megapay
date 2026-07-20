// TRON Configuration
export const TRON_CONFIG = {
  // USDT Contract Address on TRON (TRC20)
  USDT_CONTRACT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  
  // TRON Grid API (no API key needed for basic queries)
  TRON_GRID: 'https://api.trongrid.io',
  
  // TRON Explorer
  TRON_EXPLORER: 'https://tronscan.org',
  
  // Default wallet address for receiving payments
  // !!! IMPORTANT: CHANGE THIS TO YOUR ACTUAL WALLET !!!
  MERCHANT_WALLET: process.env.NEXT_PUBLIC_MERCHANT_WALLET || '',
  
  // Confirmations required
  MIN_CONFIRMATIONS: 1,
};

export const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/megapay';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const API_KEY = process.env.API_SECRET_KEY || 'megapay-secret-key-change-me';

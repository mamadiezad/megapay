// TRON Configuration
export const TRON_CONFIG = {
  USDT_CONTRACT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  TRON_GRID: 'https://api.trongrid.io',
  TRON_EXPLORER: 'https://tronscan.org',
  MIN_CONFIRMATIONS: 1,
};

export const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/megapay';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const API_KEY = process.env.API_SECRET_KEY || 'megapay-secret-key-change-me';

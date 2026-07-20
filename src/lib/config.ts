export const config = {
  env: process.env.NODE_ENV || 'development',
  mongo: { uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/megapay' },
  redis: { url: process.env.REDIS_URL || 'redis://localhost:6379', enabled: !!process.env.REDIS_URL },
  server: { port: parseInt(process.env.PORT || '3000', 10), url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' },
  auth: {
    masterKey: process.env.API_SECRET_KEY || 'megapay-dev-key',
    jwtSecret: process.env.JWT_SECRET || 'megapay-jwt-secret',
  },
  payment: {
    expiryMinutes: parseInt(process.env.PAYMENT_EXPIRY_MINUTES || '30', 10),
    minAmount: parseFloat(process.env.MIN_AMOUNT || '1'),
    maxAmount: parseFloat(process.env.MAX_AMOUNT || '100000'),
  },
  webhook: {
    maxRetries: parseInt(process.env.WEBHOOK_MAX_RETRIES || '5', 10),
    retryDelayMs: parseInt(process.env.WEBHOOK_RETRY_DELAY || '5000', 10),
  },
  rateLimit: { windowMs: 60000, maxRequests: 100 },
  blockchains: {
    tron: {
      name: 'TRON', nativeToken: 'TRX',
      usdtContract: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      rpc: 'https://api.trongrid.io', explorer: 'https://tronscan.org',
      decimal: 6, enabled: true,
    },
    bsc: {
      name: 'BSC', nativeToken: 'BNB',
      usdtContract: '0x55d398326f99059fF775485246999027B3197955',
      rpc: process.env.BSC_RPC || '', explorer: 'https://bscscan.com',
      decimal: 18, enabled: !!process.env.BSC_RPC,
    },
    ethereum: {
      name: 'Ethereum', nativeToken: 'ETH',
      usdtContract: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      rpc: process.env.ETH_RPC || '', explorer: 'https://etherscan.io',
      decimal: 18, enabled: !!process.env.ETH_RPC,
    },
  },
};
export type BlockchainId = keyof typeof config.blockchains;

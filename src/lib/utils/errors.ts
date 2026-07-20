// Structured API errors

export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const Errors = {
  INVALID_API_KEY: new AppError('INVALID_API_KEY', 401, 'Invalid API key'),
  INVALID_AMOUNT: new AppError('INVALID_AMOUNT', 400, 'Amount must be between 1 and 100000 USDT'),
  INVALID_ADDRESS: new AppError('INVALID_ADDRESS', 400, 'Invalid blockchain address'),
  INVALID_TXID: new AppError('INVALID_TXID', 400, 'Invalid transaction ID'),
  TX_NOT_FOUND: new AppError('TX_NOT_FOUND', 404, 'Transaction not found'),
  RATE_LIMITED: new AppError('RATE_LIMITED', 429, 'Too many requests. Slow down.'),
  INTERNAL: new AppError('INTERNAL', 500, 'Internal server error'),
};

export function errorResponse(err: any) {
  if (err instanceof AppError) {
    return { error: err.message, code: err.code, details: err.details };
  }
  console.error('Unhandled:', err);
  return { error: 'Internal server error', code: 'INTERNAL' };
}

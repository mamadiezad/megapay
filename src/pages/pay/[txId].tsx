import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import QRCode from 'qrcode';

interface TxData {
  txId?: string;
  amount?: number;
  amountReceived?: number;
  toAddress?: string;
  txHash?: string;
  paymentUrl?: string;
  expiresAt?: string;
  description?: string;
  redirectUrl?: string;
}

export default function PayPage() {
  const router = useRouter();
  const rawTxId = router.query.txId;
  const txId = Array.isArray(rawTxId) ? rawTxId[0] : rawTxId || '';

  const [tx, setTx] = useState<TxData | null>(null);
  const [status, setStatus] = useState('loading');
  const [qrUrl, setQrUrl] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [done, setDone] = useState(false);

  const checkPayment = useCallback(async () => {
    if (!txId || done) return;
    try {
      const res = await fetch('/api/check-payment?txId=' + txId);
      const data = await res.json();
      const info = data.tx || data;
      setTx(info);
      setStatus(data.status);

      if (info.expiresAt && timeLeft === 0) {
        const expiry = new Date(info.expiresAt).getTime();
        setTimeLeft(Math.max(0, Math.floor((expiry - Date.now()) / 1000)));
      }

      if (data.status === 'paid' || data.status === 'overpaid') {
        setDone(true);
        if (info.redirectUrl) {
          setTimeout(() => { window.location.href = info.redirectUrl; }, 3000);
        }
      }
    } catch {
      setStatus('error');
    }
  }, [txId, done, timeLeft]);

  useEffect(() => {
    if (!txId) return;
    checkPayment();
    const interval = setInterval(checkPayment, 8000);
    return () => clearInterval(interval);
  }, [txId, checkPayment]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    if (tx?.toAddress && !qrUrl) {
      QRCode.toDataURL(tx.toAddress).then(setQrUrl).catch(() => {});
    }
  }, [tx?.toAddress, qrUrl]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e0e0e0', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Head><title>مگاپرداخت - پرداخت</title></Head>
      <div style={{ background: '#1e1e2e', border: '1px solid #313244', borderRadius: 16, padding: 32, maxWidth: 440, width: '100%', textAlign: 'center' }}>
        <h1 style={{ color: '#03a66d', margin: 0, fontSize: 24 }}>💳 مگاپرداخت</h1>
        <p style={{ color: '#a0a0b0', fontSize: 14 }}>درگاه پرداخت ارز دیجیتال</p>
        <div style={{ height: 1, background: '#313244', margin: '16px 0' }} />

        {status === 'loading' && <p>در حال بارگذاری...</p>}
        {status === 'error' && <p style={{ color: '#ef4444' }}>خطا در دریافت اطلاعات پرداخت</p>}

        {status === 'pending' && tx && (
          <>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#FFD700' }}>{tx.amount} USDT</div>
            <p style={{ color: '#a0a0b0' }}>{tx.description || 'پرداخت'}</p>
            <div style={{ background: '#11111b', borderRadius: 12, padding: 20, margin: '16px 0' }}>
              {qrUrl && <img src={qrUrl} style={{ width: 180, height: 180, margin: '0 auto', display: 'block' }} alt="QR" />}
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 12 }}>ارسال به آدرس:</div>
              <div style={{ fontSize: 12, background: '#0d1117', padding: 8, borderRadius: 8, wordBreak: 'break-all', marginTop: 4, color: '#22c55e' }}>{tx.toAddress}</div>
              <button onClick={() => navigator.clipboard.writeText(tx.toAddress || '')} style={{ background: '#03a66d', color: 'white', border: 'none', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', marginTop: 8 }}>کپی آدرس</button>
            </div>
            <div style={{ color: timeLeft < 120 ? '#ef4444' : '#a0a0b0' }}>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</div>
            <div style={{ height: 4, background: '#313244', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: (timeLeft > 0 ? (timeLeft / 1800) * 100 : 0) + '%', background: '#03a66d', transition: 'width 1s linear' }} />
            </div>
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 12 }}>منتظر واریز USDT (TRC20) هستیم...</p>
          </>
        )}

        {(status === 'paid' || status === 'overpaid') && (
          <div>
            <div style={{ fontSize: 48 }}>✅</div>
            <h2 style={{ color: '#22c55e' }}>پرداخت با موفقیت انجام شد!</h2>
            <p>{tx?.amountReceived} USDT دریافت شد.</p>
            {tx?.txHash && <p style={{ fontSize: 12, color: '#6b7280', wordBreak: 'break-all' }}>هش: {tx.txHash}</p>}
            {tx?.redirectUrl && <p style={{ fontSize: 13, color: '#a0a0b0' }}>در حال انتقال به فروشگاه...</p>}
          </div>
        )}

        {status === 'expired' && (
          <div>
            <div style={{ fontSize: 48 }}>⏰</div>
            <h2 style={{ color: '#ef4444' }}>مهلت پرداخت به پایان رسید</h2>
            <p style={{ color: '#a0a0b0' }}>برای پرداخت مجدد، دوباره اقدام کنید.</p>
          </div>
        )}
      </div>
    </div>
  );
}

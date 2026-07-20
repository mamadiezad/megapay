import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function PayPage() {
  const router = useRouter();
  const raw = router.query.txId;
  const txId = Array.isArray(raw) ? raw[0] : raw || '';
  const [tx, setTx] = useState<any>(null);
  const [status, setStatus] = useState('loading');
  const [qrUrl, setQrUrl] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [done, setDone] = useState(false);

  const check = useCallback(async () => {
    if (!txId || done) return;
    try {
      const r = await fetch('/api/payment/check?txId=' + txId);
      const d = await r.json();
      setTx(d.tx); setStatus(d.status);
      if (d.status === 'paid' || d.status === 'overpaid') { setDone(true); }
    } catch { setStatus('error'); }
  }, [txId, done]);

  useEffect(() => { if (!txId) return; check(); const i = setInterval(check, 8000); return () => clearInterval(i); }, [txId, check]);
  useEffect(() => { if (timeLeft <= 0) return; const i = setInterval(() => setTimeLeft(t => t - 1), 1000); return () => clearInterval(i); }, [timeLeft]);
  useEffect(() => {
    if (!tx?.toAddress || qrUrl) return;
    import('qrcode').then(Q => Q.default.toDataURL(tx.toAddress)).then(setQrUrl).catch(() => {});
  }, [tx?.toAddress, qrUrl]);

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e0e0e0', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Head><title>مگاپرداخت</title></Head>
      <div style={{ background: '#1e1e2e', borderRadius: 16, padding: 32, maxWidth: 440, width: '100%', textAlign: 'center' }}>
        <h1 style={{ color: '#03a66d', margin: 0, fontSize: 24 }}>💳 مگاپرداخت</h1>
        {status === 'loading' && <p>...</p>}
        {status === 'pending' && tx && (
          <>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#FFD700', margin: '16px 0' }}>{tx.amount} USDT</div>
            {qrUrl && <img src={qrUrl} style={{ width: 160, height: 160, margin: '0 auto', display: 'block' }} alt="QR" />}
            <div style={{ background: '#0d1117', borderRadius: 8, padding: 12, fontSize: 12, color: '#22c55e', wordBreak: 'break-all' }}>{tx.toAddress}</div>
            <button onClick={() => navigator.clipboard.writeText(tx.toAddress)} style={{ background: '#03a66d', color: 'white', border: 'none', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', marginTop: 8 }}>کپی</button>
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 12 }}>منتظر واریز USDT (TRC20)...</p>
          </>
        )}
        {(status === 'paid' || status === 'overpaid') && <><div style={{ fontSize: 48 }}>✅</div><h2 style={{ color: '#22c55e' }}>پرداخت شد!</h2></>}
        {status === 'expired' && <><div style={{ fontSize: 48 }}>⏰</div><h2 style={{ color: '#ef4444' }}>منقضی شد</h2></>}
      </div>
    </div>
  );
}

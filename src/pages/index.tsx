import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [amount, setAmount] = useState(10);
  const [wallet, setWallet] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const API_KEY = 'megapay-dev-key';

  async function createTest() {
    if (!wallet) { setResult('آدرس کیف پول را وارد کنید'); return; }
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify({ amount: Number(amount), wallet, description: 'پرداخت تستی' }),
      });
      const data = await res.json();
      if (data.success) setResult('✅ لینک: ' + data.data.paymentUrl);
      else setResult('❌ ' + (data.error || 'خطا'));
    } catch { setResult('❌ خطا در ارتباط'); }
    setLoading(false);
  }

  return (
    <div style={{ background: '#0d1117', color: '#e0e0e0', minHeight: '100vh' }}>
      <Head><title>مگاپرداخت — درگاه پرداخت USDT</title></Head>
      <nav style={{ borderBottom: '1px solid #313244', padding: 16, maxWidth: 800, margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#03a66d', fontWeight: 700, fontSize: 20 }}>💳 مگاپرداخت</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="#docs" style={{ color: '#a0a0b0', textDecoration: 'none', fontSize: 14 }}>مستندات</a>
          <a href="/admin" style={{ color: '#a0a0b0', textDecoration: 'none', fontSize: 14 }}>پنل</a>
          <a href="https://t.me/llllxyz" style={{ color: '#03a66d', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>پشتیبانی</a>
        </div>
      </nav>

      <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>
          درگاه پرداخت <span style={{ color: '#03a66d' }}>USDT</span>
        </h1>
        <p style={{ color: '#a0a0b0', fontSize: 18, lineHeight: 1.8 }}>
          دریافت پرداخت ارز دیجیتال بدون تحریم، بدون بانک، بدون محدودیت.
        </p>
      </div>

      <div id="docs" style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px 40px' }}>
        <div style={{ background: '#1e1e2e', borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <h2 style={{ color: '#03a66d' }}>تست آنلاین</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
            <input placeholder="مبلغ USDT" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} style={inputS} />
            <input placeholder="آدرس کیف پول TRON" value={wallet} onChange={e => setWallet(e.target.value)} style={{ ...inputS, flex: 1 }} />
            <button onClick={createTest} disabled={loading} style={btnS}>{loading ? '⏳' : '🔗 ایجاد لینک'}</button>
          </div>
          {result && <div style={{ marginTop: 12, fontSize: 14, color: result.includes('✅') ? '#22c55e' : '#ef4444', wordBreak: 'break-all' }}>{result}</div>}
        </div>

        <div style={{ background: '#1e1e2e', borderRadius: 12, padding: 24 }}>
          <h2 style={{ color: '#03a66d' }}>API — ایجاد لینک پرداخت</h2>
          <pre style={{ background: '#0d1117', padding: 16, borderRadius: 8, marginTop: 12, fontSize: 13, direction: 'ltr', textAlign: 'left', overflow: 'auto' }}>
            POST /api/payment/create
            x-api-key: YOUR_API_KEY
            {'{ "amount": 50, "wallet": "T...", "description": "Order #123" }'}
          </pre>
        </div>
      </div>
    </div>
  );
}

const inputS: any = { background: '#11111b', border: '1px solid #313244', borderRadius: 8, padding: '10px 14px', color: '#e0e0e0', };
const btnS: any = { background: '#03a66d', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, };

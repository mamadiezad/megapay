import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [masterKey, setMasterKey] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [merchantWallet, setMerchantWallet] = useState('');
  const [newApiKey, setNewApiKey] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats', { headers: { 'x-admin-key': prompt('Master Key:') || '' } })
      .then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  async function registerMerchant() {
    const res = await fetch('/api/merchant/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-master-key': masterKey || 'megapay-dev-key' },
      body: JSON.stringify({ name: merchantName, wallet: merchantWallet }),
    });
    const data = await res.json();
    if (data.apiKey) setNewApiKey(data.apiKey);
  }

  return (
    <div style={{ background: '#0d1117', color: '#e0e0e0', minHeight: '100vh', padding: 24 }}>
      <Head><title>مگاپرداخت - پنل مدیریت</title></Head>
      <h1 style={{ color: '#03a66d' }}>پنل مدیریت مگاپرداخت</h1>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 12, margin: '20px 0' }}>
          <Card label="کل تراکنش‌ها" value={stats.totalTransactions} />
          <Card label="پرداخت شده" value={stats.paidTransactions} />
          <Card label="حجم (USDT)" value={stats.totalVolume.toFixed(2)} />
          <Card label="امروز" value={stats.todayTransactions} />
          <Card label="مرچنت‌ها" value={stats.totalMerchants} />
        </div>
      )}

      <div style={{ background: '#1e1e2e', borderRadius: 12, padding: 24, marginTop: 24 }}>
        <h2>ثبت فروشنده جدید</h2>
        <input placeholder="نام فروشگاه" value={merchantName} onChange={e => setMerchantName(e.target.value)}
          style={inputStyle} />
        <input placeholder="آدرس کیف پول TRON" value={merchantWallet} onChange={e => setMerchantWallet(e.target.value)}
          style={inputStyle} />
        <input placeholder="Master Key" value={masterKey} onChange={e => setMasterKey(e.target.value)}
          style={inputStyle} />
        <button onClick={registerMerchant} style={btnStyle}>ثبت فروشنده</button>
        {newApiKey && (
          <div style={{ background: '#0d1117', padding: 16, borderRadius: 8, marginTop: 12, direction: 'ltr', textAlign: 'left' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>API Key جدید:</div>
            <code style={{ color: '#22c55e' }}>{newApiKey}</code>
            <button onClick={() => navigator.clipboard.writeText(newApiKey)}
              style={{ ...btnStyle, marginTop: 8, padding: '6px 16px', fontSize: 13 }}>کپی</button>
          </div>
        )}
      </div>

      <div style={{ background: '#1e1e2e', borderRadius: 12, padding: 24, marginTop: 24 }}>
        <h2>نرخ‌ها و محدودیت‌ها</h2>
        <p>حداقل پرداخت: 1 USDT | حداکثر: 100,000 USDT</p>
        <p>انقضای لینک: 30 دقیقه | تاییدیه: 1 confirmation</p>
        <p>بلاکچین‌های فعال: TRON (USDT)</p>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: any }) {
  return (
    <div style={{ background: '#1e1e2e', border: '1px solid #313244', borderRadius: 12, padding: 20, textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#03a66d', marginTop: 4 }}>{value ?? '—'}</div>
    </div>
  );
}

const inputStyle: any = {
  background: '#11111b', border: '1px solid #313244', borderRadius: 8,
  padding: '10px 14px', color: '#e0e0e0', width: '100%', marginBottom: 12, display: 'block',
};
const btnStyle: any = {
  background: '#03a66d', color: 'white', border: 'none', padding: '10px 24px',
  borderRadius: 8, cursor: 'pointer', fontWeight: 600,
};

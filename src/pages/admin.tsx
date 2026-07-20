import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [stats, setStats] = useState<Record<string,any>|null>(null);
  const [masterKey, setMasterKey] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [merchantWallet, setMerchantWallet] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = prompt('Master Key:') || '';
    setMasterKey(key);
    fetch('/api/admin/stats', { headers: { 'x-admin-key': key } })
      .then(r => r.json()).then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function registerMerchant() {
    const res = await fetch('/api/merchant/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-master-key': masterKey },
      body: JSON.stringify({ name: merchantName, wallet: merchantWallet }),
    });
    const data = await res.json();
    if (data.apiKey) setNewApiKey(data.apiKey);
    else alert('Error: ' + (data.error || 'Unknown'));
  }

  return (
    <div style={{ background: '#0d1117', color: '#e0e0e0', minHeight: '100vh', padding: 24 }}>
      <Head><title>مگاپرداخت - پنل مدیریت</title></Head>
      <h1 style={{ color: '#03a66d' }}>💳 پنل مدیریت مگاپرداخت</h1>
      {loading && <p style={{ color: '#a0a0b0' }}>در حال بارگذاری...</p>}
      {stats && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 12, margin: '20px 0' }}>
            <Card label="کل تراکنش‌ها" value={stats.totalTransactions} />
            <Card label="پرداخت شده" value={stats.paidTransactions} />
            <Card label="حجم (USDT)" value={(stats.totalVolume || 0).toFixed(2)} />
            <Card label="امروز" value={stats.todayTransactions} />
            <Card label="فروشنده‌ها" value={stats.totalMerchants} />
          </div>
          <div style={{ background: '#1e1e2e', borderRadius: 12, padding: 24 }}>
            <h2>فعالیت ۲۴ ساعت</h2>
            <div style={{ display: 'flex', gap: 2, marginTop: 16, minHeight: 100, alignItems: 'flex-end' }}>
              {(stats.hourlyActivity || []).map((h: any) => (
                <div key={h.hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '100%', height: Math.max(4, h.count * 20), background: '#03a66d', borderRadius: '4px 4px 0 0' }} />
                  <span style={{ fontSize: 9, color: '#6b7280' }}>{h.hour}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      <div style={{ background: '#1e1e2e', borderRadius: 12, padding: 24, marginTop: 24 }}>
        <h2>ثبت فروشنده جدید</h2>
        <input placeholder="نام فروشگاه" value={merchantName} onChange={e => setMerchantName(e.target.value)} style={s} />
        <input placeholder="آدرس کیف پول TRON" value={merchantWallet} onChange={e => setMerchantWallet(e.target.value)} style={s} />
        <button onClick={registerMerchant} style={b}>ثبت</button>
        {newApiKey && (
          <div style={{ background: '#0d1117', padding: 16, borderRadius: 8, marginTop: 12 }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>API Key:</div>
            <code style={{ color: '#22c55e', fontSize: 13 }}>{newApiKey}</code>
          </div>
        )}
      </div>
    </div>
  );
}
function Card({ label, value }: { label: string; value: any }) {
  return <div style={{ background: '#1e1e2e', border: '1px solid #313244', borderRadius: 12, padding: 20, textAlign: 'center' }}>
    <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: '#03a66d', marginTop: 4 }}>{value ?? '-'}</div>
  </div>;
}
const s: any = { background: '#11111b', border: '1px solid #313244', borderRadius: 8, padding: '10px 14px', color: '#e0e0e0', width: '100%', marginBottom: 12, display: 'block', boxSizing: 'border-box' };
const b: any = { background: '#03a66d', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 };

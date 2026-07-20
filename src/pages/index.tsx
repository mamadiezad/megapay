import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [testAmount, setTestAmount] = useState(10);
  const [testWallet, setTestWallet] = useState('');
  const [testResult, setTestResult] = useState('');

  async function createTestPayment() {
    if (!testWallet) { setTestResult('لطفا آدرس کیف پول TRON را وارد کنید'); return; }
    setTestResult('در حال ایجاد...');
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': 'megapay-secret-key-change-me' },
        body: JSON.stringify({ amount: Number(testAmount), description: 'پرداخت تستی', wallet: testWallet }),
      });
      const data = await res.json();
      if (data.success) setTestResult('لینک پرداخت: ' + data.data.paymentUrl);
      else setTestResult('خطا: ' + JSON.stringify(data));
    } catch (e: any) { setTestResult('خطا: ' + e.message); }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e0e0e0' }}>
      <Head><title>مگاپرداخت - درگاه پرداخت USDT</title></Head>
      <nav style={{ borderBottom: '1px solid #313244', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 800, margin: '0 auto' }}>
        <span style={{ color: '#03a66d', fontWeight: 700, fontSize: 20 }}>مگاپرداخت</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="#features" style={{ color: '#a0a0b0', textDecoration: 'none', fontSize: 14 }}>امکانات</a>
          <a href="#api" style={{ color: '#a0a0b0', textDecoration: 'none', fontSize: 14 }}>API</a>
          <a href="https://t.me/llllxyz" style={{ color: '#03a66d', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>پشتیبانی</a>
        </div>
      </nav>
      <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>درگاه پرداخت <span style={{ color: '#03a66d' }}>USDT</span></h1>
        <p style={{ color: '#a0a0b0', fontSize: 18, lineHeight: 1.8 }}>دریافت پرداخت ارز دیجیتال بدون تحریم، بدون کارمزد بالا، بدون محدودیت. مناسب برای کسب و کارهای ایرانی.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
          <a href="#api" style={{ background: '#03a66d', color: 'white', padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>مستندات API</a>
          <a href="https://github.com/mamadiezad/megapay" style={{ border: '1px solid #313244', color: '#e0e0e0', padding: '12px 28px', borderRadius: 8, textDecoration: 'none' }}>سورس کد</a>
        </div>
      </div>
      <div id="features" style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 32 }}>امکانات</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[{emoji:'🔗',title:'لینک پرداخت',desc:'ایجاد لینک پرداخت با یک API call'},{emoji:'🔔',title:'Webhook',desc:'اعلام خودکار پس از واریز'},{emoji:'📱',title:'QR Code',desc:'نمایش QR برای واریز آسان'},{emoji:'⏱',title:'انقضا خودکار',desc:'لینک های پرداخت با زمان محدود'},{emoji:'🔒',title:'غیرحضانتی',desc:'پول مستقیم به کیف پول شما میره'},{emoji:'📦',title:'داکر',desc:'قابل نصب روی هر سروری'}].map((f,i)=>(
            <div key={i} style={{background:'#1e1e2e',border:'1px solid #313244',borderRadius:12,padding:20,textAlign:'center'}}>
              <div style={{fontSize:32}}>{f.emoji}</div>
              <h3 style={{fontSize:14,margin:'8px 0 4px'}}>{f.title}</h3>
              <p style={{fontSize:12,color:'#a0a0b0',margin:0}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div id="api" style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 32 }}>API</h2>
        <div style={{ background: '#1e1e2e', border: '1px solid #313244', borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: '#03a66d' }}>ایجاد لینک پرداخت</h3>
          <div style={{ background: '#0d1117', padding: 16, borderRadius: 8, marginTop: 12, fontSize: 13, direction: 'ltr', textAlign: 'left' }}>
            <span style={{ color: '#22c55e' }}>POST</span> /api/create-payment<br/>x-api-key: your_key<br/>{'{"amount":50,"wallet":"TYourWallet...","description":"Order #123"}'}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px 80px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 16 }}>تست سریع</h2>
        <p style={{ textAlign: 'center', color: '#a0a0b0', marginBottom: 24 }}>یه لینک پرداخت آزمایشی بساز</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <input type="number" placeholder="مبلغ (USDT)" value={testAmount} onChange={e => setTestAmount(Number(e.target.value))}
            style={{ background: '#1e1e2e', border: '1px solid #313244', borderRadius: 8, padding: '10px 16px', color: '#e0e0e0', width: 150 }} />
          <input placeholder="آدرس کیف پول TRON" value={testWallet} onChange={e => setTestWallet(e.target.value)}
            style={{ background: '#1e1e2e', border: '1px solid #313244', borderRadius: 8, padding: '10px 16px', color: '#e0e0e0', width: 300 }} />
          <button onClick={createTestPayment}
            style={{ background: '#03a66d', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer' }}>ایجاد لینک</button>
        </div>
        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 14 }}>{testResult}</div>
      </div>
    </div>
  );
}

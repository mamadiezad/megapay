import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e0e0e0' }}>
      <Head><title>مگاپرداخت — درگاه پرداخت USDT</title></Head>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #313244', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 800, margin: '0 auto' }}>
        <span style={{ color: '#03a66d', fontWeight: 700, fontSize: 20 }}>💳 مگاپرداخت</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="#features" style={{ color: '#a0a0b0', textDecoration: 'none', fontSize: 14 }}>امکانات</a>
          <a href="#api" style={{ color: '#a0a0b0', textDecoration: 'none', fontSize: 14 }}>API</a>
          <a href="https://t.me/llllxyz" style={{ color: '#03a66d', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>پشتیبانی</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>
          درگاه پرداخت <span style={{ color: '#03a66d' }}>USDT</span>
        </h1>
        <p style={{ color: '#a0a0b0', fontSize: 18, lineHeight: 1.8 }}>
          دریافت پرداخت ارز دیجیتال بدون تحریم، بدون کارمزد بالا، بدون محدودیت.
          مناسب برای کسب‌وکارهای ایرانی.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
          <a href="#api" style={{ background: '#03a66d', color: 'white', padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
            مستندات API
          </a>
          <a href="https://github.com/mamadiezad/megapay" style={{ border: '1px solid #313244', color: '#e0e0e0', padding: '12px 28px', borderRadius: 8, textDecoration: 'none' }}>
            سورس کد
          </a>
        </div>
      </div>

      {/* Features */}
      <div id="features" style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 32 }}>✨ امکانات</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { emoji: '🔗', title: 'لینک پرداخت', desc: 'ایجاد لینک پرداخت با یک API call' },
            { emoji: '🔔', title: 'Webhook', desc: 'اعلام خودکار پس از واریز' },
            { emoji: '📱', title: 'QR Code', desc: 'نمایش QR برای واریز آسان' },
            { emoji: '⏱', title: 'انقضا خودکار', desc: 'لینک‌های پرداخت با زمان محدود' },
            { emoji: '🔒', title: 'غیرحضانتی', desc: 'پول مستقیم به کیف پول شما میره' },
            { emoji: '📦', title: 'داکر', desc: 'قابل نصب روی هر سروری' },
          ].map((f, i) => (
            <div key={i} style={{ background: '#1e1e2e', border: '1px solid #313244', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 32 }}>{f.emoji}</div>
              <h3 style={{ fontSize: 14, margin: '8px 0 4px' }}>{f.title}</h3>
              <p style={{ fontSize: 12, color: '#a0a0b0', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* API */}
      <div id="api" style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 32 }}>🔌 API</h2>
        <div style={{ background: '#1e1e2e', border: '1px solid #313244', borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: '#03a66d' }}>ایجاد لینک پرداخت</h3>
          <div style={{ background: '#0d1117', padding: 16, borderRadius: 8, marginTop: 12, fontSize: 13, direction: 'ltr', textAlign: 'left' }}>
            <span style={{ color: '#22c55e' }}>POST</span> /api/create-payment<br/>
            <br/>
            <span style={{ color: '#6b7280' }}>// Header</span><br/>
            x-api-key: your_api_key<br/>
            <br/>
            <span style={{ color: '#6b7280' }}>// Body</span><br/>
            {'{'}
            <br/>&nbsp;&nbsp;amount: 50,<br/>
            &nbsp;&nbsp;wallet: "TYourWallet...",<br/>
            &nbsp;&nbsp;description: "سفارش #123",<br/>
            &nbsp;&nbsp;callbackUrl: "https://sitename.com/webhook",<br/>
            &nbsp;&nbsp;redirectUrl: "https://sitename.com/success"<br/>
            {'}'}
          </div>
          <p style={{ fontSize: 13, color: '#a0a0b0', marginTop: 12 }}>
            پاسخ شامل لینک پرداخت، آدرس کیف پول و QR کد است. مشتری رو بفرستید به لینک پرداخت، خودش واریز میکنه.
          </p>
        </div>
      </div>

      {/* Quick test */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px 80px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 16 }}>🧪 تست سریع</h2>
        <p style={{ textAlign: 'center', color: '#a0a0b0', marginBottom: 24 }}>
          یه لینک پرداخت آزمایشی بساز و ببین چجوری کار میکنه
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <input id="testAmount" type="number" placeholder="مبلغ (USDT)" defaultValue={10}
            style={{ background: '#1e1e2e', border: '1px solid #313244', borderRadius: 8, padding: '10px 16px', color: '#e0e0e0', width: 150 }} />
          <input id="testWallet" placeholder="آدرس کیف پول (TRON)"
            style={{ background: '#1e1e2e', border: '1px solid #313244', borderRadius: 8, padding: '10px 16px', color: '#e0e0e0', width: 300 }} />
          <button onClick={createTestPayment}
            style={{ background: '#03a66d', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer' }}>
            ایجاد لینک
          </button>
        </div>
        <div id="testResult" style={{ marginTop: 16, textAlign: 'center', fontSize: 14, color: '#a0a0b0' }}></div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          async function createTestPayment() {
            const amount = document.getElementById('testAmount').value;
            const wallet = document.getElementById('testWallet').value;
            const result = document.getElementById('testResult');
            if (!wallet) { result.textContent = 'لطفاً آدرس کیف پول TRON را وارد کنید'; return; }
            result.textContent = 'در حال ایجاد...';
            try {
              const res = await fetch('/api/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': 'megapay-secret-key-change-me' },
                body: JSON.stringify({ amount: Number(amount), description: 'پرداخت تستی', wallet }),
              });
              const data = await res.json();
              if (data.success) {
                result.innerHTML = '<a href="' + data.data.paymentUrl + '" target="_blank" style="color:#03a66d;font-size:16px;font-weight:600;">🔗 ' + data.data.paymentUrl + '</a>';
              } else {
                result.textContent = 'خطا: ' + JSON.stringify(data);
              }
            } catch(e) {
              result.textContent = 'خطا: ' + e.message;
            }
          }
        `
      }} />
    </div>
  );
}

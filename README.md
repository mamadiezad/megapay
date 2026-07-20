# 💳 مگاپرداخت — MegaPay Crypto Payment Gateway

> **درگاه پرداخت ارز دیجیتال USDT برای کسب‌وکارهای ایرانی**
> MegaPay — Accept USDT payments without banks, sanctions, or high fees.

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs)](https://nextjs.org)
[![TRON](https://img.shields.io/badge/TRON-USDT-FF6B2B?logo=tron)](https://tron.network)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## ✨ قابلیت‌ها

| قابلیت | توضیح |
|--------|-------|
| 🔗 **لینک پرداخت** | با یک API call لینک پرداخت بسازید |
| 💳 **USDT (TRC20)** | دریافت تتر بدون کارمزد بالا |
| 📱 **QR Code** | اسکن و واریز آسان |
| 🔔 **Webhook** | پس از واریز، به سرور شما اعلام می‌شود |
| ⏱ **انقضای خودکار** | لینک‌های پرداخت با زمان محدود |
| 🔒 **غیرحضانتی** | پول مستقیم به کیف پول شما واریز می‌شود |
| 🐳 **داکر** | قابل نصب روی سرور شخصی |

---

## 🚀 شروع سریع

```bash
git clone https://github.com/mamadiezad/megapay.git
cd megapay
npm install
npm run dev
```

### تنظیمات `.env.local`

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/megapay
NEXT_PUBLIC_SITE_URL=http://localhost:3000
API_SECRET_KEY=your-secret-key-here
```

### ایجاد لینک پرداخت

```bash
curl -X POST http://localhost:3000/api/create-payment \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-key" \
  -d '{"amount": 50, "wallet": "TYourTronWallet..."}'
```

پاسخ:
```json
{
  "success": true,
  "data": {
    "txId": "ABC12345",
    "paymentUrl": "http://localhost:3000/pay/ABC12345",
    "amount": 50,
    "toAddress": "TYourTronWallet..."
  }
}
```

---

## 📁 ساختار پروژه

```
megapay/
├── src/
│   ├── lib/
│   │   ├── config.ts       # تنظیمات
│   │   ├── db.ts           # مدل دیتابیس
│   │   └── tron.ts         # اتصال به TRON
│   ├── pages/
│   │   ├── index.tsx        # صفحه اصلی
│   │   ├── pay/[txId].tsx  # صفحه پرداخت
│   │   └── api/
│   │       ├── create-payment.ts  # API ایجاد پرداخت
│   │       └── check-payment.ts   # بررسی وضعیت
│   └── types/index.ts
├── package.json
└── README.md
```

---

## 🐳 Docker

```bash
docker build -t megapay .
docker run -p 3000:3000 megapay
```

---

## 🔗 ریپوهای مرتبط
- [🤖 ربات چت ناشناس](https://github.com/mamadiezad/robot-chat-nashnas)
- [🤖 AI Sales Bot](https://github.com/mamadiezad/ai-business-sales-bot)

---

## 📜 لایسنس
**MIT**

---

<p align="center">ساخته شده با ❤️ توسط <a href="https://github.com/mamadiezad">Mohammad</a></p>

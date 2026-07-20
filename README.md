# 💳 مگاپرداخت (MegaPay) v2.0

> **درگاه پرداخت ارز دیجیتال** — دریافت USDT روی TRON (بزودی BSC, ETH)
> Persian Crypto Payment Gateway — production-ready, scalable, self-hosted

## ✨ ویژگی‌ها

| ویژگی | توضیح |
|:------|:-------|
| 🔗 **لینک پرداخت** | ایجاد با یک API call |
| 💳 **USDT (TRC20)** | پشتیبانی از تتر روی ترون |
| 📱 **QR Code** | اسکن و واریز |
| 🔔 **Webhook** | اعلام خودکار با Retry |
| 🏪 **چند فروشنده** | API Key مجزا برای هر کسب و کار |
| 📊 **داشبورد مدیریت** | آمار لحظه‌ای، ثبت فروشنده |
| ⏱ **انقضای خودکار** | لینک‌های موقت |
| 🔒 **غیرحضانتی** | پول مستقیم به کیف پول شما می‌ره |
| 🐳 **داکر** | قابل نصب روی هر سروری |

## 🚀 شروع سریع

```bash
git clone https://github.com/mamadiezad/megapay.git
cd megapay
npm install

# تنظیم .env.local
cp .env.example .env.local

# اجرا
npm run dev
```

## 🐳 اجرا با داکر

```bash
docker-compose up --build
```

## 🔌 API

### ایجاد لینک پرداخت
```bash
POST /api/payment/create
x-api-key: YOUR_API_KEY

{
  "amount": 50,
  "wallet": "TYourTronWallet...",
  "description": "سفارش #123",
  "callbackUrl": "https://site.com/webhook",
  "redirectUrl": "https://site.com/success"
}
```

### بررسی وضعیت
```bash
GET /api/payment/check?txId=ABC12345
```

### ثبت فروشنده (مدیریت)
```bash
POST /api/merchant/register
x-master-key: YOUR_MASTER_KEY

{ "name": "فروشگاه من", "wallet": "T..." }
```

## 📁 ساختار

```
megapay/
├── src/
│   ├── lib/
│   │   ├── config.ts         # تنظیمات
│   │   ├── db.ts             # MongoDB (Transaction, Merchant)
│   │   ├── cache.ts          # Redis (اختیاری)
│   │   ├── blockchain/
│   │   │   ├── index.ts      # Multi-chain interface
│   │   │   └── tron.ts       # TRON provider
│   │   └── utils/
│   │       ├── errors.ts     # خطاهای ساختاریافته
│   │       └── logger.ts     # لاگر
│   ├── pages/
│   │   ├── index.tsx         # صفحه اصلی
│   │   ├── admin.tsx         # پنل مدیریت
│   │   └── api/
│   │       ├── payment/
│   │       │   ├── create.ts # ایجاد پرداخت
│   │       │   └── check.ts  # بررسی وضعیت
│   │       ├── merchant/
│   │       │   ├── register.ts # ثبت فروشنده
│   │       │   └── stats.ts    # آمار فروشنده
│   │       └── admin/
│   │           └── stats.ts    # آمار کل
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── README.md
```

## 🎯 مسیر بعدی
- [x] TRON (USDT)
- [ ] BSC (USDT/BUSD)
- [ ] Ethereum (USDT)
- [ ] Webhook Retry Queue
- [ ] Admin Dashboard کامل
- [ ] Merchant Dashboard
- [ ] Rate Limiting
- [ ] Redis Caching

## 📜 لایسنس
MIT

<p align="center">Built with ❤️ by <a href="https://github.com/mamadiezad">Mohammad</a></p>

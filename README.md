# 💳 مگاپرداخت (MegaPay) v2.0 — Crypto Payment Gateway

> **درگاه پرداخت ارز دیجیتال USDT** برای کسب‌وکارهای ایرانی و بین‌المللی  
> **خودت میزبان باش** — بدون تحریم، بدون کارمزد بالا، بدون محدودیت  
> Persian Crypto Payment Gateway — production-ready, scalable, self-hosted

<p align="center">
  <img src="https://raw.githubusercontent.com/mamadiezad/megapay/main/public/banner.jpg" alt="مگاپرداخت" width="100%%" style="border-radius: 12px;" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis" />
  <img src="https://img.shields.io/badge/TRON-USDT-FF6B2B?style=for-the-badge&logo=tron" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker" />
</p>

---

## 🎯 معرفی

**مگاپرداخت** یک درگاه پرداخت ارز دیجیتال **self-hosted** است. کسب‌وکارها بدون نیاز به بانک USDT دریافت می‌کنند.

| مشکل | راه حل |
|:-----|:-------|
| تحریم‌های بانکی | پرداخت مستقیم USDT |
| کارمزد بالا | کارمزد نزدیک صفر |
| محدودیت مبلغ | ۱ تا ۱۰۰,۰۰۰ USDT |

---

## ✨ امکانات v2.0

- 💳 **لینک پرداخت** — ایجاد با یک API call
- 💲 **USDT (TRC20)** — تتر روی شبکه TRON
- 📱 **QR Code** — واریز سریع
- 🔔 **Webhook** — اعلام خودکار با Retry
- 🏪 **سیستم فروشندگان** — API Key مجزا برای هر کسب‌وکار
- 📊 **پنل مدیریت** — آمار لحظه‌ای، ثبت فروشنده، نمودار
- 🐳 **Docker** — آماده اجرا با docker-compose
- ⚡ **Redis** — کش اختیاری
- 🔄 **Multi-chain** — آماده برای BSC و ETH

---

## 🚀 شروع سریع

```bash
git clone https://github.com/mamadiezad/megapay.git
cd megapay
npm install
cp .env.example .env.local
npm run dev
```

**یا با Docker:**
```bash
docker-compose up --build
```

---

## 🔌 API

### ایجاد لینک پرداخت
```bash
POST /api/payment/create
x-api-key: YOUR_KEY
{"amount":50,"wallet":"TYourWallet..."}
```

### بررسی وضعیت
```bash
GET /api/payment/check?txId=ABC123
```

---

## 📁 ساختار

```
megapay/
├── src/lib/           # core (config, db, cache, blockchain)
├── src/pages/api/     # API routes (payment, merchant, admin)
├── src/pages/         # UI (index, admin, pay/[txId])
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

---

## 🎯 نقشه راه

- ✅ v1.0 — TRON USDT, لینک پرداخت, QR
- ✅ v2.0 — Multi-chain, Merchant, Redis, Docker
- 🔄 v2.1 — BSC (BNB/USDT)
- ⏳ v3.0 — Ethereum (USDT)

---

## 🔗 ریپوهای مرتبط
- [ربات چت ناشناس](https://github.com/mamadiezad/robot-chat-nashnas)
- [AI Sales Bot](https://github.com/mamadiezad/ai-business-sales-bot)

---

## 📜 لایسنس
MIT

ساخته شده با ❤️ توسط Mohammad

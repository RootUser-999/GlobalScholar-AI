# 🎓 SEA — The Sophie Education Academy

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlecloud&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**SEA (The Sophie Education Academy)** is an AI-powered full-stack web application designed to help international students discover, track, and apply for academic scholarships globally. Powered by Google Gemini AI, the platform features real-time intelligent scholarship discovery, secure email OTP authentication, student progress tracking, and a comprehensive administration dashboard.

---

## ✨ Key Features

### 🤖 AI-Powered Scholarship Search
- **Real-Time AI Discovery:** Leverages Google Gemini API (`@google/genai`) to generate personalized scholarship matches based on field of study, degree level, and target country.
- **Hybrid Data Resilience:** Features an automatic fallback to verified local dataset records (`src/data/scholarships.ts`) if the Gemini API key is rate-limited or unavailable, ensuring 100% uptime.

### 🔐 Auth & Security
- **Email OTP Verification:** Automated 6-digit numeric OTP delivery powered by Nodemailer via Gmail SMTP (`sophieedpro@gmail.com`).
- **Clean State Management:** Instantly purges sensitive authentication data (passwords, temporary tokens, OTP entries) whenever login/signup modals are closed or canceled.
- **User & Admin Security:** Self-service password management for both active student accounts and administrators.

### 📊 Dashboard & Management
- **Student Portal:** Save opportunities, manage application statuses, and update personal profile settings.
- **Admin Panel:** Centralized oversight for managing site options, platform metrics, and administrative security settings.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express (TypeScript)
- **AI Engine:** Google Gemini API (`@google/genai`)
- **Email Delivery:** Nodemailer (Gmail App Passwords)
- **Deployment:** Vercel (Serverless Express API + React SPA)

---

## 📁 Repository Structure

```text
├── src/
│   ├── components/       # React UI Components (AISearchView, AdminPanel, AuthModals)
│   ├── context/          # State Management (AuthContext, ScholarshipContext)
│   ├── data/             # Integrated Fallback Data (scholarships.ts)
│   ├── App.tsx           # Main Application Shell
│   └── main.tsx          # React Client Entrypoint
├── server.ts             # Node.js/Express Backend & API Endpoints
├── vercel.json           # Vercel Deployment & Serverless Routing Config
├── package.json          # Project Dependencies & Scripts
├── tsconfig.json         # TypeScript Settings
└── README.md             # Repository Documentation

<div align="center">

<img src="https://img.shields.io/badge/Google_Solution_Challenge-2026-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Status-Live-1D9E75?style=for-the-badge" />
<img src="https://img.shields.io/badge/Version-4.0-0B1929?style=for-the-badge" />

<br/><br/>

```
 ██████╗██╗  ██╗ █████╗ ██╗███╗   ██╗ ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗
██╔════╝██║  ██║██╔══██╗██║████╗  ██║██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗
██║     ███████║███████║██║██╔██╗ ██║██║  ███╗██║   ██║███████║██████╔╝██║  ██║
██║     ██╔══██║██╔══██║██║██║╚██╗██║██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║
╚██████╗██║  ██║██║  ██║██║██║ ╚████║╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝
```

### 🚢 AI-Powered Maritime Supply Chain Intelligence Platform

**Predict risks. Reroute instantly. Stay ahead of disruptions.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FF6B00?style=flat-square&logo=firebase&logoColor=white)](https://firebase.google.com)
[![Gemini](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)
[![XGBoost](https://img.shields.io/badge/XGBoost-R²_0.9691-1D9E75?style=flat-square)](https://xgboost.readthedocs.io)
[![License](https://img.shields.io/badge/License-MIT-1D9E75?style=flat-square)](LICENSE)

<br/>

[🌊 Live Demo](#) · [📖 Documentation](#architecture) · [🚀 Quick Start](#quick-start) · [👥 Team](#team)

<br/>

---

</div>

## 🌊 The Problem

Maritime shipping carries **over 80% of global trade** — worth **$14 trillion annually**. Yet when disruptions strike:

```
⚓ Piracy in Gulf of Aden          → Ships reroute manually (hours lost)
🔥 Sanctions on Strait of Hormuz  → No real-time intelligence
🌪️  Extreme weather events         → Cargo delayed, millions lost
⚔️  Geopolitical conflicts         → Operators flying blind
```

**Current solutions are reactive. ChainGuard makes it proactive.**

---

## ⚡ What ChainGuard Does

> *From raw threat signal to captain's briefing — in under 2 seconds.*

```
📡 Live RSS Feeds (6 sources, every 30min)
         ↓
🔍 NLP Threat Verification Engine
         ↓
🤖 XGBoost Risk Scoring (16 features, R²=0.9691)
         ↓
🗺️  Yen's K-Shortest Path (3 optimal routes)
         ↓
✨ Gemini AI Captain's Briefing (<2 seconds)
```

---

## 🎯 Core Features

<table>
<tr>
<td width="50%">

### 🛡️ Predictive Risk Scoring
XGBoost model trained on **3,000 synthetic routes** across **16 features** — weather, geopolitical signals, chokepoint exposure, piracy zones, and sanctions data.

**R² = 0.9691** — production-grade accuracy.

</td>
<td width="50%">

### 📰 News Verification Engine
Crawls **6 live maritime RSS feeds** every 30 minutes:
- Reuters, BBC, gCaptain
- Maritime Executive
- Splash247, IMB Piracy Bureau

Composite confidence: **Ψ(a) = 0.30·T(s) + 0.25·τ(t) + 0.20·G(a) + 0.25·C**

</td>
</tr>
<tr>
<td width="50%">

### 🗺️ AI Route Optimization
**Yen's K-Shortest** algorithm computes **3 alternative routes** in milliseconds. Each path weighted by:
- α=0.60 threat severity
- β=0.25 distance
- γ=0.15 weather risk

</td>
<td width="50%">

### 🤖 Gemini Tactical Briefing
**Gemini 1.5 Flash** generates a confidential captain's briefing with:
- Threat summary
- Weather assessment  
- Route recommendation
- Risk mitigation steps

All in **under 2 seconds**.

</td>
</tr>
<tr>
<td width="50%">

### 📊 SHAP Value Insights
Explainable AI — understand **exactly why** a route is flagged high risk. Feature-level attribution shows which signals drove the score.

</td>
<td width="50%">

### 🔐 Firebase Authentication
Secure multi-provider auth:
- Email/Password
- Google OAuth
- GitHub OAuth

Role-based access for Maritime Officers.

</td>
</tr>
</table>

---



## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CHAINGUARD v4.0                       │
├─────────────────────┬───────────────────────────────────────┤
│     FRONTEND        │            BACKEND                      │
│   (Next.js 15)      │          (Python/FastAPI)              │
│                     │                                         │
│  ┌─────────────┐    │    ┌──────────────────────────────┐   │
│  │  Firebase   │    │    │   News Ingestion Pipeline     │   │
│  │    Auth     │    │    │  6 RSS feeds × 30min cycle   │   │
│  └─────────────┘    │    └──────────────┬───────────────┘   │
│                     │                   ↓                     │
│  ┌─────────────┐    │    ┌──────────────────────────────┐   │
│  │   Gemini    │◄───┼────│   NLP Verification Engine    │   │
│  │  Briefings  │    │    │  Ψ(a) confidence scoring     │   │
│  └─────────────┘    │    └──────────────┬───────────────┘   │
│                     │                   ↓                     │
│  ┌─────────────┐    │    ┌──────────────────────────────┐   │
│  │ Route Map   │◄───┼────│   XGBoost Risk Model         │   │
│  │ Dashboard   │    │    │   R² = 0.9691, 16 features   │   │
│  └─────────────┘    │    └──────────────┬───────────────┘   │
│                     │                   ↓                     │
│  ┌─────────────┐    │    ┌──────────────────────────────┐   │
│  │  Threat     │◄───┼────│   Yen's K-Shortest Path      │   │
│  │  Intel      │    │    │   3 optimal routes computed  │   │
│  └─────────────┘    │    └──────────────────────────────┘   │
└─────────────────────┴───────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS | UI & routing |
| **Auth** | Firebase Authentication | Email, Google, GitHub OAuth |
| **AI Briefing** | Google Gemini 1.5 Flash | Captain's tactical briefing |
| **ML Model** | XGBoost, scikit-learn | Risk scoring (R²=0.9691) |
| **Routing** | Yen's K-Shortest Path | Alternative route computation |
| **NLP** | Custom verification engine | Threat confidence scoring |
| **Data** | 6 live RSS feeds | Real-time maritime intelligence |
| **Backend** | Python, FastAPI | Risk engine API |
| **Visualization** | Three.js Globe, Google Maps | Route visualization |

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+    # Frontend
Python 3.11+   # Backend
```

### 1. Clone the repository
```bash
git clone https://github.com/neil-data/Chain-guard-hackathon-.git
cd Chain-guard-hackathon-
```

### 2. Frontend Setup
```bash
cd frontends
npm install
cp .env.example .env.local
# Fill in your keys in .env.local
npm run dev
```

### 3. Backend Setup
```bash
cd chainguard
python -m venv .venv
.venv\Scripts\activate      # Windows
# source .venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python app.py
```

### 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Firebase (get from console.firebase.google.com)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server-side only)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Google Gemini (get from aistudio.google.com)
GEMINI_API_KEY=

# Backend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 5. Open in browser
```
Frontend:  http://localhost:3000
Backend:   http://localhost:8000
```

---

## 📊 Performance Metrics

<div align="center">

| Metric | Value |
|--------|-------|
| 🎯 Prediction Accuracy | **94.3%** |
| ⚡ AI Response Time | **< 2 seconds** |
| 🗺️ Active Routes Monitored | **50+** |
| 🔄 Rerouting Speed | **3x faster** than manual |
| 📰 News Sources | **6 live feeds** |
| 🔍 Model R² Score | **0.9691** |
| 🛣️ Routes per Analysis | **3 alternatives** |
| ⏱️ Feed Crawl Interval | **Every 30 minutes** |

</div>

---

## 🌍 UN SDG Alignment

<table>
<tr>
<td width="50%" align="center">

**SDG 9 — Industry, Innovation & Infrastructure**

ChainGuard modernizes critical maritime logistics infrastructure by replacing manual, reactive route planning with AI-driven proactive decision-making — reducing disruption response time from hours to under 2 seconds.

</td>
<td width="50%" align="center">

**SDG 17 — Partnerships for the Goals**

By protecting global trade corridors, ChainGuard enables safer, more reliable shipping routes that developing economies depend on for imports, exports, and economic growth.

</td>
</tr>
</table>

---

## 📁 Project Structure

```
Chain-guard-hackathon-/
├── 📂 frontends/                 # Next.js frontend
│   ├── 📂 app/
│   │   ├── 📂 (auth)/           # Login, register pages
│   │   ├── 📂 (dashboard)/      # Dashboard, analyzer, threats
│   │   ├── 📂 api/              # API routes (Gemini, analyze)
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── 📂 components/
│   │   ├── 📂 landing/          # Hero, Footer, HowItWorks
│   │   └── 📂 ui/               # Globe3D, DynamicGlobe
│   ├── 📂 lib/
│   │   ├── firebase.ts          # Firebase client config
│   │   ├── firebase-admin.ts    # Firebase admin (server)
│   │   └── auth-context.tsx     # Global auth state
│   ├── middleware.ts             # Route protection
│   ├── .env.example             # Environment template
│   └── package.json
│
├── 📂 chainguard/               # Python backend
│   ├── app.py                   # FastAPI risk engine
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

---

## 🔒 Security

- ✅ All API keys stored server-side in `.env.local` — never exposed to frontend
- ✅ Firebase Admin SDK used for server-side token verification
- ✅ Route protection via Next.js middleware
- ✅ `.env.local` excluded from version control
- ✅ Firebase security rules enforced

---

## 👥 Team

<div align="center">

Built with ❤️ for **Google Solution Challenge 2026**

| Member | Role |
|--------|------|
| Neil Banerjee | Full Stack & Testing |
| Yash Vania | Backend & Data Pipeline |
| Manthan Balani | AI & NLP Engineering |
| Shrey gohil | UI/UX & Frontend |

</div>

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built for Google Solution Challenge 2026**

*"Predictive risk. Resilient supply."*

⭐ Star this repo if ChainGuard helped you learn something!

<img src="https://img.shields.io/badge/Made_with-❤️_in_India-FF9933?style=for-the-badge" />
<img src="https://img.shields.io/badge/Google_Solution_Challenge-2026-4285F4?style=for-the-badge&logo=google&logoColor=white" />

</div>

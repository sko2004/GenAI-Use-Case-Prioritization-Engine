<div align="center">
  <img src="https://img.icons8.com/nolan/256/combo-chart.png" width="100"/>
  <h1>GenAI Use-Case Prioritization Engine</h1>
  <p>A Decision-Support Platform for Identifying, Evaluating, and Prioritizing Generative AI Opportunities in Organizations.</p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</div>

<br />

## 📖 Table of Contents
1. [Overview & Problem Statement](#-overview--problem-statement)
2. [Key Features](#-key-features)
3. [Architecture & Tech Stack](#-architecture--tech-stack)
4. [Folder Structure](#-folder-structure)
5. [The Prioritization Algorithm](#-the-prioritization-algorithm)
6. [Local Development Setup](#-local-development-setup)
   - [A. Database Setup (Supabase)](#a-database-setup-supabase)
   - [B. Backend Setup (FastAPI Python)](#b-backend-setup-fastapi-python)
   - [C. Frontend Setup (React Vite)](#c-frontend-setup-react-vite)
7. [Environment Variables Reference](#-environment-variables-reference)
8. [Expected Outcomes](#-expected-outcomes)

---

## 🔍 Overview & Problem Statement

Organizations today face a major challenge in adopting Generative AI effectively. While many possible use cases exist across HR, Finance, Procurement, and Operations, not all are equally valuable, feasible, or ready for implementation. Most companies struggle with:
- Analyzing a massive landscape of potential use-cases.
- Determining structural data readiness and estimating implementation effort.
- Evaluating compliance risks across different business units.
- Prioritizing projects without a deterministic, objective framework.

**The GenAI Use-Case Prioritization Engine** solves this by combining business-function analysis, pain-point capture, LLM-assisted use-case generation, multi-criteria scoring, prioritization matrices, and roadmap creation into a single integrated platform.

---

## ✨ Key Features

- **Automated GenAI Discovery:** Simply provide business unit contexts and operational friction points (Pain Points). A tailored LLM prompts the Groq API to recommend exact GenAI applications (e.g., "Invoice Anomaly Checker", "HR Onboarding Agent").
- **Deterministic Scoring Engine:** Evaluates each discovered opportunity autonomously across 7 multi-dimensional parameters (Impact, Effort, Scalability, Adoption Feasibility, Risk, Data Readiness, Process Standardization).
- **Consulting-Grade Prioritization Matrices:** Automatically generates scatter plot visualization mapping Effort against Impact, explicitly identifying "Quick Wins", "Strategic Bets", and "Avoid/Defer" initiatives.
- **Enterprise Roadmapping:** Output strategies categorized into Phase 1, Phase 2, and Phase 3 timelines based on risk-adjustments and effort parameters.
- **Persistent History & Cloud Storage:** Secure, multi-tenant persistence layer mapping user sessions (via Google OAuth) to their evaluation histories.
- **Export Ready:** Generate boardroom-ready reports via built-in layout configurations matching PDF export flows.

---

## 🏗️ Architecture & Tech Stack

This project is built using an industry-standard modern microservice split:

### 1. Frontend (Client Tier)
- **Framework:** React 18 / Vite / TypeScript
- **Styling:** Tailwind CSS + Glassmorphism / Recharts for visualizations
- **UI Components:** Customized primitives wrapped via `clsx` and `tailwind-merge`

### 2. Backend (API Tier)
- **Framework:** Python / FastAPI
- **Gateway/Proxy:** Secured endpoint hiding the Groq prompt engineering logic and tokens from client-side network exposure.
- **AI Engine:** Groq SDK (Llama-3 model) executing structured generation strictly enforcing `json_object` return schemas.

### 3. Database & Auth (Persistence Tier)
- **Data Store:** Supabase PostgreSQL
- **Security:** Strict Row-Level Security (RLS) policies mapping isolated datasets.
- **Identity:** Googe OAuth via Supabase `@supabase/ssr`

---

## 📂 Folder Structure

```text
genai-usecase-engine/
│
├── frontend/                     # React + Vite Client Application
│   ├── src/
│   │   ├── components/           # Reusable UI primitives (Button, Card, Input) & Layout
│   │   ├── context/              # Context providers (AuthContext handling Supabase User Session)
│   │   ├── lib/                  # Utilities, Supabase Config, Groq Proxy Fetchers, Scoring Engine
│   │   ├── pages/                # App Views (Login, Dashboard, New Assessment, Results, History)
│   │   └── types/                # Typescript specific type-models (UseCase, Assessment)
│   ├── supabase/migrations/      # SQL queries required to define Schema & configure RLS
│   ├── index.html                # App injection point
│   ├── tailwind.config.js        # UI Styling presets
│   └── package.json              
│
├── backend/                      # Python FastAPI Application
│   ├── main.py                   # FastAPI Routing, CORS config, and Groq Server-Side handling
│   ├── requirements.txt          # Python dependencies
│   └── .env.example              # Env variable templates
│
└── README.md                     # You are here
```

---

## 🧮 The Prioritization Algorithm

Every generated system use-case runs through a deterministic evaluation engine built inside the application (`src/lib/scoring.ts`). The normalized total score heavily impacts the Visual Matrix generation using the following weighted representation:

$$
Total Score = 0.25*(Impact) + 0.15*(Data Readiness) + 0.15*(Scalability) + 0.10*(Standardization) + 0.10*(Adoption) - 0.15*(Effort) - 0.10*(Risk)
$$

---

## 🛠️ Local Development Setup

To test and run the project locally, please follow this strict 3-stage process.

### A. Database Setup (Supabase)

1. Create a project on [Supabase.com](https://supabase.com/).
2. Navigate to your project's **Authentication** settings and enable the **Google** Identity Provider.
3. Open the **SQL Editor** tab in the Supabase Dashboard.
4. Copy the entire contents of `frontend/supabase/migrations/00_schema.sql` and run it. This will immediately spin up the:
   - `assessments` table
   - `pain_points` table
   - `use_cases` table
   - And the necessary **Row Level Security (RLS)** constraints protecting data.

### B. Backend Setup (FastAPI Python)

1. Open a terminal and navigate to the backend folder:
```bash
cd backend
```
2. Create and activate a Virtual Environment (Recommended):
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```
3. Install the dependencies:
```bash
pip install -r requirements.txt
```
4. Copy `backend/.env.example` into a new `backend/.env` file and input your Groq API Key.
5. Boot the ASGI Server:
```bash
uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

> **Note:** The backend should now be listening for API proxy requests at `http://localhost:5000/api/generate-use-cases`.

### C. Frontend Setup (React Vite)

1. Keep your backend terminal running. Open a *second* terminal and navigate to the frontend folder:
```bash
cd frontend
```
2. Install npm dependencies:
```bash
npm install
```
3. Copy `frontend/.env.example` to a new `frontend/.env` file. You will need to link your front-end to Supabase and your new local backend.
4. Start the Vite development build:
```bash
npm run dev
```
5. Navigate to [http://localhost:5173/](http://localhost:5173/) on your browser.

---

## 🔐 Environment Variables Reference

A quick reference on what configurations must be defined in your `.env` files.

**Backend (`backend/.env`):**
- `GROQ_API_KEY`: Fetch this from [console.groq.com](https://console.groq.com/keys)
- `PORT`: Default is `5000`

**Frontend (`frontend/.env`):**
- `VITE_SUPABASE_URL`: Setup URL from your Supabase Project Settings > API.
- `VITE_SUPABASE_ANON_KEY`: Setup Key from your Supabase Project Settings > API.
- `VITE_BACKEND_URL`: Usually `http://localhost:5000`

---

## 🏦 Expected Outcomes

This project is built to perfectly simulate high-level consulting advisory tooling. Navigating through the platform flow will cleanly demonstrate the ability to convert qualitative organizational stress points into structured, actionable qualitative decision deliverables. It perfectly blends standard CRUD application behavior with LLM-orchestration mechanics.

Enjoy evaluating the future of Generative AI logic!

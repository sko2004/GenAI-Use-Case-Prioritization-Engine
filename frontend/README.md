# GenAI Use-Case Prioritization Engine

A decision-support platform for identifying, evaluating, and prioritizing Generative AI opportunities in organizations. Designed with a premium consulting-style aesthetic.

## Tech Stack
- **Frontend:** React + Vite, Tailwind CSS, Recharts
- **Backend/Auth/Database:** Supabase (PostgreSQL + Google OAuth)
- **LLM Engine:** Groq API (Llama-3 model)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your keys:
```env
VITE_SUPABASE_URL=your-supabase-url-here
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
VITE_GROQ_API_KEY=your-groq-api-key-here
```

### 3. Database Migration (Supabase)
To enable the save to history and persistent dashboard functionality, you must run the included SQL setup script in your Supabase project's SQL Editor.

1. Open your Supabase Dashboard -> SQL Editor
2. Copy and paste the contents of `supabase/migrations/00_schema.sql`
3. Click **Run** to generate the necessary tables and Row-Level Security policies.

### 4. Running the App Locale
```bash
npm run dev
```

### 5. Access
Navigate to `http://localhost:5173`. Make sure you've authorized `http://localhost:5173/dashboard` inside your Google OAuth configurations via the Supabase dashboard as well.

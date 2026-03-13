# ApplyPilot - Complete Architecture & Design Decisions

## 🏗️ System Architecture Overview

Your application is a **full-stack, AI-powered job application tracker** that combines frontend UI, backend APIs, and database management. Here's how everything connects:

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Next.js App Router (Frontend)                          │   │
│  │  - pages/dashboard, /auth, /applications, /tools        │   │
│  │  - React Components (Client & Server Components)        │   │
│  │  - Supabase Auth (Browser Client)                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    HTTP/HTTPS Requests
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                      NEXT.JS SERVER                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  API Routes (/api/*)                                    │   │
│  │  - /api/create-profile (POST) - Create user profile    │   │
│  │  - /api/create-profile/applications (GET/POST) - CRUD  │   │
│  │  - /api/create-profile/score (POST) - Keyword analysis │   │
│  │  - /api/interview (POST) - Generate questions          │   │
│  │  - /api/bullets (POST) - Optimize bullets              │   │
│  │                                                          │   │
│  │  Server Components (SSR)                                │   │
│  │  - Auth verification via Supabase Server Client         │   │
│  │  - Direct database queries via Prisma ORM              │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                   Database Queries
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                   SUPABASE BACKEND                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database (via Prisma ORM)                   │   │
│  │                                                          │   │
│  │  Tables:                                                │   │
│  │  ┌─ Profile (Users)                                    │   │
│  │  │  - id (UUID)                                        │   │
│  │  │  - email (unique)                                   │   │
│  │  │  - fullName                                         │   │
│  │  │  - applications[] (relation)                        │   │
│  │  │                                                      │   │
│  │  ├─ Application (Job Listings)                         │   │
│  │  │  - id (CUID)                                        │   │
│  │  │  - userId (FK to Profile)                           │   │
│  │  │  - company, role, location                          │   │
│  │  │  - jobDescription (for analysis)                    │   │
│  │  │  - status (APPLIED|INTERVIEW|OFFER|...)            │   │
│  │  │  - analyses[] (relation)                            │   │
│  │  │                                                      │   │
│  │  └─ Analysis (AI Results)                              │   │
│  │     - id (CUID)                                        │   │
│  │     - applicationId (FK)                               │   │
│  │     - keywordScore (0-100)                             │   │
│  │     - missingKeywords (JSON array)                     │   │
│  │     - optimizedBullets (JSON array)                    │   │
│  │     - interviewQuestions (JSON array)                  │   │
│  │                                                          │   │
│  │  Authentication:                                        │   │
│  │  - Supabase Auth (Email/Password, Social Login Ready)  │   │
│  │  - JWT tokens managed by Supabase                       │   │
│  │  - Row-level security (RLS) on tables                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Core Design Decisions & Why

### 1. **Why Next.js 16 with App Router?**

**Decision:** Full-stack framework with App Router (not Pages Router)

**Why:**
- **Server Components by default** - Automatically secure (database credentials stay on server)
- **File-based routing** - No routing configuration needed
- **API routes in same project** - Backend & frontend together = easier to maintain
- **Edge capabilities** - Easy to deploy on Vercel with automatic scaling
- **Turbopack** - 3x faster builds than Webpack
- **Built-in auth middleware** - Easy to protect routes

**When talking to recruiters:**
> "I chose Next.js 16 because it gives me both frontend and backend in one unified framework. The App Router with Server Components means I can query the database directly in my components - no separate REST client needed. Plus, Turbopack makes the dev experience incredibly fast for iteration."

---

### 2. **Why Supabase (Not Firebase, MongoDB, etc.)?**

**Decision:** Supabase for authentication AND database

**Why:**
- **PostgreSQL advantage** - Relations between Profile→Application→Analysis are enforced at DB level (referential integrity)
- **Built-in Auth** - No need for separate auth service (JWT, sessions handled)
- **Row-Level Security (RLS)** - Users can ONLY access their own data at database level (security)
- **Real-time subscriptions** - If you add live updates later, it's built-in
- **Free tier is generous** - Perfect for portfolio projects
- **Session Pooler** - Solves IPv4 connection issues (which we used!)

**When talking to recruiters:**
> "Supabase gives me PostgreSQL's relational power combined with Firebase-like simplicity. The key advantage is Row-Level Security - I can enforce that users only see their own data at the database layer, not just in the application code. This is more secure than a lot of applications out there."

---

### 3. **Why Prisma ORM?**

**Decision:** Prisma instead of raw SQL or other ORMs

**Why:**
- **Type-safe queries** - TypeScript catches errors at compile time
- **Schema as source of truth** - Single file defines database structure
- **Migrations** - Version control for database changes
- **Relations simplified** - `application.analyses` loads related data automatically
- **Works with ANY database** - Not locked to Supabase

**Prisma Schema Structure:**
```prisma
model Profile {
  id           String        @id
  email        String        @unique
  fullName     String?
  applications Application[]  // One user can have many applications
}

model Application {
  id       String  @id
  userId   String
  profile  Profile @relation(fields: [userId], references: [id])
  analyses Analysis[] // One application can have many analyses
}
```

**When talking to recruiters:**
> "Prisma gives me type safety on all my database queries. I define my schema once, and TypeScript ensures I can't accidentally query the wrong fields or miss required data. This catches bugs before production."

---

### 4. **Why This Database Structure?**

```
Profile (1) ──→ (Many) Application ──→ (Many) Analysis
```

**Decision Logic:**

- **Profile model** - Represents authenticated users
  - One profile = one user
  - Stores email (unique login) + optional full name
  - Cascade delete: deleting a profile deletes all their applications

- **Application model** - Represents each job they apply to
  - Links to Profile via userId (foreign key)
  - Stores job metadata (company, role, location, URL)
  - Stores full jobDescription (needed for keyword analysis)
  - Status field tracks if Applied→Interview→Offer (workflow)

- **Analysis model** - Stores AI analysis results
  - Links to Application (one app can have many analyses)
  - Stores analysis results as JSON (flexible, can change structure)
  - keywordScore, missingKeywords, optimizedBullets, interviewQuestions

**Why separate Analysis from Application?**
- **Separation of concerns** - Analysis is separate data that can be regenerated
- **Reusability** - User could re-run analysis multiple times for same job
- **Clean data model** - Application = "the job posting I'm tracking", Analysis = "my AI insights about it"

**When talking to recruiters:**
> "I designed this with relational data in mind. Each user has multiple applications, and each application can have multiple analyses (e.g., if they re-run the keyword analyzer). The foreign key relationships ensure referential integrity - if an application is deleted, all analyses are automatically cleaned up."

---

### 5. **Why These API Routes?**

| Route | Purpose | Why Design |
|-------|---------|-----------|
| `POST /api/create-profile` | Create user profile | Runs after Supabase auth succeeds, stores user in our DB |
| `GET/POST /api/create-profile/applications` | CRUD applications | All user applications in one endpoint using HTTP method routing |
| `POST /api/create-profile/score` | Keyword analysis | Server-side processing (could add AI/external API here) |
| `POST /api/interview` | Generate interview questions | Server-side logic detects tech keywords |
| `POST /api/bullets` | Optimize bullets | Server-side text transformation with action verbs |

**Why nested routes like `/api/create-profile/applications`?**
- Groups related functionality - all "application" operations under one path
- Makes it clear these belong to a specific profile
- Easier to add auth checks at the `/create-profile` level

**When talking to recruiters:**
> "I organized my routes semantically - all application operations are nested under `/create-profile/applications`. This makes the API surface self-documenting and easier to add features like batch operations or analytics later."

---

### 6. **Why This Authentication Flow?**

```
User Signs Up/Logs In
         ↓
Supabase Auth (Browser) ← JWT Token
         ↓
Create Profile in DB (via POST /api/create-profile)
         ↓
Dashboard loads (Server Component)
  → Supabase Server Client validates JWT
  → Query database for user's applications
  → Render dashboard
```

**Key Design Choices:**

1. **Two Supabase clients:**
   - `lib/supabase/client.ts` - Browser (public, safe for client-side)
   - `lib/supabase/server.ts` - Server (can use service role, if needed)

2. **Prisma singleton pattern** (`lib/prisma.ts`):
   ```typescript
   if (process.env.NODE_ENV === "production") {
     prisma = new PrismaClient();
   } else {
     if (!globalAny.prisma) {
       globalAny.prisma = new PrismaClient();
     }
     prisma = globalAny.prisma;
   }
   ```
   Why? In development, Next.js hot-reloads code, which would create multiple Prisma instances and exhaust connection pool

**When talking to recruiters:**
> "I use Supabase's JWT authentication which is handled securely on both client and server. The key insight is that I maintain a singleton Prisma connection in development to avoid connection pool exhaustion during hot reloads - this shows I understand production concerns."

---

### 7. **Why These Utility Functions?**

#### `lib/keyword-extractor.ts`
```typescript
extractKeywords(text) // Removes stopwords (the, a, and...), returns keywords
compareKeywords(jobDesc, resume) // Returns fit score + missing keywords
```

**Why this approach:**
- Local processing (no API calls = faster)
- Deterministic (same input = same output)
- Easily testable
- Can add AI/ML here later without changing API

#### `lib/bullet-optimizer.ts`
```typescript
optimizeBullet(input) // Replaces weak verbs with action verbs
```

**Why:**
- Pattern-based (finds first word, replaces with action verbs)
- Generates 3 variations (gives user choice)
- No external API needed (fast)

**When talking to recruiters:**
> "These utilities are intentionally kept simple and local. I could integrate with OpenAI's API later for smarter optimization, but for now, local pattern matching is fast and reliable. The utility function architecture makes that swap trivial."

---

## 🎨 Frontend Architecture

### Component Structure:

```
app/
├── page.tsx (homepage - public)
├── auth/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── dashboard/page.tsx (server component - protected)
├── applications/
│   ├── page.tsx (list applications)
│   └── new/page.tsx (form to add application)
├── tools/
│   ├── keyword-analyzer/page.tsx
│   ├── bullet-optimizer/page.tsx
│   └── interview-prep/page.tsx
└── api/ (backend routes)
```

### Why Mix Server & Client Components?

- **Dashboard (server)** - Fetches user's applications on server, renders them. User can't bypass this.
- **Auth pages (client)** - Use Supabase client SDK for signup/login
- **Tool pages (client)** - Text inputs, real-time feedback needed

**When talking to recruiters:**
> "I use Next.js Server Components where authentication/authorization matters (dashboard, user data) and Client Components where interactivity is needed (forms, tools). This gives me security by default."

---

## 🔐 Security Decisions

1. **Profile creation after auth** - Ensures only authenticated users in DB
2. **Server components for sensitive data** - Can't be inspected or modified by user
3. **Prisma queries filtered by userId** - Even if auth is bypassed, data is still protected
4. **Environment variables** - Supabase URL/keys never in frontend (except public ones)
5. **Session Pooler** - Added security by routing through Supabase infrastructure

---

## 📊 Data Flow Examples

### Example 1: User submits job application
```
1. User fills form on /applications/new
2. Form submitted to POST /api/create-profile/applications
3. Server receives request, validates auth
4. Creates record in database via Prisma
5. Returns confirmation
6. Frontend redirects to dashboard
```

### Example 2: User analyzes resume fit
```
1. User pastes job description + resume on /tools/keyword-analyzer
2. Frontend calls POST /api/create-profile/score
3. Server processes via extractKeywords() utility
4. Calculates match percentage
5. Returns matched keywords + missing keywords
6. Frontend displays results in real-time
```

### Example 3: Dashboard loads (protected)
```
1. Browser navigates to /dashboard
2. Next.js Server Component runs
3. Supabase.auth.getUser() checks JWT validity
4. If invalid → redirect to /auth/login
5. If valid → Query database for user's applications
6. Render dashboard with metrics
```

---

## 🚀 Why This Architecture Scales

1. **Database relations** - As data grows, filtering by userId remains fast (indexed)
2. **Prisma connection pooling** - Handles multiple concurrent requests
3. **Vercel deployment** - Automatically scales serverless functions
4. **Supabase Session Pooler** - Connection pooling on database side
5. **API routes** - Can be deployed as separate microservices later
6. **Server Components** - Reduce JavaScript sent to browser (faster UX)

---

## Interview-Ready Answers

### Q: "Why did you choose this tech stack?"
A: "I prioritized developer experience and security. Next.js 16 lets me build full-stack in one framework with Server Components for security by default. Supabase provides PostgreSQL with built-in auth and row-level security - I didn't have to reinvent authentication. Prisma gives me type-safe database queries. The combination lets me move fast without sacrificing security or scalability."

### Q: "How does authentication work?"
A: "Supabase handles authentication with JWT tokens. When a user signs up, Supabase returns a JWT. I then create a profile record in my database so I can associate user data with their account. On protected pages, I validate the JWT server-side before querying their data. The database filters everything by userId, so even if auth is bypassed somehow, a user can only see their own data."

### Q: "Why separate the Analysis from the Application?"
A: "Two reasons: First, separation of concerns - an Application is 'the job I'm tracking', while Analysis is 'my AI insights about it'. Second, it allows users to re-run analyses. They could update their resume and re-run the keyword analyzer on the same job posting without modifying the original application record."

### Q: "How do you handle database migrations?"
A: "Prisma migrations. When I want to add a column or table, I update the schema.prisma file, then run `prisma migrate dev` which generates SQL migration files and applies them. This gives me version control for database changes and makes rollback simple."

### Q: "How is the Session Pooler different from direct connection?"
A: "Direct connection goes straight from app to database, but my MacBook is on IPv4. Supabase's Session Pooler acts as a proxy, adding connection pooling on the database side. This means multiple app instances can share a smaller number of database connections, reducing overhead and enabling true scalability."


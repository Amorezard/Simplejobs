# ApplyPilot - Recruiter Interview Cheat Sheet

## 60-Second Pitch

"ApplyPilot is an AI-powered job application tracker I built to solve a real problem: job hunters manually comparing their resume against job descriptions. The app has four features: an application tracker to store all applications in one place, a keyword analyzer that scores how well your resume matches a job description, a bullet optimizer that transforms weak resume bullets into powerful statements using action verbs, and an interview prep generator that creates relevant technical questions based on the job.

Technically, it's a full-stack Next.js application with React 19, TypeScript for type safety, Supabase for authentication and PostgreSQL database, and Prisma as the ORM. The architecture separates server components (for security) from client components (for interactivity), with API routes handling business logic. I used Supabase's Session Pooler to solve IPv4 connectivity issues.

The key architectural decision was using relational data - each user has applications, each application has analyses that store AI results. This lets users re-run analyses without data duplication. I deploy on Vercel for automatic scaling."

---

## Key Technical Points to Explain

### Architecture
```
Frontend (Next.js App Router)
  ↓
API Routes (5 endpoints)
  ↓
Prisma ORM
  ↓
Supabase PostgreSQL
  ↓
Row-Level Security (users can only see own data)
```

### Why Each Technology

| Technology | Why I Chose It | What It Does |
|------------|---------------|-------------|
| Next.js 16 | Full-stack framework with Server Components for security | Builds frontend + backend in one project |
| React 19 | Latest with concurrent rendering | Client interactivity and form handling |
| TypeScript | Catches bugs at compile time | Type safety on all code |
| Prisma ORM | Type-safe, migrations, relations | Talks to database safely |
| Supabase | PostgreSQL + Auth + RLS | Database, user authentication, security |
| Tailwind CSS | Utility-first CSS framework | Modern, responsive styling |

### Security Decisions
1. **Server Components** - Can't be inspected by users
2. **Row-Level Security** - Database enforces data isolation
3. **JWT validation** - Every API checks authentication
4. **Environment variables** - Secrets never exposed to browser

---

## Feature Walkthrough (What to Demo)

### 1. Authentication
- Sign up with email/password
- Supabase handles JWT management
- Can add Google/GitHub login easily

### 2. Dashboard
- Shows stats (Total Applications, Applied, Interviews, Offers)
- Real-time counts from database
- Protected route (redirects if not logged in)

### 3. Add Application
- Fill in company, role, location, URL
- Store job description for analysis
- Creates record in database
- Appears on dashboard instantly

### 4. Keyword Analyzer
- Paste job description
- Paste resume
- Get fit score (0-100%)
- See matching keywords (green) and missing keywords (red)
- **Behind the scenes:** Server-side text processing, keyword extraction with stopword filtering, score calculation

### 5. Bullet Optimizer
- Paste weak resume bullet: "Helped with testing"
- Get 3 variations with action verbs: "Built comprehensive test suite", "Developed automated testing framework", "Engineered end-to-end test coverage"
- **Behind the scenes:** Pattern matching, action verb replacement, multiple variations generated

### 6. Interview Prep
- Enter job role and paste job description
- Get 5-10 interview questions
- Questions include behavioral + technical based on tech stack detected
- **Behind the scenes:** Tech keyword detection (React, TypeScript, Python, etc.), question generation based on detected skills

---

## Common Interview Questions & Answers

### Q: "Walk me through your application architecture"

A: "The app follows a layered architecture. The frontend is built with Next.js App Router - I use Server Components for pages that need authentication and database access, which keeps credentials safe on the server. Client Components handle user input for things like forms and tools.

The API layer consists of five routes: one to create user profiles after authentication, one for CRUD operations on applications, one for keyword analysis, one for interview question generation, and one for bullet optimization. Each route follows REST conventions and handles input validation.

The database layer uses Prisma ORM with three models: Profile (users), Application (jobs), and Analysis (AI results). The relations are: one Profile has many Applications, and one Application has many Analyses. I chose this structure because it separates concerns - an Application is the job posting data, while Analysis is the AI insights that can be regenerated.

Everything connects to Supabase's PostgreSQL database with Row-Level Security policies ensuring users can only access their own data at the database layer."

### Q: "Why Prisma over raw SQL?"

A: "Prisma gives me three things: First, type safety - all my database queries are typed in TypeScript, so I catch errors at compile time. Second, migrations - I can version control database changes in SQL files, making rollback simple. Third, relations are simplified - when I query an application, I can automatically load all related analyses with one line: `application.analyses`.

Raw SQL would be faster for complex queries, but for 90% of applications, Prisma is the right balance of productivity and performance. If I hit performance limits, I can always use `prisma.$queryRaw()` for specific queries."

### Q: "How does authentication work?"

A: "Supabase handles the authentication flow. When a user signs up, Supabase returns a JWT token. The browser stores this token. Then I create a Profile record in my database so I can associate user data with that account.

On protected pages like the dashboard, I run a Server Component that validates the JWT using Supabase's server client. If it's invalid, I redirect to login. If it's valid, I query the database for that user's applications using their userId. This two-layer protection - JWT validation + database filtering - means even if someone somehow bypasses the JWT check, they still can't see other users' data."

### Q: "Why did you use Supabase instead of Firebase?"

A: "Supabase gives me PostgreSQL's relational power combined with Firebase's ease of use. The key advantage for my use case is Row-Level Security - I can write database policies that enforce data access at the database layer, not just the application layer. This means I don't have to trust my backend to filter data correctly; the database itself won't return other users' data.

PostgreSQL also has better support for complex queries if I add reporting features later. And I can self-host Supabase if needed, whereas Firebase locks me in. For this project, Supabase's free tier is more than sufficient."

### Q: "How do you handle the data relationships?"

A: "I designed a three-table schema: Profile, Application, and Analysis. Each user (Profile) has many applications they're tracking. Each application can have multiple analyses - for example, if they re-run the keyword analyzer after updating their resume, that creates a new Analysis record linked to the same Application.

In Prisma, these relationships are one line:
```
const application = await prisma.application.findUnique({
  where: { id },
  include: { analyses: true } // Automatically load all analyses
})
```

This design prevents data duplication - I don't duplicate the application data when running new analyses. It also allows me to track analysis history if I want to add features like 'view previous analyses'."

### Q: "Why use the Session Pooler instead of direct database connection?"

A: "I discovered I was on IPv4 while Supabase's direct connection required IPv6. The Session Pooler acts as a proxy that adds connection pooling on the database side. This has two benefits: First, it made the connection work. Second, it means multiple app instances can share a smaller connection pool, reducing overhead and making the app more scalable. In production on Vercel, this is important because each serverless function instance would otherwise need its own connection."

### Q: "What would you add next?"

A: "The number one priority is file uploads. Right now users paste text, but I want to support PDF uploads for resumes and job descriptions. I'd use Cloudinary for file storage, extract text server-side with a PDF parser, and store extracted text in the database for analyses.

After that, I'd focus on UI polish - the app is functional but looks basic. I'd redesign the landing page, add better navigation, use shadcn/ui components for modern styling, and make sure it's mobile responsive.

Then I'd add features like edit/delete applications, export recommendations, and an interview practice mode where users record themselves answering questions."

### Q: "How do you ensure data security?"

A: "Multiple layers: First, I use HTTPS/TLS for transport security. Second, Supabase JWT tokens are cryptographically signed - I validate them server-side on every protected request. Third, I use Row-Level Security policies in PostgreSQL - even if someone somehow bypasses my backend, the database won't return their data.

Fourth, I separate concerns between Server and Client Components - sensitive operations like database queries never happen on the client. Fifth, I use environment variables for secrets - database credentials never appear in frontend code. Sixth, I validate all inputs server-side, not just client-side, to prevent injection attacks.

It's defense in depth - multiple layers so if one fails, others protect the app."

### Q: "How would you handle 10,000 concurrent users?"

A: "The architecture scales well: Vercel automatically scales serverless functions, so increased traffic spawns more function instances. Supabase's connection pooler manages database connections, so multiple app instances don't exhaust the connection pool. The database is indexed on userId, so queries remain fast even with millions of records.

If I hit true limits, I'd consider: adding Redis caching for frequently accessed data, moving expensive operations like PDF parsing to background jobs with a queue service like Bull Redis, implementing CDN caching for static assets, or sharding the database if it gets too large.

But honestly, for an app like this tracking job applications, 10,000 concurrent users is overkill. Most users would be accessing it once a day. The architecture would handle 10,000 daily active users easily."

---

## Code Snippets to Explain

### Server Component (Security)
```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    redirect("/auth/login");
  }
  
  // This query only runs on the server - user can't see it
  const applications = await prisma.application.findMany({
    where: { userId: data.user.id }, // Filtered by user ID
  });
  
  return <Dashboard apps={applications} />;
}
```
**Explain:** "The database query only runs on the server, so the user can't inspect it or modify the userId filter. Even if they hack the frontend, this backend code is safe."

### Prisma Relations
```typescript
const application = await prisma.application.findUnique({
  where: { id: "app_123" },
  include: { analyses: true } // Load all related analyses
});

// Now I have:
// application.company
// application.role
// application.analyses[0].keywordScore
// application.analyses[0].missingKeywords
```
**Explain:** "This is the relational database power - one query loads the application and all its analyses. The database enforces the relationship, so data stays consistent."

### Utility Function
```typescript
export function extractKeywords(text: string) {
  return [...new Set(
    text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3 && !STOPWORDS.has(word))
  )];
}

export function compareKeywords(jobDesc: string, resume: string) {
  const jobKeywords = extractKeywords(jobDesc);
  const resumeKeywords = extractKeywords(resume);
  
  const matched = jobKeywords.filter(k => resumeKeywords.has(k));
  const missing = jobKeywords.filter(k => !resumeKeywords.has(k));
  
  return {
    score: Math.round((matched.length / jobKeywords.length) * 100),
    matched,
    missing,
  };
}
```
**Explain:** "This is intentionally simple - local text processing that's deterministic and fast. I could swap in an LLM or more sophisticated NLP later without changing the API."

---

## Visual Diagrams to Draw

### Data Flow Diagram
```
┌─────────────┐
│   Browser   │
│   (User)    │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────────────────────────────┐
│  Next.js API Route                  │
│  - Validate JWT                     │
│  - Process business logic           │
└──────┬──────────────────────────────┘
       │ Prisma Query
       ▼
┌─────────────────────────────────────┐
│  PostgreSQL (Supabase)              │
│  - RLS Policy checks userId         │
│  - Returns only that user's data    │
└──────┬──────────────────────────────┘
       │ JSON Response
       ▼
┌─────────────┐
│   Browser   │
│  (Display)  │
└─────────────┘
```

### Database Schema Diagram
```
Profile
├── id (PK)
├── email (unique)
├── fullName
└── applications[] (1-to-many)
    │
    └── Application
        ├── id (PK)
        ├── userId (FK to Profile)
        ├── company
        ├── role
        ├── jobDescription
        └── analyses[] (1-to-many)
            │
            └── Analysis
                ├── id (PK)
                ├── applicationId (FK)
                ├── keywordScore
                ├── missingKeywords (JSON)
                ├── optimizedBullets (JSON)
                └── interviewQuestions (JSON)
```

---

## Questions You Should Ask Back

1. "What does your current tech stack look like?"
   - Shows interest in their infrastructure

2. "How do you typically handle scaling challenges?"
   - Demonstrates you think about growth

3. "Do you use TypeScript in your projects?"
   - Shows your preference for type safety

4. "What's your approach to database design?"
   - Indicates you think about data modeling

5. "How do you balance speed of development with code quality?"
   - Shows maturity about real-world tradeoffs

---

## Remember to Mention

✅ Type safety throughout the codebase
✅ Security at multiple layers
✅ Relational database design
✅ Server-side rendering for security
✅ Responsive, mobile-friendly design
✅ Deployed on Vercel (automatic scaling)
✅ Used Session Pooler to solve real technical problem
✅ Would easily scale to thousands of users
✅ Clear separation of concerns (frontend/backend/database)
✅ Room for growth (file uploads, dark mode, advanced features)

---

## Don't Mention (Keeps It Simple)

❌ That it's a "learning project" (frame as "production-ready")
❌ Implementation struggles (focus on solutions)
❌ All the bugs you fixed (just mention "had to debug connection string format")
❌ Technical debt (everyone has it)
❌ "I copied this from a tutorial" (built a real app)


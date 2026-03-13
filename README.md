# ApplyPilot - AI Application Tracker

A modern, full-stack job application tracker with AI-powered resume analysis, resume bullet optimization, and interview preparation. Built with Next.js 16, React 19, TypeScript, Prisma, and Supabase.

## 🎯 Features

### 1. **Job Application Tracker**
Track all your job applications in one place.
- Add new applications with company, role, location, job URL, and date
- Store full job descriptions for later reference
- Monitor application status (Applied, Interview, Final Round, Rejected, Offer)
- Add personal notes for each application
- View all applications on dashboard
- Statistics dashboard showing totals by status

### 2. **Resume Keyword Analyzer**
Compare your resume against job descriptions to see how well you match.
- Paste job description and resume text
- Get instant fit score (0-100%)
- See which keywords you match
- Identify missing keywords (in red)
- Keyword-based analysis to improve your fit

### 3. **Resume Bullet Optimizer**
Transform weak resume bullets into powerful, impactful statements.
- Paste a weak resume bullet
- Get 3 improved variations instantly
- Uses strong action verbs (Built, Developed, Implemented, etc.)
- Each suggestion includes impact emphasis
- Copy any suggestion with one click

### 4. **Interview Prep Generator**
Get relevant interview questions based on the specific job.
- Enter job role and paste job description
- Get relevant technical questions for the role
- Includes standard behavioral questions
- Questions dynamically generated based on tech stack detected
- Supports: React, Next.js, TypeScript, Python, SQL, APIs, Docker, AWS, Testing, Databases, JavaScript

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account (free at supabase.com)

### Installation

1. **Clone and install**
```bash
git clone <repo-url>
cd Simplejobs
npm install
```

2. **Get Supabase credentials**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Go to Settings → API
   - Copy: Project URL and Anon Key
   - Go to Database → Connection Pooler
   - Copy connection strings

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-anon-key
DATABASE_URL=prisma+postgres://user:password@db.xxx.supabase.co:5432/postgres?schema=public
DIRECT_URL=postgresql://user:password@db.xxx.supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Initialize database**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
/app
  /api                    # Backend API routes
    /bullets              # Resume bullet optimization
    /interview            # Interview question generation
    /create-profile       # User profile & applications management
  /auth                   # Login and signup pages
  /dashboard              # Main statistics dashboard
  /applications           # View and create job applications
  /tools                  # AI-powered tools
    /keyword-analyzer
    /bullet-optimizer
    /interview-prep

/lib
  /supabase              # Authentication clients
  prisma.ts              # Database client
  keyword-extractor.ts   # Keyword analysis logic
  bullet-optimizer.ts    # Resume bullet optimization logic

/prisma
  schema.prisma          # Database models

/components/ui           # Reusable UI components
```

## 🗄️ Database Schema

### Profile Model
```
- id (Supabase user ID)
- email
- fullName (optional)
- createdAt
- applications (relationship)
```

### Application Model
```
- id
- userId (reference to Profile)
- company
- role
- location
- jobUrl
- dateApplied
- status (APPLIED, ACCEPTED, INTERVIEW, FINAL_ROUND, REJECTED, OFFER)
- notes
- jobDescription
- createdAt
- updatedAt
- analyses (relationship)
```

### Analysis Model
```
- id
- applicationId (reference to Application)
- keywordScore
- fitScore
- missingKeywords
- optimizedBullets
- interviewQuestions
- createdAt
```

## 🔌 API Routes

### Authentication & Profile
- **POST** `/api/create-profile` - Create user profile after signup

### Applications (Auth Required)
- **GET** `/api/create-profile/applications` - Get all user's applications
- **POST** `/api/create-profile/applications` - Create new application

### Analysis Tools (No Auth Required)
- **POST** `/api/create-profile/score` - Analyze resume vs job description
- **POST** `/api/interview` - Generate interview questions
- **POST** `/api/bullets` - Optimize resume bullet

## 📖 How to Use

### Adding a Job Application
1. Click "Add Application" on `/applications/new`
2. Fill in company, role, location, and job URL
3. (Optional) Paste the full job description - you'll use this for analysis
4. Click "Save Application"
5. View all applications on the dashboard

### Analyzing Resume Fit
1. Go to `/tools/keyword-analyzer`
2. Paste the job description in the first box
3. Paste your resume text in the second box
4. Click "Analyze"
5. See your fit score and missing keywords
6. Green badges = keywords you have
7. Red badges = keywords you're missing

### Optimizing Resume Bullets
1. Go to `/tools/bullet-optimizer`
2. Paste a weak resume bullet (e.g., "worked on projects")
3. Click "Optimize"
4. Get 3 improved variations with action verbs
5. Copy your favorite suggestion
6. Update your resume with the improved bullet

### Preparing for Interview
1. Go to `/tools/interview-prep`
2. Enter the job role (e.g., "Senior React Developer")
3. Paste the job description
4. Click "Generate Questions"
5. See technical questions specific to the tech stack
6. Practice answering both technical and behavioral questions

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Database commands
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Create/run migrations
npx prisma studio       # Open database GUI
npx prisma db reset     # Clear database (dev only)

# Prisma migrations
npx prisma migrate dev --name migration_name
npx prisma migrate deploy
```

## 🔐 Authentication

The app uses **Supabase Auth** for user authentication:
- Sign up with email/password
- Profile automatically created in database
- Session maintained via cookies
- Protected routes redirect to login
- Server-side auth validation on API routes

## 🚢 Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Add Environment Variables**
   - Go to project settings
   - Add all variables from `.env.example`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
     - `DATABASE_URL`
     - `DIRECT_URL`
     - `NEXT_PUBLIC_APP_URL` (your Vercel URL)

4. **Run Database Migrations**
   - After first deployment, you may need to run:
   ```bash
   npx prisma migrate deploy
   ```

## 🔍 Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` and `DIRECT_URL` in `.env.local`
- Verify Supabase project is active
- Run `npx prisma generate`

### "Supabase auth not working"
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` matches
- Ensure Supabase Auth is enabled in project

### "API route returns 404"
- Check route path is correct
- Rebuild: `npm run build`
- Restart dev server: `npm run dev`

### "Cannot fetch applications"
- Verify you're logged in
- Check browser console for errors
- Check API is accessible: `curl http://localhost:3000/api/create-profile/applications`

### "Analyze button not working"
- Both job description and resume text required
- Try with shorter text if timeout occurs
- Check browser console for errors

## 💡 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 19.2.3 |
| **Framework** | Next.js | 16.1.6 |
| **Build** | Turbopack | Latest |
| **Language** | TypeScript | 5 |
| **Styling** | Tailwind CSS | 4 |
| **UI Components** | shadcn/ui + Radix UI | Latest |
| **Database** | PostgreSQL | Latest |
| **ORM** | Prisma | 6.19.2 |
| **Auth** | Supabase | Latest |
| **Icons** | Lucide React | 0.577.0 |
| **Charts** | Recharts | 3.8.0 |
| **Validation** | Zod | 4.3.6 |

## 📊 Project Statistics

- **React Components**: 15+
- **API Routes**: 5
- **Database Models**: 3
- **Utility Functions**: 6+
- **Lines of Code**: 2000+
- **Type Coverage**: 100%

## 🎯 Next Steps

### Immediate
- [ ] Set up Supabase account
- [ ] Configure `.env.local`
- [ ] Run `npm install && npx prisma migrate dev`
- [ ] Start dev server and test features

### Short Term (1-2 weeks)
- [ ] Customize styling
- [ ] Add more analysis features
- [ ] Implement email notifications
- [ ] Add resume parser

### Long Term (1-3 months)
- [ ] LinkedIn integration
- [ ] AI cover letter generator
- [ ] Mock interview video recording
- [ ] Team collaboration features
- [ ] Salary negotiation guides

## 📝 Environment Variables

Required for development:

```env
# Supabase (get from project settings)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-anon-key

# Database (from connection pooler)
DATABASE_URL=prisma+postgres://user:password@db.xxx.supabase.co:5432/postgres?schema=public
DIRECT_URL=postgresql://user:password@db.xxx.supabase.co:5432/postgres

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See `.env.example` for template.

## 📄 License

MIT - Feel free to use this project for any purpose.

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit pull requests.

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review your `.env.local` configuration
3. Check browser console for error messages
4. Verify Supabase project is properly configured

---

**Built with ❤️ using Next.js 16, React 19, and Supabase**

**Happy job hunting! 🚀**

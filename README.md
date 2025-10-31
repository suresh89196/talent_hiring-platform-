@@ -0,0 +1,363 @@
# TalentFlow - Hiring Platform

A modern, full-featured hiring management platform built with Next.js, React, and Tailwind CSS. TalentFlow helps you manage job postings, candidates, and assessments in one unified interface.

## Features

### 📋 Jobs Management
- Create and manage job postings
- Track job status (open, closed, filled)
- Organize jobs by department
- View detailed job information and requirements
- Rich job descriptions with markdown support

### 👥 Candidates Management
- Centralized candidate database
- Track candidate status (applied, reviewing, interviewing, offered, hired, rejected)
- Kanban board view for visual workflow management
- Detailed candidate profiles with qualifications
- Contact information and application history

### 📊 Assessment System
- Build custom assessments for different roles
- Create multi-section assessments with customizable questions
- Question types: Multiple Choice, Short Answer, and Long Answer
- Preview assessments before publishing
- Link assessments to specific job postings

### 💾 Local Data Persistence
- All data stored in IndexedDB for offline capability
- Automatic data synchronization
- No server required for core functionality
- Mock API layer for realistic data handling

### 🎨 Modern UI/UX
- Clean, professional interface
- Dark mode support
- Responsive design for all screen sizes
- Accessibility-first component design
- Real-time updates and instant feedback

## Tech Stack

- **Frontend**: React 19.2, Next.js 16
- **Styling**: Tailwind CSS 4.1, shadcn/ui components
- **Database**: IndexedDB (client-side storage)
- **Forms**: React Hook Form, Zod validation
- **UI Components**: Radix UI, Recharts
- **Icons**: Lucide React
- **Utilities**: date-fns, class-variance-authority

## Project Structure

\`\`\`
talentflow/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Home/Jobs listing page
│   ├── jobs/                    # Jobs management pages
│   ├── candidates/              # Candidates pages
│   ├── candidates-kanban/       # Kanban board view
│   ├── assessments/             # Assessment builder
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles and theme
├── components/
│   ├── jobs/                    # Job-related components
│   ├── candidates/              # Candidate-related components
│   ├── assessments/             # Assessment components
│   ├── layout/                  # Layout wrapper component
│   ├── theme-provider.tsx       # Theme configuration
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── db.ts                    # IndexedDB initialization and queries
│   ├── mock-api.ts              # Mock API layer
│   ├── seed-data.ts             # Sample data generation
│   ├── sync-manager.ts          # Data synchronization logic
│   ├── types.ts                 # TypeScript interfaces
│   ├── utils.ts                 # Utility functions
│   └── hooks/                   # Custom React hooks
├── public/                      # Static assets
├── package.json                 # Dependencies
├── next.config.mjs              # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── postcss.config.mjs           # PostCSS configuration
\`\`\`

## Getting Started

### Prerequisites
- Node.js 18+ (v20+ recommended)
- npm or pnpm package manager

### Installation

1. **Using shadcn CLI** (Recommended):
   \`\`\`bash
   npx shadcn-cli@latest init -d
   \`\`\`
   Choose your options when prompted, then navigate to the project:
   \`\`\`bash
   cd my-talentflow-app
   \`\`\`

2. **Manual Installation**:
   \`\`\`bash
   git clone <repository-url>
   cd talentflow
   npm install
   # or
   pnpm install
   \`\`\`

### Running Locally

\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser. The application will automatically initialize with sample data on first load.

### Build for Production

\`\`\`bash
npm run build
npm start
# or
pnpm build
pnpm start
\`\`\`

## Usage Guide

### Managing Jobs

1. Navigate to the **Jobs** page from the sidebar
2. Click **"Add New Job"** to create a job posting
3. Fill in job details: title, department, requirements, description
4. Set the job status (Open, Closed, Filled)
5. Save the job

### Managing Candidates

1. Go to the **Candidates** page
2. View candidates in list or Kanban board view
3. Click a candidate to view their profile
4. Update candidate status through the workflow
5. Track application history and notes

### Building Assessments

1. Navigate to the **Assessments** page
2. Create a new assessment and add sections
3. Add questions to each section (Multiple Choice, Short Answer, Long Answer)
4. Configure question options and answers
5. Preview your assessment before publishing
6. Link assessment to job postings

### Using the Kanban Board

- Access the **Candidates Kanban** view for visual workflow management
- Drag candidates between status columns
- See all stages: Applied → Reviewing → Interviewing → Offered → Hired/Rejected
- Filter and search candidates within the board

## Data Management

### Data Storage
- All data is stored locally in your browser's IndexedDB
- Data persists between sessions
- No data is sent to external servers

### Sample Data
The application comes with seed data that's automatically loaded on first run:
- 8 sample job postings
- 25 candidate profiles
- 6 pre-built assessments

To reset data and reload samples:
1. Open browser DevTools (F12)
2. Go to Application → IndexedDB
3. Delete the "talentflow" database
4. Refresh the page

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub:
   \`\`\`bash
   git push origin main
   \`\`\`

2. Visit [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Import Project" and select your repository
4. Configure project settings (defaults work fine)
5. Click "Deploy"

Your app will be live at `https://your-project.vercel.app`

### Deploy to Other Platforms

**Netlify**:
\`\`\`bash
npm run build
# Deploy the .next folder
\`\`\`

**Docker**:
\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

**GitHub Pages**:
\`\`\`bash
npm run build
# Export static site (requires static export configuration)
\`\`\`

## API Reference

### Mock API Endpoints

The application uses a mock API layer (`lib/mock-api.ts`) that simulates REST endpoints:

#### Jobs
- `getJobs()` - Retrieve all jobs
- `getJobById(id)` - Get specific job
- `createJob(job)` - Create new job
- `updateJob(id, updates)` - Update existing job
- `deleteJob(id)` - Delete job

#### Candidates
- `getCandidates()` - Retrieve all candidates
- `getCandidateById(id)` - Get specific candidate
- `createCandidate(candidate)` - Create new candidate
- `updateCandidate(id, updates)` - Update candidate
- `deleteCandidate(id)` - Delete candidate

#### Assessments
- `getAssessments()` - Retrieve all assessments
- `getAssessmentById(id)` - Get specific assessment
- `createAssessment(assessment)` - Create new assessment
- `updateAssessment(id, updates)` - Update assessment
- `deleteAssessment(id)` - Delete assessment

## Customization

### Theme Colors
Edit `app/globals.css` to change the color scheme:
\`\`\`css
:root {
  --primary: oklch(0.35 0.18 264);      /* Primary brand color */
  --secondary: oklch(0.5 0.15 200);     /* Secondary color */
  --accent: oklch(0.65 0.15 150);       /* Accent highlights */
  /* ... more colors ... */
}
\`\`\`

### Add New Pages
1. Create a new file in `app/` directory
2. Export a React component as default
3. The route is automatically available

### Extend Data Models
1. Update types in `lib/types.ts`
2. Modify database schema in `lib/db.ts`
3. Update seed data in `lib/seed-data.ts`
4. Update mock API in `lib/mock-api.ts`

## Performance Optimization

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Configured for Vercel deployment
- **CSS-in-JS**: Tailwind CSS with optimized bundle
- **Lazy Loading**: Components loaded on demand
- **Caching**: IndexedDB caching for local data

## Accessibility

The platform follows WCAG 2.1 AA standards:
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Focus indicators for interactive elements

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Data Not Persisting
- Clear browser cache and IndexedDB
- Check browser storage quota
- Ensure cookies are not blocked

### Performance Issues
- Clear browser cache
- Disable browser extensions
- Check available memory

### Build Errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Ensure Node.js version is 18+

## Contributing

To contribute to TalentFlow:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - Feel free to use this project for personal or commercial use.

## Support

For issues and questions:
1. Check the Troubleshooting section
2. Review browser console for error messages
3. Ensure all dependencies are installed correctly

## Roadmap

### Planned Features
- User authentication and multi-user support
- Server-side persistence with database backend
- Email notifications and reminders
- Resume parsing and analysis
- Interview scheduling integration
- Analytics and reporting dashboards
- Bulk import/export functionality
- Advanced filtering and search
- Custom workflow states
- Integration with popular job boards

## Version History

### v1.0.0 (Current)
- Initial release
- Core job, candidate, and assessment management
- Local data persistence
- Modern UI with dark mode support
- Kanban board view
- Comprehensive documentation

---

Built with ❤️ by the TalentFlow team. Happy hiring!

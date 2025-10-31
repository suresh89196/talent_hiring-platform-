# TalentFlow Development Guide

This guide covers development setup, architecture, and contribution guidelines.

## Development Environment

### Prerequisites
- Node.js 18+ (v20+ recommended)
- npm or pnpm
- Git
- A code editor (VS Code recommended)
- Modern browser with DevTools

### Initial Setup

\`\`\`bash
# Clone repository
git clone https://github.com/yourusername/talentflow.git
cd talentflow

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
\`\`\`

### VS Code Extensions (Recommended)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin
- Thunder Client (for API testing)

## Project Architecture

### Directory Structure Explained

\`\`\`
lib/
├── db.ts              # IndexedDB operations (init, queries, updates)
├── mock-api.ts        # API layer simulating REST endpoints
├── seed-data.ts       # Sample data generation
├── sync-manager.ts    # Data synchronization logic
├── types.ts           # TypeScript interfaces for all entities
├── utils.ts           # Shared utility functions
└── hooks/             # Custom React hooks
    ├── use-jobs.ts    # Job data management
    ├── use-candidates.ts  # Candidate data management
    └── use-assessments.ts # Assessment data management
\`\`\`

### Data Flow Architecture

\`\`\`
Component
    ↓
Custom Hook (useJobs, useCandidates, etc.)
    ↓
Mock API Layer (lib/mock-api.ts)
    ↓
Database Layer (lib/db.ts)
    ↓
IndexedDB
\`\`\`

### State Management Pattern

TalentFlow uses React hooks + IndexedDB (no Redux/Zustand needed):

\`\`\`typescript
// Custom hook pattern
export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    mockAPI.getJobs().then(result => {
      setJobs(result.data)
      setLoading(false)
    })
  }, [])
  
  return { jobs, loading, add, update, delete }
}

// Usage in component
function MyComponent() {
  const { jobs, loading } = useJobs()
  // render jobs...
}
\`\`\`

## Data Models

### Job
\`\`\`typescript
interface Job {
  id: string
  title: string
  department: string
  status: 'open' | 'closed' | 'filled'
  requirements: string[]
  description: string
  createdAt: string
  updatedAt: string
}
\`\`\`

### Candidate
\`\`\`typescript
interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  status: 'applied' | 'reviewing' | 'interviewing' | 'offered' | 'hired' | 'rejected'
  appliedJobs: string[] // Job IDs
  qualifications: string[]
  createdAt: string
  updatedAt: string
}
\`\`\`

### Assessment
\`\`\`typescript
interface Assessment {
  id: string
  title: string
  jobId: string
  sections: AssessmentSection[]
  createdAt: string
  updatedAt: string
}

interface AssessmentSection {
  id: string
  title: string
  questions: Question[]
}

interface Question {
  id: string
  text: string
  type: 'multiple-choice' | 'short-answer' | 'long-answer'
  options?: string[] // For multiple choice
  correctAnswer?: string
}
\`\`\`

## Development Workflow

### Creating a New Feature

1. **Create a new branch**
   \`\`\`bash
   git checkout -b feature/my-feature
   \`\`\`

2. **Update types** (if needed)
   \`\`\`typescript
   // lib/types.ts
   export interface MyNewType {
     id: string
     // fields...
   }
   \`\`\`

3. **Add to database** (if needed)
   \`\`\`typescript
   // lib/db.ts
   export async function addMyNewType(item: MyNewType) {
     const db = await getDB()
     return db.add('myNewTypes', item)
   }
   \`\`\`

4. **Update mock API** (if needed)
   \`\`\`typescript
   // lib/mock-api.ts
   export const mockAPI = {
     async getMyNewTypes() {
       const db = await getDB()
       const items = await db.getAll('myNewTypes')
       return { data: items, error: null }
     }
   }
   \`\`\`

5. **Create custom hook** (if needed)
   \`\`\`typescript
   // lib/hooks/use-my-new-type.ts
   export function useMyNewType() {
     const [items, setItems] = useState<MyNewType[]>([])
     
     useEffect(() => {
       mockAPI.getMyNewTypes().then(result => {
         setItems(result.data)
       })
     }, [])
     
     return { items }
   }
   \`\`\`

6. **Create component**
   \`\`\`typescript
   // components/my-feature/my-feature-list.tsx
   export default function MyFeatureList() {
     const { items } = useMyNewType()
     
     return (
       <div>
         {items.map(item => (
           <div key={item.id}>{item.name}</div>
         ))}
       </div>
     )
   }
   \`\`\`

7. **Add route** (if new page)
   \`\`\`typescript
   // app/my-feature/page.tsx
   export default function MyFeaturePage() {
     return <MyFeatureList />
   }
   \`\`\`

8. **Test locally**
   \`\`\`bash
   npm run dev
   # Test in browser
   \`\`\`

9. **Commit changes**
   \`\`\`bash
   git add .
   git commit -m "feat: add my new feature"
   git push origin feature/my-feature
   \`\`\`

10. **Create pull request** on GitHub

### Code Conventions

**TypeScript**
- Use strict mode
- Type all function parameters and returns
- Use interfaces for object shapes

**React**
- Use functional components
- Use hooks for state management
- Extract complex logic to custom hooks
- Memoize expensive components

**Styling**
- Use Tailwind CSS classes
- Use semantic color tokens
- Follow mobile-first approach
- Use `cn()` utility for conditional classes

**Naming**
- Components: PascalCase
- Files: kebab-case
- Variables/functions: camelCase
- Constants: UPPER_SNAKE_CASE

### Testing

Currently no automated tests configured. Recommended additions:

\`\`\`bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Example test file
// components/jobs/job-card.test.tsx
import { render, screen } from '@testing-library/react'
import JobCard from './job-card'

describe('JobCard', () => {
  it('renders job title', () => {
    const job = { id: '1', title: 'Engineer', /* ... */ }
    render(<JobCard job={job} />)
    expect(screen.getByText('Engineer')).toBeInTheDocument()
  })
})
\`\`\`

## Database Debugging

### View IndexedDB Data

1. Open DevTools (F12)
2. Application tab
3. IndexedDB → talentflow
4. Browse tables and data

### Clear All Data

\`\`\`javascript
// In browser console
const req = indexedDB.deleteDatabase('talentflow')
// Refresh page
\`\`\`

### Export Data

\`\`\`javascript
// In browser console
async function exportData() {
  const db = await new Promise((resolve, reject) => {
    const req = indexedDB.open('talentflow')
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  
  const stores = Array.from(db.objectStoreNames)
  const data = {}
  
  for (let store of stores) {
    const tx = db.transaction(store)
    const items = await new Promise((resolve, reject) => {
      const req = tx.objectStore(store).getAll()
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
    data[store] = items
  }
  
  console.log(JSON.stringify(data, null, 2))
}

exportData()
\`\`\`

## Performance Optimization

### Bundle Analysis

\`\`\`bash
npm install --save-dev @next/bundle-analyzer

# Add to next.config.mjs
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)

# Run analysis
ANALYZE=true npm run build
\`\`\`

### Lighthouse Audit

\`\`\`bash
# In Chrome DevTools
# DevTools → Lighthouse
# Click "Generate report"
\`\`\`

### Code Splitting Best Practices

\`\`\`typescript
// Import components dynamically
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <div>Loading...</div>
})
\`\`\`

## Debugging Tips

### Browser Console Logging

\`\`\`typescript
// Use descriptive prefixes
console.log('[v0] Component rendered:', props)
console.error('[v0] Error occurred:', error)
console.warn('[v0] Warning message')
\`\`\`

### React DevTools

- Install React DevTools browser extension
- Inspect component props and state
- Profile component render performance

### Network Debugging

1. DevTools → Network tab
2. Filter by Fetch/XHR
3. Check mock API calls
4. Inspect request/response payloads

## Common Issues and Solutions

### "Module not found" Error
\`\`\`bash
# Ensure all imports have correct paths
# Check file names match exactly (case-sensitive)
# Verify tsconfig paths are correct
\`\`\`

### State Not Updating
\`\`\`typescript
// Create new object/array reference
setState([...state, newItem])  // Good
setState(state.push(newItem))  // Bad - mutates original
\`\`\`

### Styles Not Applying
\`\`\`typescript
// Use className instead of class
<div className="bg-primary">  // Good
<div class="bg-primary">      // Bad

// Ensure Tailwind CSS is imported
import './globals.css'
\`\`\`

### Performance Degradation
\`\`\`typescript
// Memoize expensive components
export default memo(ExpensiveComponent)

// Use useCallback for functions
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies])
\`\`\`

## Git Workflow

\`\`\`bash
# View branches
git branch

# Create feature branch
git checkout -b feature/feature-name

# Stage changes
git add .

# Commit with message
git commit -m "type: description"
# Types: feat, fix, docs, style, refactor, perf, test

# Push to remote
git push origin feature/feature-name

# Create pull request on GitHub

# After merge, update local
git checkout main
git pull origin main
\`\`\`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

---

Happy coding! For questions or issues, open a GitHub issue or contact the team.

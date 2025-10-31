# TalentFlow Deployment Guide

This guide covers deploying TalentFlow to various platforms.

## Deployment Options

### 1. Vercel (Recommended)

**Why Vercel?**
- Zero configuration deployment
- Automatic HTTPS
- Global CDN
- Free tier available
- Perfect for Next.js applications

**Steps:**

1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/talentflow.git
   git push -u origin main
   \`\`\`

2. **Import on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Accept default settings
   - Click "Deploy"

3. **Post-Deployment**
   - Your app is live at `https://[project-name].vercel.app`
   - Configure custom domain in Vercel dashboard
   - Enable automatic deployments from `main` branch

### 2. Netlify

**Steps:**

1. **Build the project**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Drag and Drop Deploy**
   - Visit [netlify.com](https://netlify.com)
   - Drag the `.next` folder onto the Netlify dashboard
   - Your site is deployed!

3. **Connected Deployment**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Push to deploy automatically

### 3. Docker Deployment

**Create Dockerfile:**
\`\`\`dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
\`\`\`

**Build and Run:**
\`\`\`bash
# Build image
docker build -t talentflow:latest .

# Run container
docker run -p 3000:3000 talentflow:latest
\`\`\`

**Deploy to Docker Hub:**
\`\`\`bash
# Tag image
docker tag talentflow:latest yourusername/talentflow:latest

# Push to Docker Hub
docker push yourusername/talentflow:latest
\`\`\`

### 4. Railway

**Steps:**

1. **Connect GitHub**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configure**
   - Select your repository
   - Add environment variables if needed
   - Railway auto-detects Next.js

3. **Deploy**
   - Click "Deploy"
   - Monitor deployment status
   - Get your live URL

### 5. AWS Amplify

**Steps:**

1. **Connect Repository**
   - Visit AWS Amplify Console
   - Click "New App" → "Host Web App"
   - Connect your GitHub account

2. **Configure Build**
   - Select your repository and branch
   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`

3. **Deploy**
   - Click "Save and Deploy"
   - Monitor deployment progress

## Environment Variables

Create a `.env.local` file for local development:

\`\`\`env
# Database (if using external DB in future)
# DATABASE_URL=your_database_url

# API Keys (if using external services)
# API_KEY=your_api_key
\`\`\`

**For Deployment:**
1. Add environment variables in platform dashboard
2. Never commit secrets to git
3. Use `.env.local` for local development only

## Pre-Deployment Checklist

- [ ] All code committed to git
- [ ] Tests passing (if applicable)
- [ ] No console errors in development
- [ ] Environment variables configured
- [ ] Build completes successfully (`npm run build`)
- [ ] Metadata in `app/layout.tsx` updated
- [ ] No TypeScript errors
- [ ] Performance optimizations applied

## Post-Deployment

### 1. Verify Deployment
- Visit your live URL
- Test all main features
- Check data persistence
- Test on mobile devices
- Verify dark mode works

### 2. Monitor Performance
- Check Lighthouse scores
- Monitor Core Web Vitals
- Review error logs
- Track user analytics

### 3. Set Up Monitoring

**Vercel Analytics:**
Already configured - view on Vercel dashboard

**Web Vitals:**
Already instrumented in `app/layout.tsx`

### 4. Configure Custom Domain

**On Vercel:**
1. Project Settings → Domains
2. Add custom domain
3. Update DNS records (Vercel provides guide)
4. HTTPS auto-configured

**On Netlify:**
1. Domain settings
2. Add domain
3. Configure DNS
4. HTTPS auto-enabled

## Scaling Considerations

As TalentFlow grows:

### Database Migration
- Upgrade from IndexedDB to backend database
- Options: Supabase, Firebase, PostgreSQL
- Update mock API layer to use real endpoints

### Backend Services
- Implement Node.js/Python backend API
- Add authentication system
- Set up database migrations

### Infrastructure
- CDN for static assets
- Image optimization service
- Caching layers
- Load balancing

## Troubleshooting Deployment

### Build Fails
\`\`\`bash
# Clear build artifacts
rm -rf .next
rm -rf node_modules
npm install
npm run build
\`\`\`

### Application Not Loading
- Check environment variables
- Verify node version matches requirements
- Check logs on deployment platform

### Performance Issues
- Verify Next.js optimization settings
- Check image optimization
- Review bundle size
- Monitor server response times

### Data Not Persisting
- Verify IndexedDB is enabled in browser
- Check browser storage quota
- Ensure cookies not blocked
- Clear browser cache and reload

## Backup and Recovery

**Local Backup:**
\`\`\`bash
# Export data from IndexedDB
# Use browser DevTools → Application → IndexedDB
\`\`\`

**Git Backup:**
- All code automatically backed up in git
- Push regularly to remote repository

## Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

\`\`\`yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        run: npx vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
\`\`\`

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Docker Documentation](https://docs.docker.com)

---

Need help? Check the main README.md or review platform-specific documentation.

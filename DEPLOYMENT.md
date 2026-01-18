# Deployment Guide

## Quick Deploy to Vercel (Recommended)

Vercel provides the easiest deployment for Next.js applications.

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to project directory:
```bash
cd "/Users/andrew-mbp/Documents/claude projects/Care Navigator"
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? **Your account**
   - Link to existing project? **N**
   - Project name? **care-navigator** (or your choice)
   - Directory? **./** (current directory)
   - Override settings? **N**

5. Your app will be live at: `https://care-navigator-xxxxx.vercel.app`

### Option 2: Deploy via Vercel Dashboard

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: CareNavigator prototype"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"

## Alternative: Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Deploy:
```bash
netlify deploy --prod
```

## Environment Setup

This prototype has NO environment variables or secrets. All data is client-side only.

## Post-Deployment Checklist

- [ ] Test the landing page loads
- [ ] Complete the 5-step quiz
- [ ] Verify results page shows benefit cards
- [ ] Test with Texas resident persona
- [ ] Test with California resident persona
- [ ] Verify localStorage persistence (refresh during quiz)
- [ ] Test mobile responsiveness
- [ ] Run accessibility audit (Chrome DevTools Lighthouse)

## Performance Optimization

The build is already optimized for production with:
- ✅ Static generation for landing/quiz/results pages
- ✅ Automatic code splitting by Next.js
- ✅ Tailwind CSS purging (removes unused styles)
- ✅ Image optimization (if you add images later)

## Custom Domain (Optional)

### On Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### On Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS

## Monitoring & Analytics (Optional for V2)

For production, consider adding:
- **Vercel Analytics**: Built-in, privacy-friendly
- **PostHog**: Open-source product analytics
- **Sentry**: Error tracking

## Troubleshooting

### Build fails with "Module not found"
- Run `npm install` to ensure all dependencies are installed
- Check that all imports use correct paths (@/ alias)

### Deployment succeeds but shows blank page
- Check browser console for errors
- Verify all files are committed to git
- Ensure no environment variables are missing (none needed for this prototype)

### Quiz data not persisting
- Ensure user's browser allows localStorage
- Check for browser privacy settings blocking storage

## Sharing the Prototype

Once deployed, share the URL with:
- **Investors**: For pitch deck demos
- **Technical Founders**: For code review
- **Users**: For user testing and feedback
- **Partners**: For collaboration discussions

Example URLs:
- Live Demo: `https://care-navigator-demo.vercel.app`
- GitHub Repo: `https://github.com/yourusername/care-navigator`

---

**Need help?** Check the README.md for more detailed setup instructions.

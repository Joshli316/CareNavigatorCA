# Cloudflare Pages Deployment Guide

## Quick Start - Deploy via Dashboard (Recommended)

This guide will help you deploy the CareNavigator application to Cloudflare Pages using the web dashboard.

---

## Prerequisites

✅ GitHub repository created: https://github.com/andrew-indigitous/care-navigator
✅ Code pushed to repository
⏳ Cloudflare account (free tier works perfectly)

---

## Step-by-Step Deployment Instructions

### Step 1: Access Cloudflare Dashboard

1. Go to: **https://dash.cloudflare.com**
2. Log in to your Cloudflare account
   - If you don't have an account, create one (it's free)
   - No credit card required for the free tier

### Step 2: Navigate to Pages

1. In the left sidebar, click **"Workers & Pages"**
2. Click the **"Create application"** button
3. Select the **"Pages"** tab
4. Click **"Connect to Git"**

### Step 3: Connect GitHub Repository

1. Click **"Connect GitHub"**
2. A popup will appear asking you to authorize Cloudflare
3. Click **"Authorize Cloudflare"**
4. Select your repositories:
   - You can choose "All repositories" or "Only select repositories"
   - Make sure `care-navigator` is selected
5. Click **"Install & Authorize"**

### Step 4: Select Repository

1. You'll see a list of your GitHub repositories
2. Find and click on **`andrew-indigitous/care-navigator`**
3. Click **"Begin setup"**

### Step 5: Configure Build Settings

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Project name** | `care-navigator` (or your preferred name) |
| **Production branch** | `main` |
| **Framework preset** | **Next.js** (select from dropdown) |
| **Build command** | `npm run build` |
| **Build output directory** | `.next` |

**Environment variables:** (None required for this prototype)

### Step 6: Deploy

1. Click **"Save and Deploy"**
2. Cloudflare will start building your application
   - This typically takes 2-5 minutes
   - You can watch the build logs in real-time
3. Once complete, you'll see a success message with your deployment URL

---

## Your Deployment URL

After deployment, your application will be available at:

```
https://care-navigator.pages.dev
```

Or with your custom project name:

```
https://[your-project-name].pages.dev
```

---

## Post-Deployment

### Verify the Deployment

1. Click the deployment URL to open your application
2. Test the quiz flow:
   - Start the eligibility quiz
   - Complete all 5 steps
   - Verify results display correctly
   - Check that all 34 benefit programs are showing

### Automatic Deployments

Good news! Every time you push to the `main` branch on GitHub, Cloudflare Pages will automatically:
- Build your application
- Deploy the new version
- Keep your site live with zero downtime

### Custom Domain (Optional)

To add a custom domain like `carenavigator.com`:

1. In your Cloudflare Pages project, go to **"Custom domains"**
2. Click **"Set up a custom domain"**
3. Enter your domain name
4. Follow the DNS configuration instructions
5. Cloudflare automatically provides free SSL certificates

---

## Troubleshooting

### Build Fails with "npm ERR!"

**Solution:** Check the build logs for the specific error. Common issues:
- Missing dependencies: Run `npm install` locally first
- TypeScript errors: Fix any type errors in your code

### "Page not found" after deployment

**Solution:** Verify the build output directory is set to `.next`

### Application loads but shows errors

**Solution:** Check the browser console for errors. This is typically due to:
- Environment variables not set (though none are required for this prototype)
- Client-side JavaScript errors

---

## Build Optimization (Optional)

For faster builds and better performance, you can add these to your build settings:

**Environment Variables:**
```
NODE_VERSION=18
NPM_FLAGS=--legacy-peer-deps
```

**Build Command (optimized):**
```bash
npm ci && npm run build
```

---

## Monitoring & Analytics

Cloudflare Pages provides built-in analytics:

1. Go to your project dashboard
2. Click the **"Analytics"** tab
3. View:
   - Page views
   - Unique visitors
   - Response times
   - Geographic distribution

---

## Deployment Status

- ✅ GitHub repository created and pushed
- ⏳ Cloudflare Pages deployment (in progress - follow steps above)
- ⏳ Live URL verification pending

Once deployed, update this section with:
- 🎉 Live URL: `https://care-navigator.pages.dev`
- 🎉 Deployment date: [DATE]

---

## Next Steps After Deployment

1. **Share the URL** with stakeholders for feedback
2. **Test all features** in the production environment
3. **Monitor build logs** for any issues
4. **Set up custom domain** (optional)
5. **Add analytics tracking** if needed (Google Analytics, etc.)

---

## Support Resources

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Next.js on Cloudflare**: https://developers.cloudflare.com/pages/framework-guides/nextjs/
- **GitHub Integration**: https://developers.cloudflare.com/pages/get-started/git-integration/

---

## CLI Deployment (Alternative - Not Recommended for Initial Setup)

If you prefer CLI deployment, you can use Wrangler:

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
npx wrangler pages deploy .next --project-name=care-navigator
```

**Note:** Dashboard deployment is recommended for initial setup as it's more reliable and provides better visibility into the build process.

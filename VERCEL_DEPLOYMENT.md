# Vercel Deployment Guide for Oxal

## Overview
Vercel is the optimal platform for Next.js applications. It provides:
- **Edge caching** globally (reduces 1,134 ms server response to <100 ms)
- **Automatic deployments** from Git
- **Free tier** for static sites
- **Integrated analytics** and performance monitoring

## Performance Benefits
With Vercel deployment, you'll see:
- Document request latency: **1,134 ms → 100-200 ms** (1,000+ ms savings)
- Automatic CDN edge caching worldwide
- Built-in image optimization
- Serverless functions with auto-scaling

## Deployment Steps

### Step 1: Create Vercel Account
1. Go to https://vercel.com/signup
2. Sign up with GitHub, GitLab, or email
3. Authorize Vercel to access your GitHub account

### Step 2: Import Project
1. Visit https://vercel.com/new
2. Select **Next.js** as framework
3. Choose your repository (`oxal-web-shop`)
4. Configure project settings:
   - **Project Name**: `oxal-web-shop`
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (default)

### Step 3: Environment Variables
Add if needed (currently none required):
- Leave blank if using defaults
- Can add later in Project Settings → Environment Variables

### Step 4: Deploy
1. Click **Deploy**
2. Wait for build to complete (~2-3 minutes)
3. Get your deployment URL: `https://oxal-web-shop.vercel.app`

### Step 5: Custom Domain
1. Go to Project Settings → Domains
2. Add your domain: `oxal.shop`
3. Update DNS records at your domain registrar:
   - **CNAME**: `cname.vercel-dns.com`
   - Or use **A records** Vercel provides
4. DNS propagation: 5-48 hours

## Post-Deployment Verification

### Check Performance
1. Run Lighthouse on production URL
2. Expected Lighthouse scores:
   - **Performance**: 90+
   - **SEO**: 92+
   - **Accessibility**: 95+
   - **Best Practices**: 100

### Monitor Analytics
1. Vercel Dashboard → Analytics
2. Track:
   - Edge cache hit ratio
   - First Byte Time (TTFB)
   - Core Web Vitals
   - Real User Monitoring (RUM)

### Test Core Web Vitals
1. Visit https://web.dev/measure/
2. Analyze your production URL
3. Expected results:
   - **LCP**: <2.5s (Largest Contentful Paint)
   - **FID**: <100ms (First Input Delay)
   - **CLS**: <0.1 (Cumulative Layout Shift)

## Continuous Deployment
- **Automatic**: Every push to `main` branch deploys
- **Preview**: PRs get automatic preview deployments
- **Rollback**: Easy version rollback in Vercel dashboard

## Vercel.json Configuration
The included `vercel.json` provides:
- Optimized cache headers for static assets
- 1-year immutable cache for JS/CSS/images
- Proper content-type headers
- SEO rewrite rules for sitemap/robots

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Common issues:
  - Missing environment variables
  - Node version mismatch (Vercel uses Node 18+)
  - Firestore configuration needed

### Slow Deployment
- First deployment: 2-3 minutes (builds Next.js)
- Subsequent: 30-60 seconds (with caching)

### Custom Domain Issues
- DNS: Allow 24-48 hours for propagation
- HTTPS: Auto-enabled by Vercel (free SSL)
- WWW redirect: Configure in Domains settings

## Cost
- **Free tier**: Sufficient for static sites
- **Pro tier** ($20/month): For advanced features
  - Team collaboration
  - Enhanced analytics
  - Priority support

## Next Steps
1. Deploy to Vercel
2. Configure custom domain
3. Run Lighthouse on production URL
4. Monitor analytics dashboard
5. Set up Git automation (auto-deploy on push)

## Resources
- Vercel Docs: https://vercel.com/docs
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs
- Custom Domain: https://vercel.com/docs/concepts/projects/domains
- Analytics: https://vercel.com/analytics

# Deployment Guide

This guide covers various options for deploying the Massachusetts Afterschool Programs Map as a front-facing web application.

## Table of Contents
1. [GitHub Pages (Free)](#github-pages)
2. [Netlify (Free)](#netlify)
3. [Vercel (Free)](#vercel)
4. [Traditional Web Hosting](#traditional-web-hosting)
5. [Custom Domain Setup](#custom-domain-setup)

---

## GitHub Pages

**Cost**: Free
**Custom Domain**: Supported
**Ease**: ⭐⭐⭐⭐⭐

### Steps:

1. **Create a GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: MA Afterschool Programs Map"
   git branch -M main
   git remote add origin https://github.com/yourusername/ma-afterschool-map.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Under "Source", select branch: `main`
   - Select folder: `/ (root)`
   - Click "Save"

3. **Access your site**
   - Your site will be available at: `https://yourusername.github.io/ma-afterschool-map/`
   - Initial deployment takes 1-2 minutes

### Custom Domain with GitHub Pages:

1. Add a `CNAME` file to your repository:
   ```
   yourdomain.com
   ```

2. Configure DNS with your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: yourusername.github.io
   ```

3. In GitHub Pages settings, enter your custom domain and enable HTTPS

---

## Netlify

**Cost**: Free (100GB bandwidth/month)
**Custom Domain**: Supported
**Ease**: ⭐⭐⭐⭐⭐
**Auto Deploy**: ✅

### Method 1: Drag & Drop

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click "Add new site" → "Deploy manually"
3. Drag and drop your project folder
4. Site deploys instantly at `random-name.netlify.app`

### Method 2: Git Integration

1. Push code to GitHub (see GitHub Pages steps)
2. On Netlify, click "Add new site" → "Import from Git"
3. Connect your GitHub account
4. Select your repository
5. Click "Deploy site"

**Advantages**:
- Automatic deployments on git push
- Instant rollbacks
- Built-in form handling
- Split testing support

### Netlify Configuration

Create `netlify.toml` in your project root (optional):

```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Vercel

**Cost**: Free
**Custom Domain**: Supported
**Ease**: ⭐⭐⭐⭐⭐
**Auto Deploy**: ✅

### Steps:

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel auto-detects settings
5. Click "Deploy"

**Features**:
- Automatic HTTPS
- Global CDN
- Instant cache invalidation
- Preview deployments for branches

---

## Traditional Web Hosting

**Cost**: Varies ($5-20/month typically)
**Custom Domain**: Usually included
**Ease**: ⭐⭐⭐

### Compatible Hosts:
- Bluehost
- HostGator
- DreamHost
- SiteGround
- Any hosting with FTP/SFTP access

### Steps:

1. **Purchase hosting and domain**

2. **Upload files via FTP**
   - Use FileZilla, Cyberduck, or built-in file manager
   - Upload all files to `public_html` or `www` directory
   - Maintain folder structure

3. **Set permissions**
   ```
   Folders: 755
   Files: 644
   ```

4. **Access your site**
   - Visit: `http://yourdomain.com`

### Using cPanel:

1. Log into cPanel
2. Go to File Manager
3. Navigate to `public_html`
4. Upload all project files
5. Extract if uploaded as ZIP

---

## Amazon S3 + CloudFront

**Cost**: Very low (pay per use)
**Custom Domain**: Supported
**Ease**: ⭐⭐⭐
**Scale**: Enterprise-level

### Quick Steps:

1. **Create S3 Bucket**
   - Name it same as your domain
   - Enable static website hosting
   - Upload all files
   - Set bucket policy for public read

2. **Set up CloudFront Distribution**
   - Point to S3 bucket
   - Add custom SSL certificate (free with ACM)
   - Configure caching rules

3. **Update DNS**
   - Point domain to CloudFront distribution

**Best for**: High-traffic sites, global audience

---

## Custom Domain Setup

### DNS Configuration

For most deployments, configure these DNS records with your domain provider:

**Option 1: CNAME Record** (for www subdomain)
```
Type: CNAME
Name: www
Value: your-deployment-url.netlify.app (or similar)
TTL: 3600
```

**Option 2: A Record** (for root domain)
```
Type: A
Name: @
Value: [IP address of hosting provider]
TTL: 3600
```

### Popular Domain Providers:
- **Namecheap**: Dashboard → Advanced DNS → Add Record
- **GoDaddy**: DNS Management → Add Record
- **Google Domains**: DNS → Custom records
- **Cloudflare**: DNS → Add record

### SSL/HTTPS Setup

Most modern hosting platforms (Netlify, Vercel, GitHub Pages) provide **free automatic HTTPS** via Let's Encrypt.

For traditional hosting:
1. Get free SSL from Let's Encrypt
2. Install via cPanel or hosting control panel
3. Force HTTPS redirect in `.htaccess`:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## Post-Deployment Checklist

- [ ] Test all functionality (map loads, search works, filters work)
- [ ] Verify mobile responsiveness
- [ ] Test data upload feature
- [ ] Check all external links
- [ ] Verify SSL certificate is active (HTTPS)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Verify custom domain (if applicable)
- [ ] Set up analytics (Google Analytics, optional)
- [ ] Create backup of data files
- [ ] Document update process for your team

---

## Updating Your Deployed Site

### GitHub Pages / Netlify / Vercel (Git-based):
```bash
git add .
git commit -m "Update program data"
git push
```
Site updates automatically within 1-2 minutes.

### Traditional Hosting:
1. Update files locally
2. Upload changed files via FTP
3. Clear browser cache to see changes

---

## Performance Optimization

### Before Deployment:

1. **Minify CSS** (optional):
   ```bash
   npx clean-css-cli -o styles.min.css styles.css
   ```

2. **Minify JavaScript** (optional):
   ```bash
   npx uglify-js app.js -o app.min.js
   ```

3. **Optimize images** (if you add any):
   - Use tools like TinyPNG
   - Consider WebP format

### CDN Configuration:

For better global performance, use a CDN:
- **Cloudflare** (free tier available)
- **Amazon CloudFront**
- Built-in with Netlify/Vercel

---

## Monitoring & Analytics

### Google Analytics Setup:

Add before closing `</head>` in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Simple Analytics (Privacy-friendly alternative):

```html
<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
```

---

## Troubleshooting

**Issue**: Files uploaded but site shows 404
- **Solution**: Ensure `index.html` is in the root directory
- Check file permissions (should be 644)

**Issue**: Map doesn't load after deployment
- **Solution**: Check browser console for HTTPS/HTTP mixed content errors
- Ensure Leaflet CDN URLs use HTTPS

**Issue**: Custom domain not working
- **Solution**: Wait 24-48 hours for DNS propagation
- Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

**Issue**: Data upload doesn't work
- **Solution**: This is expected on static hosting - upload feature works client-side only
- For persistent data storage, consider adding a backend (Firebase, Supabase)

---

## Cost Comparison

| Platform | Monthly Cost | Bandwidth | Storage | Custom Domain |
|----------|-------------|-----------|---------|---------------|
| GitHub Pages | Free | 100GB | 1GB | ✅ |
| Netlify | Free | 100GB | Unlimited | ✅ |
| Vercel | Free | 100GB | Unlimited | ✅ |
| Shared Hosting | $5-20 | Varies | 10-50GB | ✅ Included |
| AWS S3+CloudFront | ~$1-5 | Pay per use | Pay per GB | ✅ |

**Recommendation for small-medium traffic**: Use GitHub Pages, Netlify, or Vercel (all free and excellent).

---

## Support

For deployment-specific issues:
- **GitHub Pages**: [GitHub Pages Documentation](https://docs.github.com/pages)
- **Netlify**: [Netlify Support](https://docs.netlify.com/)
- **Vercel**: [Vercel Documentation](https://vercel.com/docs)

---

**Ready to deploy?** Start with the easiest option (GitHub Pages or Netlify) and upgrade later if needed!

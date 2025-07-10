# Deployment Guide

## Overview

This document outlines the deployment process for the Avanticlassic website, covering both the current SSG implementation and future deployment strategies.

## Current Deployment Architecture

### Static Site Generation
- **Framework**: Custom Deno-based SSG
- **Build Process**: `deno run --allow-read --allow-write main.ts`
- **Output**: Static HTML files in `_site/` directory
- **Hosting**: Vercel (https://ssg-eta.vercel.app/)

### Build Pipeline
1. **Data Loading**: JSON files from `data/` directory
2. **Translation Loading**: i18n files from `i18n/` directory
3. **Template Rendering**: Eta templates generate HTML
4. **Asset Processing**: Images and CSS copied to output
5. **Multi-language Generation**: Separate directories for each language

## Vercel Deployment

### Current Configuration
```json
{
  "buildCommand": "deno run --allow-read --allow-write main.ts",
  "outputDirectory": "_site",
  "installCommand": "echo 'Using Deno runtime'",
  "framework": null
}
```

### Deployment Process
1. **Code Push**: Push changes to GitHub repository
2. **Automatic Trigger**: Vercel detects changes and triggers build
3. **Build Execution**: Runs Deno build command
4. **Asset Optimization**: Vercel optimizes static assets
5. **CDN Distribution**: Content distributed globally
6. **DNS Update**: Site available at custom domain

### Environment Variables
- `DENO_VERSION`: Specify Deno version for consistency
- `NODE_VERSION`: Required for Vercel compatibility
- `BUILD_COMMAND`: Custom build command override

## Local Development

### Prerequisites
- Deno runtime installed
- Git for version control
- Code editor with TypeScript support

### Development Commands
```bash
# Install Deno (if not already installed)
curl -fsSL https://deno.land/install.sh | sh

# Clone repository
git clone https://github.com/username/avanticlassic.git
cd avanticlassic/ssg-eta

# Build site
deno run --allow-read --allow-write main.ts

# Watch for changes (development mode)
deno run --allow-read --allow-write watch.ts

# Serve locally
cd _site && python3 -m http.server 8080
```

### Development Workflow
1. **Edit Content**: Modify JSON files in `data/` directory
2. **Update Templates**: Edit Eta templates in `eta-files/`
3. **Add Assets**: Place images in `assets/` directory
4. **Build Site**: Run build command to generate static files
5. **Test Locally**: Serve and test generated site
6. **Commit Changes**: Push to repository for deployment

## Content Deployment

### JSON Data Updates
1. **Edit Data Files**: Update `data/*.json` files
2. **Validate JSON**: Ensure proper JSON syntax
3. **Update Translations**: Add/update content in `i18n/*.json`
4. **Build and Test**: Generate site and verify changes
5. **Deploy**: Commit and push changes

### Asset Management
```bash
# Add new artist images
assets/images/artists/
├── {artistId}-800.jpeg     # Thumbnail
├── {artistId}-1125.jpeg    # Medium
└── {artistId}-1500.jpeg    # Full size

# Add new release images
assets/images/releases/
├── {releaseId}.jpeg        # Thumbnail
└── {releaseId}-1200.jpeg   # Full size
```

### Image Optimization
- **Format**: JPEG for photos, PNG for graphics
- **Quality**: 80-90% for optimal balance
- **Sizes**: Multiple sizes for responsive design
- **Compression**: Use tools like ImageOptim or TinyPNG

## Production Deployment

### Vercel Production Settings
- **Domain**: Configure custom domain
- **SSL**: Automatic HTTPS certificate
- **CDN**: Global edge network
- **Caching**: Static asset caching
- **Performance**: Automatic optimization

### Performance Optimization
- **Static Generation**: Pre-rendered HTML
- **Asset Optimization**: Compressed images and CSS
- **CDN Distribution**: Global content delivery
- **Caching Headers**: Long-term caching for static assets

## Monitoring and Maintenance

### Site Health Monitoring
- **Uptime Monitoring**: Vercel provides basic monitoring
- **Performance Metrics**: Core Web Vitals tracking
- **Error Tracking**: Vercel Analytics integration
- **SSL Certificate**: Automatic renewal

### Backup Strategy
- **Git Repository**: Complete version history
- **Asset Backup**: Regular backup of images and media
- **Database Export**: JSON data files in version control
- **Deployment History**: Vercel maintains deployment history

## Security Considerations

### Static Site Security
- **HTTPS**: Automatic SSL certificate
- **No Server**: Reduced attack surface
- **Content Security**: Static files only
- **Access Control**: Git-based access management

### Asset Security
- **Image Optimization**: Prevent malicious uploads
- **File Validation**: Verify file types and sizes
- **CDN Security**: Vercel security features
- **Version Control**: Track all changes

## Troubleshooting

### Common Build Issues
1. **Deno Permission Errors**: Ensure proper `--allow-*` flags
2. **JSON Syntax Errors**: Validate JSON files before build
3. **Missing Assets**: Verify all referenced images exist
4. **Template Errors**: Check Eta template syntax
5. **Translation Issues**: Ensure all translation keys exist

### Debug Commands
```bash
# Check Deno version
deno --version

# Validate JSON files
deno eval "JSON.parse(await Deno.readTextFile('data/artists.json'))"

# Check file permissions
ls -la data/

# Test build process
deno run --allow-read --allow-write --check main.ts
```

### Performance Issues
- **Build Time**: Optimize template rendering
- **Asset Size**: Compress images and optimize assets
- **CDN Caching**: Configure appropriate cache headers
- **Code Splitting**: Separate critical and non-critical assets

## Future Deployment Enhancements

### Automated Testing
- **Pre-deployment Tests**: Validate content before deployment
- **Visual Regression**: Screenshot comparison testing
- **Performance Tests**: Lighthouse CI integration
- **Link Validation**: Check all external links

### Advanced CI/CD
```yaml
# GitHub Actions workflow
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x
      - run: deno run --allow-read --allow-write main.ts
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### Content Management Integration
- **CMS Integration**: Headless CMS for content management
- **Automated Builds**: Trigger builds on content changes
- **Preview Deployments**: Staging environment for content review
- **Rollback Capability**: Quick revert to previous versions

## Alternative Hosting Options

### Netlify
- **Similar Features**: Static site hosting with CDN
- **Build Process**: Same Deno build command
- **Cost**: Free tier available
- **Benefits**: Built-in form handling, edge functions

### GitHub Pages
- **Free Hosting**: For open-source projects
- **GitHub Integration**: Direct repository deployment
- **Custom Domain**: Support for custom domains
- **Limitations**: No server-side processing

### AWS S3 + CloudFront
- **S3 Storage**: Static file hosting
- **CloudFront CDN**: Global content delivery
- **Cost Control**: Pay-per-use pricing
- **Scalability**: Handle traffic spikes

## Cost Optimization

### Vercel Pricing
- **Hobby Plan**: Free for personal projects
- **Pro Plan**: $20/month for commercial use
- **Enterprise**: Custom pricing for large organizations

### Resource Optimization
- **Image Compression**: Reduce storage and bandwidth
- **Code Minification**: Smaller file sizes
- **CDN Caching**: Reduce origin requests
- **Asset Bundling**: Combine resources efficiently

## Disaster Recovery

### Backup Procedures
1. **Repository Backup**: Git repository with all code and content
2. **Asset Backup**: Regular backup of images and media files
3. **Configuration Backup**: Deployment settings and environment variables
4. **Database Export**: JSON data files in version control

### Recovery Process
1. **Restore Repository**: Clone from backup location
2. **Restore Assets**: Upload images and media files
3. **Rebuild Site**: Generate fresh static files
4. **Redeploy**: Deploy to hosting platform
5. **Verify**: Test all functionality after recovery

### Testing Recovery
- **Regular Tests**: Monthly disaster recovery tests
- **Documentation**: Keep recovery procedures updated
- **Automation**: Automate backup and recovery processes
- **Monitoring**: Alert on backup failures
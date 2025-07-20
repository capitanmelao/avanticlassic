/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://avanticlassic.vercel.app',
  generateRobotsTxt: false, // We have a custom robots.txt
  generateIndexSitemap: true,
  exclude: [
    '/admin-panel/*',
    '/api/auth/*',
    '/api/upload',
    '/api/metadata',
    '/shop/cart',
    '/shop/success',
    '/shop/cancel',
    '/_next/*'
  ],
  additionalPaths: async (config) => {
    const paths = []
    
    try {
      // We'll generate additional paths for dynamic content
      // Artists, releases, playlists, videos, and products
      
      // Static important pages
      const staticPaths = [
        '/',
        '/artists',
        '/releases', 
        '/playlists',
        '/videos',
        '/shop',
        '/about',
        '/news-and-more'
      ]
      
      for (const path of staticPaths) {
        paths.push({
          loc: path,
          changefreq: 'weekly',
          priority: path === '/' ? 1.0 : 0.8,
          lastmod: new Date().toISOString(),
        })
      }
      
      // Dynamic content will be handled by individual sitemap generation
      // in the pages themselves using getServerSideProps or ISR
      
    } catch (error) {
      console.error('Error generating additional sitemap paths:', error)
    }
    
    return paths
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin-panel/', '/api/auth/', '/_next/']
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        crawlDelay: 1
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/'
      },
      {
        userAgent: 'Perplexity-Bot',
        allow: '/',
        crawlDelay: 1
      },
      {
        userAgent: 'Claude-Bot',
        allow: '/',
        crawlDelay: 1
      }
    ],
    additionalSitemaps: [
      'https://avanticlassic.vercel.app/sitemap-artists.xml',
      'https://avanticlassic.vercel.app/sitemap-releases.xml',
      'https://avanticlassic.vercel.app/sitemap-playlists.xml',
      'https://avanticlassic.vercel.app/sitemap-videos.xml',
      'https://avanticlassic.vercel.app/sitemap-products.xml'
    ]
  },
  transform: async (config, path) => {
    // Custom transformation for specific paths
    let priority = 0.7
    let changefreq = 'weekly'
    
    if (path === '/') {
      priority = 1.0
      changefreq = 'daily'
    } else if (path.startsWith('/artists') || path.startsWith('/releases')) {
      priority = 0.9
      changefreq = 'weekly'
    } else if (path.startsWith('/shop')) {
      priority = 0.8
      changefreq = 'daily'
    } else if (path.startsWith('/playlists') || path.startsWith('/videos')) {
      priority = 0.8
      changefreq = 'weekly'
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        {
          href: `https://avanticlassic.vercel.app${path}`,
          hreflang: 'en',
        },
        {
          href: `https://avanticlassic.vercel.app/fr${path}`,
          hreflang: 'fr',
        },
        {
          href: `https://avanticlassic.vercel.app/de${path}`,
          hreflang: 'de',
        },
      ],
    }
  },
}
/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://tawasyme.com',
    generateRobotsTxt: true, // (optional)
    sitemapSize: 7000,
    exclude : "https://tawasyme.com/admin/Sellers"
    // ...other options
  }
  
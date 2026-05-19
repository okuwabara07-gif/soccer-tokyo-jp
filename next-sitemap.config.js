/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://soccer-selection.jp',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: ['https://soccer-selection.jp/sitemap.xml'],
  },
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
}

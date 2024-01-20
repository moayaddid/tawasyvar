/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://tawasyme.com",
  generateRobotsTxt: true, // (optional)
  exclude: [
    `/admin/*`,
    `/seller/*`,
    `/login`,
    `/TradeMarksPolicy`,
    `/TermsAndConditions`,
    `/SubmitOrder`,
    `/PrivacyPolicy`,
    `/MyProfile`,
    `/Orders`,
    `/signup`,
    `/verification`,
    `/ar/404`,
    `/404`,
    `/ar/Orders`,
    `/ar/MyProfile`,
    `/ar/SubmitOrder`,
    `/seller`,
  ],
  // ...other options
};
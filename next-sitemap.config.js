/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://tawasyme.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", disallow: "/admin" },
      { userAgent: "*", disallow: "/admin/*" },
      { userAgent: "*", disallow: "/seller/*" },
      { userAgent: "*", disallow: "/seller" },
      { userAgent: "*", disallow: "/ar/seller/*" },
      { userAgent: "*", disallow: "/ar/seller" },
      { userAgent: "*", disallow: "/login" },
      { userAgent: "*", disallow: "/TradeMarksPolicy" },
      { userAgent: "*", disallow: "/TermsAndConditions" },
      { userAgent: "*", disallow: "/PrivacyPolicy" },
      { userAgent: "*", disallow: "/ar/TradeMarksPolicy" },
      { userAgent: "*", disallow: "/ar/TermsAndConditions" },
      { userAgent: "*", disallow: "/ar/PrivacyPolicy" },
      { userAgent: "*", disallow: "/SubmitOrder" },
      { userAgent: "*", disallow: "/MyProfile" },
      { userAgent: "*", disallow: "/Orders" },
      { userAgent: "*", disallow: "/signup" },
      { userAgent: "*", disallow: "/verification" },
      { userAgent: "*", disallow: "/ar/404" },
      { userAgent: "*", disallow: "/404" },
      { userAgent: "*", disallow: "/ar/Orders" },
      { userAgent: "*", disallow: "/ar/MyProfile" },
      { userAgent: "*", disallow: "/ar/SubmitOrder" },
      { userAgent: "*", allow: "/" },
    ],
    additionalSitemaps: [
      `https://tawasyme.com/sitemap.xml`,
      `https://tawasyme.com/server-sitemap.xml`,
    ],
  },
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

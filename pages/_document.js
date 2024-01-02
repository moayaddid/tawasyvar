// import { Html, Head, Main, NextScript } from 'next/document'

import Document, { Html, Main, NextScript, Head } from "next/document";
import Script from "next/script";

function MyDocument({ locale, ...props }) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  // console.log(`in document`);
  // console.log(dir);
  // console.log(locale);

  return (
    <Html dir={dir} lang={locale}>
      <Head>
        <NextScript id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            "https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','G-4C6MQ427TW');`}
        </NextScript>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=GTM-5N2BFDQM"
        />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'GTM-5N2BFDQM');
        `}
        </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WJTGWG84"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx) => {
  const initialProps = await Document.getInitialProps(ctx);
  return { ...initialProps, locale: ctx?.locale || "en" };
};

export default MyDocument;

import axios from "axios";

export const revalidate = 604800

async function generateSiteMap(data, type) {
  let output = [];
  if (type === `products`) {
    data.data.products.map((product) => {
      if (product.slug_ar) {
        output.push(
          `<url><loc>https://www.tawasyme.com/ar/Products/${
            product.slug_ar
          }</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`
        );
      }
      if (product.slug_en) {
        output.push(
          `<url><loc>https://www.tawasyme.com/Products/${
            product.slug_en
          }</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`
        );
      }
    });
  }else{
    data.data.stores.map((store) => {
        if (store.slug_ar) {
          output.push(
            `<url><loc>https://www.tawasyme.com/ar/Stores/${
              store.slug_ar
            }</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`
          );
        }
        if (store.slug_en) {
          output.push(
            `<url><loc>https://www.tawasyme.com/Stores/${
              store.slug_en
            }</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`
          );
        }
      });
  }

  return output;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  //   const request = await fetch(EXTERNAL_DATA_URL);
  //   const posts = await request.json();

  const products = await axios.get(
    `https://admin.tawasyme.com/api/all-products-all`
  );
  let pros = [];
  let stos = [];
  if (products) {
    pros = await generateSiteMap(products, `products`);
  }

  const stores = await axios.get(
    `http://admin.tawasyme.com/api/all-stores-all`
  );

  if (stores) {
    stos = await generateSiteMap(stores, `stores`);
  }

  const defaultdata = `
  <url><loc>https://tawasyme.com</loc><lastmod>2024-02-18T09:08:40.472Z</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>https://tawasyme.com/AboutUs</loc><lastmod>2024-02-18T09:08:40.473Z</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>https://tawasyme.com/ContactUs</loc><lastmod>2024-02-18T09:08:40.473Z</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>https://tawasyme.com/Products</loc><lastmod>2024-02-18T09:08:40.473Z</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://tawasyme.com/Stores</loc><lastmod>2024-02-18T09:08:40.473Z</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://tawasyme.com/ar/Stores</loc><lastmod>2024-02-18T09:08:40.473Z</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://tawasyme.com/ar/AboutUs</loc><lastmod>2024-02-18T09:08:40.473Z</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>https://tawasyme.com/ar/ContactUs</loc><lastmod>2024-02-18T09:08:40.473Z</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>https://tawasyme.com/ar/Products</loc><lastmod>2024-02-18T09:08:40.473Z</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`;
  // We generate the XML sitemap with the posts data
  //   const sitemap = generateSiteMap(posts);

  let output;

  output = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${defaultdata}
  ${pros.join("")}
  ${stos.join("")}
  </urlset>
  `;

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(output);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;

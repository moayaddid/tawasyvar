import axios from "axios";
import { getServerSideSitemapLegacy } from "next-sitemap";

export async function getServerSideProps(context) {
  const products = await axios.get(
    `https://admin.tawasyme.com/api/all-products-all`
  );
  let fields = [];
  if (products) {
    products.data.products.map((product) => {
      if (product.slug_ar) {
        fields.push({
          loc: `https://www.tawasyme.com/ar/Products/${product.slug_ar}`,
          lastmod: new Date().toISOString(),
          changefreq : "daily",
          priority: 0.7,
        });
      }
      if (product.slug_en) {
        fields.push({
          loc: `https://www.tawasyme.com/Products/${product.slug_en}`,
          lastmod: new Date().toISOString(),
          changefreq : "daily",
          priority: 0.7,
        });
      }
    })
  }

  const stores = await axios.get(
    `http://admin.tawasyme.com/api/all-stores-all`
  );
  if (stores) {
    stores.data.stores.map((store) => {
      if (store.slug_ar) {
        fields.push({
          loc: `https://www.tawasyme.com/ar/Stores/${store.slug_ar}`,
          lastmod: new Date().toISOString(),
          changefreq : "daily",
          priority: 0.7,
        });
      }
      if (store.slug_en) {
        fields.push({
          loc: `https://www.tawasyme.com/Stores/${store.slug_en}`,
          lastmod: new Date().toISOString(),
          changefreq : "daily",
          priority: 0.7,
        });
      }
    })
  }

  return getServerSideSitemapLegacy(context, fields);
// return { props :null}; 
}

export default function Site() {}

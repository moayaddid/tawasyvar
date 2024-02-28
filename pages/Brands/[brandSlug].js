import Image from "next/image";
import logo from "@/public/images/tawasylogo.png";
import lego from "@/public/images/lego.png";
import withLayoutCustomer from "@/components/wrapping components/WrappingCustomerLayout";
import axios from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import url from "@/URL";
import { useEffect, useState } from "react";
import FilterCategories from "@/components/SellerStore/filterCategory/filterCategories";
import PublicAllProduct from "@/components/CustomerAllProducts/AllProducts";
import Cookies from "js-cookie";

export async function getServerSideProps(context) {
  const { locale, query } = context;
  const response = await axios.get(`${url}/api/brand/${query.brandSlug}`, {
    headers: { "Accept-Language": locale ? locale : "en" },
  });
  if (!response.data) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      brand: response.data,
    },
  };
}

function BrandPage({ brand }) {
  // console.log(brand);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories , setCategories] = useState() ;
  const [categoryProducts , setCategoryProducts] = useState();

  const onSelectCategory = (categoryName) => {
    Cookies.set( `brandctg` , categoryName);
    setSelectedCategory(categoryName);
    // console.log(`category selected`) ;
    // console.log(categories);
    const cat = brand?.categories_with_products.find((catego) => catego.category_name == categoryName);
        if(cat){
          // console.log(`cat found`) ;
          // console.log(cat);
          // setSelectedCategory(cat.category_name);
          setCategoryProducts(cat.products);
          return ;
        }
  };

  useEffect(() => {
    if (brand) {
      let cats = [] ;
      brand?.categories_with_products?.map((singleCategory) => {
          if(singleCategory.products && singleCategory.products?.length > 0){
            cats.push({name : singleCategory.category_name});
          }
      });
      // console.log(`cats`);
      // console.log(cats);
      setCategories(cats); 
    }
  }, [brand]);

  useEffect(() => {
    const category = Cookies.get(`brandctg`);
    if (brand && categories?.length > 0) {
      if(category){
        const cat = brand?.categories_with_products.find((catego) => catego.category_name == category);
        if(cat){
          setSelectedCategory(cat.category_name);
          setCategoryProducts(cat.products);
          return ;
        }else{
          setSelectedCategory(brand?.categories_with_products[0].categories_name);
          setCategoryProducts(brand?.categories_with_products[0].products);  
          return; 
        }
      }
      setSelectedCategory(brand?.categories_with_products[0].categories_name);
      setCategoryProducts(brand?.categories_with_products[0].products);
    }
  }, [brand , categories]);

  const { t } = useTranslation;
  return (
    <div>
      {brand?.brand_details?.brand_image && (
        <div className=" w-full justify-center h-auto max-h-auto lg:h-[500px] lg:max-h-[500px] md:block hidden ">
          <div className="relative bg-gray-200 md:rounded-bl-lg md:rounded-br-lg  w-full h-auto max-h-auto lg:h-[500px] lg:max-h-[500px]">
            <Image
              src={brand?.brand_details?.brand_image ?? logo}
              width={0}
              height={0}
              style={{ width: "100%", height: "100%" }}
              alt={brand?.brand_details?.brand_name}
              className="object-contain"
            />
            <div className=" absolute -bottom-[10%] left-[5%] 2xl:w-[200px] 2xl:h-[200px] xl:w-[200px] xl:h-[200px] lg:w-[150px] lg:h-[150px] md:w-[150px] md:h-[150px] w-[80px] h-[80px] ">
              {/* profile photo */}
              <Image
                src={brand?.brand_details?.brand_logo ?? logo}
                width={0}
                height={0}
                className="rounded-lg  border-4 object-contain border-white "
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      )}

      {brand?.brand_details?.brand_image && (
        <div className="md:hidden block pt-8">
          <div className="w-full flex justify-center items-center">
            <div className="sm:w-[150px] sm:h-[150px] w-[50%] h-auto ">
              {/* profile photo */}
              <Image
                src={brand?.brand_details?.brand_logo ?? logo}
                width={0}
                height={0}
                className="rounded-lg  border-4 object-contain border-white "
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      )}

      {brand?.brand_details?.brand_image && (
        <div className="w-full flex flex-col justify-center items-center my-5 divide-y-2 shadow-md ">
          <h1 className="md:text-3xl sm:text-xl text-2xl py-2">{brand?.brand_details?.brand_name}</h1>
          {brand?.brand_details?.brand_description && (
            <h2 className="w-[80%] text-center md:text-lg sm:text-base text-sm mx-auto py-2 line-clamp-3 overflow-y-scroll">
              {brand?.brand_details?.brand_description}
            </h2>
          )}
        </div>
      )}

      {!brand?.brand_details?.brand_image && (
        <div className=" w-[90%] mx-auto flex md:flex-row flex-col justify-start items-center md:space-x-4 space-y-4 pt-8">
          <div className="sm:w-[150px] sm:h-[150px] w-[50%] h-auto  ">
            {/* profile photo */}
            <Image
              src={brand?.brand_details?.brand_logo ?? logo}
              width={0}
              height={0}
              className="rounded-lg  border-4 object-contain border-white "
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="w-full flex flex-col justify-center items-center my-5 divide-y-2">
            <h1 className="md:text-3xl sm:text-xl text-2xl py-2">
              {brand?.brand_details?.brand_name}
            </h1>
            {brand?.brand_details?.brand_description && (
              <h2 className="w-[80%] text-center md:text-lg sm:text-base text-sm mx-auto py-2 line-clamp-3 overflow-y-scroll">
                {brand?.brand_details?.brand_description}
              </h2>
            )}
          </div>
        </div>
      )}

      <hr className="py-3" />

      <div className="w-full">
        <div className="flex justify-center bg-gray-200 w-full py-3 mb-10  ">
          <ul className="grid md:w-max w-[90%] mx-auto gap-6 md:overflow-auto overflow-x-scroll">
            {(brand?.categories_with_products?.length > 0 && categories ) && (
              <FilterCategories
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={onSelectCategory}
              />
            )}
          </ul>
        </div>

        <div className="flex w-[90%] justify-center mx-auto mt-4 mb-7">
          <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 gap-y-7 mx-auto ">
            {brand &&
              categoryProducts &&
              categoryProducts.map((product, index) => (
                // <ProductCustomer key={product.id} product={product} />
                <PublicAllProduct
                  key={`${product.name ? product.name : product.slug} ${index}`}
                  product={product}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withLayoutCustomer(BrandPage);

import React, { useState, useEffect } from "react";
import Logo from "@/public/images/item2.jpg";
import Image from "next/image";
import Storeimage from "@/public/images/storeimage.jpg";
import FilterCategories from "@/components/SellerStore/filterCategory/filterCategories";
import withLayoutCustomer from "@/components/wrapping components/WrappingCustomerLayout";
import ItemProduct from "@/public/images/kuala.jpg";
import { Router, useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import ProductCustomer from "@/components/ProductsCustomer/products";
import { convertTo12HourFormat } from "@/pages/seller/store";
import styles from "@/components/componentsStyling/sellerStorePage.module.css";
import { MdArrowForward, MdClose } from "react-icons/md";
import { useRef } from "react";
import { NextSeo } from "next-seo";
import logo from "@/public/images/tawasylogo.png";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import PublicAllProduct from "@/components/CustomerAllProducts/AllProducts";
import Cookies from "js-cookie";

export async function getServerSideProps(context) {
  const { params, locale, res, req } = context;
  const Api = createAxiosInstance();
  try {
    const response = await Api.get(
      `/api/stores-with-products/${params.storeId}`,
      {
        headers: { "Accept-Language": locale || "en" },
      }
    );
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        store: response.data,
      },
    };
  } catch (error) {
    if (error.response.status) {
      if (error.response.status == 500) {
        if (error?.response?.data?.lang && error?.response?.data?.slug) {
          if (error?.response?.data?.lang == "ar") {
            res.writeHead(301, {
              Location: `/ar/Stores/${encodeURIComponent(
                error.response.data.slug
              )}`,
            });
            res.end();
            return true;
          } else {
            res.writeHead(301, {
              Location: `/Stores/${error.response.data.slug}`,
            });
            res.end();
            return true;
          }
        }
      } else {
        return {
          notFound: true,
        };
      }
    }
  }
}

function Products({ store }) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [storeId, setStoreId] = useState();
  const { t } = useTranslation("");
  const [searching, setSearching] = useState(false);
  const [inSearch, setInSearch] = useState(false);
  const [searchedResults, setSearchedResults] = useState();
  const searchRef = useRef();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const onSelectCategory = (categoryName) => {
    if (categoryName !== "Offers" && categoryName !== "عروض" ) {
      Cookies.set(`ctg`, categoryName);
    }
    setSelectedCategory(categoryName);
  };

  useEffect(() => {
    const bb = router.query.storeId;
    if (bb) {
      setStoreId(bb);
    }
  }, [router.query.storeId]);

  useEffect(() => {
    const category = Cookies.get(`ctg`);
    if (store && store.categories.length > 0) {
      if (category) {
        const cat = store.categories.find((catego) => catego.name == category);
        if (cat) {
          setSelectedCategory(cat.name);
          return;
        } else {
          setSelectedCategory(store.categories[0].name);
          return;
        }
      }
      if (store.promotions && store.promotions.length > 0) {
        if(router){
          if(router.locale === `en`){
            setSelectedCategory("Offers");
          }else{
            setSelectedCategory("عروض");

          }
        }
      } else {
        setSelectedCategory(store.categories[0].name);
      }
    }
  }, [store]);

  async function search(e) {
    e.preventDefault();
    setSearching(true);
    try {
      const response = await Api.post(
        `api/product/${storeId}/search`,
        {
          query: searchRef.current.value,
        },
        {
          noSuccessToast: true,
        }
      );
      const component =
        response.data.data.length < 1 ? (
          <div className="w-max mx-auto">{response.data.message}</div>
        ) : (
          <div className=" w-[90%] grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 gap-y-7 mx-auto">
            {response.data.data.map((product, index) => {
              return (
                <PublicAllProduct
                  key={` ${product.name} ${product.id} ${index}`}
                  product={product}
                  storeId={store.store.id}
                />
              );
            })}
          </div>
        );
      setSearchedResults(component);
      setSearching(false);
      // console.log(`product search`);
      // console.log(response.data.data);
    } catch (error) {
      setSearching(false);
    }
    setSearching(false);
  }

  let selectedCategoryData;

  if (store && selectedCategory) {
    if (
      store.promotions &&
      store.promotions.length > 0 &&
      (selectedCategory === "Offers" || selectedCategory === "عروض")
    ) {
      selectedCategoryData = { products: store.promotions };
    } else {
      selectedCategoryData = store.category.find(
        (category) => category.name === selectedCategory
      );
    }
  }
  let days = [];
  if (store && store.store) {
    const beforeDays = JSON.parse(store.store.opening_days);
    days = beforeDays.join(" - ");
  }

  return (
    <>
      {store && (
        <NextSeo
          title={`${store.store.name} | ${t("titles.home")}`}
          description={store.store.name}
          canonical={
            router.locale == `en`
              ? `https://tawasyme.com/store/${router.query.storeId}`
              : `https://tawasyme.com/ar/store/${router.query.storeId}`
          }
        />
      )}
      <div className="">
        {store && (
          <div className=" relative lg:max-h-[475px] lg:h-[475px] bg-gray-200 max-h-auto h-auto w-full box-border ">
            <Image
              priority
              src={store.store.image ? store.store.image : Logo}
              alt="store"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "100%" }} // optional
              className={`w-full  h-[200px] object-contain   select-none pointer-events-none `}
            />
          </div>
        )}

        <div className="md:flex md:justify-between items-center mx-auto w-[90%] ">
          {store && (
            <div className="flex justify-center items-center mt-2 ">
              <div className=" md:w-[200px] w-[100px] h-auto min-h-[75px] ">
                <Image
                  priority
                  className=" shadow w-full h-full object-contain rounded-md"
                  src={store.store.logo ? store.store.logo : logo}
                  alt="store"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              <div className="mx-6  ">
                <h1 className="md:text-2xl sm:text-xl text-lg text-gray-800 font-medium capitalize">
                  {store.store.name}
                </h1>
                <div className="flex flex-col justify-center items-start w-full">
                  <div>
                    {/* <div>
                    <h2 className="md:text-2xl text-lg text-gray-500 font-medium  ">
                      {t("store.address")} :
                    </h2>
                    <p className="text-gray-400 md:text-2xl text-base ">
                      {store.store.location}
                    </p>
                  </div> */}
                    <div className="flex flex-col md:flex-row justify-start items-center gap-2 w-full">
                      <div className="md:text-xl sm:text-lg text-sm text-gray-500 font-medium">
                        <h3 className="sm:my-2 capitalize">
                          {/* {`Opening Days`} : */}
                          {t("store.openingDays")} :
                        </h3>
                        {/* {JSON.parse(store.store.opening_days)?.map(
                          (day, index) => {
                            return (
                              <span key={index} className="text-gray-400 mt-4">
                                {index !== store.store.opening_days.length - 1
                                  ? `${day} ,`
                                  : day}
                              </span>
                            );
                          }
                        )} */}
                        <p className="text-gray-500">
                          {days && days.length > 0 && days}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {store && (
            <div className="flex flex-col md:items-end items-center my-3  ">
              <div>
                <h2 className="md:text-xl sm:text-lg text-sm text-gray-600 font-medium sm:my-2">
                  {/* {`Opening Time`} : */}
                  {`${t("store.openingTime")} : `}
                  <span className="text-gray-400 md:text-xl sm:text-lg text-sm px-1 ">
                    {convertTo12HourFormat(store.store.opening_time)}
                  </span>
                </h2>
              </div>
              <div>
                <h2 className="md:text-xl sm:text-lg text-sm text-gray-600 font-medium sm:my-3">
                  {/* {`Closing Time`} : */}
                  {`${t("store.closingTime")} : `}
                  <span className="text-gray-400 md:text-xl sm:text-lg text-sm">
                    {convertTo12HourFormat(store.store.closing_time)}
                  </span>
                </h2>
              </div>
              {store.store.free_delivery == true && (
                <div className="w-full py-1 text-center md:text-lg sm:text-base text-sm text-white bg-green-500 sm:my-3 my-1 px-2 rounded-lg ">
                  {t("freeDelivery")} {store.store.radius} {t("meter")}
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className="w-[80%] flex justify-center items-center gap-2 mx-auto mb-7 "
          dir="ltr"
        >
          <form
            onSubmit={search}
            className="flex bg-gray-100 w-full sm:w-2/5 items-center rounded-lg px-2 border-2 border-transparent focus-within:border-skin-primary transition-all duration-700 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              className="w-full bg-gray-100 outline-none rounded-lg text-sm h-10  "
              type="text"
              ref={searchRef}
              // placeholder={`Search`}
              placeholder={t("store.search")}
              onClick={() => {
                setInSearch(true);
              }}
            />
            <button type="submit">
              <MdArrowForward
                // onClick={search}
                className="hover:border-b-2 border-skin-primary cursor-pointer"
              />
            </button>
          </form>
          {inSearch == true && (
            <MdClose
              className="text-red-500 hover:text-red-600 w-[25px] h-[25px] hover:border-b-2 hover:border-red-600 cursor-pointer "
              onClick={() => {
                setInSearch(false);
              }}
            />
          )}
        </div>

        {inSearch == false && (
          <div className="w-full">
            <div className="flex justify-center bg-gray-200 w-full py-3 mb-10  ">
              <ul className="grid md:w-max w-[90%] mx-auto gap-6 md:overflow-auto overflow-x-scroll">
                {store && (
                  <FilterCategories
                    categories={
                      store.promotions && store.promotions.length > 0
                        ? (router && router.locale == `en`)
                          ? [
                              { id: 999999, name: "Offers" },
                              ...store.categories,
                            ]
                          : [{ id: 999999, name: "عروض" }, ...store.categories]
                        : store.categories
                    }
                    selectedCategory={selectedCategory}
                    onSelectCategory={onSelectCategory}
                  />
                )}
              </ul>
            </div>

            <div className="flex w-[90%] justify-center mx-auto mt-4 mb-7">
              <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 gap-y-7 mx-auto ">
                {store &&
                  selectedCategoryData &&
                  selectedCategoryData.products.map((product, index) => (
                    // <ProductCustomer key={product.id} product={product} />
                    <PublicAllProduct
                      key={`${
                        product.name ? product.name : product.slug
                      } ${index}`}
                      product={product}
                      storeId={store.store.id}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}

        {inSearch == true &&
          (searching == true ? (
            <div className="w-full h-full">
              <TawasyLoader width={300} height={300} />
            </div>
          ) : (
            <div className="w-full flex justify-center min-h-[500px]">
              {searchedResults && searchedResults}
            </div>
          ))}
      </div>
    </>
  );
}

export default withLayoutCustomer(Products);

// export async function getStaticProps({ locale }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ["common"])),
//     },
//   };
// }

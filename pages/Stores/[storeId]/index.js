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
// import { notFound } from "next/navigation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import PublicAllProduct from "@/components/CustomerAllProducts/AllProducts";

export async function getServerSideProps(context) {
  const { params, locale } = context;
  const Api = createAxiosInstance();
  const response = await Api.get(`/api/stores-with-products/${params.storeId}` , {
    headers : { 'Accept-Language': locale || 'en',}
  });
  if (!response.data.store) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      store: response.data,
    },
  };
}

function Products({ store }) {
  // function Products({store}) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [storeId, setStoreId] = useState();
  const { t } = useTranslation("");

  const [searching, setSearching] = useState(false);
  const [inSearch, setInSearch] = useState(false);
  const [searchedResults, setSearchedResults] = useState();
  const searchRef = useRef();

  // router.asPath = "nigga/nigga" ;
  // console.log(router)
  // console.log(router.asPath);
  // const {
  //   data: store,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery([`storePage`, storeId], fetchStorePage, {
  //   staleTime: 1,
  //   refetchOnMount: true,
  //   refetchOnWindowFocus: false,
  //   enabled: Boolean(storeId) == true,
  // });
  const [selectedCategory, setSelectedCategory] = useState(null);

  const onSelectCategory = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  useEffect(() => {
    const bb = router.query.storeId;
    if (bb) {
      setStoreId(bb);
    }
  }, [router.query.storeId]);

  useEffect(() => {
    if (store && store.categories.length > 0) {
      setSelectedCategory(store.categories[0].name);
    }
  }, [store]);

  async function fetchStorePage() {
    try {
      return await Api.get(`/api/stores-with-products/${storeId}`);
    } catch {}
  }

  console.log(store);

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
            {response.data.data.map((product) => {
              return <PublicAllProduct key={product.id} product={product} storeId={store.store.id} />;
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

  // if (isLoading) {
  //   return (
  //     <div className="w-full h-full">
  //       <TawasyLoader width={400} height={400} />
  //     </div>
  //   );
  // }

  let selectedCategoryData;

  if (store && selectedCategory) {
    selectedCategoryData = store.category.find(
      (category) => category.name === selectedCategory
    );
    // console.log(selectedCategoryData);
  }
  let days = [] ;

  const beforeDays = JSON.parse(store.store.opening_days);
  days = beforeDays.join(" - ")
  // if (store) {
  //   console.log(store.data);
  //   console.log(`asdasd`);
  //   console.log(JSON.parse(store.data.store.opening_days));
  // }

  return (
    <>
      <NextSeo
      title={`${store.store.name} | ${t("titles.home")}`}
      description={store.store.name}
        canonical={`https://tawasyme.com/store/${router.query.storeId}`}
      />
      <div className="">
        {store && (
          <div className=" relative lg:h-[400px] md:h-[300px] sm:h-[200px] bg-gray-200 h-[100px] w-full box-border ">
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
                        <p className="text-gray-500" >{days && days.length > 0 && days}</p>
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
                <h2 className="md:text-xl text-lg text-gray-600 font-medium sm:my-2">
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
              <ul className="flex md:justify-center justify-start md:items-center items-start md:w-full w-[90%] mx-auto gap-6 md:overflow-auto overflow-x-scroll">
                {store && (
                  <FilterCategories
                    categories={store.categories}
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
                  selectedCategoryData.products.map((product , index) => (
                    // <ProductCustomer key={product.id} product={product} />
                    <PublicAllProduct key={index} product={product} storeId={store.store.id} />
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

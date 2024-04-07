import withLayoutCustomer from "@/components/wrapping components/WrappingCustomerLayout";
import React from "react";
import { MdArrowForward, MdClose } from "react-icons/md";
import test from "@/public/images/flowers.jpeg";
import PublicAllProduct from "@/components/CustomerAllProducts/AllProducts";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import products from "@/pages/seller/products";
import createAxiosInstance from "@/API";
import { useState } from "react";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { Ring } from "@uiball/loaders";
import { useRef } from "react";
import { NextSeo } from "next-seo";
import axios from "axios";
import url from "@/URL";
import Link from "next/link";

export async function getServerSideProps(context) {
  const { locale, query } = context;
  const response = await axios.get(
    `${url}/api/allproducts?page=${
      query?.page && query?.page !== null && query?.page !== undefined && query?.page > 0
        ? query?.page
        : 1
    }`,
    {
      headers: { "Accept-Language": locale ? locale : "en" },
    }
  );
  // console.log(response);
  if(!response.data){
    return {
        notFound: true,
    }
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      products: response.data,
    },
  };
}

function AllProducts({ products }) {
  const { t } = useTranslation("");
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [currentPage, setCurrentPage] = useState(1);
  const [inSearch, setInSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchedResults, setSearchedResults] = useState();
  const searchRef = useRef();

  function scroll(id) {
    document.querySelector(`#${id}`).scrollIntoView({ behavior: "smooth" });
  }

  async function search(e) {
    e.preventDefault();
    setSearching(true);
    // console.log(`before try`);
    try {
      // console.log(`in try`);
      const response = await Api.post(
        `api/allProducts/search`,
        {
          query: searchRef.current.value,
        },
        {
          noSuccessToast: true,
        }
      );
      // console.log(`sadndsaknjdsnkj`);
      const component = !response.data.products ? (
        <div className="w-max mx-auto text-black ">{response.data.message}</div>
      ) : (
        <div className=" w-[90%] grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 gap-y-7 mx-auto">
          {response.data.products.map((product) => {
            return <PublicAllProduct key={product.id} product={product} />;
          })}
        </div>
      );
      // console.log(`component`);
      // console.log(searchedResults);
      setSearchedResults(component);
      setSearching(false);
      // console.log(`product search`);
      // console.log(response.data.data);
    } catch (error) {
      setSearching(false);
    }
    setSearching(false);
  }

  // if (products) {
  //   console.log(products);
  // }

  // if (isLoading) {
  //   return (
  //     <div className="w-full h-full">
  //       <TawasyLoader width={500} height={500} />
  //     </div>
  //   );
  // }

  return (
    <>
      <NextSeo
        title={`${t("titles.allProducts")} | ${t("titles.home")} `}
        description={t("descs.allProducts")}
        canonical={ router.locale == `en` ? `https://tawasyme.com/Products` : `https://tawasyme.com/ar/Products`}
      />
      <div>
        <div className="bg-gray-100 w-full py-3" id="top">
          <h1 className="text-3xl text-gray-600 font-medium w-[90%] mx-auto">
            {t("products.ALLProducts")}
          </h1>
        </div>
        <div
          className="w-[80%] flex justify-center items-center gap-2 mx-auto my-7 "
          dir="ltr"
        >
          <form
            dir={router.locale == "ar" ? "rtl" : "ltr"}
            onSubmit={search}
            className="flex bg-gray-100 w-full sm:w-2/5 items-center rounded-lg px-2 border-2 border-transparent focus-within:border-skin-primary transition-all duration-700 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mx-2"
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
                onClick={search}
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
          <div className="w-[90%] mx-auto py-5">
            {products && products.products && products.products.length > 0 ? (
              <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 gap-y-7 mx-auto  ">
                {products.products &&
                  products.products.map((product) => (
                    <PublicAllProduct key={product.id} product={product} />
                  ))}
              </div>
            ) : (
              <div className="text-center" > There are no products . </div>
            )}
            {products && products.pagination && (
              <div className="w-fit mx-auto flex justify-center items-center h-max gap-4 py-4 ">
                {/* <button
                  className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-max"
                  onClick={() => {
                    setCurrentPage(products.pagination.current_page - 1);
                    scroll(`top`);
                    // setCurrentPage(data.data.pagination.previousPage);
                  }}
                  disabled={
                    products.pagination.current_page ===
                    products.pagination.from
                  }
                >
                  {t("stores.previousPage")}
                </button> */}
                <Link
                  className={`px-2 py-1 ${
                    products.pagination.current_page ==
                    1
                      ? `pointer-events-none opacity-50 cursor-not-allowed`
                      : `pointer-events-auto`
                  } bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] select-none w-max`}
                  href={`/Products?page=${
                    products.pagination.current_page - 1
                  }`}
                  // onClick={() => {
                  //   setCurrentPage(products.pagination.current_page - 1);
                  //   scroll(`top`);
                  //   // setCurrentPage(data.data.pagination.previousPage);
                  // }}
                  // disabled={
                  //   products.pagination.current_page ===
                  //   products.pagination.from
                  // }
                >
                  {t("stores.previousPage")}
                </Link>
                {/* {isFetching && (
                  <Ring size={20} lineWeight={5} speed={2} color="#222222" />
                )} */}
                {/* <button
                  className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-max"
                  onClick={() => {
                    setCurrentPage(products.pagination.current_page + 1);
                    scroll(`top`);
                    // setCurrentPage(data.data.pagination.nextPage);
                  }}
                  disabled={
                    products.pagination.current_page ===
                    products.pagination.last_page
                  }
                >
                  {t("stores.nextPage")}
                </button> */}
                <Link
                  className={`px-2 py-1 ${
                    products.pagination.current_page ===
                    products.pagination.last_page
                      ? `pointer-events-none opacity-50 cursor-not-allowed`
                      : `pointer-events-auto`
                  } bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] select-none w-max`}
                  href={`/Products?page=${
                    products.pagination.current_page + 1
                  }`}
                  // onClick={() => {
                  //   setCurrentPage(products.pagination.current_page + 1);
                  //   scroll(`top`);
                  //   // setCurrentPage(data.data.pagination.nextPage);
                  // }}
                  disabled={
                    products.pagination.current_page ===
                    products.pagination.last_page
                  }
                >
                  {t("stores.nextPage")}
                </Link>
              </div>
            )}
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

export default withLayoutCustomer(AllProducts);

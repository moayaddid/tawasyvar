import withLayoutCustomer from "@/components/wrapping components/WrappingCustomerLayout";
import React from "react";
import { MdArrowForward, MdClose } from "react-icons/md";
import PublicAllProduct from "@/components/CustomerAllProducts/AllProducts";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useState } from "react";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { useRef } from "react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import lego from "@/public/images/lego.png";
import Image from "next/image";
import BrandCustomer from "@/components/customerCommponents/CustomerBrand/BrandCustomer";
import axios from "axios";
import url from "@/URL";

export async function getServerSideProps(context) {
  const { locale, query } = context;
  const response = await axios.get(
    `${url}/api/brands?page=${
      query?.page && query?.page !== null && query?.page !== undefined && query?.page > 0
        ? query?.page
        : 1
    }`,
    {
      headers: { "Accept-Language": locale ? locale : "en" },
    }
  );
  if(!response.data){
    return {
      notFound : true ,
    }
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      brands: response.data,
    },
  };
}

function AllProducts({ brands }) {
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
    try {
      const response = await Api.get(
        `api/search-brand`,
        {
          params :  { query : searchRef.current.value},
        },
        {
          noSuccessToast: true,
        }
      );
      const component = !response.data.brands ? (
        <div className="w-max mx-auto text-black ">{response.data.message}</div>
      ) : (
        <div className=" grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 gap-y-7 mx-auto ">
          {response.data.brands.map((brand , i) => {
            return <BrandCustomer key={i} brand={brand} />;
          })}
        </div>
      );
      setSearchedResults(component);
      setSearching(false);
    } catch (error) {
      setSearching(false);
    }
    setSearching(false);
  }

  return (
    <>
      <NextSeo
        title={`${t("titles.allBrands")} | ${t("titles.home")} `}
        description={t("descs.allBrands")}
        canonical={ router.locale == `en` ? `https://tawasyme.com/Brands` : `https://tawasyme.com/ar/Brands`}
      />
      <div>
        <div className="bg-gray-100 w-full py-3" id="top">
          <h1 className="text-3xl text-gray-600 font-medium w-[90%] mx-auto">
            {t("allBrands")}
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
            {brands && brands.brands && brands.brands.length > 0 ? (
            <div className="grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 gap-y-7 mx-auto  ">
              {brands?.brands?.map((brand , i) => {
                return <BrandCustomer key={i} brand={brand} />
              })}
            </div>
            ) : (
              <div className="text-center" > {t("noBrands")} . </div>
            )} 
            {brands && brands.pagination && (
              <div className="w-fit mx-auto flex justify-center items-center h-max gap-4 py-4 ">
                <Link
                  className={`px-2 py-1 ${
                    brands.pagination.current_page ===
                    1
                      ? `pointer-events-none opacity-50 cursor-not-allowed`
                      : `pointer-events-auto`
                  } bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] select-none w-max`}
                  href={`/Brands?page=${
                    brands.pagination.current_page - 1
                  }`}
                >
                  {t("stores.previousPage")}
                </Link>
                <Link
                  className={`px-2 py-1 ${
                    brands.pagination.current_page ===
                    brands.pagination.last_page
                      ? `pointer-events-none opacity-50 cursor-not-allowed`
                      : `pointer-events-auto`
                  } bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] select-none w-max`}
                  href={`/Brands?page=${
                    brands.pagination.current_page + 1
                  }`}
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
            <div className="w-[90%] mx-auto pb-5">
              {searchedResults && searchedResults}
            </div>
          ))}
      </div>
    </>
  );
}

export default withLayoutCustomer(AllProducts);

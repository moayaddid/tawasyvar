import React, { useState, useEffect, useRef } from "react";
import withLayoutCustomer from "@/components/wrapping components/WrappingCustomerLayout";
import ResponsiveCarousel from "@/components/CarouselCustomer/carousel";
import StoreComponent from "@/components/customerCommponents/StoreComponent";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { MdArrowForward, MdClose } from "react-icons/md";
import { NextSeo } from "next-seo";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Cookies from "js-cookie";
import axios from "axios";
import url from "@/URL";

export async function getServerSideProps(context) {
  const { params, locale, req , res } = context;
  const Api = createAxiosInstance(`asdasd`);
  const token = req.cookies.AT;
  const user = req.cookies.user;
  let mainResponse;
  let response;

  try {
    if (token && user && user === "customer") {
      // console.log(`authenticated`);
      response = await axios.get(
        `${url}/api/customer/store-types/${params.storeTypeId}`,
        {
          withCredentials: true,
          headers: {
            "Accept-Language": locale ? locale : "en",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      response = await axios.get(
        `${url}/api/storetypes/${params.storeTypeId}`,
        {
          headers: { "Accept-Language": locale ? locale : "en" },
        }
      );
    }
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        stores: response.data,
      },
    };
  } catch (error) {
    if (error.response.status) {
      if (error.response.status == 500) {
        if (error?.response?.data?.lang && error?.response?.data?.slug) {
          if (error?.response?.data?.lang == "ar") {
            res.writeHead(301, {
              Location: `/ar/StoreType/${encodeURIComponent(
                error.response.data.slug
              )}`,
            });
            res.end();
            return true;
          } else {
            res.writeHead(301, {
              Location: `/StoreType/${error.response.data.slug}`,
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

const StoreType = ({ stores }) => {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [searching, setSearching] = useState(false);
  const [inSearch, setInSearch] = useState(false);
  const [searchedResults, setSearchedResults] = useState();
  const searchRef = useRef();
  const { t } = useTranslation("");

  // useEffect(() => {
  //   const sti = router.query.storeTypeId;
  //   if (router.query.storeTypeId) {
  //     setStoreTypeId(sti);
  //   }
  // }, [router.query.storeTypeId]);

  async function search(e) {
    e.preventDefault();
    setSearching(true);
    try {
      const { data: stores } = await Api.post(
        `/api/stores/search`,
        {
          query: searchRef.current.value,
        },
        {
          noSuccessToast: true,
        }
      );
      const component =
        stores.message && stores.data.length < 1 ? (
          <div className="w-[80%] mx-auto text-lg text-center">
            {stores.message}
          </div>
        ) : (
          <div
            className={`w-[70%] grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-col-1 gap-4 mx-auto`}
          >
            {stores?.data?.map((store) => {
              return <StoreComponent key={store.id} store={store} />;
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
    <div>
      <NextSeo
        title={`${stores.data.store_type.name} | ${t("titles.home")}`}
        description={stores.data.store_type.name}
        canonical={
          router.locale == `en`
            ? `https://tawasyme.com/StoreType/${router.query.storeTypeId}`
            : `https://tawasyme.com/ar/StoreType/${router.query.storeTypeId}`
        }
      />
      {/* { stores && <NextSeo
        title={`Tawasy Shopping - ${stores.data.store_type.name}`}
        description={`Tawasy Shopping  ${stores.data.store_type.name}`}
        openGraph={{
          title: stores.data.data.store_type.name,
          description: "shop from our stores that cover a whole combination of categories from our store types",
          images: [
            {
              url: stores.data.store.image,
              alt: stores.data.store.name, 
            },
          ],
          type: 'store type', 
          url: `https://tawasy.com/customer/StoreType/${storeTypeId}`,
        }}
      />} */}
      {stores && stores.data.ads && (
        <div className="mx-auto w-full  " dir="ltr">
          <ResponsiveCarousel ads={stores.data.ads} />
        </div>
      )}
      <div className="md:mx-20 shadow-lg shadow-gray-500 pb-5 mb-6 ">
        {stores && (
          <div className="flex w-full h-full px-5 py-2 bg-gray-200 my-7">
            <div className="w-full">
              <h1 className="md:text-3xl text-xl font-medium text-black">
                {stores.data.store_type.name}
              </h1>
            </div>
          </div>
        )}

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
              className="w-full bg-gray-100 outline-none rounded-lg text-sm h-10"
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

        <div className="">
          {inSearch == false && (
            <div
              className={`w-[70%] grid xl:grid-cols-2 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1 grid-col-1 gap-4 mx-auto `}
            >
              {stores &&
                stores.data.stores.map((store) => {
                  return <StoreComponent key={store.id} store={store} />;
                })}
            </div>
          )}
          {inSearch == true && (
            <div className="min-h-[300px]">
              {inSearch == true &&
                (searching ? (
                  <div className="w-max h-auto mx-auto ">
                    <TawasyLoader width={300} height={300} />
                  </div>
                ) : (
                  searchedResults && searchedResults
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withLayoutCustomer(StoreType);

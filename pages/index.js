import images from "@/public/images/1.jpg";
import imagee from "@/public/images/2.jpg";
import StoreTypeComponent from "@/components/customerCommponents/StoreTypeComponent/StoreTypeComponent";
import Image from "next/image";
import  ResponsiveCarousel  from "@/components/CarouselCustomer/carousel";
import withLayoutCustomer from "@/components/wrapping components/WrappingCustomerLayout";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { Ring } from "@uiball/loaders";
import logo from "@/public/images/tawasylogo.png";
import { NextSeo } from "next-seo";

export async function getServerSideProps(context) {
  const { params, locale } = context;
  const Api = createAxiosInstance();
  const response = await Api.get(`/api/store-types`, {
    headers: { "Accept-Language": locale || "en" },
    "Content-Type": "application/json",
    Accept: "application/json",
  });
  if (!response.data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      data: response.data,
    },
  };
}

function CustomerPage({ data }) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const searchRef = useRef();
  const [searchedResults, setSearchedResults] = useState();
  const [searchType, setSearchType] = useState(`storeType`);
  const [inSearch, setInSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [delayedSearch, setDelayedSearch] = useState(null);
  const { t } = useTranslation("");

  const inputDelay = 500;

  const debounceSearch = () => {
    // setSearching(true);

    if (delayedSearch) {
      clearTimeout(delayedSearch);
    }

    setDelayedSearch(setTimeout(() => {
      if (searchRef.current.value.length >= 3) {
        search();
      } else {
        setSearching(false);
      }
    }, 500));
  };

  const handleInputChange = () => {
    debounceSearch();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    debounceSearch();
  };

  useEffect(() => {
    return () => {
      if (delayedSearch) {
        clearTimeout(delayedSearch);
      }
    };
  }, [delayedSearch]);

  async function search(e = null) {
    if (e) {
      e.preventDefault();
    }
    // console.log(searchType);
    if (searchRef.current.value) {
      setSearching(true);
      switch (searchType) {
        case `storeType`:
          try {
            const { data: storeTypes } = await Api.post(
              `/api/store-types/search`,
              {
                query: searchRef.current.value,
              },
              {
                noSuccessToast: true,
              }
            );
            // console.log(storeTypes);
            const components = (
              <div className="flex flex-col justify-start items-center h-full w-full ">
                <p className=" text-base text-start text-skin-primary py-1 border-b w-full border-skin-primary ">
                  {/* {`Store Types`} : */}
                  {t("home.storeTypes")} :
                </p>
                {storeTypes.message ? (
                  <div className="w-[80%] mx-auto text-lg text-center py-2">
                    {storeTypes.message}
                  </div>
                ) : (
                  <div
                    className=" w-full flex flex-col space-y-2 py-3 "
                    dir="ltr"
                  >
                    {storeTypes?.map((storeType) => {
                      return (
                        <Link
                          key={storeType.slug}
                          href={`/StoreType/${storeType.slug}`}
                          className="flex justify-start items-center space-x-2 hover:bg-gray-100 px-1 py-2 "
                        >
                          <Image
                            loading="eager"
                            src={storeType.image ? storeType.image : logo}
                            alt={storeType.name}
                            width={50}
                            height={50}
                            className="object-center object-contain rounded-sm "
                          />
                          <p>{storeType.name}</p>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSearchedResults(components);
            setSearching(false);
          } catch (error) {
            setSearching(false);
          }
          break;
        case `category`:
          try {
            const { data: categoryStores } = await Api.post(
              `/api/category/search`,
              {
                category_name: searchRef.current.value,
              },
              {
                noSuccessToast: true,
              }
            );
            const components = (
              <div className="flex flex-col justify-start items-center h-full w-full gap-4 ">
                <p className=" text-base text-start text-skin-primary py-1 border-b w-full border-skin-primary">
                  {t("home.stores")} :
                </p>
                {categoryStores.message ? (
                  <div className="w-[80%] mx-auto text-lg text-center">
                    {categoryStores.message}
                  </div>
                ) : (
                  <div className=" w-full flex flex-col space-y-2 py-3 ">
                    {categoryStores?.data?.map((store) => {
                      return (
                        <Link
                          key={store.slug}
                          href={`/Stores/${store.slug}`}
                          className="flex justify-start items-center space-x-2 hover:bg-gray-100 px-1 py-2 "
                        >
                          <Image
                            loading="eager"
                            src={store.logo ? store.logo : logo}
                            alt={store.name}
                            width={50}
                            height={50}
                            className="object-center object-contain rounded-sm "
                          />
                          <p>{store.name}</p>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
            // console.log(`component result`);
            // console.log(components);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSearchedResults(components);
            setSearching(false);
          } catch (error) {
            setSearching(false);
          }
          break;
        case `brand`:
          try {
            const { data: brandStores } = await Api.post(
              `/api/brands/search`,
              {
                query: searchRef.current.value,
              },
              {
                noSuccessToast: true,
              }
            );
            const components = (
              <div className="flex flex-col justify-start items-center h-full w-full gap-4 ">
                <p className="text-base text-start text-skin-primary py-1 border-b w-full border-skin-primary">
                  {/* {`Stores`} : */}
                  {t("home.stores")} :
                </p>
                {brandStores.message && brandStores.data.length < 1 ? (
                  <div className="w-[80%] mx-auto text-lg text-center">
                    {brandStores.message}
                  </div>
                ) : (
                  <div className="  w-full flex flex-col space-y-2 py-3">
                    {brandStores?.data?.map((store) => {
                      return (
                        <Link
                          key={store.id}
                          href={`/Stores/${store.slug}`}
                          className="flex justify-start items-center space-x-2 hover:bg-gray-100 px-1 py-2 "
                        >
                          <Image
                            loading="eager"
                            src={store.logo ? store.logo : logo}
                            alt={store.name}
                            width={50}
                            height={50}
                            className="object-center object-contain rounded-sm "
                          />
                          <p>{store.name}</p>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSearchedResults(components);
            setSearching(false);
          } catch (error) {
            setSearching(false);
          }
          break;
      }
    } else {
      return;
    }
  }

  return (
    <>
      <NextSeo
        title={t("titles.home")}
        description={t("descs.home")}
        canonical={router.locale == `en` ? `https://tawasyme.com` : `https://tawasyme.com/ar` }
      />

      <div className="w-full h-full">
        {data && (
          <div className="relative flex flex-col justify-start items-center h-max w-full gap-4 ">
            {data && data.ads && (
              <div className="mx-auto w-full pb-3 " dir="ltr">
                <ResponsiveCarousel ads={data.ads} />
              </div>
            )}

            <div
              className={`${
                data.ads && data.ads.length > 0
                  ? `md:top-[90px] md:absolute`
                  : ``
              }  w-[80%] mx-auto justify-center items-center space-x-2 pt-5`}
              dir="ltr"
            >
              <div className="flex flex-col justify-start items-center">
                <form
                  onSubmit={handleFormSubmit}
                  className="flex bg-gray-100 w-full lg:w-5/12 md:w-5/12 items-center rounded-sm px-2 border-2 border-transparent focus-within:border-skin-primary transition-all duration-700 mx-auto "
                >
                  <select
                    value={searchType}
                    onChange={(e) => {
                      setSearchType(e.target.value);
                    }}
                    className="bg-gray-100 outline-none sm:text-sm text-xs w-fit h-10 mx-2 px-2"
                  >
                    <option value="storeType">{t("home.storeType")}</option>
                    {/* <option value="category">{t("home.category")}</option> */}
                    {/* <option value="brand">{t("home.brand")}</option> */}
                  </select>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 sm:block hidden "
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
                    className="w-full bg-gray-100 outline-none rounded-lg text-sm h-10 placeholder:text-xs placeholder:text-transparent placeholder:md:text-gray-400"
                    type="text"
                    ref={searchRef}
                    dir={router.locale == "ar" ? "rtl" : "ltr"}
                    onChange={handleInputChange}
                    placeholder={t("home.search")}
                    onClick={() => {
                      setInSearch(true);
                    }}
                  />
                  {searching == true ? (
                    <Ring size={25} lineWeight={5} speed={2} color="#ff6600" />
                  ) : (
                    <MdClose
                      className={`text-red-500 ${
                        inSearch == true ? `opacity-100` : `opacity-0`
                      } transition-opacity duration-300s hover:text-red-600 w-[25px] h-[25px] hover:border-b-2 hover:border-red-600 cursor-pointer`}
                      onClick={() => {
                        setInSearch(false);
                      }}
                    />
                  )}
                </form>
                <p className="block md:hidden text-center text-xs text-gray-400">
                  {t("home.search")}
                </p>
                {inSearch == true && searchedResults && searchType && (
                  <div className="px-4 z-10 mx-auto w-full lg:w-2/5 md:w-2/5 bg-white border border-gray-300 rounded-sm ">
                    {searchedResults}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-start items-center h-full w-full space-y-5">
              <h1 className="hidden">Tawasy Shopping</h1>
              <h2 className=" md:text-4xl text-2xl text-black py-5 ">
                {t("home.discover")}
              </h2>
              {data && data.data ? (
                <div className=" sm:w-[80%] w-[90%] sm:h-[60%] h-max grid 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-6 pb-20 ">
                  {data.data.map((storeType) => {
                    return (
                      <StoreTypeComponent
                        key={storeType.id}
                        storeType={storeType}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="w-[60%] text-center mx-auto text-lg">
                  {" "}
                  {data.message ? data.message : `There are no storeTypes`}{" "}
                </div>
              )}
            </div>

            <div className="w-full mb-7">
              <div className="py-3 mb-4">
                <h2 className="text-center text-3xl text-gray-600">
                  {t("home.JoinUs")}
                </h2>
              </div>
              <div className="flex lg:flex-row flex-col justify-center items-center mx-auto my-auto lg:space-x-4  ">
                <Link
                  href="/signup?user=seller"
                  className="lg:w-[40%] md:w-[60%] w-[70%] lg:my-0 my-2  flex flex-row space-x-2 rounded-md border-2 border-gray-300 hover:border-skin-primary transition-all duration-500 shadow-md"
                >
                  <Image
                    src={imagee}
                    alt="become a seller"
                    width={150}
                    height={150}
                    style={{ width: "150px", height: "150px" }}
                    className="object-contain rounded-l-lg overflow-hidden md:w-[40%] min-w-[40%] w-[50%] h-auto "
                  />

                  <div className="flex flex-col justify-center gap-2">
                    <p className="xl:text-2xl md:text-xl text-lg text-gray-600 font-medium">
                      {" "}
                      {t("home.BecomeASeller")}
                    </p>
                    <p className="md:text-base text-sm text-gray-500 px-1">
                      {t("home.seller")}
                    </p>
                  </div>
                </Link>

                <Link
                  href="/signup?user=customer"
                  className="lg:w-[40%] md:w-[60%] w-[70%] lg:my-0 my-2  flex flex-row space-x-2 rounded-md border-2 border-gray-300 hover:border-skin-primary transition-all duration-500 shadow-md"
                >
                  <Image
                    src={images}
                    alt="become a customer"
                    width={150}
                    height={150}
                    style={{ width: "150px", height: "150px" }}
                    className="object-contain rounded-l-lg overflow-hidden md:w-[40%] min-w-[40%] w-[50%] h-auto "
                  />

                  <div className="flex flex-col justify-center gap-2">
                    <p className=" xl:text-2xl md:text-xl text-lg text-gray-600 font-medium">
                      {" "}
                      {t("home.BecomeACustomer")}
                    </p>
                    <p className="md:text-lg text-base text-gray-500 px-1">
                      {t("home.customer")}
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="flex md:flex-row overflow-clip flex-col-reverse w-[70%] md:space-x-3 space-y-[12px] items-center justify-center py-6 ">
              <div className="flex flex-col space-y-2 md:mx-7 mx-2 md:my-0 my-2">
                <h3 className="text-3xl text-gray-600 font-medium text-center">
                  {t("home.TawasyApp")}
                </h3>
                <p className="text-gray-500 md:my-3 text-center">
                  {t("home.WhatYouNeed")}
                </p>
                <Link href={`https://app.tawasyme.com`} legacyBehavior>
                  <a
                    target="_blank"
                    className="border-2 border-skin-primary py-2 text-center px-5 text-skin-primary rounded-md"
                  >
                    {t("home.DownloadApp")}
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default withLayoutCustomer(CustomerPage);

import withLayoutCustomer from "@/components/wrapping components/WrappingCustomerLayout";
import React, { useRef, useState } from "react";
import { MdArrowForward } from "react-icons/md";
import test from "@/public/images/flowers.jpeg";
import testlogo from "@/public/images/tawasylogo.png";
import PublicStoreCard from "@/components/CustomerPublicStores/PublicStore";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import createAxiosInstance from "@/API";
import { useRouter } from "next/router";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { Ring } from "@uiball/loaders";
import { useQuery } from "react-query";
import { NextSeo } from "next-seo";
import url from "@/URL";
import Link from "next/link";
import axios from "axios";

export async function getServerSideProps(context) {
  const { locale, query } = context;
  const response = await axios.get(
    `${url}/api/allstores?page=${
      query?.page &&
      query?.page !== null &&
      query?.page !== undefined &&
      query?.page > 0
        ? query?.page
        : 1
    }`,
    {
      headers: { "Accept-Language": locale ? locale : "en" },
    }
  );
  // console.log(response);
  if (!response.data) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      stores: response.data,
    },
  };
}

function PublicStore({ stores }) {
  const { t } = useTranslation("");
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [currentPage, setCurrentPage] = useState(1);
  // const {
  //   data: stores,
  //   isLoading,
  //   isFetching,
  // } = useQuery(
  //   [`allStores`, currentPage],
  //   () => fetchAllStores(currentPage),
  //   { staleTime: 1, refetchOnMount: true, refetchOnWindowFocus: false , keepPreviousData : true }
  // );

  // async function fetchAllStores(currentPage) {
  //   try {
  //     return await Api.get(`/api/allstores?page=${currentPage}`);
  //   } catch (error) {}
  // }

  function scroll(id) {
    document.querySelector(`#${id}`).scrollIntoView({ behavior: "smooth" });
  }

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
        title={`${t("titles.allStores")} | ${t("titles.home")}`}
        description={t("descs.allStores")}
        canonical={
          router.locale == `en`
            ? `https://tawasyme.com/Stores`
            : `https://tawasyme.com/ar/Stores`
        }
      />
      <div className="">
        <div className="bg-gray-100 w-full px-5 py-3" id="top">
          <h1 className="text-3xl text-gray-600 font-medium w-[90%] mx-auto">
            {t("stores.ALLStore")}
          </h1>
        </div>

        <div className="w-[90%] mx-auto py-5 ">
          {stores.stores && stores.stores.length > 0 ? (
            <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
              {stores.stores &&
                stores.stores.map((store) => {
                  return <PublicStoreCard key={store.id} store={store} />;
                })}
            </div>
          ) : (
            <div className="w-max mx-auto">{t("stores.noStores")}</div>
          )}
          {stores &&
            stores.stores &&
            stores.stores.length > 0 &&
            stores.pagination && (
              <div className="w-fit mx-auto flex justify-center items-center h-max space-x-4 py-4 ">
                <Link
                  className={`px-2 py-1 ${
                    stores.pagination.current_page == 1
                      ? `pointer-events-none opacity-50 cursor-not-allowed`
                      : `pointer-events-auto`
                  } bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] select-none w-max`}
                  href={`/Stores?page=${
                    stores.pagination.current_page - 1
                  }`}
                >
                  {t("stores.previousPage")}
                </Link>

                <Link
                  className={`px-2 py-1 ${
                    stores.pagination.current_page ===
                    stores.pagination.last_page
                      ? `pointer-events-none opacity-50 cursor-not-allowed`
                      : `pointer-events-auto`
                  } bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] select-none w-max`}
                  href={`/Stores?page=${
                    stores.pagination.current_page + 1
                  }`}
                >
                  {t("stores.nextPage")}
                </Link>
              </div>
            )}
        </div>
      </div>
    </>
  );
}

export default withLayoutCustomer(PublicStore);

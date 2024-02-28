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



export async function getServerSideProps(context) {
  const { locale } = context;
  const Api = createAxiosInstance();
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

function PublicStore() {
  const {t} = useTranslation("");
  const router = useRouter();
  const Api = createAxiosInstance(router) ;
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: stores,
    isLoading,
    isFetching,
  } = useQuery(
    [`allStores`, currentPage],
    () => fetchAllStores(currentPage),
    { staleTime: 1, refetchOnMount: true, refetchOnWindowFocus: false , keepPreviousData : true }
  );

  async function fetchAllStores(currentPage) {
    try {
      return await Api.get(`/api/allstores?page=${currentPage}`);
    } catch (error) {}
  }

  function scroll (id) {
    document.querySelector(`#${id}`).scrollIntoView({behavior : 'smooth' });
  }


  if (isLoading) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={500} height={500} />
      </div>
    );
  }

  return (
    <>
    <NextSeo 
      title={`${t("titles.allStores")} | ${t("titles.home")}`}
      description={t("descs.allStores")}
      canonical="https://tawasyme.com/Stores"
    />
      <div className="">
        <div className="bg-gray-100 w-full px-5 py-3" id="top" >
          <h1 className="text-3xl text-gray-600 font-medium w-[90%] mx-auto">{t("stores.ALLStore")}</h1>
        </div>

        <div className="w-[90%] mx-auto py-5 ">
          { stores.data.stores && stores.data.stores.length > 0 ? <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            { stores.data.stores && stores.data.stores.map((store) => {
              return <PublicStoreCard key={store.id} store={store} />;
            })}
          </div> : <div className="w-max mx-auto" >{t("stores.noStores")}</div>}
          {stores && stores.data.stores && stores.data.stores.length > 0 && stores.data.pagination && (
                <div className="w-fit mx-auto flex justify-center items-center h-max space-x-4 py-4 ">
                  <button
                    className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-max"
                    onClick={() => {
                      setCurrentPage(stores.data.pagination.current_page - 1);
                      scroll(`top`);
                      // setCurrentPage(data.data.pagination.previousPage);
                    }}
                    disabled={
                      stores.data.pagination.current_page ==
                      1
                    }
                  >
                    {t("stores.previousPage")}
                  </button>
                  { isFetching && <Ring size={20} lineWeight={5} speed={2} color="#222222" />}
                  <button
                    className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-max"
                    onClick={() => {
                      setCurrentPage(stores.data.pagination.current_page + 1);
                      scroll(`top`);
                    }}
                    disabled={
                      stores.data.pagination.current_page ===
                      stores.data.pagination.last_page
                    }
                  >
                   {t("stores.nextPage")}
                  </button>
                </div>
              )}

        </div>
      </div>
    </>
  );
}

export default withLayoutCustomer(PublicStore);


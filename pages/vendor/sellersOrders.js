import withVendorLayout from "@/components/wrapping components/WrappingVendorLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import logo from "@/public/images/tawasylogo.png";
import Image from "next/image";
import createAxiosInstance from "@/API";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { Ring } from "@uiball/loaders";
import { MdArrowDropDown, MdClose } from "react-icons/md";
import VendorSellerOrder from "@/components/VendorComponents/vendorSellerOrder";
import { useTranslation } from "next-i18next";

export async function getServerSideProps(context) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

function ProductsPricingPage() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const { t } = useTranslation("");

  const {
    data: orders,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(`vendorSellersOrders`, fetchSellersVendorsOrders, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchSellersVendorsOrders() {
    try {
      return await Api.get(`/api/vendor/get-orders`);
    } catch (error) {}
  }

  return (
    <div className="w-[90%] mx-auto py-7 flex flex-col justify-start items-start space-y-5">
      <p className="px-2 text-start text-3xl">{t("v.sellersRequests")} :</p>
      <hr className="w-full" />
      {isLoading == true ? (
        <div className="w-full flex justify-center items-center">
          <TawasyLoader width={300} height={300} />
        </div>
      ) : (
        <div className="w-full">
          {orders && orders.data && orders?.data?.orders.length > 0 ? (
            <div className="w-full flex flex-wrap justify-start items-center">
              {orders.data.orders.map((order, i) => {
                return (
                  <VendorSellerOrder key={`${i} - ${order.id}`} order={order} />
                );
              })}
            </div>
          ) : (
            <div className="w-full text-center"> {t("v.noSellerRequests")} </div>
          )}
        </div>
      )}
    </div>
  );
}

export default withVendorLayout(ProductsPricingPage);

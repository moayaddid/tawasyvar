import createAxiosInstance from "@/API";
import SellerVendorOrder from "@/components/SellerComponents/sellerVendorOrder";
import TawasyLoader from "@/components/UI/tawasyLoader";
import withLayout from "@/components/wrapping components/WrappingSellerLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { useTranslation } from "next-i18next";

export async function getServerSideProps(context) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

function VendorOrders() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const { t } = useTranslation("");

  const { data: orders, isLoading } = useQuery(
    `SellerVendorOrders`,
    fetchSellerVendorOrders,
    {
      staleTime: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  async function fetchSellerVendorOrders() {
    try {
      return await Api.get(`/api/seller/get-vendor-orders`);
    } catch (error) {}
  }


  return (
    <div className="w-[90%] mx-auto py-7 flex flex-col justify-start items-start space-y-5">
      <p className="px-2 text-start text-3xl">{t("myVendorOrders")}</p>
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
                  <SellerVendorOrder key={`${i} - ${order.id}`} order={order} />
                );
              })}
            </div>
          ) : (
            <div className="w-full text-center"> {t("noVendorOrders")} </div>
          )}
        </div>
      )}
    </div>
  );
}

export default withLayout(VendorOrders);

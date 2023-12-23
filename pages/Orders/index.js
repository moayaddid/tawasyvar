import createAxiosInstance from "@/API";
import OrdersCustomer from "@/components/OrdersCustomer/orders";
import TawasyLoader from "@/components/UI/tawasyLoader";
import withLayoutCustomer from "@/components/wrapping components/WrappingCustomerLayout";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import {useTranslation} from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import grayLogo from '@/public/images/logo-tawasy--gray.png' ;
import { NextSeo } from "next-seo";

const Orders = () => {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const { t } = useTranslation("");

  const { data: orders, isLoading , refetch } = useQuery(`Orders`, fetchOrders, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchOrders() {
    return await Api.get(`/api/customer/orders`);
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
        title={t("titles.orders")}
        description={t("descs.orders")}
        canonical="https://tawasyme.com/Orders"
      />
      <div className="md:px-28 px-3 py-4">
        <div>
          <h1 className="font-medium text-3xl mb-4 text-gray-500 my-">
            {/* {`All Orders`} */}
            {t("orders.allOrders")}
          </h1>
        </div>
        {orders && orders.data.orders && orders.data.orders.length > 0 ? (
          <div className="grid md:grid-cols-3 sm:grid-cols-1 grid-col-1 gap-4 ">
            {orders.data.orders.map((order , index) => {
              return <OrdersCustomer key={index} order={order} refetch = {() => {
                // console.log(`refetching`);
                refetch();
              }} />;
            })}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center text-2xl text-gray-600 ">
            <Image
              src={grayLogo}
              alt="gray Tawasy"
              className="w-[20%] h-auto "
            />
            {/* {`You have no orders yet.`} */}
            {t("orders.orderDetails.noOrders")}
          </div>
        )}
      </div>
    </>
  );
};

export default withLayoutCustomer(Orders);

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
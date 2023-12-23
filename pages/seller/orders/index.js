import withLayout from "@/components/wrapping components/WrappingSellerLayout";
import React, { useEffect, useState } from "react";
import styles from "../../../components/componentsStyling/sellerStyles.module.css";
import SellerOrders from "@/components/SellerOrders/sellerOrder";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export async function getServerSideProps(context) {
  const { locale } = context;
  
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
const Orders = () => {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [ordersType, setOrdersType] = useState();
  const {t} = useTranslation("");
  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching ,
  } = useQuery([`orders`, ordersType, router.query.type], fetchOrders, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  async function fetchOrders() {
    // console.log(`fetching`);
    switch (ordersType) {
      case "pendingOrders":
        const pending = await Api.get(`/api/seller/pending-orders`);
        if (pending.data.pendingOrders) {
          return pending.data.pendingOrders;
        } else {
          return [];
        }
      case "rejectedOrders":
        const rejected = await Api.get(`/api/seller/declined-orders`);
        if (rejected.data.declinedOrders) {
          return rejected.data.declinedOrders;
        } else {
          return [];
        }
      case "acceptedOrders":
        const accepted = await Api.get(`/api/seller/accepted-orders`);
        if (accepted.data.acceptedOrders) {
          return accepted.data.acceptedOrders;
        } else {
          return [];
        }
      case "allOrders":
        const all = await Api.get(`/api/seller/orders`);
        // console.log(`all orders`);
        // console.log(all.data.orders);
        if (all.data.orders) {
          return all.data.orders;
        } else {
          return [];
        }
      case undefined:
        const allo = await Api.get(`/api/seller/orders`);
        // console.log(`all orders undefined`);
        // console.log(allo.data.orders);
        if (allo.data.orders) {
          return allo.data.orders;
        } else {
          return [];
        }
    }
  }

  useEffect(() => {
    let vars = router.query.type;
    if (vars) {
      // setProductsType(vars);
      setOrdersType(vars);
    }

    // setLoaded(true);
  }, [router.query.type]);

  let title;

  if (ordersType) {
    switch (ordersType) {
      case "pendingOrders":
        title = t("seller.sidebar.order.pending");
        break;
      case "rejectedOrders":
        title = t("seller.sidebar.order.rejected");
        break;
      case "acceptedOrders":
        title = t("seller.sidebar.order.accepted");
        break;
      case "allOrders":
        title = t("seller.sidebar.order.all");
        break;
    }
  } else {
    title = t("seller.sidebar.order.all");
  }

  // if (orders) {
  //   console.log(`final orders`);
  //   console.log(orders);
  // }

  return (
    <div className="page-orders" dir={router.locale == "ar" ? "rtl" : "ltr"} >
      <div className="container">
        <div className="m-5 p-5">
          <h2 className="text-2xl text-stone-500 border-b-2 border-skin-primary pb-5 ">
            {title}
          </h2>
        </div>

        <div className="w-full ">
          {isLoading || isRefetching ? (
            <div className="w-full h-full">
              <TawasyLoader width={200} height={200} />
            </div>
          ) : (
            orders &&
            Array.isArray(orders) &&
            orders.length > 0 ? (
              <div className="overflow-x-auto">
              <table className="w-full overflow-x-auto table-auto">
                <thead className="bg-zinc-200 h-8 ">
                  <tr className="border-b-[#ff6600]">
                    <th>{t("seller.orders.table.id")}</th>
                    <th>{t("seller.orders.table.status")}</th>
                    <th>{t("seller.orders.table.date")}</th>
                    <th>{t("seller.orders.table.total")}</th>
                    <th>{t("seller.orders.table.coupon")}</th>
                    {ordersType && ordersType == `rejectedOrders` && (
                      <th>{t("seller.orders.table.reason")}</th>
                    )}
                    <th>{t("seller.orders.table.details")}</th>
                  </tr>
                </thead>
                <tbody className="text-xl">
                  {orders.map((names, index) => (
                    <SellerOrders
                      key={index}
                      orders={names}
                      refetch={() => {
                        refetch();
                      }}
                    />
                  ))}
                </tbody>
              </table>
              </div>
            ) : <p className="w-full text-center" >{t("seller.orders.noOrders")}.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default withLayout(Orders);

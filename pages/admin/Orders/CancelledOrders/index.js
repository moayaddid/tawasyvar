import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import createAxiosInstance from "@/API";
import TawasyLoader from "@/components/UI/tawasyLoader";
import withLayoutAdmin from "@/components/UI/adminLayout";
import OrderAdmin from "@/components/AdminOrders/OrderAdmin";

const tableheading = [
  {
    heading: "Store Name",
  },
  {
    heading: "Customer Name ",
  },
  {
    heading: "Status",
  },
  {
    heading: "Reason",
  },
  {
    heading: "Shipping Address",
  },
  {
    heading: "Date",
  },
  {
    heading: "Updated",
  },
];

function CancelledOrdersAdmin() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const {
    data: allOrders,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery("adminCancelledOrders", fetchCancelledOrders, {
    staleTime: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  async function fetchCancelledOrders () {
    try{
      return await Api.get(`/api/admin/cancelled-orders`);
    }catch(error){

    }
  }

  if(isLoading){
    return <div className="w-full h-full" >
      <TawasyLoader width={400} height={400} />
    </div>
  }

  return (
    <div className="md:px-6">
      <div className="container">
        <div className="m-5 p-5">
          <h2 className="text-2xl text-stone-500 pb-5 ">Cancelled Orders</h2>
        </div>

        <div className="w-full ">
          { allOrders && allOrders.data.data.length > 0 ? <table className="w-full overflow-x-auto table-auto">
            <thead className="sticky top-0 bg-white border-b-2 border-blue-500">
              <tr className="text-sm font-semibold text-center border-b-2 border-gray-400 uppercase">
                <th>Id</th>
                {tableheading.map((head , i) => (
                  <th key={i}>{head.heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-lg font-normal text-gray-700 text-center">
              {allOrders && allOrders.data.data.map((order , index) => {
                return (
                  <OrderAdmin
                    names={order}
                    key={index}
                    refetch={() => {
                      refetch();
                    }}
                  />
                );
              })}
            </tbody>
          </table> : <div> There are no cancelled orders. </div>}
        </div>
      </div>
    </div>
  );
}

export default withLayoutAdmin(CancelledOrdersAdmin);

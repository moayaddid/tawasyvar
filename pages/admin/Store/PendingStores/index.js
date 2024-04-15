import React, { useState, useEffect } from "react";
import withLayoutAdmin from "@/components/UI/adminLayout";
import item1 from "../../../../public/images/kuala.jpg";
import StoreAdmin from "@/components/AdminStore/StoreAdmin";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";

const tableheading = [
  {
    heading: "Action",
  },
  {
    heading: "Seller ID",
  },
  {
    heading : "Seller Name"
  },
  {
    heading: "Name Ar",
  },
  {
    heading: "Name En",
  },
  {
    heading: "Opening Time",
  },
  {
    heading: "Closing Time",
  },
  {
    heading: "Status",
  },
  {
    heading: "Image",
  },
  {
    heading: "Logo",
  },
  {
    heading: "Store Type",
  },
  {
    heading: "Opening Days",
  },
  {
    heading: "Address",
  },
  {
    heading: "Street",
  },
  {
    heading: "Area",
  },
  {
    heading: "Created",
  },
  {
    heading: "Updated",
  },
];


function PendingStoreAdmin() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const {
    data: pendingStores,
    isLoading,
    refetch,
  } = useQuery(`pendingStores`, fetchPendingStores, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchPendingStores () {
    try{
      return await Api.get(`/api/admin/store-requests`);
    }catch(error){}
  }

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={400} height={400} />
      </div>
    );
  }

  return (
    <div className="md:px-6">
      <div className="h-full">
        <div className="m-5 p-5">
          <h2 className="text-2xl text-stone-500 pb-5 ">Pending Stores</h2>
        </div>

        <div className="w-full h-[70%] overflow-x-auto ">
          {pendingStores &&
          pendingStores.data.requests &&
          pendingStores.data.requests.length > 0 ? (
            <table className="w-max overflow-x-auto table-auto">
              <thead className="">
                <tr className="text-sm font-semibold text-center border-b-2 border-gray-400 uppercase">
                  <th>Id</th>
                  {tableheading.map((index) => (
                    <th className="px-4 " key={index.id}>
                      {index.heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-lg font-normal text-gray-700 text-center">
                {pendingStores.data.requests.map((store) => {
                  return (
                    <StoreAdmin
                      names={store}
                      key={store.id}
                      refetch={() => {
                        refetch();
                      }}
                    />
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="w-max mx-auto">{`There are no pending Stores.`}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withLayoutAdmin(PendingStoreAdmin);

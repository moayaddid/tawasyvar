import React, { useState, useEffect } from "react";
import withLayoutAdmin from "@/components/UI/adminLayout";
import item1 from "../../../../public/images/kuala.jpg";
import StoreAdmin from "@/components/AdminStore/StoreAdmin";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { Ring } from "@uiball/loaders";

const tableheading = [
  {
    heading: "Action",
  },
  {
    heading: "Seller ID",
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

function ActiveStoreAdmin() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [currentPage, setCurrentPage] = useState(1);
  const { data:activeStores, isLoading, refetch , isFetching } = useQuery(
    [`activeStores` , currentPage],
     () => fetchActiveStores(currentPage),
    { staleTime: 1, refetchOnMount: true, refetchOnWindowFocus: false }
  );

  async function fetchActiveStores(currentPage) {
    try {
      return await Api.get(`/api/admin/approved-stores?page=${currentPage}`);
    } catch (error) {}
  }

  if (isLoading == true) {
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
          <h2 className="text-2xl text-stone-500 pb-5 ">Active Stores</h2>
        </div>

        <div className="w-full h-[70%] overflow-x-auto ">
          {activeStores &&
          activeStores.data.stores &&
          activeStores.data.stores.length > 0 ? (
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
                {activeStores.data.stores.map((store) => {
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
            <div className="w-max mx-auto">{`There are no active Stores.`}</div>
          )}
        </div>
        {activeStores && activeStores.data.pagination && (
            <div className="w-[50%] mx-auto flex justify-center items-center h-max gap-4 ">
              <button
                className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                onClick={() => {
                  setCurrentPage(activeStores.data.pagination.current_page - 1);
                }}
                disabled={
                  activeStores.data.pagination.current_page ===
                  activeStores.data.pagination.from
                }
              >
                Previous Page
              </button>
              {isFetching && (
                <Ring size={20} lineWeight={5} speed={2} color="#222222" />
              )}
              <button
                className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                onClick={() => {
                  setCurrentPage(activeStores.data.pagination.current_page + 1);
                }}
                disabled={
                  activeStores.data.pagination.current_page ===
                  activeStores.data.pagination.last_page
                }
              >
                Next Page
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

export default withLayoutAdmin(ActiveStoreAdmin);

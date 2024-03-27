import React, { useState, useEffect } from "react";
import withLayoutAdmin from "@/components/UI/adminLayout";
import item1 from "../../../../public/images/kuala.jpg";
import StoreAdmin from "@/components/AdminStore/StoreAdmin";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { useRef } from "react";
import { MdArrowForward, MdClose } from "react-icons/md";
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
    heading: "Store Type ID",
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

function AllStoreAdmin() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [searchedResults, setSearchedResults] = useState();
  const searchRef = useRef();
  const [inSearch, setInSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: stores,
    isLoading,
    refetch,
    isFetching,
  } = useQuery(["allStores", currentPage], () => fetchAllStores(currentPage), {
    staleTime: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    keepPreviousData: true,
  });

  async function fetchAllStores(currentPage) {
    return await Api.get(`/api/admin/stores?page=${currentPage}`);
  }

  async function search(e) {
    e.preventDefault();
    setSearching(true);
    try {
      const response = await Api.get(`/api/admin/stores/searchByName`, {
        params: { search: searchRef.current.value },
        noSuccessToast: true,
      });
      const component =
        response.data.data.length < 1 ? (
          <div className="w-max mx-auto">{response.data.message}</div>
        ) : (
          <table className="w-full overflow-x-auto table-auto">
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
              {response.data.data &&
                response.data.data.map((customer) => {
                  return (
                    <StoreAdmin
                      names={customer}
                      key={customer.id}
                      refetch={() => {
                        refetch();
                      }}
                    />
                  );
                })}
            </tbody>
          </table>
        );
      setSearchedResults(component);
      setSearching(false);
    } catch (error) {
      setSearching(false);
    }
    setSearching(false);
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
          <h2 className="text-2xl text-stone-500 pb-5 ">All Stores</h2>
        </div>

        <div
          className="w-[80%] flex justify-center items-center gap-2 mx-auto mb-7 "
          dir="ltr"
        >
          <form
            onSubmit={search}
            className="flex bg-gray-100 w-full sm:w-2/5 items-center rounded-lg px-2 border-2 border-transparent focus-within:border-skin-primary transition-all duration-700 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
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
              className="w-full bg-gray-100 outline-none rounded-lg text-sm h-10  "
              type="text"
              ref={searchRef}
              placeholder="Search stores by name"
              onClick={() => {
                setInSearch(true);
              }}
              required
            />
            <button type="submit">
              <MdArrowForward
                // onClick={search}
                className="hover:border-b-2 border-skin-primary cursor-pointer"
              />
            </button>
          </form>
          {inSearch == true && (
            <MdClose
              className="text-red-500 hover:text-red-600 w-[25px] h-[25px] hover:border-b-2 hover:border-red-600 cursor-pointer "
              onClick={() => {
                setInSearch(false);
              }}
            />
          )}
        </div>

        <div className="w-full h-[70%] overflow-x-auto ">
          {inSearch == false && (
            <div>
              <table className="w-max overflow-x-auto table-auto">
                <thead className="sticky top-0 bg-white border-b-2 border-blue-500">
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
                  {stores &&
                    stores.data.stores &&
                    stores.data.stores.map((store) => {
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
            </div>
          )}
          
          {inSearch == true &&
            (searching == true ? (
              <div className="w-full h-full">
                <TawasyLoader width={300} height={300} />
              </div>
            ) : (
              <div className="w-full min-h-[500px]">
                {searchedResults && searchedResults}
              </div>
            ))}
        </div>
        {inSearch == false && stores && stores.data.pagination && (
            <div className="w-[50%] mx-auto flex justify-center items-center h-max gap-4 py-3 ">
              <button
                className="px-2 py-1 bg-[#2837bf] text-white rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                onClick={() => {
                  setCurrentPage(1);
                }}
                disabled={
                  stores.data.pagination.current_page ==
                  1
                }
              >
                First Page
              </button>
              <button
                className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                onClick={() => {
                  setCurrentPage(stores.data.pagination.current_page - 1);
                }}
                disabled={
                  stores.data.pagination.current_page ==
                  1
                }
              >
                Previous Page
              </button>
              {isFetching ? (
                <Ring size={20} lineWeight={5} speed={2} color="#222222" />
              ) : <p className="px-2 border-b-2 border-skin-primary" >{stores.data.pagination.current_page}</p>}
              <button
                className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                onClick={() => {
                  setCurrentPage(stores.data.pagination.current_page + 1);
                }}
                disabled={
                  stores.data.pagination.current_page ===
                  stores.data.pagination.last_page
                }
              >
                Next Page
              </button>
              <button
                className="px-2 py-1 bg-[#2837bf] text-white rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                onClick={() => {
                  setCurrentPage(stores.data.pagination.last_page);
                }}
                disabled={
                  stores.data.pagination.current_page ===
                  stores.data.pagination.last_page
                }
              >
                Last Page
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

export default withLayoutAdmin(AllStoreAdmin);

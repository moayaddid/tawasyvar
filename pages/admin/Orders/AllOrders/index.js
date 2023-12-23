import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import createAxiosInstance from "@/API";
import TawasyLoader from "@/components/UI/tawasyLoader";
import withLayoutAdmin from "@/components/UI/adminLayout";
import OrderAdmin from "@/components/AdminOrders/OrderAdmin";
import { MdArrowForward, MdClose } from "react-icons/md";

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
    heading: "Shipping Address",
  },
  {
    heading: "Date",
  },
  {
    heading: "Updated",
  },
];


function AllOrdersAdmin() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [searchedResults, setSearchedResults] = useState();
  const searchRef = useRef();
  const [inSearch, setInSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const {
    data: allOrders,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery("adminAllOrders", fetchAllOrders, {
    staleTime: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  async function fetchAllOrders() {
    try {
      return await Api.get(`/api/admin/orders`);
    } catch (error) {}
  }

  async function search(e) {
    e.preventDefault();
    setSearching(true);
    try {
      const response = await Api.get(`/api/admin/orders/searchById`, {
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
                {tableheading.map((head , i) => (
                  <th className="px-4 " key={i}>
                    {head.heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-lg font-normal text-gray-700 text-center">
              {response.data.data &&
                response.data.data.map((customer , index) => {
                  return (
                    <OrderAdmin
                      names={customer}
                      key={index}
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
      <div className="container">
        <div className="m-5 p-5">
          <h2 className="text-2xl text-stone-500 pb-5 ">All Orders</h2>
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
              placeholder="Search orders by the order id"
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

        { inSearch == false && <div className="w-full ">
          {allOrders && allOrders.data.data.length > 0 ? (
            <table className="w-full overflow-x-auto table-auto">
              <thead className="sticky top-0 bg-white border-b-2 border-blue-500 w-full py-4 ">
                <tr className="text-sm font-semibold text-center border-b-2 border-gray-400 uppercase">
                  <th>Id</th>
                  {tableheading.map((index) => (
                    <th key={index.id}>{index.heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-lg font-normal text-gray-700 text-center">
                {allOrders &&
                  allOrders.data.data.map((order) => {
                    return (
                      <OrderAdmin
                        names={order}
                        key={order.id}
                        refetch={() => {
                          refetch();
                        }}
                      />
                    );
                  })}
              </tbody>
            </table>
          ) : (
            <div className="w-full text-center"> There are no orders. </div>
          )}
        </div>}

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
    </div>
  );
}

export default withLayoutAdmin(AllOrdersAdmin);

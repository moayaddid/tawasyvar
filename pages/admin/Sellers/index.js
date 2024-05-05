import React, { useState, useEffect, useRef } from "react";
import withLayoutAdmin from "@/components/UI/adminLayout";
import CouponsAdmin from "@/components/AdminCoupons/CouponsAdmin";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import CustomersAdmin from "@/components/AdminCustomer/CustomerAdmin";
import SellersAdmin from "@/components/AdminSeller/SellerAdmin";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { MdArrowForward, MdClose } from "react-icons/md";

const tableheading = [
  {
    heading: "Name",
  },
  {
    heading: "Phone",
  },
  // {
  //   heading: "Store Id",
  // },
  {
    heading: "Stores",
  },
  {
    heading: "Verification Code",
  },
  {
    heading: "City",
  },
  {
    heading: "Location",
  },
  {
    heading: "Longitude",
  },
  {
    heading: "Latitude",
  },
  {
    heading: "Created At",
  },
  {
    heading: "Updated At",
  },
];

function AllCustomer() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [searchedResults, setSearchedResults] = useState();
  const searchRef = useRef();
  const [inSearch, setInSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const { data: sellers, isLoading , refetch } = useQuery(`sellers`, fetchSellers, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchSellers() {
    try {
      return await Api.get(`/api/admin/all-sellers`);
    } catch (error) {}
  }

  async function search(e) {
    e.preventDefault();
    setSearching(true);
    try {
      const response = await Api.get(`/api/admin/sellers/searchByName`, {
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
                    <SellersAdmin
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
          <h2 className="text-2xl text-stone-500 pb-5 ">Sellers</h2>
          <div className="flex">
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
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  className="w-full bg-gray-100 outline-none rounded-lg text-sm h-10  "
                  type="text"
                  ref={searchRef}
                  placeholder="Search sellers by name"
                  onClick={() => {
                    setInSearch(true);
                  }}
                />
                <MdArrowForward
                  // onClick={search}
                  type="submit"
                  className="hover:border-b-2 border-skin-primary cursor-pointer"
                />
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
          </div>
        </div>

        <div className="w-full h-[70%] overflow-x-auto ">
          {inSearch == false && (
            <table className="w-max overflow-x-auto table-auto">
              <thead className="">
                <tr className="text-sm font-semibold text-center border-b-2 border-gray-400 uppercase">
                  <th>Id</th>
                  {tableheading.map((index , i) => (
                    <th className="px-4 " key={i}>
                      {index.heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-lg font-normal text-gray-700 text-center">
                {sellers &&
                  sellers.data.data.map((customer , index) => {
                    return (
                      <SellersAdmin
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
      </div>
    </div>
  );
}

export default withLayoutAdmin(AllCustomer);

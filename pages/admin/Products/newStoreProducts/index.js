import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import createAxiosInstance from "@/API";
import TawasyLoader from "@/components/UI/tawasyLoader";
import withLayoutAdmin from "@/components/UI/adminLayout";
import { Ring } from "@uiball/loaders";
import AdminNewProduct from "@/components/AdminNewProduct/AdminNewProduct";
import { MdArrowForward, MdClose } from "react-icons/md";

const tableheading = [
  {
    heading: "Name",
  },
  {
    heading: "Image",
  },
];

function NewStoreProducts() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [currentPage, setCurrentPage] = useState(1);
  const [inSearch, setInSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchedResults, setSearchedResults] = useState();
  const searchRef = useRef();
  const {
    data: allProduct,
    isLoading,
    refetch,
    isRefetching,
    isFetching,
  } = useQuery(
    ["waffer", currentPage],
    () => fetchadminAllProduct(currentPage),
    {
      staleTime: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  async function fetchadminAllProduct(currentPage) {
    try {
      return await Api.get(`/api/admin/waffer?page=${currentPage}`);
    } catch {}
  }

  async function search(e) {
    e.preventDefault();
    setSearching(true);
    try {
      const response = await Api.get(
        `api/admin/khara-search`,
        {
          params: { query: searchRef.current.value },
        },
        {
          noSuccessToast: true,
        }
      );
      const component = !response.data.products ? (
        <div className="w-max mx-auto text-black ">{response.data.message}</div>
      ) : (
        <table className="w-full overflow-auto table-auto">
          <thead className="sticky top-0 bg-white border-b-2 border-blue-500">
            <tr className="text-sm font-semibold text-center border-b-2 border-blue-500 uppercase">
              <th>Id</th>
              {tableheading.map((index) => (
                <th className=" px-4 py-4 " key={index.heading}>
                  {index.heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-lg h-[10%] font-normal text-gray-700 text-center">
            {response.data.products &&
              response.data.products.map((names, i) => {
                return (
                  <AdminNewProduct
                    product={names}
                    key={`${names.name} - ${i}`}
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

  if (isLoading == true) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={400} height={400} />
      </div>
    );
  }

  return (
    <div>
      <div className="md:px-6 h-full ">
        <div className="w-full h-screen max-h-full flex flex-col mx-auto">
          <div className="p-3 h-max flex justify-between items-center ">
            <h2 className="text-2xl text-stone-500 pb-3 w-[20%] ">
              New Products
            </h2>
            <div
              className=" w-[80%] flex justify-start items-center space-x-3 "
              dir="ltr"
            >
              <form
                dir={router.locale == "ar" ? "rtl" : "ltr"}
                onSubmit={search}
                className="flex bg-gray-100 w-[50%] items-center rounded-lg px-2 border-2 border-transparent focus-within:border-skin-primary transition-all duration-700 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mx-2"
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
                  // placeholder={`Search`}
                  placeholder={`Search By Name`}
                  onClick={() => {
                    setInSearch(true);
                  }}
                />
                <button type="submit">
                  <MdArrowForward
                    onClick={search}
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
          </div>
          {inSearch == false && (
            <div className="w-full h-full flex overflow-hidden flex-col justify-start gap-1 ">
              <div className=" h-[90%] overflow-auto">
                {allProduct && allProduct.data.products.length > 0 ? (
                  <table className="w-full overflow-auto table-auto">
                    <thead className="sticky top-0 bg-white border-b-2 border-blue-500">
                      <tr className="text-sm font-semibold text-center border-b-2 border-blue-500 uppercase">
                        <th>Id</th>
                        {tableheading.map((index) => (
                          <th className=" px-4 py-4 " key={index.heading}>
                            {index.heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-lg h-[10%] font-normal text-gray-700 text-center">
                      {allProduct.data.products &&
                        allProduct.data.products.map((names, i) => {
                          return (
                            <AdminNewProduct
                              product={names}
                              key={`${names.name} - ${i}`}
                            />
                          );
                        })}
                    </tbody>
                  </table>
                ) : (
                  <div className="w-max mx-auto"> There are no Products. </div>
                )}
              </div>
              {allProduct && allProduct.data.pagination && (
                <div className="w-[50%] mx-auto flex justify-center items-center h-max gap-4 ">
                  <button
                    className="px-2 py-1 bg-[#2837bf] text-white rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                    onClick={() => {
                      setCurrentPage(
                       1
                      );
                    }}
                    disabled={
                      allProduct.data.pagination.current_page ==
                      1
                    }
                  >
                    First Page
                  </button>
                  <button
                    className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                    onClick={() => {
                      setCurrentPage(
                        allProduct.data.pagination.current_page - 1
                      );
                    }}
                    disabled={
                      allProduct.data.pagination.current_page ==
                      1
                    }
                  >
                    Previous Page
                  </button>
                  {isFetching ? (
                    <Ring size={20} lineWeight={5} speed={2} color="#222222" />
                  ) : <p className="px-2 border-b-2 border-skin-primary" >{allProduct.data.pagination.current_page}</p>}
                  <button
                    className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                    onClick={() => {
                      setCurrentPage(
                        allProduct.data.pagination.current_page + 1
                      );
                    }}
                    disabled={
                      allProduct.data.pagination.current_page ===
                      allProduct.data.pagination.last_page
                    }
                  >
                    Next Page
                  </button>
                  <button
                    className="px-2 py-1 bg-[#2837bf] text-white rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                    onClick={() => {
                      setCurrentPage(
                        allProduct.data.pagination.last_page
                      );
                    }}
                    disabled={
                      allProduct.data.pagination.current_page ===
                      allProduct.data.pagination.last_page
                    }
                  >
                    Last Page
                  </button>
                </div>
              )}
            </div>
          )}

          {inSearch == true &&
            (searching == true ? (
              <div className="w-full h-full">
                <TawasyLoader width={300} height={300} />
              </div>
            ) : (
              searchedResults && searchedResults
            ))}
        </div>
      </div>
    </div>
  );
}

export default withLayoutAdmin(NewStoreProducts);

import withLayout from "@/components/wrapping components/WrappingSellerLayout";
import React, { useState, useEffect } from "react";
import item1 from "../../../../public/images/kuala.jpg";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import createAxiosInstance from "@/API";
import { QueryClient, useQueryClient } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import Link from "next/link";
import AdminProduct from "@/components/AdminProducts/productsAdmin";
import withLayoutAdmin from "@/components/UI/adminLayout";
import { MdArrowForward, MdClose } from "react-icons/md";
import { useRef } from "react";
import { Ring } from "@uiball/loaders";

const tableheading = [
  {
    heading: "Action",
  },
  {
    heading: "Has-Variations",
  },
  {
    heading: "Name Ar",
  },
  {
    heading: "Name En",
  },
  {
    heading: "Desc Ar",
  },
  {
    heading: "Desc En",
  },
  {
    heading: "Category",
  },
  {
    heading: "Image",
  },
  {
    heading: "Status",
  },
  {
    heading: "Brand",
  },
  {
    heading: "Sku",
  },
  {
    heading: "Ean Code",
  },
  {
    heading: "items per pack",
  },
  {
    heading: "Sold Quantity",
  },

  {
    heading: "Sort Order",
  },
  {
    heading: "Created",
  },
  {
    heading: "Updated",
  },
  {
    heading: "Instores",
  },
];

function ProductsAdmin() {
  const [tablecontent, settablecontent] = useState([]);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [searchedResults, setSearchedResults] = useState();
  const searchRef = useRef();
  const [inSearch, setInSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: allProduct,
    isLoading,
    refetch,
    isRefetching,
    isFetching
  } = useQuery(["adminAllProduct" ,currentPage ], () => fetchadminAllProduct(currentPage), {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  async function fetchadminAllProduct(currentPage) {
    try {
      return await Api.get(`/api/admin/get-products?page=${currentPage}`);
    } catch {}
  }

  const closepopup = () => {
    openchange(false);
  };

  async function search(e) {
    e.preventDefault();
    setSearching(true);
    try {
      const response = await Api.get(`/api/admin/products/searchByName`, {
        params: { search: searchRef.current.value },
        noSuccessToast: true,
      });
      const component =
        response.data.data.length < 1 ? (
          <div className="w-max mx-auto">{response.data.message}</div>
        ) : (
          <table className="w-max overflow-auto table-auto">
            <thead className="sticky top-0 bg-white border-b-2 border-blue-500">
              <tr className="text-sm font-semibold text-center border-b-2 border-blue-500 uppercase">
                <th>Id</th>
                {tableheading.map((index) => (
                  <th className=" px-4" key={index.heading}>
                    {index.heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-lg h-full font-normal text-gray-700 text-center">
              {response.data.data &&
                response.data.data.map((names) => {
                  return (
                    <AdminProduct
                      product={names}
                      key={names.id}
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
          <div className="p-3 h-[20%] ">
            <h2 className="text-2xl text-stone-500 pb-5 ">All Products</h2>
            <div className="flex">
              <div
                className="w-full flex justify-center items-center gap-2 mx-auto "
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
                    placeholder="Search products by name"
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

              <div className="w-[50%] flex justify-end ">
                <button
                  className="bg-skin-primary text-white py-1 px-3 rounded-md"
                  onClick={() => {
                    router.push("/admin/Products/addNewProduct");
                  }}
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>

          {inSearch == false && (
            <div className="w-full h-full flex overflow-hidden flex-col justify-start gap-4 ">
              <div className="mt-2 h-[90%] overflow-auto">
                {allProduct && allProduct.data.products.length > 0 ? (
                  <table className="w-max overflow-auto table-auto">
                    <thead className="sticky top-0 bg-white border-b-2 border-blue-500">
                      <tr className="text-sm font-semibold text-center border-b-2 border-blue-500 capitalize">
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
                        allProduct.data.products.map((names) => {
                          return (
                            <AdminProduct
                              product={names}
                              key={names.id}
                              refetch={() => {
                                refetch();
                              }}
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
                    className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                    onClick={() => {
                      setCurrentPage(1);
                      // setCurrentPage(data.data.pagination.previousPage);
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
                      setCurrentPage(allProduct.data.pagination.current_page - 1);
                      // setCurrentPage(data.data.pagination.previousPage);
                    }}
                    disabled={
                      allProduct.data.pagination.current_page ==
                      1
                    }
                  >
                    Previous Page
                  </button>
                  { isFetching ? <Ring size={20} lineWeight={5} speed={2} color="#222222" /> : <p className=" px-2 border-b-2 border-skin-primary" >{allProduct.data.pagination.current_page}</p>}
                  <button
                    className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                    onClick={() => {
                      setCurrentPage(allProduct.data.pagination.current_page + 1);
                      // setCurrentPage(data.data.pagination.nextPage);
                    }}
                    disabled={
                      allProduct.data.pagination.current_page ===
                      allProduct.data.pagination.last_page
                    }
                  >
                    Next Page
                  </button>
                  <button
                    className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                    onClick={() => {
                      setCurrentPage(allProduct.data.pagination.last_page);
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
              <div className=" mt-6 h-[90%] overflow-auto">
                {searchedResults && searchedResults}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default withLayoutAdmin(ProductsAdmin);

import createAxiosInstance from "@/API";
import AdminAttachableProduct from "@/components/AdminComponents/AdminAttachableProduct";
import withLayoutAdmin from "@/components/UI/adminLayout";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { MdArrowForward, MdClose } from "react-icons/md";
import { useQuery } from "react-query";

const tableheading = [
  {
    heading: "Action",
  },
  {
    heading: "Name",
  },
  {
    heading: "Image",
  },
];

function AttachableProducts() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [selectedStore, setSelectedStore] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [inSearch, setInSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchedResults, setSearchedResults] = useState();
  const searchRef = useRef();
  const {
    data: attachableProducts,
    refetch,
    isLoading,
    isFetching,
    isRefetching,
  } = useQuery(
    [`AttachableProducts`, selectedStore, currentPage],
    () => fectAttachableProducts(selectedStore, currentPage),
    {
      staleTime: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  );

  function scroll(id) {
    document.querySelector(`#${id}`).scrollIntoView({ behavior: "smooth" });
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
        <table className="w-full overflow-auto relative table-auto overflow-y-scroll ">
          <thead className="sticky top-0 bg-white border-b-2 border-blue-500 overflow-y-scroll">
            <tr className="text-sm font-semibold text-center border-b-2 border-blue-500 uppercase">
              <th>Id</th>
              {tableheading.map((index) => (
                <th className=" px-4 py-4 " key={index.heading}>
                  {index.heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-lg font-normal text-gray-700 text-center h-[500px]">
            {response?.data?.products &&
              response?.data?.products?.map((prod) => {
                return (
                  <AdminAttachableProduct
                    product={prod}
                    key={prod.id}
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

  async function fectAttachableProducts(selectedPage) {
    try {
      return await Api.get(
        `/api/admin/get-waffer-products/?page=${selectedPage}`
      );
    } catch (error) {}
  }

  return (
    <div className="w-[90%] mx-auto py-12 flex flex-col space-y-4 h-screen ">
      <div className="flex text-2xl pb-2 border-b border-gray-400 justify-start items-center">
        Attachable Products
      </div>
      <div className="flex justify-start space-x-6 items-center">
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
        {attachableProducts && attachableProducts.data.pagination && (
          <div className="w-fit mx-auto flex justify-center items-center h-max gap-4 py-4 ">
            <button
              className="px-2 py-1 bg-gray-400 text-white rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed w-max"
              onClick={() => {
                setCurrentPage(
                  attachableProducts.data.pagination.current_page - 1
                );
              }}
              disabled={attachableProducts.data.pagination.current_page == 1}
            >
              {`Previous Page`}
            </button>
            <button
              className="px-2 py-1 bg-gray-400 text-white rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed w-max"
              onClick={() => {
                setCurrentPage(
                  attachableProducts.data.pagination.current_page + 1
                );
              }}
              disabled={
                attachableProducts.data.pagination.current_page ===
                attachableProducts.data.pagination.last_page
              }
            >
              {`Next Page`}
            </button>
            {isFetching && (
              <Ring size={20} lineWeight={5} speed={2} color="#222222" />
            )}
          </div>
        )}
      </div>
      {isLoading == true ? (
        <div className="w-full h-full flex justify-center items-center">
          <TawasyLoader width={300} height={300} />
        </div>
      ) : (
        inSearch == false && (
          <div className="w-full">
            {attachableProducts &&
            attachableProducts.data?.products?.length > 0 ? (
              <table className="w-full overflow-auto relative table-auto overflow-y-scroll ">
                <thead className="sticky top-0 bg-white border-b-2 border-blue-500 overflow-y-scroll">
                  <tr className="text-sm font-semibold text-center border-b-2 border-blue-500 uppercase">
                    <th>Id</th>
                    {tableheading.map((index) => (
                      <th className=" px-4 py-4 " key={index.heading}>
                        {index.heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-lg font-normal text-gray-700 text-center h-[500px]">
                  {attachableProducts?.data?.products &&
                    attachableProducts.data.products.map((prod) => {
                      return (
                        <AdminAttachableProduct
                          product={prod}
                          // selectedStoreId={selectedStore}
                          key={prod.id}
                          refetch={() => {
                            refetch();
                          }}
                        />
                      );
                    })}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-lg">
                There are no Attachable Products
              </p>
            )}
          </div>
        )
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
  );
}

export default withLayoutAdmin(AttachableProducts);

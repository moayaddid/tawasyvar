import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import createAxiosInstance from "@/API";
import TawasyLoader from "@/components/UI/tawasyLoader";
import withLayoutAdmin from "@/components/UI/adminLayout";
import { Ring } from "@uiball/loaders";
import AdminNewProduct from "@/components/AdminNewProduct/AdminNewProduct";

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
  const {
    data: allProduct,
    isLoading,
    refetch,
    isRefetching,
    isFetching
  } = useQuery(["waffer" ,currentPage ], () => fetchadminAllProduct(currentPage), {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  async function fetchadminAllProduct(currentPage) {
    try {
      return await Api.get(`/api/admin/waffer?page=${currentPage}`);
    } catch {}
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
          <div className="p-3 h-max ">
            <h2 className="text-2xl text-stone-500 pb-3 ">New Products</h2>
          </div>
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
                        allProduct.data.products.map((names , i) => {
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
                    className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                    onClick={() => {
                      setCurrentPage(allProduct.data.pagination.current_page - 1);
                      // setCurrentPage(data.data.pagination.previousPage);
                    }}
                    disabled={
                      allProduct.data.pagination.current_page ===
                      allProduct.data.pagination.from
                    }
                  >
                    Previous Page
                  </button>
                  { isFetching && <Ring size={20} lineWeight={5} speed={2} color="#222222" />}
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
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default withLayoutAdmin(NewStoreProducts);

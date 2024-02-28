import React, { useState, useEffect } from "react";
import item1 from "../../../../public/images/kuala.jpg";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import Link from "next/link";
import withLayoutAdmin from "@/components/UI/adminLayout";
import AdminProduct from "@/components/AdminProducts/productsAdmin";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
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
    heading: "Quantity",
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

function ShareProductsAdmin() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: sharedProducts,
    isLoading,
    refetch,
    isFetching,
  } = useQuery(
    ["adminSharedProducts", currentPage],
    () => fetchSharedProducts(currentPage),
    {
      staleTime: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  async function fetchSharedProducts(currentPage) {
    try {
      return await Api.get(`/api/admin/approved-products?page=${currentPage}`);
    } catch (error) {}
  }

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={400} height={400} />
      </div>
    );
  }

  return (
    <div>
      <div className="md:px-6">
        <div className="w-full h-full mx-auto">
          <div className="m-5 p-5 flex justify-between items-center">
            <h1 className="text-2xl text-stone-500 ">Share Product</h1>
            {/* <div className="flex"> */}
            <div className="w-max flex justify-end ">
              <button
                className="bg-skin-primary text-white py-1 px-3 rounded-md"
                onClick={() => {
                  router.push("/admin/Products/addNewProduct");
                }}
              >
                Add Product
              </button>
            </div>
            {/* </div> */}
          </div>
          {sharedProducts && sharedProducts.data.products.length > 0 ? (
            <div className="mt-6 max-h-[700px] overflow-x-auto">
              <table className="w-max overflow-x-auto table-auto">
                <thead className="sticky top-0">
                  <tr className="text-sm font-semibold bg-white text-center border-b-2 border-blue-500 uppercase">
                    <th>Id</th>
                    {tableheading.map((index) => (
                      <th className=" px-4 py-4 " key={index.heading}>
                        {index.heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-lg font-normal text-gray-700 text-center">
                  {sharedProducts.data.products.map((names) => {
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
            </div>
          ) : (
            <div className="w-max mx-auto">There are no Shared Products.</div>
          )}

          {sharedProducts && sharedProducts.data.pagination && (
            <div className="w-[50%] mx-auto flex justify-center items-center h-max gap-4 ">
              <button
                className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                onClick={() => {
                  setCurrentPage(
                    sharedProducts.data.pagination.current_page - 1
                  );
                  // setCurrentPage(data.data.pagination.previousPage);
                }}
                disabled={
                  sharedProducts.data.pagination.current_page ===
                  1
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
                  setCurrentPage(
                    sharedProducts.data.pagination.current_page + 1
                  );
                  // setCurrentPage(data.data.pagination.nextPage);
                }}
                disabled={
                  sharedProducts.data.pagination.current_page ===
                  sharedProducts.data.pagination.last_page
                }
              >
                Next Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withLayoutAdmin(ShareProductsAdmin);

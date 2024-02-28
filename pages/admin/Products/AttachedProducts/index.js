import createAxiosInstance from "@/API";
import AdminAttachableProduct from "@/components/AdminComponents/AdminAttachableProduct";
import AdminAttachedProduct from "@/components/AdminComponents/AdminAttachedProduct";
import withLayoutAdmin from "@/components/UI/adminLayout";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

const tableheading = [
  {
    heading: "Action",
  },
  {
    heading: "Name",
  },
  {
    heading: "Variation",
  },
  {
    heading: "Image",
  },
];

function AttachedProducts() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [selectedStore, setSelectedStore] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: attachedProducts,
    refetch,
    isLoading,
    isFetching,
    isRefetching,
  } = useQuery(
    [`AttachedProducts`, selectedStore, currentPage],
    () => fetchAttachedProducts(selectedStore, currentPage),
    {
      staleTime: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  );

  function scroll(id) {
    document.querySelector(`#${id}`).scrollIntoView({ behavior: "smooth" });
  }

  async function fetchAttachedProducts(selectedStore, selectedPage) {
    // console.log(`in fetching function`)
    try {
      let storeId ;
      // switch(selectedStore){
      //   case 1 :
      //     storeId = 62 
      // }
      if (selectedStore && selectedPage) {
        return await Api.get(
          `/api/admin/products-in-store/9/api/${selectedStore}?page=${selectedPage}`
        );
        // console.log(response);
      }
    } catch (error) {}
  }

  // useEffect(() => {
  //   console.log(attachedProducts);
  // }, [attachedProducts, selectedStore, currentPage]);

  return (
    <div className="w-[90%] mx-auto py-12 flex flex-col space-y-4 h-screen ">
      <div className="flex text-2xl pb-2 border-b border-gray-400 justify-start items-center">
        Attached Products
      </div>
      <div className="flex justify-start space-x-6 items-center">
        <label htmlFor="store" className="">
          Store Address :
          <select
            id="store"
            onChange={(e) => {
              setSelectedStore(e.target.value);
              setCurrentPage(1);
            }}
            defaultValue={selectedStore ? selectedStore : null}
            className="bg-transparent px-2 text-center cursor-pointer "
          >
            <option value={null} selected disabled>
              Select Store
            </option>
            <option value={1} className="cursor-pointer">
              شارع بغداد
            </option>
            <option value={2} className="cursor-pointer">
              قزاز
            </option>
            <option value={3} className="cursor-pointer">
              صحنايا
            </option>
          </select>
        </label>
        {attachedProducts && attachedProducts?.data?.pagination && <p>-</p>}
        {attachedProducts && attachedProducts?.data?.pagination && (
          <div className="w-fit mx-auto flex justify-center items-center h-max gap-4 py-4 ">
            <button
              className="px-2 py-1 bg-gray-400 text-white rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed w-max"
              onClick={() => {
                setCurrentPage(
                  attachedProducts.data.pagination.current_page - 1
                );
                // scroll(`top`);
                // setCurrentPage(data.data.pagination.previousPage);
              }}
              disabled={
                attachedProducts.data.pagination.current_page ==
                1
              }
            >
              {`Previous Page`}
            </button>
            <button
              className="px-2 py-1 bg-gray-400 text-white rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed w-max"
              onClick={() => {
                setCurrentPage(
                  attachedProducts.data.pagination.current_page + 1
                );
                // scroll(`top`);
                // setCurrentPage(data.data.pagination.nextPage);
              }}
              disabled={
                attachedProducts.data.pagination.current_page ===
                attachedProducts.data.pagination.last_page
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
        <div className="w-full">
          {attachedProducts &&
          attachedProducts.data?.data?.length > 0 ? (
            <table className="w-max min-w-full overflow-auto relative table-auto overflow-y-scroll ">
              <thead className="sticky top-0 bg-white border-b-2 border-blue-500 overflow-y-scroll">
                <tr className="text-sm font-semibold text-center border-b-2 border-blue-500 uppercase">
                  {tableheading.map((index) => (
                    <th className=" px-4 py-4 " key={index.heading}>
                      {index.heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-lg font-normal text-gray-700 text-center h-[500px]">
                {attachedProducts?.data?.data &&
                  attachedProducts.data.data.map((prod, i) => {
                    return (
                      <AdminAttachedProduct
                        product={prod}
                        selectedStoreId = {selectedStore}
                        key={`${i} - ${prod.name} - ${prod.attached_id}`}
                        refetch={() => {
                          refetch();
                        }}
                      />
                    );
                  })}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-lg">There are no Attached Products</p>
          )}
        </div>
      )}
    </div>
  );
}

export default withLayoutAdmin(AttachedProducts);

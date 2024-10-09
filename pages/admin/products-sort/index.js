import createAxiosInstance from "@/API";
import AdminSortingProduct from "@/components/AdminProducts/productSortingAdmin";
import withLayoutAdmin from "@/components/UI/adminLayout";
import TawasyLoader from "@/components/UI/tawasyLoader";
import DropDownSearch from "@/components/UI/utilities/DropDownSearch";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { MdArrowForward, MdClose } from "react-icons/md";
import { useQuery } from "react-query";

function ProductSorting() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  // const [searchedResults, setSearchedResults] = useState();
  const searchRef = useRef();
  const [inSearch, setInSearch] = useState(false);
  // const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilters, setCategoryFilters] = useState();
  const [brandFilters, setBrandFilters] = useState();
  const {
    data: products,
    isLoading,
    refetch,
    isFetching,
  } = useQuery(
    ["categories", currentPage, brandFilters, categoryFilters, searchValue],
    () =>
      fetchAllProducts(currentPage, categoryFilters, brandFilters, searchValue),
    {
      staleTime: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const tableheading = [
    {
      heading: "Category",
    },
    {
      heading: "Category-Order",
    },
    {
      heading: "Brand",
    },
    {
      heading: "Brand-Order",
    },
    {
      heading: "Product",
    },
    {
      heading: "Product-Order",
    },
    {
      heading: "Sort Result",
    },
    {
      heading: "Action",
    },
  ];

  async function fetchAllProducts(
    currentPage,
    categories,
    brands,
    searchParam
  ) {
    try {
      return await Api.get(`/api/admin/sorted-products?page=${currentPage}`, {
        params: {
          category_id: categories,
          brand_id: brands,
          search: searchParam ?? "",
        },
      });
    } catch (error) {}
  }

  // function addCategoryFilter(id) {
  //   try {
  //     setCategoryFilters((prev) => {
  //       if (prev && !prev.includes(id)) {
  //         return [...prev, id];
  //       } else {
  //         return [...prev];
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // function addBrandFilter(id) {
  //   try {
  //     setBrandFilters((prev) => {
  //       if (prev && !prev.includes(id)) {
  //         return [...prev, id];
  //       } else {
  //         return [...prev];
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // function removeBrandfilter(id) {
  //   try {
  //     setBrandFilters((prev) => {
  //       const old = [...prev];
  //       const newone = old.filter((filterId) => filterId !== id);
  //       return newone;
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // function removeCategoryFilter(id) {
  //   try {
  //     setCategoryFilters((prev) => {
  //       const old = [...prev];
  //       const newone = old.filter((filterId) => filterId !== id);
  //       return newone;
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  function getName(array, id) {
    try {
      let name;
      array.forEach((itm) => {
        if (itm.id == id) {
          name = itm.name || itm.name_en;
        }
      });
      return name;
    } catch (error) {
      console.log(error);
    }
  }

  // async function search(e) {
  //   e.preventDefault();
  //   setSearching(true);
  //   try {
  //     const response = await Api.get(`/api/admin/products/searchByName`, {
  //       params: { search: searchRef.current.value },
  //       noSuccessToast: true,
  //     });
  //     const component =
  //       response.data.data.length < 1 ? (
  //         <div className="w-max mx-auto">{response.data.message}</div>
  //       ) : (
  //         <table className="w-max overflow-auto table-auto">
  //           <thead className="sticky top-0 bg-white border-b-2 border-blue-500">
  //             <tr className="text-sm font-semibold text-center border-b-2 border-blue-500 uppercase">
  //               <th>Id</th>
  //               {tableheading.map((index) => (
  //                 <th className=" px-4" key={index.heading}>
  //                   {index.heading}
  //                 </th>
  //               ))}
  //             </tr>
  //           </thead>
  //           <tbody className="text-lg h-full font-normal text-gray-700 text-center">
  //             {response.data.data &&
  //               response.data.data.map((names) => {
  //                 return (
  //                   <AdminProduct
  //                     product={names}
  //                     key={names.id}
  //                     refetch={() => {
  //                       refetch();
  //                     }}
  //                   />
  //                 );
  //               })}
  //           </tbody>
  //         </table>
  //       );
  //     setSearchedResults(component);
  //     setSearching(false);
  //   } catch (error) {
  //     setSearching(false);
  //   }
  //   setSearching(false);
  // }

  function search(e) {
    e.preventDefault();
    setSearchValue(searchRef.current.value);
  }

  if (isLoading == true || isFetching == true) {
    return <TawasyLoader width={400} />;
  }

  return (
    <div className="md:px-6">
      <div className="min-h-screen">
        <div
          className="w-full flex justify-between items-center gap-2 mx-auto m-7 "
          dir="ltr"
        >
          <h2 className="text-2xl text-stone-500 ">Products Sort Order</h2>
          <div className="flex w-max grow justify-start items-center space-x-2 ">
            <form
              onSubmit={search}
              className="flex bg-gray-100 w-full items-center rounded-lg px-2 border-2 border-transparent focus-within:border-skin-primary transition-all duration-700 "
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
                value={searchValue ?? null}
                placeholder="Search categories by name"
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
              {/* </div> */}
            </form>
            {inSearch == true && (
              <MdClose
                className="text-red-500 hover:text-red-600 w-[25px] h-[25px] hover:border-b-2 hover:border-red-600 cursor-pointer "
                onClick={() => {
                  setInSearch(false);
                  setSearchValue();
                }}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col justify-start items-start space-y-5">
          <div className="flex justify-start items-center space-x-4 w-full">
            <p>Filter By :</p>
            {products && products.data.categories && (
              <DropDownSearch
                width={`w-[20%]`}
                data={products.data.categories}
                selectItem={(item) => {
                  setCategoryFilters(item.id);
                  setCurrentPage(1);
                }}
                show={`name_en`}
                get={`id`}
                title={`Select Category`}
              />
            )}
            {products && products.data.brands && (
              <DropDownSearch
                width={`w-[20%]`}
                data={products.data.brands}
                selectItem={(item) => {
                  setBrandFilters(item.id);
                  setCurrentPage(1);
                }}
                show={`name`}
                get={`id`}
                title={`Select Brand`}
              />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 ">
            <p>Applied Filters :</p>
            {!categoryFilters && !brandFilters ? (
              <p>None</p>
            ) : (
              <div className="flex flex-wrap gap-2 items-center">
                {categoryFilters && (
                  <div className="px-2 py-1 flex justify-between items-center space-x-2 rounded-2xl border border-skin-primary select-none ">
                    <p>{`Category : ${getName(
                      products.data.categories,
                      categoryFilters
                    )}`}</p>
                    <MdClose
                      onClick={() => {
                        setCategoryFilters();
                        setCurrentPage(1);
                      }}
                      className="w-[20px] h-auto text-red-400 cursor-pointer hover:text-red-500"
                    />
                  </div>
                )}
                {products && brandFilters && (
                  <div className="px-2 py-1 flex justify-between items-center space-x-2 rounded-2xl border border-skin-primary select-none ">
                    <p>{`Brand : ${getName(
                      products.data.brands,
                      brandFilters
                    )}`}</p>
                    <MdClose
                      onClick={() => {
                        setBrandFilters();
                        setCurrentPage(1);
                      }}
                      className="w-[20px] h-auto text-red-400 cursor-pointer hover:text-red-500"
                    />
                  </div>
                )}
              </div>
            )}
            <button
              onClick={refetch}
              className="outline-none px-2 py-1 rounded-lg bg-skin-primary text-white  "
            >
              Refresh
            </button>
          </div>
        </div>

        {products?.data?.products && (
          <>
            {products?.data?.products && products.data.products.length > 0 ? (
              <table className="min-w-full max-w-full overflow-x-auto ">
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
                  {products.data.products.map((product, i) => {
                    return (
                      <AdminSortingProduct
                        key={`${i} - ${product.product_id}`}
                        product={product}
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
          </>
        )}

        {products &&
          products.data.pagination &&
          products.data.products.length > 0 && (
            <div className="w-[50%] mx-auto flex justify-center items-center h-max gap-4 p-4 ">
              <button
                className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                onClick={() => {
                  setCurrentPage(1);
                  // setCurrentPage(data.data.pagination.previousPage);
                }}
                disabled={products.data.pagination.current_page == 1}
              >
                First Page
              </button>
              <button
                className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                onClick={() => {
                  setCurrentPage(products.data.pagination.current_page - 1);
                  // setCurrentPage(data.data.pagination.previousPage);
                }}
                disabled={products.data.pagination.current_page == 1}
              >
                Previous Page
              </button>
              {isFetching ? (
                <Ring size={20} lineWeight={5} speed={2} color="#222222" />
              ) : (
                <p className=" px-2 border-b-2 border-skin-primary">
                  {products.data.pagination.current_page}
                </p>
              )}
              <button
                className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                onClick={() => {
                  setCurrentPage(products.data.pagination.current_page + 1);
                  // setCurrentPage(data.data.pagination.nextPage);
                }}
                disabled={
                  products.data.pagination.current_page ===
                  products.data.pagination.last_page
                }
              >
                Next Page
              </button>
              <button
                className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                onClick={() => {
                  setCurrentPage(products.data.pagination.last_page);
                }}
                disabled={
                  products.data.pagination.current_page ===
                  products.data.pagination.last_page
                }
              >
                Last Page
              </button>
            </div>
          )}

        {/* {inSearch == true &&
          (searching == true ? (
            <div className="w-full h-full">
              <TawasyLoader width={300} height={300} />
            </div>
          ) : (
            <div className="w-full min-h-[500px]">
              {searchedResults && searchedResults}
            </div>
          ))} */}
      </div>
    </div>
  );
}

export default withLayoutAdmin(ProductSorting);

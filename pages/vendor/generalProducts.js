import withVendorLayout from "@/components/wrapping components/WrappingVendorLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { TfiShoppingCartFull } from "react-icons/tfi";
import Link from "next/link";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import TotalAddProduct from "@/components/product/SellerTotalAddProduct/TotalAddProduct";
import { Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { MdArrowForward, MdClose } from "react-icons/md";
import { Ring } from "@uiball/loaders";
import { useDispatch, useSelector } from "react-redux";
import { selectedActions } from "@/Store/SelectedSlice";
import { useRef, useState } from "react";
import VendorSharedProduct from "@/components/VendorComponents/vendorSharedProduct";

export async function getServerSideProps(context) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

function addProducts() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [currentPage, setCurrentPage] = useState(1);
  const searchRef = useRef();
  const { t } = useTranslation("");
  const { data, isLoading, isFetching } = useQuery(
    ["sharedProducts", currentPage],
    () => fetchSharedProducts(currentPage),
    {
      staleTime: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  async function fetchSharedProducts(pageNumber) {
    return await Api.get(`api/seller/approved-products?page=${pageNumber}`);
  }

  // const [selectedProducts, setSelectedProducts] = useState();
  const [loadingSelected, setLoadingSelected] = useState(false);
  const [searchedProducts, setSearchedProducts] = useState();
  const [inSearch, setInSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  // const selectedProduct = useSelector(
  //   (state) => state.selected.selectedProduct
  // );
  const selectedProducts = useSelector((state) => state.vendor.products);
  const [open, openchange] = useState(false);
  // const dispatch = useDispatch();

  // async function fetchSelectedProducts() {
  //   setLoadingSelected(true);
  //   try {
  //     const response = await Api.get(`api/seller/selected-products`);
  //     setSelectedProducts(response.data.selected_products);
  //     setLoadingSelected(false);
  //   } catch (error) {}
  // }

  const functionopenpopup = async () => {
    openchange(true);
    dispatch(selectedActions.openselected());
    // await fetchSelectedProducts();
  };

  const closepopup = () => {
    openchange(false);
  };

  if (isLoading == true) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={400} height={400} />
      </div>
    );
  }

  function closeSearch() {
    setInSearch(false);
  }

  function scroll(id) {
    document.querySelector(`#${id}`).scrollIntoView({ behavior: "smooth" });
  }

  async function search(e) {
    e.preventDefault();
    setSearching(true);
    try {
      const response = await Api.post(
        `/api/seller/search-approved-products`,
        {
          search_term: searchRef.current.value,
        },
        {
          noSuccessToast: true,
        }
      );
      setSearchedProducts(response.data);
      setSearching(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="md:px-16 px-5">
      <div
        className="flex md:flex-row flex-col md:gap-0 gap-2 justify-between my-10 pt-10 pb-5 border-b-2 border-skin-primary "
        id="top"
      >
        <div className="w-[50%] flex justify-start items-center gap-2 ">
          <form
            onSubmit={search}
            className="flex bg-gray-100 w-full sm:w-4/5 items-center rounded-lg mx-2 px-2 border-2 border-transparent focus-within:border-skin-primary transition-all duration-700 "
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
              className="w-full bg-gray-100 outline-none rounded-lg text-sm h-10"
              type="text"
              ref={searchRef}
              placeholder={t("seller.addProduct.search")}
              onClick={() => {
                setInSearch(true);
              }}
            />
            <button type="submit">
              <MdArrowForward className="hover:border-b-2 border-skin-primary cursor-pointer" />
            </button>
          </form>
          {inSearch == true && (
            <MdClose
              className="text-red-500 hover:text-red-600 w-[25px] h-[25px] hover:border-b-2 hover:border-red-600 cursor-pointer "
              onClick={closeSearch}
            />
          )}
        </div>
        <div className="w-[50%] flex justify-center items-center">
          <p className="text-gray-500 pr-2">
            {t("seller.addProduct.cantFind")}
          </p>
          <Link
            href={"/vendor/customProduct"}
            className="bg-[#ff6600] px-3 py-3 text-white text-center md:w-auto w-[100%] "
          >
            {t("seller.products.addNewProduct")}
          </Link>
        </div>
      </div>
      {searching == true ? (
        <div className="w-full h-full">
          <TawasyLoader width={300} height={300} />
        </div>
      ) : (
        <div className="container">
          {data && data.data.approvedProducts && inSearch == false && (
            <div className="w-full h-full">
              {data.data.approvedProducts.length > 0 ? (
                <div class="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-col-1 gap-4 ">
                  {data.data.approvedProducts.map((curElem) => {
                    return (
                      <VendorSharedProduct key={curElem.id} product={curElem} />
                    );
                  })}
                </div>
              ) : (
                <div className="w-max mx-auto text-xl">
                  {t("seller.addProduct.noAvailable")}
                </div>
              )}
            </div>
          )}
          {inSearch == true &&
            searchedProducts &&
            (searchedProducts.transformedProducts.length > 0 ? (
              <div class="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-col-1 gap-4 ">
                {searchedProducts.transformedProducts.map((curElem) => {
                  return (
                    <VendorSharedProduct key={curElem.id} product={curElem} />
                  );
                })}
              </div>
            ) : (
              <div className="w-full text-center text-lg ">
                {searchedProducts.message}
              </div>
            ))}

          {data &&
            data.data.pagination &&
            data.data.approvedProducts.length > 0 &&
            inSearch == false && (
              <div className="w-[50%] mx-auto flex justify-center items-center py-5 gap-4 ">
                <button
                  className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                  onClick={() => {
                    setCurrentPage(data.data.pagination.current_page - 1);
                    scroll("top");
                  }}
                  disabled={
                    data.data.pagination.current_page ===
                    data.data.pagination.from
                  }
                >
                  {t("seller.addProduct.previousPage")}
                </button>
                {isFetching && (
                  <Ring size={20} lineWeight={5} speed={2} color="#ff6600" />
                )}
                <button
                  className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:bg-[#ff9100] disabled:opacity-50 disabled:cursor-not-allowed w-[20%]"
                  onClick={() => {
                    setCurrentPage(data.data.pagination.current_page + 1);
                    scroll(`top`);
                  }}
                  disabled={
                    data.data.pagination.current_page ===
                    data.data.pagination.last_page
                  }
                >
                  {t("seller.addProduct.nextPage")}
                </button>
              </div>
            )}
          <Dialog
            disableAutoFocus
            disableRestoreFocus
            className="h-full"
            fullWidth
            maxWidth="xl"
            open={open}
            onClose={closepopup}
          >
            <DialogTitle className="flex justify-between">
              <h4 className="sm:text-2xl text-sm ">
                {" "}
                {t("seller.addProduct.selectedProducts.selectedProducts")}:
              </h4>
              <MdClose
                onClick={closepopup}
                className="w-[35px] h-[35px] cursor-pointer "
              />
            </DialogTitle>
            <hr />
            <DialogContent>
              {loadingSelected == false ? (
                <Stack spacing={2} margin={2}>
                  {selectedProducts && !selectedProducts.message ? (
                    selectedProducts.length > 0 ? (
                      <div className=" mt-5">
                        <table className="table w-full" border={4}>
                          <thead className="md:text-xl text-base ">
                            <tr>
                              <th className="pb-4 md:px-0 px-4">
                                {t(
                                  "seller.addProduct.selectedProducts.table.productName"
                                )}
                              </th>
                              <th className="pb-4 md:px-0 px-4">
                                {t(
                                  "seller.addProduct.selectedProducts.table.variations"
                                )}
                              </th>
                              <th className="pb-4 md:px-0 px-4">
                                {t(
                                  "seller.addProduct.selectedProducts.table.brand"
                                )}
                              </th>
                              <th className="pb-4 md:px-0 px-4">
                                {t(
                                  "seller.addProduct.selectedProducts.table.category"
                                )}
                              </th>
                              <th className="pb-4 md:px-0 px-4">
                                {t(
                                  "seller.addProduct.selectedProducts.table.publish"
                                )}
                              </th>
                              <th className="pb-4 md:px-0 px-4">
                                {t(
                                  "seller.addProduct.selectedProducts.table.image"
                                )}
                              </th>
                              <th className="pb-4 md:px-0 px-4">
                                {t(
                                  "seller.addProduct.selectedProducts.table.price"
                                )}{" "}
                              </th>
                              <th className="pb-4 md:px-0 px-4"> </th>
                            </tr>
                          </thead>
                          <tbody className="text-lg font-normal text-gray-700 text-center">
                            {selectedProducts.map((curElem) => (
                              <TotalAddProduct
                                key={curElem.product_id}
                                selectproduct={curElem}
                                refetch={async () => {
                                  await fetchSelectedProducts();
                                }}
                              />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="w-full h-full flex justify-center items-center text-center">
                        <p>
                          {t("seller.addProduct.selectedProducts.noProducts")}
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full flex justify-center items-center text-center">
                      <p>
                        {t("seller.addProduct.selectedProducts.noProducts")}
                      </p>
                    </div>
                  )}
                </Stack>
              ) : (
                <div className="w-full h-full">
                  <TawasyLoader width={350} height={350} />
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}

      <button
        onClick={() => {
          functionopenpopup();
        }}
      >
        <div
          style={{
            color: "white",
            padding: "10px",
            zIndex: "999",
            position: "fixed",
            bottom: "10px",
            right: "10px",
          }}
        >
          <div className="relative">
            {/* {selectedProduct && (
              <div className="w-[15px] h-[15px] absolute top-0.5 right-0 rounded-full bg-green-400 "></div>
            )} */}
            <TfiShoppingCartFull className="bg-gray-400 w-[60px] h-[60px] rounded-[50%] p-[15px]"></TfiShoppingCartFull>
          </div>
        </div>
      </button>
    </div>
  );
}

export default withVendorLayout(addProducts);

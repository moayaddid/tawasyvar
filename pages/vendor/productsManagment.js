import createAxiosInstance from "@/API";
import { convertMoney } from "@/components/SellerOrders/sellerOrder";
import TawasyLoader from "@/components/UI/tawasyLoader";
import VendorSelecteableProduct from "@/components/VendorComponents/VendorSelectableComponent";
import withVendorLayout from "@/components/wrapping components/WrappingVendorLayout";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Ring } from "@uiball/loaders";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  MdArrowDropDown,
  MdArrowForward,
  MdClose,
} from "react-icons/md";
import { useQuery } from "react-query";
import { useTranslation } from "next-i18next";


export async function getServerSideProps(context) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

function VendorProductsManagment() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [toggleFilters, settoggleFilters] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [brandFilters, setBrandFilters] = useState([]);
  const [categories, setCategories] = useState();
  const [brands, setBrands] = useState();
  const [isLoadingCatBrand, setIsLoadingCatBrand] = useState(false);
  const [openActions, setOpenActions] = useState(false);
  const [allProductsSelected, setAllProductsSelected] = useState(false);
  const [selectedAction, setSelectedAction] = useState(1); // 1 for pricing 2 for availability
  const [increase, setIncrease] = useState(); // 1 for null , 2 for increase , 3 for decrease
  const [amount, setAmount] = useState();
  const [status, setStatus] = useState();
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [inSearch, setInSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchedResults, setSearchedResults] = useState();
  const searchRef = useRef();
  const [showSelected, setShowSelected] = useState(false);
  const {t} = useTranslation("");


  const {
    data: allProducts,
    isLoading,
    refetch,
  } = useQuery(
    ["VendorProductsManagmentAllProducts", brandFilters, categoryFilters],
    () => fetchAllProducts(categoryFilters, brandFilters),
    {
      staleTime: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  async function fetchAllProducts(categoriesF, brandsF) {
    try {
      let newC = [];
      let newB = [];
      categoriesF.map((category) => {
        newC.push({ category_id: category });
      });
      brandsF.map((brand) => {
        newB.push({ brand_id: brand });
      });
      return await Api.get(`/api/vendor/filtered-data`, {
        params: {
          brands: newB,
          categories: newC,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchCategoriesBrands() {
    setIsLoadingCatBrand(true);
    try {
      const allCategories = await Api.get(`/api/vendor/categories-products`);
      setCategories(allCategories?.data?.data);
      const allBrands = await Api.get(`/api/vendor/brands-products`);
      setBrands(allBrands?.data?.data);
      setIsLoadingCatBrand(false);
    } catch (error) {
      setIsLoadingCatBrand(false);
    }
    setIsLoadingCatBrand(false);
  }

  useEffect(() => {
    if (toggleFilters == true) {
      try {
        fetchCategoriesBrands();
      } catch (error) {}
    }
  }, [toggleFilters]);

  function addCategoryFilter(id) {
    try {
      setCategoryFilters((prev) => {
        if (prev && !prev.includes(id)) {
          return [...prev, id];
        } else {
          return [...prev];
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  function addBrandFilter(id) {
    try {
      setBrandFilters((prev) => {
        if (prev && !prev.includes(id)) {
          return [...prev, id];
        } else {
          return [...prev];
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  function removeBrandfilter(id) {
    try {
      setBrandFilters((prev) => {
        const old = [...prev];
        const newone = old.filter((filterId) => filterId !== id);
        return newone;
      });
    } catch (error) {
      console.log(error);
    }
  }

  function removeCategoryFilter(id) {
    try {
      setCategoryFilters((prev) => {
        const old = [...prev];
        const newone = old.filter((filterId) => filterId !== id);
        return newone;
      });
    } catch (error) {
      console.log(error);
    }
  }

  function getName(array, id) {
    try {
      let name;
      array.forEach((itm) => {
        if (itm.id == id) {
          name = itm.name;
        }
      });
      return name;
    } catch (error) {
      console.log(error);
    }
  }

  function closeAcionsPopUp() {
    setAllProductsSelected((prev) => {
      if (prev == true) {
        return false;
      }
    });
    setIncrease();
    setAmount();
    setOpenActions(false);
    setStatus();
  }

  function selectProduct(productStore) {
    setSelectedProducts((prev) => {
      if (prev && !prev.some(obj => obj.id === productStore.id)) {
        return [...prev, productStore];
      } else {
        // return [...prev];
        const newPros = prev.filter(
          (product) => product.id !== productStore.id
        );
        return [...newPros];
      }
    });
  }

  async function applyPrice() {
    setLoadingPricing(true);
    if (allProductsSelected && allProductsSelected == true) {
      try {
        const response = await Api.post(`/api/vendor/update-all-prices`, {
          is_increase: Number(increase) === 1 ? true : false,
          amount: amount,
        });
        refetch();
        setLoadingPricing(false);
        closeAcionsPopUp();
        return;
      } catch (error) {
        setLoadingPricing(false);
        return;
      }
    } else {
      try {
        let pros = [];
        selectedProducts.map((product) => {
          pros.push({ vendor_product_id: product.id });
        });
        const response = await Api.post(`/api/vendor/edit-price-batch`, {
          is_increase: Number(increase) === 1 ? true : false,
          amount: amount,
          vendor_products: pros,
        });
        refetch();
        closeAcionsPopUp();
        setLoadingPricing(false);
        return;
      } catch (error) {
        setLoadingPricing(false);
      }
      setLoadingPricing(false);
      return;
    }
  }

  async function search(e) {
    e.preventDefault();
    setSearching(true);
    try {
      const response = await Api.get(
        `api/vendor/search-all-products`,
        {
          params: { query: searchRef.current.value },
        },
        {
          noSuccessToast: true,
        }
      );
      const component = response?.data && response?.data;
      setSearchedResults(component);
      setSearching(false);
    } catch (error) {
      setSearching(false);
      setSearchedResults();
    }
    setSearching(false);
  }

  return (
    <>
      <div className="w-[90%] mx-auto h-screen">
        <div className="w-full pt-10">
          <p className="text-3xl py-7 ">{t("productManagment")}</p>
          <hr className="py-1" />
        </div>
        <div className="my-6 w-full ">
          <div className="w-full flex flex-col space-y-4 h-max transition-all duration-300">
            <div className="w-full flex flex-wrap justify-start items-center space-x-4">
              <form
                dir={router.locale == "ar" ? "rtl" : "ltr"}
                onSubmit={search}
                className="flex bg-gray-100 w-full sm:w-2/5 items-center rounded-lg px-2 border-2 border-transparent focus-within:border-skin-primary transition-all duration-700 "
              >
                <input
                  className="w-full bg-gray-100 outline-none rounded-lg text-sm h-10  "
                  type="text"
                  ref={searchRef}
                  // placeholder={`Search`}
                  placeholder={`Search Products By name`}
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
              <button
                onClick={() => {
                  settoggleFilters((prev) => !prev);
                }}
                className="flex justify-around items-center"
              >
                <p className="px-1">{t("filter")}</p>
                <MdArrowDropDown
                  className={` transition-all duration-300 text-[22px] ${
                    toggleFilters == true && `rotate-90`
                  }`}
                />
              </button>
            </div>
            <div
              className={`flex justify-start items-start space-x-4 ${
                toggleFilters == true ? `h-auto` : `h-0`
              } transition-all overflow-clip duration-300 `}
            >
              {isLoadingCatBrand == true ? (
                <div className="w-full flex justify-start items-start">
                  <Ring speed={3} size={25} lineWeight={5} color="#ff6600" />
                </div>
              ) : (
                <div className="flex flex-wrap justify-start items-center space-x-4">
                  {toggleFilters == true && <p>{t("filterBy")} :</p>}
                  {toggleFilters == true && categories && (
                    <label
                      htmlFor="categories px-1 "
                      className="border border-skin-primary px-2 py-1 select-none rounded-lg "
                    >
                      {t("filterByCat")} :
                      <select
                        id="categories"
                        className="bg-transparent box-content px-2 w-min hover:bg-gray-100 cursor-pointer "
                        onChange={(e) => {
                          addCategoryFilter(e.target.value);
                        }}
                        value={1}
                      >
                        <option
                          disabled
                          selected
                          className="box-content"
                          value={1}
                        >
                          {t("selectCat")}
                        </option>
                        {categories &&
                          categories
                            .filter((obj) => !categoryFilters?.includes(obj.id))
                            .map((category) => {
                              return (
                                <option
                                  key={category.id}
                                  value={category.id}
                                  className="cursor-pointer"
                                >
                                  {category.name}
                                </option>
                              );
                            })}
                      </select>
                    </label>
                  )}
                  {toggleFilters == true && brands && (
                    <label
                      htmlFor="brands "
                      className="border border-skin-primary px-2 py-1 select-none rounded-lg "
                    >
                      {t("filterByBra")} :
                      <select
                        id="brands"
                        className="bg-transparent px-2 hover:bg-gray-100 cursor-pointer py-1 "
                        onChange={(e) => {
                          addBrandFilter(e.target.value);
                        }}
                        value={1}
                      >
                        <option disabled selected value={1}>
                        {t("selectBra")}
                        </option>
                        {brands &&
                          brands.map((brand) => {
                            return (
                              <option
                                key={brand.id}
                                value={brand.id}
                                className="cursor-pointer"
                              >
                                {brand.name}
                              </option>
                            );
                          })}
                      </select>
                    </label>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <p>{t("appliedFilters")} :</p>
              {categoryFilters?.length < 1 && brandFilters?.length < 1 ? (
                <p>( {t("none")} )</p>
              ) : (
                <div className="flex flex-wrap gap-2 items-center">
                  {categoryFilters?.length > 0 &&
                    categoryFilters?.map((filterId, i) => {
                      return (
                        <div
                          key={i}
                          className="px-2 py-1 flex justify-between items-center space-x-2 rounded-2xl border border-skin-primary select-none "
                        >
                          <p>{getName(categories, filterId)}</p>
                          <MdClose
                            onClick={() => {
                              removeCategoryFilter(filterId);
                            }}
                            className="w-[20px] h-auto text-red-400 cursor-pointer hover:text-red-500"
                          />
                        </div>
                      );
                    })}
                  {brandFilters?.length > 0 &&
                    brandFilters?.map((filterId, i) => {
                      return (
                        <div
                          key={i}
                          className="px-2 py-1 flex justify-between items-center space-x-2 rounded-2xl border border-skin-primary select-none "
                        >
                          <p>{getName(brands, filterId)}</p>
                          <MdClose
                            onClick={() => {
                              removeBrandfilter(filterId);
                            }}
                            className="w-[20px] h-auto text-red-400 cursor-pointer hover:text-red-500"
                          />
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
            {allProducts && <hr />}
            {allProducts?.data?.data?.length > 0 && (
              <div>
                <button
                  onClick={() => {
                    setAllProductsSelected(true);
                    setOpenActions(true);
                  }}
                  className="px-3 py-1 bg-sky-500 text-white rounded-lg"
                >
                  {t("selectAll")}
                </button>
              </div>
            )}
            <div className="w-full flex justify-start items-center space-x-3">
              <p className="text-xl">{`( ${t("productsSelected")} : ${selectedProducts?.length} )`}</p>
              <button
                onClick={() => {
                  setOpenActions(true);
                }}
                disabled={selectedProducts?.length < 1}
                className="px-2 py-1 text-center rounded-lg disabled:cursor-not-allowed text-white bg-sky-500 disabled:bg-gray-400 transition-all duration-500 "
              >
                {t("action")}
              </button>
              <button
                onClick={() => {
                  setSelectedProducts([]);
                }}
                disabled={selectedProducts?.length < 1}
                className="px-2 py-1 text-center rounded-lg disabled:cursor-not-allowed text-white bg-red-500 disabled:bg-gray-400 transition-all duration-500"
              >
                {t("clear")}
              </button>
              <button
                onClick={() => {
                  setShowSelected(true);
                }}
                disabled={selectedProducts?.length < 1}
                className="px-2 py-1 text-center rounded-lg disabled:cursor-not-allowed text-white bg-yellow-500 disabled:bg-gray-400 transition-all duration-500"
              >
                {t("show")}
              </button>
            </div>
          </div>
        </div>
        <hr className="py-2" />
        {isLoading == true ? (
          <div className="w-full h-max flex justify-center items-center">
            <TawasyLoader width={300} height={300} />
          </div>
        ) : allProducts?.data?.data?.length > 0 ? (
          inSearch == true ? (
            searching == true ? (
              <div className="w-full h-max flex justify-center items-center">
                <TawasyLoader width={300} height={300} />
              </div>
            ) : (
              <div className="w-full flex justify-center min-h-[500px]">
                <div className="w-full grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-col-1 gap-4 mb-4">
                  {searchedResults && searchedResults.message ? (
                    <p className="w-full text-center text-lg">
                      {searchedResults.message && searchedResults.message}
                    </p>
                  ) : (
                    searchedResults?.data?.length > 0 &&
                    searchedResults?.data?.map((product, i) => (
                      <VendorSelecteableProduct
                        key={`${i} - ${product.product_id}`}
                        selectedProducts={selectedProducts}
                        selectProduct={(selectedId) => {
                          selectProduct(selectedId);
                        }}
                        product={product}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="w-full grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-col-1 gap-4 mb-4">
              {allProducts?.data?.data?.map((product, i) => (
                <VendorSelecteableProduct
                  key={`${i} - ${product.product_id}`}
                  selectedProducts={selectedProducts}
                  selectProduct={(selectedId) => {
                    selectProduct(selectedId);
                  }}
                  product={product}
                />
              ))}
            </div>
          )
        ) : (
          <p className="text-lg text-center ">{t("seller.products.noProducts")}</p>
        )}
      </div>

      <Dialog
        open={openActions}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <div className="flex justify-start items-center space-x-2">
            <p className="px-2" >{t("chooseWhat")}</p>
            <p className="text-xl text-skin-primary border-b-2 border-skin-primary">
            {allProductsSelected && allProductsSelected == true
                ? ` ${t("allProducts")}`
                : ` ${t("selectedProducts")}`}
            </p>
            <p>:</p>
          </div>
          <MdClose
            onClick={closeAcionsPopUp}
            className="text-red-500 w-[25px] cursor-pointer h-[25px] border-b-2 border-transparent hover:text-red-600 hover:border-red-600 transition-all duration-300 "
          />
        </DialogTitle>
        <DialogContent className="flex flex-col justify-start items-center space-y-3">
          <div className="w-full flex justify-center items-center space-x-5">
            <div>
              <input
                type="radio"
                id="price"
                name="action"
                value={1}
                className="sr-only peer"
                checked={selectedAction === 1}
                onChange={(e) => {
                  setSelectedAction(Number(e.target.value));
                }}
              />
              <label
                htmlFor="price"
                className="inline-flex items-center justify-center w-max px-3 py-2 text-gray-500 bg-white border-b border-gray-500 cursor-pointer peer-checked:border-orange-500 peer-checked:text-orange-500 hover:text-gray-600 hover:bg-gray-100 transition-all duration-500"
              >
                <p className="w-full block text-lg select-none font-semibold text-center">
                {t("pricing")}
                </p>
              </label>
            </div>
          </div>
          <hr />
          <div
            className={`${
              selectedAction === 1
                ? `opacity-100 translate-x-0 w-full `
                : `opacity-0 translate-x-96  overflow-hidden max-h-[0px]`
            } transition-all duration-500 flex flex-wrap space-x-3 w-full justify-center items-center `}
          >
            <p>{t("editPricing")} :</p>
            {/* <div className="flex w-full flex-wrap space-x-2"> */}
            <label htmlFor="inc">
              <select
                id="inc"
                className="bg-transparent px-2 mx-1 py-1 border border-skin-primary rounded-md box-content"
                onChange={(e) => {
                  setIncrease(e.target.value);
                }}
                defaultValue={null}
              >
                <option disabled selected value={null}>
                {t("incdec")}
                </option>
                <option className="box-content" value={1}>
                  +
                </option>
                <option className="box-content" value={0}>
                  -
                </option>
              </select>
            </label>
            <div className="flex justify-start px-1 items-center border-b-2 disabled:cursor-not-allowed border-gray-300 focus-within:border-skin-primary transition-all duration-400 ">
              <input
                type="text"
                datatype="numeric"
                placeholder={router.locale == "ar" ? "النسبة" : "Percentage"}
                disabled={!increase}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                className="outline-none disabled:cursor-not-allowed "
              />
              <p className="w-min">%</p>
            </div>
            {loadingPricing == true ? (
              <div className="px-2 py-1 bg-green-400 rounded-lg w-[10%] hover:bg-green-500 text-white flex justify-center items-center ">
                <Ring size={20} speed={3} lineWeight={5} color="white" />
              </div>
            ) : (
              <button
                disabled={!amount || !increase}
                onClick={applyPrice}
                className="px-2 py-1 bg-green-400 rounded-lg w-[10%] disabled:bg-gray-400 disabled:cursor-not-allowed hover:opacity-70 transition-all duration-300 text-white"
              >
                {t("apply")}
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showSelected}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        scroll="paper"
        maxWidth="lg"
        fullWidth
        onClose={() => setShowSelected(false)}
      >
        <DialogTitle className="flex justify-between items-center">
          <div className="flex justify-start items-center space-x-2">
            <p>{t("mySelected")}</p>
            <p>:</p>
          </div>
          <MdClose
            onClick={() => {
              setShowSelected(false);
            }}
            className="text-red-500 w-[25px] cursor-pointer h-[25px] border-b-2 border-transparent hover:text-red-600 hover:border-red-600 transition-all duration-300 "
          />
        </DialogTitle>
        <DialogContent>
          <div className="w-full flex flex-col justify-start items-start">
            <table className=" w-full overflow-x-auto table-auto">
              <thead className="sticky top-0">
                <tr className="text-sm font-semibold text-center border-b-2 border-blue-500 capitalize">
                  <th>{t("name")}</th>
                  <th>{t("combination")}</th>
                  <th>{t("price")}</th>
                </tr>
              </thead>
              <tbody className=" odd:bg-gray-100 even:bg-gray-200 text-lg font-normal text-gray-700 text-center">
                {selectedProducts?.length > 0 &&
                  selectedProducts?.map((product , i) => {
                    let varis = [];
                    if (product?.combination?.variations) {
                      product?.combination?.variations.map((variation) => {
                        if (variation.option) {
                          varis.push(variation.option);
                        }
                      });
                    }

                    return (
                      <tr key={i} className="">
                        <td className="px-2 py-2" >{product.name}</td>
                        <td className="text-red-500">
                          {product?.combination ? varis.join(" - ") : ` - `}
                        </td>
                        <td>{convertMoney(product.price)} SYP</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <hr />
        </DialogContent>
        <DialogActions className="flex justify-center items-center">
          <button onClick={() => {setShowSelected(false)}} className=" text-lg px-2 py-1 text-center rounded-lg text-white bg-sky-500 transition-all duration-500">
          {t("done")}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default withVendorLayout(VendorProductsManagment);

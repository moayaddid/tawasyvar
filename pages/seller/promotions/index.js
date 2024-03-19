import withLayout from "@/components/wrapping components/WrappingSellerLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import lego from "@/public/images/lego.png";
import kuala from "@/public/images/kuala.jpg";
import SellerPromotion, {
  calculateOfferPercentage,
} from "@/components/SellerComponents/SellerPromotion";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { MdArrowLeft, MdClose, MdOutlineArrowDropDown } from "react-icons/md";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Ring } from "@uiball/loaders";
import Image from "next/image";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { useTranslation } from "next-i18next";


export async function getServerSideProps(context) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

// const promos = [
//   {
//     id: 1,
//     product: {
//       name: "some-thing called a product asdasdasdasd",
//       combination: null,
//       image: lego,
//       brand: "The brand brand",
//       category: "category",
//     },
//     start_date: "2024-03-12T12:52:22.000000Z",
//     end_date: "2024-03-18T12:52:22.000000Z",
//     old_price: 25000,
//     new_price: 2000,
//   },
//   {
//     id: 2,
//     product: {
//       name: "some-thing called a product 222",
//       combination: {
//         part_number: 123123,
//         variations: [
//           { option: "white", image: kuala },
//           { option: "Chrome Doors", image: lego },
//         ],
//       },
//       image: lego,
//       brand: "The brand brand 2",
//       category: " category 2 ",
//     },
//     start_date: "2024-02-19",
//     end_date: "2024-04-18",
//     old_price: 25000,
//     new_price: 2000,
//   },
// ];

function Promotions() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [openNewPromo, setOpenNewPromo] = useState(false);
  const [newPrice, setNewPrice] = useState();
  const [percentage, setPercentage] = useState();
  const [delayedSearch, setDelayedSearch] = useState(null);
  const [searchedResults, setSearchedResults] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const [inSearch, setInSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState();
  const [selectedEndDate, setSelectedEndDate] = useState();
  const [isConfirming, setIsConfirming] = useState(false);
  const searchRef = useRef();
  const {t} = useTranslation("");

  const {
    data: promos,
    isLoading,
    refetch,
  } = useQuery("allPromos", fetchAllPromos, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchAllPromos() {
    try {
      return await Api.get(`/api/seller/promotion-products`);
    } catch (error) {}
  }

  const debounceSearch = () => {
    if (delayedSearch) {
      clearTimeout(delayedSearch);
    }

    setDelayedSearch(
      setTimeout(() => {
        if (searchRef.current.value.length >= 2) {
          search();
        } else {
          setSearching(false);
        }
      }, 500)
    );
  };

  const handleInputChange = () => {
    debounceSearch();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    debounceSearch();
  };

  useEffect(() => {
    return () => {
      if (delayedSearch) {
        clearTimeout(delayedSearch);
      }
    };
  }, [delayedSearch]);

  async function search(e = null) {
    if (e) {
      e.preventDefault();
    }
    if (searchRef.current.value) {
      setSearching(true);
      try {
        const { data: products } = await Api.get(
          `/api/seller/search-to-promote`,
          {
            params: { query: searchRef.current.value },
          },
          {
            noSuccessToast: true,
          }
        );
        const components = (
          <div className="flex flex-col justify-start items-center h-full w-full ">
            <p className=" text-base text-start text-skin-primary py-1 border-b w-full border-skin-primary ">
              Products :
            </p>
            {products?.data && (
              <div
                className=" w-full flex flex-col space-y-2 py-3 max-h-[400px] overflow-y-scroll "
                dir="ltr"
              >
                {products?.data?.map((product, i) => {
                  if (product.has_variation === 1) {
                    let vari = [];
                    product?.combination?.variations.map((vars) => {
                      if (vars.option) {
                        vari.push(vars.option);
                      }
                    });
                    return (
                      <div
                        key={`${i} - ${product.id} - ${product.name_en}`}
                        className="flex flex-wrap cursor-pointer justify-start items-center space-x-2 hover:bg-gray-100 px-1 w-full py-2 "
                        onClick={() => {
                          setInSearch(false);
                          setSelectedProduct({ ...product });
                        }}
                      >
                        <p>{product.name}</p>
                        {vari && vari.length > 0 && (
                          <p> - ( {vari.join(" - ")} )</p>
                        )}
                        {product.combination.part_number && (
                          <p> - [{product.combination.part_number}]</p>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={`${i} - ${product.id} - ${product.name_en}`}
                        className="flex flex-wrap cursor-pointer justify-start items-center space-x-2 hover:bg-gray-100 px-1 w-full py-2 "
                        onClick={() => {
                          setInSearch(false);
                          setSelectedProduct({ ...product });
                        }}
                      >
                        <p>{product.name}</p>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSearchedResults(components);
        setSearching(false);
      } catch (error) {
        setSearching(false);
      }
    } else {
      return;
    }
  }

  function closeNewPromo() {
    setNewPrice();
    setPercentage();
    setSelectedEndDate();
    setSelectedStartDate();
    setSelectedProduct();
    setSearchedResults();
    setInSearch(false);
    setOpenNewPromo(false);
  }

  function handlePriceChange(data) {
    try {
      setNewPrice(data);
      setPercentage(
        calculateOfferPercentage(selectedProduct.final_price, data)
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function confirmPromotion() {
    try {
      setIsConfirming(true);
      const response = await Api.post(
        `/api/seller/add-promotion/${selectedProduct.store_product_id}`,
        {
          promotion_price: newPrice,
          start_promotion_date: selectedStartDate,
          expire_promotion_date: selectedEndDate ?? null,
        }
      );
      setIsConfirming(false);
      refetch();
      closeNewPromo();
    } catch (error) {
      setIsConfirming(false);
    }
    setIsConfirming(false);
  }


  return (
    <>
      <div className="w-[90%] mx-auto pt-5">
        <div className="w-full flex md:flex-row flex-col justify-between md:space-y-0 space-y-3 items-center py-5 ">
          <p className="text-2xl">{t("promotions")}</p>
          <button
            onClick={() => {
              setOpenNewPromo(true);
            }}
            className="px-2 py-1 bg-skin-primary text-white rounded-lg hover:opacity-80"
          >
            {t("newPromo")}
          </button>
        </div>
        <hr />
        {isLoading == true ? (
          <div className="w-full flex justify-center items-center">
            <TawasyLoader width={300} height={300} />
          </div>
        ) : (
          promos &&
          promos.data.products &&
          (promos.data.products.length > 0 ? (
            <div className="py-5 w-full grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 ">
              {promos.data.products.map((promo, i) => {
                return (
                  <SellerPromotion
                    key={i}
                    promo={promo}
                    refetch={() => {
                      refetch();
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-center text-lg w-full py-5">
              {t("noPromos")}
            </p>
          ))
        )}
      </div>

      <Dialog
        open={openNewPromo}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        maxWidth="xl"
        onClose={closeNewPromo}
        fullWidth
      >
        <DialogTitle className="w-full flex justify-between items-center">
          <p className="text-lg">{t("makePromotion")}</p>
          <MdClose
            onClick={closeNewPromo}
            className="w-[25px] cursor-pointer h-[25px] border border-b-2 border-transparent hover:text-red-500 hover:border-red-500 text-black"
          />
        </DialogTitle>
        <DialogContent className="w-full flex flex-col justify-start items-start space-y-4 h-[600px]">
          <p>{t("searchFor")} :</p>
          <div className=" md:w-[40%] w-full flex flex-col justify-start items-start relative">
            <form
              onSubmit={handleFormSubmit}
              className="flex bg-gray-100 w-full items-center px-2 border-b-2 border-transparent focus-within:border-skin-primary transition-all duration-700 mx-auto "
            >
              <input
                className="w-full bg-gray-100 outline-none rounded-lg text-sm h-10 placeholder:text-xs placeholder:text-transparent placeholder:md:text-gray-400"
                type="text"
                ref={searchRef}
                onChange={handleInputChange}
                placeholder={t("searchByName")}
                onClick={() => {
                  setInSearch(true);
                }}
              />
              {searching == true ? (
                <Ring size={25} lineWeight={5} speed={2} color="#ff6600" />
              ) : (
                <MdClose
                  className={`text-red-500 ${
                    inSearch == true ? `block` : `hidden`
                  } transition-all duration-300s hover:text-red-600 w-[25px] h-[25px] hover:border-b-2 hover:border-red-600 cursor-pointer`}
                  onClick={() => {
                    setInSearch(false);
                  }}
                />
              )}
            </form>
            {inSearch == true && searchedResults && (
              <div className="px-4 z-10 absolute md:top-0 md:left-full top-full right-full left-0 mx-auto w-full bg-white border border-gray-300 rounded-sm ">
                {searchedResults}
              </div>
            )}
          </div>
          {selectedProduct !== null && selectedProduct !== undefined ? (
            <div className="w-full">
              <div className="flex flex-wrap justify-start items-center space-x-4 py-5">
                <p className="text-lg">{t("selectedProduct")} : </p>
                <p>{selectedProduct.name}</p>
                {selectedProduct.combination && (
                  <div className="flex justify-start items-center space-x-4">
                    <p>-</p>
                    {selectedProduct.combination?.variations?.map((variant , i) => {
                      return <p key={i} >{variant.option}</p>;
                    })}
                    {selectedProduct.combination?.part_number && (
                      <p>{selectedProduct.combination.part_number}</p>
                    )}
                  </div>
                )}
              </div>
              <hr />
              <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 transition-all gap-2 duration-300 justify-center py-5">
                <label htmlFor="stratdate">
                  {t("starting")} :
                  <input
                    id="stratdate"
                    type="date"
                    className="outline-none border-b-2 border-gray-400 focus:border-skin-primary py-1"
                    value={selectedStartDate}
                    onChange={(e) => {
                      setSelectedStartDate(e.target.value);
                    }}
                  />
                </label>
                <div className="w-full flex flex-col space-y-2">
                  <label htmlFor="enddate">
                    {t("ending")} : ({t("optional")})
                    <input
                      id="enddate"
                      type="date"
                      className="outline-none border-b-2 border-gray-400 focus:border-skin-primary py-1"
                      value={selectedEndDate}
                      onChange={(e) => {
                        setSelectedEndDate(e.target.value);
                      }}
                    />
                  </label>
                  <p className="text-sm text-red-500">
                    {t("sotSelecting")}
                  </p>
                </div>
                <label
                  htmlFor="oldprice"
                  className="flex flex-wrap justify-start items-center w-full "
                >
                  <p className="max-w-[30%] w-max ">{t("oldPrice")} :</p>
                  <input
                    type="text"
                    id="oldprice"
                    value={selectedProduct.final_price}
                    disabled
                    className="max-w-[70%] min-w-max px-1 border-b-2 border-gray-300"
                  />
                </label>
                <label
                  htmlFor="newprice"
                  className="flex flex-wrap justify-start items-center w-full "
                >
                  <p className="max-w-[30%] w-max ">{t("newPrice")} :</p>
                  <input
                    type="text"
                    id="newprice"
                    onChange={(e) => {
                      handlePriceChange(e.target.value);
                    }}
                    value={newPrice}
                    disabled={!selectedStartDate}
                    className="max-w-[30%] min-w-max px-1 border-b-2 border-gray-300 outline-none focus:border-skin-primary "
                  />
                  {percentage && (
                    <div className="w-full flex flex-wrap md:justify-start justify-center items-center ">
                      <p className="p-1">{t("youOffered")} :</p>
                      <p className="p-1 border-b-2 border-skin-primary">
                        {Math.round(percentage)} %
                      </p>
                      <p className="p-1"></p>
                    </div>
                  )}
                </label>
              </div>
              <div className="w-full flex sm:flex-row flex-col  justify-center items-center"></div>
            </div>
          ) : (
            <div>{t("didnotSelect")}</div>
          )}
        </DialogContent>
        <DialogActions className="w-full flex sm:flex-row flex-col sm:justify-end justify-center items-center">
          {isConfirming == true ? (
            <div
              disabled={!percentage}
              onClick={confirmPromotion}
              className="sm:w-[30%] w-full flex justify-center items-center transition-all duration-500 disabled:bg-gray-400 disabled:opacity-70 py-1 bg-green-500 hover:opacity-70 text-white rounded-lg m-1"
            >
              <Ring size={20} speed={3} lineWeight={5} color="white" />
            </div>
          ) : (
            <button
              disabled={!percentage}
              onClick={confirmPromotion}
              className="sm:w-[30%] w-full transition-all duration-500 disabled:bg-gray-400 disabled:opacity-70  py-1 bg-green-500 hover:opacity-70 text-white rounded-lg "
            >
              {t("save")}
            </button>
          )}
          <button
            onClick={closeNewPromo}
            className="sm:w-[30%] w-full py-1 bg-red-500 transition-all duration-500 hover:opacity-70 text-white rounded-lg m-1"
          >
            {t("cancel")}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default withLayout(Promotions);

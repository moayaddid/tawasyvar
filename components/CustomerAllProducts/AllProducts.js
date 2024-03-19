import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import logo from "@/public/images/tawasylogo.png";
// import { useRouter } from "next-translate-routes";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import Link from "next/link";
import { useState } from "react";
import { convertMoney } from "../SellerOrders/sellerOrder";
import { useDispatch } from "react-redux";
import { cartActions } from "@/Store/CartSlice";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { CarouselProduct } from "../ProductCarousel/CarouselProduct";
import Variations from "../VariationsCustomer/Variations";
import { MdClose } from "react-icons/md";
import TawasyLoader from "../UI/tawasyLoader";
import localfont from "next/font/local";
import { calculateOfferPercentage } from "../SellerComponents/SellerPromotion";

const OfferFont = localfont({
  src: "../../public/fonts/local/RTL-Hajar-Regular.ttf",
});

export function removeCommas(numberString) {
  var regex = /,/g;
  var result = numberString.replace(regex, "");
  return parseFloat(result);
}

function PublicAllProduct({ product, storeId }) {
  const { t } = useTranslation("");
  const router = useRouter();
  const dispatch = useDispatch();
  const Api = createAxiosInstance(router);
  const [adding, setAdding] = useState(false);
  const [open, openchange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productCombinations, setProductCombinations] = useState();
  const [selectedCombination, setSelectedCombination] = useState();
  const [dialogAdding, setDialogAdding] = useState(false);
  const combinationsRef = useRef();
  // const [proCombination , setProCombination] = useState();

  const functionopenpopup = async () => {
    openchange(true);
    setLoading(true);
    try {
      const response = await Api.get(
        `/api/product-combination/${router.query.storeId}/${product.slug}`
      );
      setProductCombinations(response.data);
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  };
  const closepopup = () => {
    openchange(false);
    setProductCombinations();
    setSelectedCombination();
  };

  const isButtonEnabled = selectedCombination ? true : false;

  async function addToCart() {
    if (product.has_variation == true) {
      functionopenpopup();
      return;
    } else {
      setAdding(true);
      try {
        const response = await Api.post(`/api/customer/cart/add`, {
          product_id: product.id,
          store_id: storeId,
        });
        dispatch(cartActions.addProduct());
        setAdding(false);
      } catch (error) {
        setAdding(false);
      }
      setAdding(false);
    }
    // functionopenpopup();
  }

  async function dialogAddToCart() {
    setDialogAdding(true);
    try {
      const response = await Api.post(`/api/customer/cart/add`, {
        product_id: product.id,
        store_id: storeId,
        variation: selectedCombination,
      });
      setDialogAdding(false);
      closepopup();
      dispatch(cartActions.addProduct());
    } catch (error) {
      setDialogAdding(false);
    }
    setDialogAdding(false);
  }

  function getselectedImage(data) {
    if (productCombinations) {
      const combi = productCombinations?.product_combination.find(
        (combination) =>
          data ==
          combination?.product?.variations?.map((variation) => {
            return variation.image;
          })
      );
      if (combi) {
        setSelectedCombination(combi.product.line_id);
      }
    }
  }

  useEffect(() => {
    const selectedComb = document.getElementById(`${selectedCombination}`);
    const container = combinationsRef.current;
    if (selectedComb && container) {
      selectedComb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
        container,
      });
    }
  }, [selectedCombination]);

  let percent;

  if (product.has_promotion == true && product.has_variation == false) {
    percent = Math.round(calculateOfferPercentage(
      removeCommas(product.price),
      removeCommas(product.promotion_price)
    ));
  }

  return (
    <>
      <div className="shadow-lg flex flex-col sm:w-fit max-w-[288px] mx-auto border-2 md:min-h-[406px] min-h-[381px] border-gray-200 rounded-md ">
        <Link
          href={
            product.price
              ? `/Stores/${router.query.storeId}/Product/${product.slug}`
              : `/Products/${product.slug}`
          }
          className=" min-w-[288px]  min-h-[260px] max-h-[260px] flex justify-center items-center "
        >
          <div className="h-[225px] w-[225px] relative bg-cover flex justify-center items-center" dir="ltr">
            <Image
              src={product.image ? product.image : logo}
              alt={product.name}
              className="w-full  transform transition duration-1000 object-contain object-center"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "225px", height: "225px" }}
            /> 
            {product.has_promotion == true &&
              product.has_variation == false && (
                <div className="absolute md:min-w-[60%] min-w-[55%] md:h-[23%] h-[20%] bg-skin-primary bottom-0 -right-7 rounded-tl-[30px] flex justify-around items-center font-hajar ">
                  <div className="md:min-w-[45%] min-w-[30%] h-[80%] text-[#FEE310] flex justify-center px-2 items-center self-end">
                    <p className="h-full md:text-3xl text-xl flex justify-center items-center pl-1">
                      {percent}
                    </p>
                    <div className="inline-flex flex-col justify-center items-start shrink h-min">
                      <p className=" md:text-sm text-[8px] w-min h-[10px]">%</p>
                      <p className=" md:text-sm text-[8px]">OFF</p>
                    </div>
                  </div>
                  <div className="md:w-[55%] w-[40%] flex text-white flex-col justify-start items-center pr-2 font-medium">
                    <div className="flex justify-start items-center space-x-1 md:text-lg text-xs h-[10px]">
                      <span className="text-white line-through decoration-red-500 decoration-[2px]  ">
                        {convertMoney(product.price)}
                      </span>
                      <p>s.p</p>
                    </div>
                    <p className="text-white w-max h-[10px] md:text-lg text-xs ">
                      {convertMoney(product.promotion_price)} s.p
                    </p>
                  </div>
                </div>
              )}
            {product.has_promotion == true && product.has_variation == true && (
              <div className="absolute max-w-[50%] md:h-[23%] h-[20%] bg-skin-primary bottom-0 -right-7 rounded-tl-[30px] text-white flex justify-center items-center w-[90%] mx-auto text-xl  ">
                Offer inside
              </div>
            )}
          </div>
        </Link>
        <div className="w-[90%] mx-auto py-3 flex flex-col gap-2 md:h-[100%] h-auto justify-between">
          <h1
            className="capitalize md:text-xl text-base text-gray-600 font-medium text-ellipsis line-clamp-2 "
            title={product.name}
          >
            {product.name}
          </h1>
          {product.price && product.has_promotion == false ? (
            <h2 className="text-gray-600 text-xl md:h-[10%]">
              {convertMoney(product.price)} S.P
            </h2>
          ) : (
            product.promotion_price &&
            <h2 className="text-gray-600 text-xl md:h-[10%]">
              {convertMoney(product.promotion_price)} S.P
            </h2>
          )}
          <p className="text-skin-primary md:text-lg text-base ">
            {product.brand}
          </p>
          {!product.price && (
            <Link
              href={`/Products/${product.slug}`}
              className="capitalize text-center md:h-[20%] border-2 border-skin-primary px-4 rounded-full text-base hover:bg-skin-primary hover:text-white transform duration-500"
            >
              {t("componentStore.ViewStore")}
            </Link>
          )}
          {product.price && (
            <button
              onClick={addToCart}
              title={product.has_variation == true && t("variationProduct")}
              className="capitalize md:h-[20%] border-2 border-skin-primary px-4 rounded-full justify-self-end  text-base transform duration-500"
            >
              {adding == true ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Ring size={17} lineWeight={5} speed={2} color="#ff6600" />
                </div>
              ) : (
                t("store.product.addToCart")
              )}
            </button>
          )}
        </div>
      </div>

      <Dialog
        open={open}
        fullWidth
        maxWidth="lg"
        disableAutoFocus
        disableRestoreFocus
      >
        <DialogTitle className="flex justify-end items-center">
          <MdClose
            onClick={closepopup}
            className="w-[25px] h-[25px] cursor-pointer text-black hover:text-red-500 transition-all duration-300"
          />
        </DialogTitle>
        <DialogContent>
          {loading == true ? (
            <div>
              <TawasyLoader width={200} height={200} />
            </div>
          ) : (
            productCombinations && (
              <div>
                <div className="flex md:flex-row flex-col gap-4 items-center w-[100%]">
                  <div className="min-w-[20%]">
                    <CarouselProduct
                      productDialog={true}
                      product={productCombinations}
                      selectedCombination={selectedCombination}
                      images={productCombinations.images}
                      onSelectImage={(data) => {
                        getselectedImage(data);
                      }}
                    />
                  </div>
                  <div className="sm:w-[80%] w-full">
                    <div className="w-full flex flex-col space-y-3 justify-between sm:items-start items-center">
                      <div className="flex md:flex-row flex-col justify-between items-center w-full">
                        <h1 className=" md:text-xl sm:text-lg text-lg w-[70%] text-gray-600 capitalize">
                          {product.name}
                        </h1>
                        {product.price && (
                          <p className="bg-gray-200 sm:text-lg  w-max text-sm h-max sm:flex-none flex py-2 px-2 text-gray-600 ">
                            {convertMoney(product.price)} S.P
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap space-x-3">
                        {product.brand && product.brand && (
                          <p className="md:text-base sm:text-base text-sm text-skin-primary border-2 border-skin-primary w-max px-5 rounded-full">
                            {product.brand}
                          </p>
                        )}
                        {product.category && product.category && (
                          <p className=" md:text-lg sm:text-base text-sm text-skin-primary border-2 border-skin-primary w-max px-5 rounded-full">
                            {product.category}
                          </p>
                        )}
                      </div>

                      <div
                        ref={combinationsRef}
                        className="w-full grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-2 overflow-y-scroll max-h-[200px] py-1"
                      >
                        {productCombinations.product_combination &&
                          productCombinations.product_combination.length > 0 &&
                          productCombinations.product_combination.map(
                            (combination, index) => {
                              let varis = [];
                              const numb = combination.product.variations.map(
                                (comb) => {
                                  varis.push(comb.option);
                                }
                              );
                              varis = varis.join(" - ");
                              let percent;
                              if (combination.product.has_promotion == true) {
                                percent = Math.round(
                                  calculateOfferPercentage(
                                    removeCommas(combination.product.price),
                                    combination.product.promotion_price
                                  )
                                );
                              }
                              return (
                                <div
                                  key={combination.product.line_id}
                                  id={`${combination.product.line_id}`}
                                >
                                  <input
                                    type="radio"
                                    id={` ${combination.product.line_id}combination`}
                                    name="combinations"
                                    value={combination.product.line_id}
                                    className="hidden peer"
                                    required
                                    checked={
                                      selectedCombination ==
                                      combination.product.line_id
                                    }
                                    onChange={(e) => {
                                      setSelectedCombination(e.target.value);
                                    }}
                                  />
                                  <label
                                    htmlFor={` ${combination.product.line_id}combination`}
                                    className="inline-flex flex-col items-start justify-start w-full px-2 py-1 text-gray-500 bg-white border border-dashed border-gray-500 rounded-lg cursor-pointer peer-checked:border-orange-500 peer-checked:text-orange-500 hover:text-gray-600 hover:bg-gray-100 transition-all duration-500"
                                  >
                                    <p className="flex flex-wrap items-center space-x-4">
                                      <p className="text-base">{varis}</p>
                                      {combination?.product?.hex && (
                                        <div
                                          className={`flex items-center justify-center w-[20px] h-[20px] rounded-full border border-skin-primary`}
                                          style={{
                                            backgroundColor: `${combination?.product?.hex}`,
                                          }}
                                        ></div>
                                      )}
                                    </p>
                                    <p className="text-xs">
                                      {combination.product.part_number}
                                    </p>
                                    {combination.product.has_promotion ==
                                    true ? (
                                      // <div className="w-full flex md:flex-row flex-col-reverse justify-around md:items-center items-start">
                                      //   <div className=" md:w-[50%] text-sm flex flex-col justify-start items-start">
                                      //     <div className="flex justify-start items-center">
                                      //       <p className="line-through decoration-red-500 px-1">
                                      //         {combination.product.price}
                                      //       </p>
                                      //       <p>S.P</p>
                                      //     </div>
                                      //     <div className="flex justify-start items-center">
                                      //       <p className="px-1">
                                      //         {convertMoney(
                                      //           combination.product
                                      //             .promotion_price
                                      //         )}
                                      //       </p>
                                      //       <p>S.P</p>
                                      //     </div>
                                      //   </div>
                                      //   <div className=" flex justify-center text-green-800 items-center 2xl:text-2xl xl:text-xl lg:text-lg text-sm">
                                      //     <p>{percent}</p>
                                      //     <p>%</p>
                                      //   </div>
                                      // </div>
                                      <div className="w-full flex md:flex-row flex-col-reverse justify-around md:items-center items-start ">
                                        <div className=" md:w-[50%] text-sm flex flex-col justify-start items-start">
                                          <div className="flex justify-start items-center">
                                            <p className="line-through decoration-red-500 px-1">
                                              {combination.product.price}
                                            </p>
                                            <p>S.P</p>
                                          </div>
                                          <div className="flex justify-start items-center">
                                            <p className="px-1">
                                              {convertMoney(
                                                combination.product
                                                  .promotion_price
                                              )}
                                            </p>
                                            <p>S.P</p>
                                          </div>
                                        </div>
                                        <div className=" flex justify-center px-2 text-green-800 items-center lg:text-2xl md:textlg text-base">
                                          <p>{percent}</p>
                                          <p>%</p>
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-sm">
                                        {combination.product.price} S.P
                                      </p>
                                    )}
                                  </label>
                                </div>
                              );
                            }
                          )}
                      </div>

                      {dialogAdding == true ? (
                        <div className="text-white sm:w-[40%] bg-skin-primary flex justify-center items-center w-full hover:opacity-80 py-1 rounded-md transition-all duration-500">
                          <Ring
                            size={20}
                            speed={2}
                            lineWeight={5}
                            color="white"
                          />
                        </div>
                      ) : (
                        <button
                          className={` text-white sm:w-[40%] w-full hover:opacity-80 py-1 rounded-md transition-all duration-500 ${
                            isButtonEnabled ? "bg-skin-primary" : "bg-gray-400"
                          }`}
                          onClick={dialogAddToCart}
                          disabled={!isButtonEnabled}
                        >
                          {t("store.product.addToCart")}
                        </button>
                      )}
                      {/* </form> */}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PublicAllProduct;

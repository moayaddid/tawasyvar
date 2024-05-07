import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import images from "@/public/images/kuala.jpg";
import withLayoutCustomer from "@/components/wrapping components/WrappingCustomerLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import logo from "@/public/images/tawasylogo.png";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import { useDispatch } from "react-redux";
import { cartActions } from "@/Store/CartSlice";
import { convertMoney } from "@/components/SellerOrders/sellerOrder";
import {
  Magnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION,
  SideBySideMagnifier,
  GlassMagnifier,
} from "react-image-magnifiers-v2";
import { NextSeo } from "next-seo";
import { CarouselProduct } from "@/components/ProductCarousel/CarouselProduct";
import Variations from "@/components/VariationsCustomer/Variations";
import { calculateOfferPercentage } from "@/components/SellerComponents/SellerPromotion";
import { removeCommas } from "@/components/CustomerAllProducts/AllProducts";

export async function getServerSideProps(context) {
  const { params, locale, res } = context;
  const Api = createAxiosInstance();
  try {
    const response = await Api.get(
      `/api/stores/${params.storeId}/products/${params.productSlug}`,
      {
        headers: { "Accept-Language": locale || "en" },
      }
    );
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        product: response.data,
      },
    };
  } catch (error) {
    if (error.response.status) {
      console.log(`asdasdasd`);
      console.log(locale);
      console.log(error.response.data);
      if (error.response.status == 500) {
        if (
          error?.response?.data?.lang &&
          error?.response?.data?.product_slug &&
          error?.response?.data?.store_slug
        ) {
          if (error?.response?.data?.lang == "ar") {
            // res.writeHead(301, {
            //   Location: `/ar/Stores/${encodeURIComponent(
            //     error.response.data.store_slug
            //   )}/Product/${encodeURIComponent(
            //     error.response.data.product_slug
            //   )}`,
            // });
            // res.end();
            // return true;
            return {
              redirect: {
                destination: `/ar/Stores/${encodeURIComponent(
                  error.response.data.store_slug
                )}/Product/${encodeURIComponent(
                  error.response.data.product_slug
                )}`,
                permanent: false,
              },
            };
          } else {
            // res.writeHead(301, {
            //   Location: `/Stores/${error.response.data.store_slug}/Product/${error.response.data.product_slug}`,
            // });
            // res.end();
            // return true;
            return {
              redirect: {
                destination: `/Stores/${error.response.data.store_slug}/Product/${error.response.data.product_slug}`,
                permanent: false,
              },
            };
          }
        } else {
          return {
            redirect: {
              destination: "/404",
              permanent: false,
            },
          };
        }
      } else {
        return {
          redirect: {
            destination: "/404",
            permanent: false,
          },
        };
      }
    }
  }
}

function Product({ product }) {
  const [adding, setAdding] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const Api = createAxiosInstance(router);
  const [price, setPrice] = useState();
  const [selectedCombination, setSelectedCombination] = useState();
  const isButtonEnabled = selectedCombination ? true : false;
  const combinationsRef = useRef();

  useEffect(() => {
    if (product) {
      if (product.product) {
        if (product.product.has_promotion == true) {
          setPrice(convertMoney(product.product.promotion_price));
        } else {
          setPrice(product.product.price);
        }
        return;
      } else if (
        product.product_combination &&
        product.product_combination.length > 0
      ) {
        let price = 9999999999;
        for (const comb of product.product_combination) {
          if (comb.product.has_promotion === 1) {
            const sdsd = comb.product.promotion_price;
            if (sdsd < price) {
              price = comb.product.promotion_price;
            }
          } else {
            const sdsd = comb.product.price.replace(/,/g, "");
            if (sdsd < price) {
              price = comb.product.price;
            }
          }
        }
        setPrice(price);
        return;
      }
    }
  }, [product]);

  async function addToCart() {
    if (product.product_combination) {
      setAdding(true);
      try {
        const response = await Api.post(`/api/customer/cart/add`, {
          product_id: product.product_id,
          store_id: product.store_id,
          variation: Number(selectedCombination),
        });
        dispatch(cartActions.addProduct());
        setAdding(false);
      } catch (error) {
        setAdding(false);
      }
      setAdding(false);
      return;
    } else {
      setAdding(true);
      try {
        const response = await Api.post(`/api/customer/cart/add`, {
          product_id: product.product.id,
          store_id: product.product.store_id,
        });
        dispatch(cartActions.addProduct());
        setAdding(false);
      } catch (error) {
        setAdding(false);
      }
      setAdding(false);
      return;
    }
  }

  const { t } = useTranslation("");

  function getselectedImage(data) {
    if (product.product_combination) {
      const combi = product?.product_combination.find(
        (combination) =>
          data ==
          combination?.product?.variations?.map((variation) => {
            return variation.image;
          })
      );
      if (combi) {
        if (combi.product.has_promotion === 1) {
          setPrice(combi.product.promotion_price);
        } else {
          setPrice(combi.product.price);
        }
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

  return (
    <>
      <NextSeo
        title={`${
          product.product
            ? product.product.name && product.product.name
            : product.name
        } | ${t("titles.home")}`}
        description={
          product.product
            ? product.product.name && product.product.name
            : product.name
        }
        canonical={
          router.locale == `en`
            ? `https://tawasyme.com/store/${router.query.storeId}/Product/${router.query.productSlug}`
            : `https://tawasyme.com/ar/store/${router.query.storeId}/Product/${router.query.productSlug}`
        }
      />
      <div className="w-full h-full flex justify-center">
        <div className="sm:w-[70%] w-[90%] shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] px-6 py-6 md:my-14 my-2">
          <div className="w-full flex md:flex-row flex-col md:justify-start items-center gap-4 py-2">
            <div className="sm:w-[40%] w-full justify-self-start">
              <CarouselProduct
                product={product}
                selectedCombination={selectedCombination}
                productDialog={false}
                onSelectImage={(data) => getselectedImage(data)}
                images={
                  product?.product ? [product?.product?.image] : product?.images
                }
              />
            </div>

            <div className="w-full h-full flex flex-col space-y-2 justify-center sm:items-start items-center">
              <div className="flex justify-between w-full">
                <h1 className=" md:text-2xl sm:text-lg text-xl w-[70%] text-gray-600 capitalize">
                  {product?.product
                    ? product?.product?.name && product?.product?.name
                    : product?.name}
                </h1>
                {product?.product_combination ? (
                  <p className="bg-gray-200 sm:text-lg  w-max text-sm h-max sm:flex-none flex py-2 px-2 text-black ">
                    {price} S.P
                    {/* {convertMoney(product.price)} S.P */}
                  </p>
                ) : (
                  <p className="bg-gray-200 sm:text-lg  w-max text-sm h-max sm:flex-none flex py-2 px-2 text-black ">
                    {price} S.P
                    {/* {convertMoney(product.price)} S.P */}
                  </p>
                )}
              </div>
              {product.product && product.product.has_promotion == true && (
                <div className="flex justify-start items-center">
                  <div className="flex justify-start items-end">
                    <p className="line-through px-1 md:text-2xl text-lg decoration-red-500 decoration-[2px]">
                      {product.product.price}
                    </p>
                    <p>S.P</p>
                  </div>
                  <p className="px-1 md:text-4xl text-2xl ">/</p>
                  <div className="flex justify-start items-end bg-skin-primary text-white px-1 rounded-lg">
                    <p className=" md:text-4xl text-2xl px-1 ">
                      {convertMoney(product.product.promotion_price)}
                    </p>
                    <p>S.P</p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 py-1">
                {(product?.product?.brand || product?.brand) && (
                  <p className="md:text-base sm:text-base text-sm text-skin-primary border-2 text-center border-skin-primary px-5 rounded-full">
                    {product?.product
                      ? product?.product?.brand && product?.product?.brand
                      : product?.brand}
                  </p>
                )}
                {(product?.category || product?.product?.category) && (
                  <p className=" md:text-base sm:text-base text-sm text-skin-primary border-2 border-skin-primary text-center px-5 rounded-full">
                    {product?.product
                      ? product?.product?.category && product?.product?.category
                      : product?.category}
                  </p>
                )}
              </div>
              {product?.product_combination && (
                <div
                  ref={combinationsRef}
                  className=" w-[90%] grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-2 overflow-y-scroll max-h-[200px] py-1"
                >
                  {product.product_combination &&
                    product.product_combination.length > 0 &&
                    product.product_combination.map((combination, index) => {
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
                              selectedCombination == combination.product.line_id
                            }
                            onChange={(e) => {
                              // console.log(e.target.value);
                              setSelectedCombination(e.target.value);
                              if (combination.product.has_promotion == true) {
                                setPrice(combination.product.promotion_price);
                              } else {
                                setPrice(combination.product.price);
                              }
                            }}
                          />
                          <label
                            htmlFor={` ${combination.product.line_id}combination`}
                            className="inline-flex h-full flex-col items-start justify-start w-full px-4 py-1 text-gray-500 bg-white border border-dashed border-gray-500 rounded-lg cursor-pointer peer-checked:border-orange-500 peer-checked:text-orange-500 hover:text-gray-600 hover:bg-gray-100 transition-all duration-500"
                          >
                            <div className="inline-flex justify-between w-full items-center space-x-2">
                              <p className="md:text-lg sm:text-base text-sm">
                                {varis}
                              </p>
                              {combination?.product?.hex && (
                                <div
                                  className={`flex items-center justify-center w-[20px] h-[20px] rounded-full border border-skin-primary`}
                                  style={{
                                    backgroundColor: `${combination?.product?.hex}`,
                                  }}
                                ></div>
                              )}
                            </div>
                            {combination.product.part_number && (
                              <p className="text-xs">
                                {`${combination.product.part_number}`}
                              </p>
                            )}
                            {combination.product.has_promotion == true ? (
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
                                        combination.product.promotion_price
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
                    })}
                </div>
              )}
              {product?.product_combination ? (
                <button
                  onClick={addToCart}
                  className={` text-white px-3 py-1 hover:opacity-70 transition-all duration-700 my-1 rounded-md xl:w-[20%] md:w-[70%] w-[90%] ${
                    isButtonEnabled ? "bg-skin-primary" : "bg-gray-400"
                  }`}
                  disabled={!isButtonEnabled}
                >
                  {adding == true ? (
                    <div className="w-full h-full flex justify-center items-center">
                      <Ring size={23} lineWeight={5} speed={2} color="white" />
                    </div>
                  ) : (
                    t("store.product.addToCart")
                  )}
                </button>
              ) : (
                <button
                  className="bg-skin-primary text-white px-3 py-1 hover:opacity-70 transition-opacity duration-500 my-1 rounded-md xl:w-[20%] md:w-[70%] w-[90%]"
                  onClick={addToCart}
                >
                  {adding == true ? (
                    <div className="w-full h-full flex justify-center items-center">
                      <Ring size={23} lineWeight={5} speed={2} color="white" />
                    </div>
                  ) : (
                    t("store.product.addToCart")
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="border-t-2 border-gray-200 py-3 my-2">
            <p className="text-gray-500 text-base">
              {product?.product
                ? product?.product?.description && product?.product?.description
                : product?.description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default withLayoutCustomer(Product);

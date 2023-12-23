import React, { useEffect, useState } from "react";
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

export async function getServerSideProps(context) {
  const { params, locale } = context;
  const Api = createAxiosInstance();
  const response = await Api.get(
    `/api/stores/${params.storeId}/products/${params.productSlug}`,
    {
      headers: { "Accept-Language": locale || "en" },
    }
  );
  // console.log(response.data);
  if (!response.data) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      product: response.data,
    },
  };
}

// function Product({ product }) {
// const product = {
//   product_combination: [
//     {
//       product: {
//         line_id: 6,
//         product_id: 2,
//         name: "Hurrican - Cars Wheels Polisher 1 Liter",
//         image:
//           "http://127.0.0.1:8000/Tawasy/public/productsimages/6213440581501.jpg",
//         price: "88,880",
//         part_number: "شسيشسي32323",
//         variations: [
//           {
//             id: 16,
//             attribute: "Color",
//             option: "Blue",
//             image: null,
//           },
//           {
//             id: 17,
//             attribute: "Color",
//             option: "Red",
//             image: null,
//           },
//         ],
//         has_variation: 1,
//       },
//     },
//     {
//       product: {
//         line_id: 5,
//         product_id: 2,
//         name: "Hurrican - Cars Wheels Polisher 1 Liter",
//         image:
//           "http://127.0.0.1:8000/Tawasy/public/productsimages/6213440581501.jpg",
//         price: "20,000",
//         part_number: "qweqwe1231246",
//         variations: [
//           {
//             id: 17,
//             attribute: "Color",
//             option: "Red",
//             image: null,
//           },
//           {
//             id: 18,
//             attribute: "Size",
//             option: "Small",
//             image: null,
//           },
//         ],
//         has_variation: 1,
//       },
//     },
//   ],
//   name: "Hurrican - Cars Wheels Polisher 1 Liter",
//   product_id: 122,
//   images: [
//     "http://127.0.0.1:8000/Tawasy/public/productsimages/6213440581501.jpg",
//   ],
//   brand: "Hurrican - هوريكان",
//   category: "Automotive Care",
//   description: "",
//   store_id: 3,
// };
// const product = {
//   success: true,
//   message: "Product details retrieved successfully.",
//   product: {
//     id: 4,
//     name: "SSM - Vehicle Shampoo 400 ml",
//     description: "",
//     image:
//       "http://127.0.0.1:8000/Tawasy/public/productsimages/1111111111714_1.jpg",
//     brand: "SSM - إس إس إم",
//     category: "Automotive Care",
//     price: "8,000",
//     slug: "ssm-vehicle-shampoo-400-ml",
//     has_variation: 0,
//     store_id: 3,
//   },
// };

function Product({ product }) {
  const [adding, setAdding] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const Api = createAxiosInstance(router);
  const [price, setPrice] = useState();
  const [selectedCombination, setSelectedCombination] = useState();
  const isButtonEnabled = selectedCombination ? true : false;

  useEffect(() => {
    if (product) {
      if (product.product) {
        setPrice(product.product.price);
        return;
      } else if (
        product.product_combination &&
        product.product_combination.length > 0
      ) {
        let price = 9999999999;
        for (const comb of product.product_combination) {
          const sdsd = comb.product.price.replace(/,/g, "");
          if (sdsd < price) {
            price = comb.product.price;
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

  console.log(product);

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
        canonical={`https://tawasyme.com/store/${router.query.storeId}/Product/${router.query.productSlug}`}
      />
      <div className="w-full h-full flex justify-center">
        <div className="sm:w-[70%] w-[90%] shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] px-6 py-6 md:my-14 my-2">
          <div className="w-full flex md:flex-row flex-col md:justify-start items-center gap-4 py-2">
            <div className="sm:w-[30%] w-full">
              <CarouselProduct
                productDialog={false}
                images={
                  product?.product ? [product?.product?.image] : product?.images
                }
              />
            </div>

            <div className="w-full flex flex-col gap-2 justify-center sm:items-start items-center">
              <div className="flex justify-between w-full">
                <h1 className=" md:text-xl sm:text-lg text-lg w-[70%] text-gray-600 capitalize">
                  {product?.product
                    ? product?.product?.name && product?.product?.name
                    : product?.name}
                </h1>
                {product?.product_combination ? (
                  <p className="bg-gray-200 sm:text-lg  w-max text-sm h-max sm:flex-none flex py-2 px-2 text-black ">
                   asdasdasdasd {price} S.P
                    {/* {convertMoney(product.price)} S.P */}
                  </p>
                ) : (
                  <p className="bg-gray-200 sm:text-lg  w-max text-sm h-max sm:flex-none flex py-2 px-2 text-black ">
                   {price} S.P
                    {/* {convertMoney(product.price)} S.P */}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(product?.product?.brand || product?.brand) && (
                  <p className="md:text-base sm:text-base text-sm text-skin-primary border-2 border-skin-primary w-max px-5 rounded-full">
                    {product?.product
                      ? product?.product?.brand && product?.product?.brand
                      : product?.brand}
                  </p>
                )}
                {(product?.category || product?.product?.category) && (
                  <p className=" md:text-base sm:text-base text-sm text-skin-primary border-2 border-skin-primary w-max px-5 rounded-full">
                    {product?.product
                      ? product?.product?.category && product?.product?.category
                      : product?.category}
                  </p>
                )}
              </div>
              {product?.product_combination && (
                <div className="w-full flex space-x-2 flex-wrap">
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
                      return (
                        <div key={combination.product.line_id}>
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
                              console.log(e.target.value);
                              setSelectedCombination(e.target.value);
                            }}
                          />
                          <label
                            htmlFor={` ${combination.product.line_id}combination`}
                            className="inline-flex flex-col items-start justify-start w-full px-4 py-1 text-gray-500 bg-white border border-dashed border-gray-500 rounded-lg cursor-pointer peer-checked:border-orange-500 peer-checked:text-orange-500 hover:text-gray-600 hover:bg-gray-100 transition-all duration-500"
                          >
                            <div className="inline-flex justify-between items-center space-x-2">
                              <p className="text-lg">{varis}</p>
                              <p className="text-base">
                                {`[ ${combination.product.part_number} ]`}
                              </p>
                            </div>
                            <p className="text-lg">
                              {combination.product.price} S.P
                            </p>
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

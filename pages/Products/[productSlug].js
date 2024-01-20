import React, { useState } from "react";
import Image from "next/image";
import images from "@/public/images/kuala.jpg";
import withLayoutCustomer from "@/components/wrapping components/WrappingCustomerLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import createAxiosInstance from "@/API";
import logo from "@/public/images/tawasylogo.png";
import StoreComponent from "@/components/customerCommponents/StoreComponent";
import {
  Magnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION,
  SideBySideMagnifier,
  GlassMagnifier,
} from "react-image-magnifiers-v2";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { CarouselProduct } from "@/components/ProductCarousel/CarouselProduct";
import Variations from "@/components/VariationsCustomer/Variations";

export async function getServerSideProps(context) {
  const { params, locale } = context;
  const Api = createAxiosInstance();
  const response = await Api.get(`/api/product/${params.productSlug}`, {
    headers: { "Accept-Language": locale || "en" },
  });
  // console.log(response);
  if (!response.data[`productDetails`]) {
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

function PublicProduct({ product }) {
  // const [selectedSize, setSelectedSize] = useState();
  // const [selectedColor, setSelectedColor] = useState();

  const router = useRouter();
  const { t } = useTranslation("");

  // const groupedVariations = {};
  // productVariations["variations"].forEach((variation) => {
  //   const attribute = variation.attribute;
  //   if (!groupedVariations[attribute]) {
  //     groupedVariations[attribute] = [];
  //   }
  //   groupedVariations[attribute].push(variation);
  // });

  let images = [] ; 
  if(product.variations){
    for (const vari of product.variations.original.variations){
      if(vari.image != null){
        images.push(vari.image);
      }
    }
    if(images.length < 1){
      images.push(product.productDetails.image);
    }
  }else{
    images.push(product.productDetails.image);
  }

  return (
    <>
      <NextSeo
        title={` ${product .productDetails.name} | ${t("titles.home")}`}
        description={product.productDetails.name}
        canonical={`https://tawasyme.com/Products/${router.query.productSlug}`}
      />
      <div className="w-full h-full flex flex-col items-center justify-center space-y-4 md:py-20 py-10 ">
        <div className="md:w-[80%] w-[90%] shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)]  md:my-5 my-2">
          <div className="w-[90%] mx-auto flex sm:flex-row flex-col sm:space-x-4 space-y-4 py-2">
            <div className="sm:h-full h-[40%]">
              <CarouselProduct images={images} onSelectImage={() => {}} />
            </div>

            <div className="w-full flex flex-col space-y-2 justify-center">
              <div className="flex justify-between">
                <h2 className="text-2xl text-gray-600 capitalize">
                  {product.productDetails.name}
                </h2>
              </div>
              {product.productDetails.brand && (
                <p className="text-lg text-skin-primary border-2 border-skin-primary w-max px-5 rounded-full">
                  {product.productDetails.brand}
                </p>
              )}

              {/* { product.variations && <Variations publicProduct={true} productVariations={product?.variations?.original} />} */}

              <p className="text-gray-500 text-base border-t-2 border-gray-200 py-3 my-2">
                {product.productDetails.decription && product.productDetails.description}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col space-y-4">
          {product.productDetails.stores && product.productDetails.stores.length > 0 ? (
            <div className="w-full flex flex-col space-y-4 ">
              <h2 className="text-2xl w-max mx-auto ">
                {t("product.storeSellers")} :
              </h2>
              <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-y-6 w-[90%] mx-auto ">
                {product.productDetails.stores &&
                  product.productDetails.stores.map((store , index) => {
                    return <StoreComponent store={store} key={index} />;
                  })}
              </div>
            </div>
          ) : (
            <div className="w-full text-center mx-auto md:text-2xl text-lg ">
              {t("product.noStores")}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default withLayoutCustomer(PublicProduct);

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import kuala from "@/public/images/kuala.jpg";
import { useTranslation } from "next-i18next";
import logo from "@/public/images/tawasylogo.png";
// import { useRouter } from "next-translate-routes";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import Link from "next/link";
import { useState } from "react";
import Cookies from "js-cookie";
import { MdCheck, MdClose, MdModeEdit } from "react-icons/md";
import { convertMoney } from "../SellerOrders/sellerOrder";

function SellerStoreProduct({ product, refetch }) {
  const { t } = useTranslation("");
  const router = useRouter();
  const [price, setPrice] = useState();
  const [editingPrice, setEditingPrice] = useState(false);
  const [savingPrice, setSavingPrice] = useState(false);
  const newPriceRef = useRef();
  const storeId = Cookies.get("Sid");
  const Api = createAxiosInstance(router);
  const [adding, setAdding] = useState(false);
  const [varis, setVaris] = useState("");
  const [image, setImage] = useState();

  useEffect(() => {
    if (product) {
      const finalPrice = product.price.replace(/,/g, "");
      setPrice(finalPrice);
      let nig = [];
      const variations =
        product.has_variation == true &&
        product.variations &&
        product.variations.length > 0 &&
        product.variations.map((variant) => {
          // console.log(`adasd`);
          // console.log(variant);
          nig.push(variant.option);
        });
      // console.log(nig);
      nig = nig.join(" / ");
      setVaris(nig);
      // let img ;
      if (
        product.has_variation == true &&
        product.variations &&
        product.variations.length > 0
      ) {
        for (const variant of product.variations) {
          if (variant.image) {
            setImage(variant.image);
            return;
          }
        }
        if(!image){
          setImage(product.image)
        }
      }else{
        setImage(product.image);
      }
      // product.variations.map((variant) => {
      //   // console.log(`adasd`);
      //   // console.log(variant);
      //   // nig.push(variant.option);
      //   if(variant.image){
      //     setImage(variant.image);
      //     return ;
      //   }
      // });
      // console.log(varis);
    }
  }, [product]);

  // console.log(product);

  async function savePrice() {
    if (
      product.has_variation == true &&
      product.variations &&
      product.variations.length > 0
    ) {
      // console.log(newPriceRef.current.value);
      setSavingPrice(true);
      try {
        const response = await Api.put(
          `api/seller/store/${storeId}/product/${product.id}/price`,
          {
            price: newPriceRef.current.value,
            variation: product.product_combination_id,
          }
        );
        setPrice(newPriceRef.current.value);
        setSavingPrice(false);
        setEditingPrice(false);
        refetch();
      } catch (error) {
        // console.log(error);
      }
    } else {
      setSavingPrice(true);
      try {
        const response = await Api.put(
          `api/seller/store/${storeId}/product/${product.id}/price`,
          {
            price: newPriceRef.current.value,
          }
        );
        setPrice(newPriceRef.current.value);
        setSavingPrice(false);
        setEditingPrice(false);
        refetch();
      } catch (error) {
        // console.log(error);
      }
    }
    setSavingPrice(false);
    setEditingPrice(false);
  }
  const productName =
    product.has_variation == true &&
    product.variations &&
    product.variations.length > 0 &&
    varis
      ? product.name +
        ` : ` +
        varis +
        (product.part_number ? ` - [${product.part_number}]` : "")
      : product.name;
  // console.log(varis);
  return (
    <div className="shadow-lg flex flex-col sm:w-fit max-w-[288px] border-2 md:min-h-[406px] min-h-[381px] border-gray-200 rounded-md ">
      <Link href={`/Products/${product.slug}`} legacyBehavior>
        <a
          target="_blank"
          className="bg-cover overflow-hidden flex justify-center items-center min-w-[288px]  min-h-[260px] max-h-[260px]  "
        >
          <Image
            // src={product.image ? product.image : logo}
            src={image ? image : logo}
            alt={product.name}
            className="w-full   transform transition duration-1000 object-contain object-center"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "225px", height: "225px" }}
          />
        </a>
      </Link>
      <div className="w-[90%] mx-auto py-3 flex flex-col gap-2 md:h-[100%] h-auto justify-between">
        <p
          className="capitalize cursor-default md:text-lg text-base text-gray-600 font-medium md:h-[40%] text-ellipsis line-clamp-3 "
          title={productName}
        >
          {/* {product.name} */}
          {productName}
        </p>
        {/* { product.has_variation == true && product.variation_info && product.variation_info.length > 0 && varis && <p className="md:h-[10%]" >{varis}</p>} */}
        {/* <p className={`text-skin-primary text-lg ${product.has_variation == true && product.variation_info && product.variation_info.length > 0 ? "md:h-[10%]" : "md:h-[20%]"} `}>{product.brand}</p> */}
        <p className={`text-skin-primary text-lg md:h-[20%] `}>
          {product.brand}
        </p>
        {price && (
          <div className="flex justify-end gap-3">
            {editingPrice == true ? (
              <input
                type="text"
                className="text-white rounded-md w-24 bg-skin-primary placeholder:text-white focus:outline-none px-2 py-1 text-sm  "
                defaultValue={price}
                ref={newPriceRef}
              />
            ) : (
              <span className="text-white rounded-md w-24 flex justify-center items-center  bg-skin-primary">
                {price}
              </span>
            )}
            {editingPrice === true ? (
              <div className="flex items-center">
                {savingPrice === true ? (
                  <div className="">
                    <Ring size={18} lineWeight={5} speed={2} color="#ff6600" />
                  </div>
                ) : (
                  <MdCheck
                    className="w-[25px] h-[25px] text-green-600 hover:text-green-500 "
                    onClick={savePrice}
                  />
                )}
                <MdClose
                  className="w-[25px] h-[25px] text-red-600 hover:text-red-500"
                  onClick={() => {
                    setEditingPrice(false);
                  }}
                />
              </div>
            ) : (
              <MdModeEdit
                className="w-[25px] h-[25px] bg-gray-400 text-white p-[3px] rounded-[50%]"
                onClick={() => {
                  setEditingPrice(true);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerStoreProduct;

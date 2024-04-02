import Image from "next/image";
import logo from "@/public/images/tawasylogo.png";
import { convertMoney } from "../SellerOrders/sellerOrder";
import { useState } from "react";
import { useTranslation } from "next-i18next";

function VendorSelecteableProduct({
  product,
  selectedProducts,
  selectProduct,
}) {
  const {t} = useTranslation("") ;

  function isSelected() {
    if (selectedProducts.some(obj => obj.id === product.vendor_product_id)) {
      return true;
    } else {
      return false;
    }
  }

//   console.log(selectedProducts);
  let varis = [];
  if (product?.combination?.variations) {
    product?.combination?.variations.map((variation) => {
      if (variation.option) {
        varis.push(variation.option);
      }
    });
  }

//   console.log(product);

  return (
    <div
      className={`shadow-lg flex flex-col sm:w-fit max-w-[288px] border-2 md:min-h-[406px] min-h-[381px]  rounded-md transition-all duration-500 ${
        isSelected() == true ? ` border-skin-primary ` : `border-gray-200`
      } `}
    >
      <div className="bg-cover overflow-hidden flex justify-center items-center min-w-[288px]  min-h-[260px] max-h-[260px]  ">
        <Image
          src={product.image ? product.image : logo}
          alt={product.name}
          className="w-full   transform transition duration-1000 object-contain object-center"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "225px", height: "225px" }}
        />
      </div>
      <div className="w-[90%] mx-auto py-3 flex flex-col gap-2 md:h-[100%] h-auto justify-between">
        <h1
          className="capitalize md:text-xl text-base text-gray-600 font-medium md:h-max text-ellipsis line-clamp-3 "
          title={product.name}
        >
          {product.name}
        </h1>
        { product.pack && <i className="text-gray-400" >{product.pack} {t("itemsInPack")}</i>}
        {product?.combination && (
          <div className="flex flex-col justify-center items-start space-y-1">
            <p className="line-clamp-3  text-red-500">
              {product?.combination?.variations && varis.join(" - ")}
            </p>
            <p>{product?.combination.part_number}</p>
          </div>
        )}
        <div className="flex flex-wrap gap-2 w-[70%] ">
          {product.brand_id && (
            <div className=" px-2 bg-white border-2 flex flex-wrap space-x-2 text-center w-max border-skin-primary rounded-2xl text-skin-primary  ">
              {product.brand_id}
            </div>
          )}
        </div>
        <div className="w-[90%] flex justify-between items-center ">
          <div className="text-lg ">
            {convertMoney(Number(product.price))} SYP
          </div>
          <button
            onClick={() => {
              selectProduct({
                id: product.vendor_product_id,
                name: product.name,
                combination: product.combination ?? null,
                price: product.price,
              });
            }}
            className={`${
              isSelected() == true ? `bg-red-500` : `bg-green-500`
            } hover:opacity-80 text-white px-3 py-1 transition-all duration-500 rounded-lg text-center `}
          >
            {isSelected() == true ? `${t("unselect")}` : `${t("select")}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VendorSelecteableProduct;

import Image from "next/image";
import logo from "@/public/images/tawasylogo.png";
import { useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { convertMoney } from "../SellerOrders/sellerOrder";
import { BiMinus, BiPlus } from "react-icons/bi";

function SellerVendorProduct({ product, selectedProducts, selectProduct }) {
  const [amount, setAmount] = useState(1);
  const noteRef = useRef();
  const { t } = useTranslation("");
  function isSelected() {
    if (
      selectedProducts.some((obj) => obj.compare === product.vendor_product_id)
    ) {
      return true;
    } else {
      return false;
    }
  }

  let varis = [];
  if (product?.combination?.variations) {
    product?.combination?.variations.map((variation) => {
      if (variation.option) {
        varis.push(variation.option);
      }
    });
  }

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
      <div className="w-[90%] select-none mx-auto py-3 flex flex-col gap-2 md:h-[100%] h-auto justify-between">
        <h1
          className="capitalize select-text md:text-xl text-base text-gray-600 font-medium md:h-max text-ellipsis line-clamp-3 "
          title={product.name}
        >
          {product.name}
        </h1>
        {product?.combination && (
          <div className="flex flex-col justify-center items-start space-y-1">
            <p className="line-clamp-3  text-red-500">
              {product?.combination?.variations && varis.join(" - ")}
            </p>
            {product?.combination.part_number && (
              <p>( {product?.combination.part_number} ) </p>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-2 w-[70%] ">
          {product.brand_id && (
            <div className=" px-2 bg-white border-2 flex flex-wrap space-x-2 text-center w-max border-skin-primary rounded-2xl text-skin-primary  ">
              {product.brand_id}
            </div>
          )}
        </div>
        <div className="w-[90%] flex flex-col justify-between items-center space-y-2  mx-auto">
          <div className=" flex flex-wrap justify-start items-center">
            <p className="text-skin-primary px-2 py-1 my-1 mx-1 border rounded-lg border-skin-primary">
              {product?.brand}
            </p>
            <p className="text-skin-primary px-2 py-1 my-1 mx-1 border rounded-lg border-skin-primary ">
              {product?.category}
            </p>
          </div>
          <div className=" w-full flex justify-between items-center space-x-2 ">
            <button
              onClick={() => {
                // console.log(`clicked`)
                selectProduct({
                  compare: product.vendor_product_id,
                  id: product.id,
                  name: product.name,
                  line_id: product.line_id ?? null,
                  combination: product.combination ?? null,
                  amount: amount,
                //   note: noteRef.current.value ?? null,
                });
              }}
              className={`${
                isSelected() == true ? `bg-red-500` : `bg-green-500`
              } hover:opacity-80 text-white w-max px-3 py-1 transition-all duration-500 rounded-lg text-center `}
            >
              {isSelected() == true ? `${t("unselect")}` : `${t("select")}`}
            </button>
            <div
              className={`flex justify-start items-center ${
                isSelected() == true
                  ? `opacity-50 pointer-events-none `
                  : `opacity-100`
              } `}
            >
              <button
                className="hover:text-skin-primary px-2 transition-all duration-300 text-lg "
                onClick={() => {
                  setAmount((prev) => {
                    return prev + 1;
                  });
                }}
              >
                <BiPlus />
              </button>
              <p className="px-2 py-1 border-b border-skin-primary">{amount}</p>
              <button
                className="hover:text-skin-primary disabled:text-gray-400 px-2 transition-all duration-300  text-lg"
                disabled={amount == 1}
                onClick={() => {
                  setAmount((prev) => {
                    return prev - 1;
                  });
                }}
              >
                <BiMinus />
              </button>
            </div>
          </div>
          {/* <label htmlFor="note" className="w-full text-black">
            <textarea
              disabled={isSelected() == true}
              id="note"
              ref={noteRef}
              className="w-full disabled:select-none outline-none border focus:border-skin-primary px-2 py-1"
              placeholder="Note"
            />
          </label> */}
        </div>
      </div>
    </div>
  );
}

export default SellerVendorProduct;

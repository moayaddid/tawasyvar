import React, { useState } from "react";
import { ResponsiveCarousel } from "../CarouselCustomer/carousel";
import Image from "next/image";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
// import logo from "../../public/images/lego.png";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import logo from "../../public/images/tawasylogo.png";
import { useTranslation } from "next-i18next";

function ProductCustomer({ product }) {
  const [adding, setAdding] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const {t} = useTranslation("");
  async function addToCart() {
    setAdding(true);
    try {
      const response = await Api.post(`/api/customer/cart/add`, {
        product_id: product.id,
        store_id: router.query.storeId,
      });
      setAdding(false);
    } catch (error) {}
    setAdding(false);
  }

  return (
    <>
      <div key={product.id} className="mb-4">
        <div
          className="bg-white overflow-hidden shadow-2xl rounded-lg items-center justify-center mx-auto"
        >
          <div className="bg-cover overflow-hidden flex justify-center items-center w-auto md:h-[343px] ">
            <Image
              src={product.image ? product.image : logo }
              alt={product.name}
              className="w-full  transform transition duration-1000 "
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "auto", height: "auto" }}
            />
          </div>

          <div className="flex flex-col justify-start items-start gap-3 py-4 px-4">
            <h3
              className="md:h-[100px] h-auto text-gray-600 md:text-2xl text-lg font-medium overflow-ellipsis md:line-clamp-2 line-clamp-3 select-none cursor-auto "
              title={product.name}
            >
              {product.name}
            </h3>
            <p className="text-skin-primary text-2xl font-medium">
              {product.price} s.p
            </p>
            <div className="flex flex-wrap w-[100%] gap-2">
              {product.brand && (
                <h3 className="text-skin-primary text-sm font-medium border-2 border-skin-primary px-2 py-1 rounded-full ">
                  {product.brand}
                </h3>
              )}
            </div>
            <p
              className=" text-gray-700 text-base font-light overflow-ellipsis min-h-[24px] line-clamp-2 select-none cursor-auto"
              title={product.description}
            >
              {product.description}

              {/* sadasd asd sd gsadhhhasd gagsdba sydhhasd dfsdfjkhsdfjkhsdfjkhsdfjhk */}
            </p>
            <div className="flex justify-center items-center pb-2 w-full">
              <button
                onClick={addToCart}
                className="items-center py-2 w-full text-sm font-medium text-center text-gray-900 bg-white rounded-full border border-[#ff6600] "
              >
                {adding == true ? (
                  <div className="w-full h-full flex justify-center">
                    <Ring size={20} lineWeight={5} speed={2} color="#ff6600" />
                  </div>
                ) : (
                  // ` Add to Cart`
                  t("store.product.addToCart")
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductCustomer;

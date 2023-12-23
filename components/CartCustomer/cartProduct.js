import {
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import image from "../../public/images/kuala.jpg";
import logo from "../../public/images/tawasylogo.png";
import Image from "next/image";
import { convertMoney } from "../SellerOrders/sellerOrder";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useState } from "react";
import { Ring } from "@uiball/loaders";
import { useTranslation } from "next-i18next";
import Link from "next/link";

function CartProduct({ product, storeid, refetch }) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const { t } = useTranslation("");
  const [isAdding, setIsAdding] = useState(false);
  const [isReducing, setIsReducing] = useState(false);
  //   const [quantity, setQuantity] = useState(product.quantity);
  let quantity = product.quantity;

  async function increaseQuantity() {
    if (product.combination) {
      setIsAdding(true);
      try {
        const response = await Api.post(`/api/customer/cart/add`, {
          product_id: product.product.id,
          store_id: storeid,
          variation: product.product_combination_id,
        });
        refetch();
        setIsAdding(false);
      } catch (error) {
        setIsAdding(false);
      }
      setIsAdding(false);
    } else {
      setIsAdding(true);
      try {
        const response = await Api.post(`/api/customer/cart/add`, {
          product_id: product.product.id,
          store_id: storeid,
        });
        refetch();
        setIsAdding(false);
      } catch (error) {
        setIsAdding(false);
      }
      setIsAdding(false);
    }
  }

  async function reduceQuantity() {
    if (product.combination) {
      setIsReducing(true);
      try {
        const response = await Api.post(`/api/customer/cart/remove`, {
          product_id: product.product.id,
          variation: product.product_combination_id,
        });
        // console.log(response);
        refetch();
        setIsReducing(false);
      } catch (error) {
        setIsReducing(false);
      }
      setIsReducing(false);
    } else {
      setIsReducing(true);
      try {
        const response = await Api.post(`/api/customer/cart/remove`, {
          product_id: product.product.id,
        });
        // console.log(response);
        refetch();
        setIsReducing(false);
      } catch (error) {
        setIsReducing(false);
      }
      setIsReducing(false);
    }
  }
  const nid = [];
  if (product.combination) {
    product?.combination?.variations.map((vari) => {
      nid.push(vari.option);
    });
    // nid.join(" / ");
  }
  const name = product.combination ? product.product.name + ` ( ${nid.join(" - ")} )` + ` [ ${product.combination?.part_number ? product.combination?.part_number : `-` } ]` : product.product.name ;

  let imageAr;

  if (product.combination?.variations && product.combination?.variations.length > 0) {
    product.combination.variations.forEach((variation) => {
      if (variation.image) {
        imageAr = variation.image;
      }
    });
  }

  if (!imageAr && product.product.image) {
    imagesArray.push(product.product.image);
  }

  return (
    <div className={`py-3 border-b-2 border-gray-300`}>
      <div className="flex gap-5 h-full">
        <div className="relative w-[20%]">
          {/* <div className="top-0 -translate-x-2.5 -translate-y-2.5 left-0 z-30  absolute bg-gray-400 border-1 text-center border-black hover:bg-red-600 w-[25px] h-[25px] rounded-full flex justify-center items-center ">
            <AiOutlineClose className="text-lg text-white " />
          </div> */}
          <Image
            src={imageAr? imageAr : logo}
            alt="product"
            className="rounded-xl object-contain "
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div className=" flex flex-col justify-center items-start gap-2  w-[50%]">
          <Link
            href={`/Products/${product.product.slug}`}
            legacyBehavior
            className="  "
          >
            <a
              target="_blank"
              className="text-gray-500 text-lg font-medium border-b-2 border-transparent hover:border-gray-500 cursor-pointer"
            >
              {name}
              {/* {product.product.name} */}
            </a>
          </Link>
          <p className=" text-skin-primary text-base font-light ">
            {product.price} S.P
          </p>
        </div>

        <div className=" flex flex-col justify-center items-center gap-2 w-[30%]">
          <div className=" text-skin-primary md:flex  items-center text-base font-light">
            {/* <div>{`Total Price`} :</div> */}
            <div>{t("orders.totalPrice")} :</div>
            <div>{convertMoney(product.lineTotal)} S.P</div>
          </div>
          <div className="flex w-[70%] justify-around items-center">
            <button>
              {isReducing == true ? (
                <Ring size={20} lineWeight={5} speed={2} color="#ff6600" />
              ) : quantity != 1 ? (
                <AiOutlineMinus
                  className={`w-[24px] h-[24px] text-gray-500  transition-all duration-800 ${
                    isAdding == true
                      ? `cursor-not-allowed`
                      : `hover:text-skin-primary hover:border-b-2 hover:border-skin-primary`
                  } `}
                  onClick={reduceQuantity}
                />
              ) : (
                <AiOutlineDelete
                  className={`w-[24px] h-[24px] text-gray-500  transition-all duration-800 ${
                    isAdding == true
                      ? `cursor-not-allowed`
                      : `hover:text-red-600 hover:border-b-2 hover:border-red-500`
                  } `}
                  onClick={reduceQuantity}
                />
              )}
            </button>
            <span className=" font-medium text-gray-500 border-b-2 border-gray-500 px-2 ">
              {quantity}
            </span>
            <button>
              {isAdding == true ? (
                <Ring size={20} lineWeight={5} speed={2} color="#ff6600" />
              ) : (
                <AiOutlinePlus
                  className={`w-[24px] h-[24px] text-gray-500  transition-all duration-800 ${
                    isReducing
                      ? `cursor-not-allowed`
                      : `hover:text-skin-primary hover:border-b-2 hover:border-skin-primary`
                  } `}
                  onClick={increaseQuantity}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartProduct;

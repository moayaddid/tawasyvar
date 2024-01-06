import Image from "next/image";
import React, { useState, useEffect, Fragment, useRef } from "react";
import {
  AiOutlineClose,
  AiOutlineIssuesClose,
  AiOutlineMinus,
  AiOutlinePlus,
  AiTwotoneDelete,
} from "react-icons/ai";
import Item from "../../public/images/item1.jpg";
import photo from "../../public/images/kuala.jpg";
import { RiDeleteBin6Line } from "react-icons/ri";
import styles from "../../components/componentsStyling/sellerStyles.module.css";
import { BsFillBagFill } from "react-icons/bs";
import CartProduct from "./cartProduct";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import TawasyLoader from "../UI/tawasyLoader";
import { Ring } from "@uiball/loaders";
import grayLogo from "../../public/images/logo-tawasy--gray.png";
import { useTranslation } from "next-i18next";

const Cart = ({ onClose, show, className }) => {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [Applying, setApplying] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const couponRef = useRef();
  const { t } = useTranslation("");
  const {
    data: cart,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery([`cart`, show], fetchCart, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: show,
  });

  async function fetchCart() {
    try {
      return await Api.get(`/api/customer/cart/show`);
    } catch (error) {}
  }

  useEffect(() => {
    // Remove overflow-y: hidden; from the body when the cart is closed
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, []);

  async function applyCoupon() {
    setApplying(true);
    try {
      const response = await Api.post(`/api/customer/cart/apply-coupon`, {
        coupon_code: couponRef.current.value,
        cart_id: cart.data.cart.id,
      });
      // console.log(response);
      setIsVisible(false);
      refetch();
      setApplying(false);
    } catch (error) {
      setApplying(false);
    }
    setApplying(false);
  }

  const [isVisible, setIsVisible] = useState(false);
  const [buttonText, setButtonText] = useState("Add Coupon");

  const handleClick = () => {
    setIsVisible(!isVisible);
    // setButtonText(buttonText === "Add Coupon" ? "Cancel" : "Add Coupon");
  };

  async function deleteCart() {
    setDeleting(true);
    try {
      const response = await Api.delete(`/api/customer/cart/delete`);
      onClose();
      setDeleting(false);
    } catch (error) {
      setDeleting(false);
    }
  }

  // if (cart) {
  //   console.log(cart);
  // }

  return (
    <div
      className={`fixed flex lg:top-[80px] md:top-[60px] sm:top-[50px] top-[50px] z-50 right-0 h-full  bg-transparent transition-all duration-700 ${
        show == false ? `w-0` : `w-full`
      } `}
      style={{
        maxHeight: "100vh",
        overflowY: "auto",
      }}
      dir="ltr"
    >
      <div className="md:w-[60%] w-0 bg-transparent " onClick={onClose}></div>
      <div
        className={`2xl:w-[40%] xl:w-[50%] lg:w-[60%] w-[100%] bg-white border-2 border-skin-primary`}
        style={{
          maxHeight: "92vh",
          overflowY: "auto",
          paddingBottom: "30px",
        }}
      >
        {isLoading == true ? (
          <div className="w-full h-full">
            <TawasyLoader width={300} height={300} />
          </div>
        ) : cart && Array.isArray(cart.data.cart) ? (
          <div className=" flex flex-col justify-start items-center w-full h-full ">
            <div className="flex w-full px-4 bg-gray-50 justify-between pt-3 pb-3">
              <h3 className="flex font-medium text-xl text-gray-600 ml-2 select-none ">
                <BsFillBagFill className=" w-[25px] h-[25px] text-skin-primary mr-2" />
                {t("cart.cart")}
                {/* {`Shopping cart`} */}
              </h3>
              <AiOutlineClose
                className="mr-2 w-[25px] h-[25px] text-gray-600 hover:text-red-500 cursor-pointer "
                onClick={onClose}
              />
            </div>
            <div className="flex flex-col justify-center items-center h-full space-y-5 ">
              <Image
                src={grayLogo}
                alt="gray Tawasy"
                className="w-[60%] h-auto "
              />
              {t("cart.emptyCart")}
              {/* {`Your cart is Empty.`} */}
            </div>
          </div>
        ) : (
          cart && (
            <div className="">
              <div className="flex px-4 bg-gray-50 justify-between pt-3 pb-3">
                <h3 className="flex font-medium text-xl text-gray-600 gap-2 select-none ">
                  <BsFillBagFill className=" w-[25px] h-[25px] text-skin-primary mr-2" />
                  {t("cart.cart")}
                  {/* {`Shopping Cart`} */}
                </h3>
                <AiOutlineClose
                  className="mr-2 w-[25px] h-[25px] text-gray-600 hover:text-red-500 cursor-pointer "
                  onClick={onClose}
                />
              </div>
              <hr className=" mb-4" />
              <div
                className={`px-5 transition-all duration-1000 ${
                  show == false ? `w-0` : `w-full`
                } `}
              >
                {cart &&
                  cart.data.cart?.lines &&
                  cart.data.cart.lines.map((item, index) => (
                    <CartProduct
                      key={index}
                      product={item}
                      storeid={cart.data.store_id}
                      refetch={() => {
                        refetch();
                      }}
                    />
                  ))}
              </div>
              {cart.data.cart.usedcoupon == false && (
                <div className="text-center w-full px-4">
                  <button
                    className="w-full pt-1 pb-1 border-t-2 border-b-2 border-[#b6b6b6]"
                    onClick={handleClick}
                  >
                    {/* {isVisible ? `Cancel` : `Add Coupon`} */}
                    {isVisible ? t("cart.cancel") : t("cart.addCoupon")}
                  </button>
                  {isVisible && (
                    <div className="w-full flex justify-between my-5 box-content ">
                      <input
                        className="w-[70%] pt-2 pb-2 outline-none pl-2 border-b-2 border-x-gray-400 focus:border-skin-primary transition-all duration-700"
                        type="text"
                        ref={couponRef}
                        placeholder={t("cart.apply")}
                        // placeholder={`Apply Coupon`}
                      />
                      <button
                        className="w-[20%] bg-skin-primary pt-2 pb-2 rounded-lg hover:bg-[#ff5100] text-white box-border "
                        onClick={applyCoupon}
                      >
                        {Applying ? (
                          <div className="flex justify-center items-center">
                            <Ring
                              size={23}
                              lineWeight={5}
                              speed={2}
                              color="white"
                            />
                          </div>
                        ) : (
                          // `Apply`
                          t("cart.apply")
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="grid md:grid-cols-2 grid-col-1 gap-2 px-4">
                <div className="pl-2 text-gray-600 font-medium text-lg">
                  <h4
                    style={{ marginBottom: "10px", marginTop: "10px" }}
                    className="flex justify-start gap-2 items-center"
                  >
                    <p>
                      {/* {`Quantity`} : */}
                      {t("orders.orderDetails.quantity")} :
                    </p>
                    <p>{cart.data.cart.total_quantity}</p>
                  </h4>
                  <h4
                    style={{ marginBottom: "10px" }}
                    className="flex justify-start gap-2 items-center"
                  >
                    {/* {`Total Price`} : */}
                    {t("orders.orderDetails.price")} :
                    <p>{cart.data.cart.total_price} S.P</p>
                  </h4>
                  <h4 className="flex justify-start gap-2 items-center">
                    {/* {`Final Price`} : */}
                    {t("orders.orderDetails.finalPrice")} :
                    <p>{cart.data.cart.final_price} S.P</p>
                  </h4>
                </div>
                <div className="pr-2 text-gray-600 font-medium text-lg">
                  <h4
                    style={{ marginBottom: "10px", marginTop: "10px" }}
                    className="flex justify-start space-x-2 items-center"
                  >
                    {/* {`Delivery Price`} : */}
                    <p>{t("orders.orderDetails.deliveryPrice")} :</p>
                    <p>{cart.data.cart.delivery_price} S.P </p>
                  </h4>
                  <h4
                    style={{ marginBottom: "10px" }}
                    className="flex justify-start space-x-2 items-center"
                  >
                    {/* {`Discount`} : */}
                    <p>{t("orders.orderDetails.discount")} : </p>
                    <p>{cart.data.cart.discounted_price} S.P</p>
                  </h4>
                </div>
              </div>
              {cart.data.cart.bigsize && cart.data.cart.bigsize == true && (
                <div className="w-full text-center text-white bg-red-400 mx-auto my-1">
                  {t("bigSize")}
                </div>
              )}
              <hr className="bg-gray-500" />
              <div
                className={`flex justify-center pb-2 pt-4  transition-opacity duration-300 ease-in-out ${
                  show == false ? `opacity-0` : `opacity-100 `
                }`}
              >
                <button
                  className="text-white bg-[#ff6600] px-16 py-2 rounded-full border-2 border-white hover:bg-white hover:text-skin-primary hover:border-skin-primary transition-all duration-500 "
                  onClick={() => {
                    router.push(`/SubmitOrder`);
                  }}
                >
                  {/* {`Submit Order`} */}
                  {t("cart.submitOrder")}
                </button>
              </div>

              <div
                className={`flex items-center justify-center w-full mt-2 border-b-2 border-t-2 border-red-700`}
              >
                <button
                  className="text-red-600 px-16 py-1 transition-all duration-500 "
                  onClick={deleteCart}
                >
                  {deleting ? (
                    <div>
                      <Ring
                        size={25}
                        speed={2}
                        lineWeight={5}
                        color="#660000"
                      />
                    </div>
                  ) : (
                    `Delete All Items`
                  )}
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Cart;

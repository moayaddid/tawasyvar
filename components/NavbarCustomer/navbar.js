import Image from "next/image";
import React, { useState, useEffect } from "react";
import TawasyLogo from "../.../../../public/images/tawasylogowhite.png";
import Link from "next/link";
import { BsFillBagFill } from "react-icons/bs";
import Cart from "../CartCustomer/cart";
import { CgProfile } from "react-icons/cg";
import { useRouter } from "next/router";
import LocaleSwitcher from "../UI/localeSwitcher/localeSwitcher";
import { useTranslation } from "next-i18next";
import { IoCartOutline } from "react-icons/io5";
// import {
//   useTranslation,
//   useLanguageQuery,
//   LanguageSwitcher,
// } from "next-export-i18n";
import Cookies from "js-cookie";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "@/Store/CartSlice";

function Navbar() {
  const router = useRouter();
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const { t } = useTranslation("");
  const addedProduct = useSelector((state) => state.cart.addedProduct);
  const dispatch = useDispatch();
  // const addedProduct = 
  // const { t } = useTranslation();
  // const [query] = useLanguageQuery();
  const Api = createAxiosInstance(router);
  // const { data: cart } = useQuery([`cart`, isLoggedIn], fetchCartData, {
  //   staleTime: 1,
  //   refetchOnMount: true,
  //   enabled: isLoggedIn == true,
  //   refetchOnWindowFocus: false,
  // });
  // // // console.log(query);

  // async function fetchCartData() {
  //   try {
  //     return await Api.get(`/api/customer/cart/show`);
  //   } catch (error) {}
  // }

  useEffect(() => {
    const token = Cookies.get("AT");
    const user = Cookies.get(`user`);
    if (token && user == `customer`) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    // Apply overflow-y: hidden; to the body when the cart is open
    if (showCartSidebar) {
      document.body.style.overflowY = "hidden";
    } else {
      // Remove overflow-y: hidden; when the cart is closed
      document.body.style.overflowY = "auto";
    }
  }, [showCartSidebar]);

  useEffect(() => {
    let dir = router.locale == "ar" ? "rtl" : "ltr";
    let lang = router.locale == "ar" ? "ar" : "en";
    document.querySelector("html").setAttribute("dir", dir);
    document.querySelector("html").setAttribute("lang", lang);
    // router.reload();
  }, [router.locale]);

  const handleCartButtonClick = () => {
    dispatch(cartActions.openCart());
    setShowCartSidebar(true);
  };

  // console.log(router);
  // console.log(addedProduct);

  return (
    <>
      <div
        className="flex bg-skin-primary justify-between lg:h-[80px] md:h-[60px] sm:h-[50px] h-[50px] pt-2 pb-2 w-full  z-20 fixed "
        dir="ltr"
      >
        <div
          className="flex justify-start md:pl-10 sm:w-[20%] w-fit h-auto pl-10 cursor-pointer"
          onClick={() => {
            router.push(`/`);
          }}
        >
          <Image
            src={TawasyLogo}
            alt="logo"
            className="md:w-auto w-[82px] h-auto"
            sizes="100vw"
          />
        </div>
        <div className="w-[50%] flex justify-end items-center md:pr-10 pr-3">
          {isLoggedIn == true && (
            <div className="flex justify-end items-center w-full sm:gap-2  ">
              <Link
                className="text-white sm:text-base text-xs w-max "
                href={"/Orders"}
              >
                {t("nav.orders")}
              </Link>
              {router.pathname != `/SubmitOrder` && (
                <button onClick={handleCartButtonClick} className="relative">
                  <IoCartOutline className="text-white w-[40px] h-[20px]  " />
                  {/* {cart?.data?.cart?.lines &&
                    cart?.data?.cart?.lines?.length > 0 && ( */}
                       { addedProduct == true && <div className="w-[7px] h-[7px] absolute rounded-full bg-gray-300 top-0 right-1"></div>}
                    {/* // )} */}
                  {/* <BsFillBagFill className="text-white w-[40px] h-[20px]  " /> */}
                </button>
              )}

              <button
                onClick={() => {
                  router.push(`/MyProfile`);
                }}
                className="flex justify-center items-center"
              >
                <CgProfile className="text-white w-[20px] h-[20px] mb-[-3px] " />
              </button>
            </div>
          )}
          { (router.pathname == "/" || router.pathname == "/ContactUs" || router.pathname == "/AboutUs" || router.pathname == "/Orders" || router.pathname == "/MyProfile" ) && <LocaleSwitcher />}
          {/* <div className="flex px-3 py-1 gap-2 text-white " >
            <LanguageSwitcher lang="ar">ar</LanguageSwitcher> |{" "}
            <LanguageSwitcher lang="en">en</LanguageSwitcher>
          </div> */}
          {/* <Link className="text-white md:mr-6 mr-2 mt-[10px]" href="#">
            Become A Seller
          </Link> */}
          {/* <button className="text-white border-white px-3 py-1 rounded-sm mr-3">
              Become A Seller
            </button> */}
          {isLoggedIn == false && (
            <div className="flex space-x-1" >
              <Link
                href={"/login"}
                // href={{ pathname :"/login" , query : query}}
                className="text-white h-[80%] sm:text-base text-xs flex items-center justify-center md:border-[1px] md:border-white md:px-6 px-1 hover:bg-white hover:text-skin-primary rounded-md justify-self-end"
              >
                {/* {`Login`} */}
                {t("nav.login")}
              </Link>
              <Link
                href={"/signup"}
                className="text-white mx-1 h-[80%] sm:text-base text-xs flex items-center justify-center md:border-[1px] md:border-white md:px-6 px-1 hover:bg-white hover:text-skin-primary rounded-md justify-self-end"
              >
                {/* {`Login`} */}
                {t("nav.SignUp")}
              </Link>
            </div>
          )}
        </div>
      </div>
      <Cart show={showCartSidebar} onClose={() => setShowCartSidebar(false)} />
    </>
  );
}

export default Navbar;

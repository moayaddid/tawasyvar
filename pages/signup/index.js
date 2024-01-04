import React, { useRef, useState } from "react";
import Logo from "../../public/images/tawasylogowhite.png";
import Locations from "@/components/Location/Location";
import { useNavigate } from "react-router-dom";
import { useRouter } from "next/router";
import styles from "../../components/componentsStyling/customerStyles.module.css";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import url from "@/URL";
import { Ring } from "@uiball/loaders";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import createAxiosInstance from "@/API";
import { TextField } from "@mui/material";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export async function getServerSideProps(context) {
  const { locale } = context;
  
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const SignUp = () => {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const customerUserNameRef = useRef();
  const customerNumberRef = useRef();
  const sellerUserNameRef = useRef();
  const sellerNumberRef = useRef();
  const [address, setAddress] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [sellerCity, setSellerCity] = useState("دمشق");
  const [registeree, setRegisteree] = useState(router.isReady && router.query.user ? (router.query.user == 'customer'  ? 1 : 2 ) : 1); // 1 for customer 2 for seller
  const [isChecked, setIsChecked] = useState(false);
  const {t} = useTranslation("");

  function handleRoleChange(event) {
    setRegisteree(Number(event.target.value));
  }

  async function customerSubmit(e) {
    e.preventDefault();

    if (!isChecked) {
      // Check if the checkbox is not checked
      toast.error(
        "Please agree on our terms and conditions and privacy policy. \b الرجاء الموافقة على الشروط والأحكام وسياسة الخصوصية الخاصة بنا",
        {
          toastId:
          "Please agree on our terms and conditions and privacy policy. \b الرجاء الموافقة على الشروط والأحكام وسياسة الخصوصية الخاصة بنا",
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      return;
    }

    if (address == undefined || address == null) {
      // Check if the checkbox is not checked
      toast.error("Please select an address. | الرجاء اختيار العنوان", {
        toastId: "Please select an address. | الرجاء اختيار العنوان",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await Api.post(`/api/customer/register`, {
        name: customerUserNameRef.current.value,
        phone_number: customerNumberRef.current.value,
        location: address ? address.address : null,
        longitude: address ? address.lng : null,
        latitude: address ? address.lat : null,
      });
      setIsLoading(false);
      Cookies.set("number", response.data.customer.phone_number, {
        expires: 365 * 10,
      });
      Cookies.remove("AT");
      Cookies.remove("user");
      Cookies.remove("Sid");
      Cookies.set("user", "customer", { expires: 365 * 10 });
      Cookies.set("registered", true, { expires: 365 * 10 });
      router.push("/verification");
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  async function sellerSubmit(e) {
    e.preventDefault();
    if (!isChecked) {
      toast.error(
        "Please agree on our terms and conditions and privacy policy. | الرجاء الموافقة على الشروط والأحكام وسياسة الخصوصية الخاصة بنا",
        {
          toastId:
          "Please agree on our terms and conditions and privacy policy. | الرجاء الموافقة على الشروط والأحكام وسياسة الخصوصية الخاصة بنا",
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      return;
    }

    if (address == undefined || address == null) {
      toast.error("Please select an address. | الرجاء اختيار العنوان", {
        toastId: "Please select an address. | الرجاء اختيار العنوان",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await Api.post(`/api/seller/register`, {
        name: sellerUserNameRef.current.value,
        phone_number: sellerNumberRef.current.value,
        location: sellerCity,
        longitude: address.lng,
        latitude: address.lat,
        city: sellerCity,
      });
      setIsLoading(false);
      Cookies.remove("AT");
      Cookies.remove("Sid");
      Cookies.remove("user");
      Cookies.set("number", response.data.seller.phone_number, {
        expires: 365 * 10,
      });
      Cookies.set("user", "seller", { expires: 365 * 10 });
      Cookies.set("registered", true, { expires: 365 * 10 });
      router.push("/verification");
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  const handleCityChange = (value) => {
    setSellerCity(value);
  };

  function handleData(data) {
    // console.log(`address`);
    // console.log(data);
    setAddress(data);
  }

  return (
    <>
      <div className="h-screen w-screen bg-skin-primary overflow-scroll ">
        {/* // customer register */}
        {
          <div
            className={`flex flex-col justify-start transition-opacity duration-900 ${
              registeree === 1 ? ` opacity-100 ` : ` opacity-0 hidden `
            }  items-center space-y-12 mx-auto px-4 pt-10 w-fit`}
          >
            <Image
              src={Logo}
              alt="Logo"
              width={400}
              height={290}
              className="mx-3"
            />
            <p className="text-white text-2xl font-semibold">
            {t("signup.customerRegister")}
            </p>
            <form
              onSubmit={customerSubmit}
              className="w-full flex flex-col space-y-6"
            >
              <input
                id="customerusername"
                type="text"
                // value={email}
                ref={customerUserNameRef}
                className="outline-none border-b-2 bg-skin-primary border-white placeholder:text-white w-full transition-all duration-700 text-white "
                placeholder={t("signup.userName")}
                required
              />
              <input
                id="customernumber"
                type="number"
                // value={email}
                ref={customerNumberRef}
                className="appearance-none outline-none border-b-2 bg-skin-primary border-white placeholder:text-white w-full transition-all duration-700 text-white "
                placeholder={t("signup.phone")}
                pattern="[0-9]{10}"
                style={{WebkitAppearance : "none" , MozAppearance : "textfield"}}
                required
              />
              <div className="flex justify-start items-center w-full space-x-3 ">
                <span className="text-white w-max ">{t("signup.address")}</span>
                <Locations
                  onLocation={handleData}
                  className={
                    "mb-4 outline-none bg-transparent border-b-2 border-white text-white  cursor-pointer placeholder:text-white appearance-none "
                  }
                />
              </div>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                  className="accent-white"
                  required
                />
                <span className="text-white sm:text-base text-sm flex justify-start flex-wrap items-center space-x-1 ">
                  <p>{t("signup.ia")}</p>
                  <Link
                    legacyBehavior
                    href={"/TermsAndConditions"}
                    className=""
                  >
                    <a
                      target="_blank"
                      className="text-sky-300 border-b-2 border-sky-300 hover:text-sky-500 hover:border-sky-500"
                    >
                      {t("signup.terms")}
                    </a>
                  </Link>
                  <p>{t("signup.andThe")}</p>
                  <Link
                    legacyBehavior
                    href={"/PrivacyPolicy"}
                    className="text-sky-300 border-b-2 border-sky-300 hover:text-sky-500 hover:border-sky-500"
                  >
                    <a
                      target="_blank"
                      className="text-sky-300 border-b-2 border-sky-300 hover:text-sky-500 hover:border-sky-500"
                    >
                      <p>{t("signup.privacy")}</p>
                    </a>
                  </Link>
                  <p>{t("signup.ofTawasy")}</p>
                </span>
              </label>

              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <label
                  htmlFor="login"
                  className=" text-lg text-white font-medium "
                >
                  {t("signup.signupAs")}
                </label>
                <ul className="grid w-full gap-6 md:grid-cols-2 mx-auto ">
                  <li>
                    <input
                      type="radio"
                      id="customer"
                      name="hosting"
                      value={1}
                      className="hidden peer"
                      required
                      checked={registeree === 1}
                      onChange={handleRoleChange}
                    />
                    <label
                      for="customer"
                      className="inline-flex items-center justify-center text-center w-full px-3 py-2 text-white-500 bg-white border border-white rounded-lg cursor-pointer peer-checked:border-orange-500 peer-checked:text-orange-500 hover:text-gray-600 hover:bg-gray-100 transition-all duration-500"
                    >
                      <p className="w-full block text-lg font-semibold">
                      {t("signup.customer")}
                      </p>
                    </label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="seller"
                      name="hosting"
                      value={2}
                      className="hidden peer"
                      required
                      checked={registeree === 2}
                      onChange={handleRoleChange}
                    />
                    <label
                      for="seller"
                      className="inline-flex items-center justify-center text-center w-full px-3 py-2 text-white bg-transparent border border-white rounded-lg cursor-pointer peer-checked:border-orange-500 peer-checked:text-orange-500 hover:text-skin-primary hover:bg-gray-100 transition-all duration-500"
                    >
                      <p className="w-full block text-lg font-semibold">
                      {t("signup.seller")}
                      </p>
                    </label>
                  </li>
                </ul>
              </div>

              <button
                className="px-2 py-1 border-2 bg-white text-skin-primary rounded-lg hover:bg-gray-200 "
                type="submit"
              >
                {isLoading == true ? (
                  <div className="flex justify-center items-center">
                    <Ring size={30} lineWeight={5} speed={2} color="#ff6600" />
                  </div>
                ) : (
                  t("login.signup")
                )}
              </button>
            </form>
            <div className="flex flex-col justify-start items-center space-x-1">
              <p className="text-md text-white ">
              {t("signup.existing")}
                <Link href={"/login"} className="border-b-2 border-white ml-2">
                {t("signup.login")}
                </Link>
              </p>
            </div>
          </div>
        }
        {/* // seller register */}
        {
          <div
            className={`flex flex-col justify-start transition-opacity duration-900 ${
              registeree === 2 ? `opacity-100` : `opacity-0 hidden`
            }  items-center space-y-12 mx-auto px-4 pt-10 w-fit`}
          >
            <Image
              src={Logo}
              alt="Logo"
              width={400}
              height={290}
              className="mx-3"
            />
            <p className="text-white text-2xl font-semibold">
            {t("signup.sellerRegister")}
            </p>
            <form
              onSubmit={sellerSubmit}
              className="w-full flex flex-col space-y-6"
            >
              <input
                id="sellerusername"
                type="text"
                ref={sellerUserNameRef}
                className="outline-none border-b-2 bg-skin-primary border-white placeholder:text-white w-full transition-all duration-700 text-white "
                placeholder={t("signup.userName")}
                required
              />
              <input
                id="sellernumber"
                type="number"
                ref={sellerNumberRef}
                className="outline-none border-b-2 bg-skin-primary border-white placeholder:text-white w-full transition-all duration-700 text-white appearance-none "
                placeholder={t("signup.phone")}
                style={{WebkitAppearance : "none" , MozAppearance : "textfield"}}
                pattern="[0-9]{10}"
                required
              />
              <div className="flex justify-start items-center space-x-3 w-full">
                <label className="text-white px-2 w-max ">{ router.locale == "ar" ? "المدينة" : "City"} </label>
                <select
                  className="w-full outline-none p-1 bg-transparent border-b-2 border-white text-white "
                  onChange={(e) => handleCityChange(e.currentTarget.value)}
                  required
                >
                  <option className="text-white" key={"دمشق"} value={"دمشق"}>
                    دمشق
                  </option>
                  <option
                    className="text-black"
                    key={"ريف دمشق"}
                    value={"ريف دمشق"}
                  >
                    ريف دمشق
                  </option>
                </select>
              </div>
              <div className="flex justify-start items-center w-full space-x-1 ">
                <span className="text-white w-max ">{t("signup.address")}</span>
                <Locations
                  onLocation={handleData}
                  className={
                    "mb-4 outline-none bg-transparent border-b-2 border-white text-white cursor-pointer placeholder:text-white appearance-none "
                  }
                />
              </div>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                  className="accent-white"
                />
                <span className="text-white sm:text-base text-sm flex justify-start flex-wrap items-center space-x-1 ">
                  <p>{t("signup.ia")}</p>
                  <Link
                    legacyBehavior
                    href={"/TermsAndConditions"}
                    className=""
                  >
                    <a
                      target="_blank"
                      className="text-sky-300 border-b-2 border-sky-300 hover:text-sky-500 hover:border-sky-500"
                    >
                      {t("signup.terms")}
                    </a>
                  </Link>
                  <p>{t("signup.andThe")}</p>
                  <Link
                    legacyBehavior
                    href={"/PrivacyPolicy"}
                    className="text-sky-300 border-b-2 border-sky-300 hover:text-sky-500 hover:border-sky-500"
                  >
                    <a
                      target="_blank"
                      className="text-sky-300 border-b-2 border-sky-300 hover:text-sky-500 hover:border-sky-500"
                    >
                      <p>{t("signup.privacy")}</p>
                    </a>
                  </Link>
                  <p>{t("signup.ofTawasy")}.</p>
                </span>
              </label>

              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <label
                  htmlFor="login"
                  className=" text-lg text-white font-medium "
                >
                  {t("signup.signupAs")}
                </label>
                <ul className="grid w-full gap-6 md:grid-cols-2 mx-auto ">
                  <li>
                    <input
                      type="radio"
                      id="customer"
                      name="hosting"
                      value={1}
                      className="hidden peer"
                      required
                      checked={registeree === 1}
                      onChange={handleRoleChange}
                    />
                    <label
                      for="customer"
                      className="inline-flex items-center justify-center text-center w-full px-3 py-2 text-white bg-transparent border border-white rounded-lg cursor-pointer peer-checked:border-orange-500 peer-checked:text-orange-500 hover:text-skin-primary hover:bg-gray-100 transition-all duration-500"
                    >
                      <p className="w-full block text-lg font-semibold">
                      {t("signup.customer")}
                      </p>
                    </label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="seller"
                      name="hosting"
                      value={2}
                      className="hidden peer"
                      required
                      checked={registeree === 2}
                      onChange={handleRoleChange}
                    />
                    <label
                      for="seller"
                      className="inline-flex items-center justify-center text-center w-full px-3 py-2 text-white bg-transparent border border-white rounded-lg cursor-pointer peer-checked:border-orange-500 peer-checked:text-orange-500 peer-checked:bg-white hover:text-skin-primary hover:bg-gray-100 transition-all duration-500"
                    >
                      <p className="w-full block text-lg font-semibold">
                      {t("signup.seller")}
                      </p>
                    </label>
                  </li>
                </ul>
              </div>

              <button
                className="px-2 py-1 border-2 bg-white text-skin-primary rounded-lg hover:bg-gray-200 "
                type="submit"
              >
                {isLoading == true ? (
                  <div className="flex justify-center items-center">
                    <Ring size={30} lineWeight={5} speed={2} color="#ff6600" />
                  </div>
                ) : (
                  t("login.signup")
                )}
              </button>
            </form>
            <div className="flex flex-col justify-start items-center space-y-1">

              <p className="text-md text-white ">
              {t("signup.existing")}
                <Link href={"/login"} className="border-b-2 border-white ml-2">
                {t("signup.login")}
                </Link>
              </p>
            </div>
          </div>
        }
      </div>
    </>
  );
};

export default SignUp;

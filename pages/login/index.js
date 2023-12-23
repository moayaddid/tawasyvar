import React, { useRef, useState } from "react";
import axios from "axios";
import url from "@/URL";
import Logo from "../../public/images/tawasylogo.png";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
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


const Login = () => {
  const NumberRef = useRef();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(1); // 1 for customer 2 for seller
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation("");
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (selectedRole === 2) {
      // seller login
      try {
        const response = await axios.post(`${url}/api/seller/login`, {
          phone_number: NumberRef.current.value,
        });
        if (response.status !== 200) {
          throw new Error(response);
        }
        setIsLoading(false);
        // console.log(`seller response`);
        // console.log(response);
        Cookies.remove("AT");
        Cookies.remove("user");
        Cookies.remove("Sid");
        Cookies.set("number", NumberRef.current.value, { expires: 365 * 10 });
        Cookies.set("user", "seller", { expires: 365 * 10 });
        router.push("/verification");
        toast.success(response.data.message, {
          toastId: response.data.message,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } catch (error) {
        toast.error(error?.response?.data?.message || `Request failed | فشل في طلب قاعدة البيانات`, {
          toastId: error?.response?.data?.message || `Request failed | فشل في طلب قاعدة البيانات `,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setIsLoading(false);
        // console.log(error);
      }
    } else if (selectedRole === 1) {
      // customer login
      try {
        const response = await axios.post(`${url}/api/customer/login`, {
          phone_number: NumberRef.current.value,
        });
        if (response.status !== 200) {
          throw new Error(response);
        }
        setIsLoading(false);
        // console.log(response);
        Cookies.remove("AT");
        Cookies.remove("user");
        Cookies.remove("Sid");
        Cookies.set("number", NumberRef.current.value, { expires: 365 * 10 });
        Cookies.set("user", "customer", { expires: 365 * 10 });
        router.push("/verification");
        toast.success(response.data.message, {
          toastId: response.data.message,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } catch (error) {
        toast.error(error.response.data.message || `Request failed | فشل في طلب قاعدة البيانات `, {
          toastId: error.response.data.message || `Request failed | فشل في طلب قاعدة البيانات `,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setIsLoading(false);
      }
    }
  };

  function handleRoleChange(event) {
    setSelectedRole(Number(event.target.value));
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleLogin(event);
    }
  }

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-white gap-12 mx-auto px-4 pt-28 w-full">
      <Image src={Logo} alt="Logo" width={400} height={290} className="mx-3" />
      <h3 className="text-xl text-black font-medium">
        {t("login.login")}
      </h3>
      <form
        onSubmit={handleLogin}
        className="flex flex-col justify-start items-center gap-9 w-full max-w-md p-4 md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] mx-auto "
        // onKeyDown={handleKeyDown}
      >
        <input
          type="number"
          ref={NumberRef}
          className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] placeholder:text-gray-300 w-full transition-all duration-700"
          placeholder={t("login.number")}
          inputMode="numeric"
          pattern="[0-9]{10}"
          style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
          required
        />
        <div className="flex flex-col justify-start items-start gap-2 w-[80%]">
          <label htmlFor="login" className=" text-lg font-medium ">
          {t("login.loginAs")}
          </label>
          <ul className="grid w-full gap-6 md:grid-cols-2 ">
            <li>
              <input
                type="radio"
                id="customer"
                name="hosting"
                value={1}
                className="hidden peer"
                required
                checked={selectedRole === 1}
                onChange={handleRoleChange}
              />
              <label
                for="customer"
                className="inline-flex items-center justify-center w-full px-3 py-2 text-gray-500 bg-white border border-gray-500 rounded-lg cursor-pointer peer-checked:border-orange-500 peer-checked:text-orange-500 hover:text-gray-600 hover:bg-gray-100 transition-all duration-500"
              >
                  <p className="w-full block text-lg font-semibold text-center">{t("signup.customer")}</p>
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
                checked={selectedRole === 2}
                onChange={handleRoleChange}
              />
              <label
                for="seller"
                className="inline-flex items-center justify-center w-full px-3 py-2 text-gray-500 bg-white border border-gray-500 rounded-lg cursor-pointer peer-checked:border-orange-500 peer-checked:text-orange-500 hover:text-gray-600 hover:bg-gray-100 transition-all duration-500"
              >
                  <p className="w-full block text-lg font-semibold text-center">{t("signup.seller")}</p>
              </label>
            </li>
          </ul>
        </div>
        <div className="flex gap-2 items-center ">
        <button
          type="submit"
          className="text-white bg-orange-500 rounded-md text-lg block px-5 py-2 mx-auto border-2 border-white hover:bg-orange-600 transition-all duration-300"
        >
          {isLoading == true ? (
            <div className="flex justify-center items-center">
              <Ring size={25} lineWeight={5} speed={2} color="white" />
            </div>
          ) : (
            t("login.logins")
          )}
        </button> 
         <span>{router.locale == "ar" ? "أو" : "or"}</span>
        <Link
          href={selectedRole == 1 ? `/signup?user=customer` : `/signup?user=seller` }
          className="text-white bg-orange-500 rounded-md text-lg block px-5 py-2 mx-auto border-2 border-white hover:bg-orange-600 transition-all duration-300"
        >
          {t("login.signup")}
        </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

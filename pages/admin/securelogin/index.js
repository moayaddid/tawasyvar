import React, { useRef, useState } from "react";
import axios from "axios";
import url from "@/URL";
import Logo from "../../../public/images/tawasylogo.png";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import Cookies from "js-cookie";

const AdminLogin = () => {
  // const NumberRef = useRef();
  const router = useRouter();
  const emailRef = useRef();
  const passwordRef = useRef();
  // const [selectedRole, setSelectedRole] = useState(1); // 1 for customer 2 for seller
  const [isLoading, setIsLoading] = useState(false);
  const Api = createAxiosInstance(router);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await Api.post(`/api/admin/login`, {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      // console.log(response) ;
      Cookies.remove("AT");
      Cookies.remove("user");
      Cookies.remove("Sid");
      Cookies.set("AT", response.data.token , {expires : 365 * 10});
      setIsLoading(false);
      router.push("/admin/Dashboard");
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
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
      <div>
        <h3 className="text-xl text-black font-medium">
          Login using your Email And Password
        </h3>
      </div>
      <form
        onSubmit={handleLogin}
        className="flex flex-col justify-start items-center gap-9 w-full max-w-md p-4 md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] mx-auto "
        onKeyDown={handleKeyDown}
      >
        <input
          type="text"
          ref={emailRef}
          className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] placeholder:text-gray-300 w-full transition-all duration-700"
          placeholder="Email"
          inputMode="email"
          required
        />
        <input
          type="password"
          ref={passwordRef}
          className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] placeholder:text-gray-300 w-full transition-all duration-700"
          placeholder="password"
          inputMode="password"
          required
        />
        <style jsx>{`
          /* Chrome, Safari, Edge, Opera */
          .appearance-none::-webkit-outer-spin-button,
          .appearance-none::-webkit-inner-spin-button {
            @apply appearance-none;
            -webkit-appearance: none;
            margin: 0;
          }

          /* Firefox */
          .appearance-none[type="number"] {
            @apply appearance-none;
            -moz-appearance: textfield;
          }
        `}</style>

        <button
          type="submit"
          className="text-white bg-orange-500 rounded-md text-lg block px-5 py-2 mx-auto border-2 border-white hover:bg-orange-600 transition-all duration-300"
          onClick={handleLogin}
        >
          {isLoading == true ? (
            <div className="flex justify-center items-center">
              <Ring size={25} lineWeight={5} speed={2} color="white" />
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

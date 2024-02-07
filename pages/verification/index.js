import React, { Fragment, useRef, useState } from "react";
import VerificationInput from "react-verification-input";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import styles from "../../components/componentsStyling/sellerStyles.module.css";
import Logo from "../../public/images/tawasylogo.png";
import Image from "next/image";
import axios from "axios";
import url from "@/URL";
import { Ring } from "@uiball/loaders";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import Cookies from "js-cookie";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Link from "next/link";

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Code = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const verifyNumber = useRef();
  const Api = createAxiosInstance(router);
  const { t } = useTranslation("");

  const handleVerify = async (e) => {
    e.preventDefault();
    const number = Cookies.get(`number`);
    setIsLoading(true);
    const user = Cookies.get("user");
    const formerUrl = Cookies.get("url");
    if (user === "seller") {
      try {
        const response = await axios.post(`${url}/api/seller/verify`, {
          phone_number: number,
          verification_code: verifyNumber.current.value,
        });
        Cookies.remove("number");
        Cookies.set("AT", response.data.token, { expires: 365 * 10 });
        try {
          const response2 = await Api.get(`/api/seller/store/status`);
          // console.log(`response in verification status`);
          switch (response2.data.status) {
            case "Store not found":
              router.replace("/seller/requestStore");
              break;

            case "approved":
              Cookies.set("Sid", response2.data.store_id, {
                expires: 365 * 10,
              });
              router.replace(`/seller`);
              break;

            case "pending":
              Cookies.set("Sid", response2.data.store_id, {
                expires: 365 * 10,
              });
              router.replace(`/seller/pendingStore`);
              break;
          }
        } catch (error) {
          console.log(error);
        }
        setIsLoading(false);
        if (response.status !== 200) {
          throw new Error(response);
        }
      } catch (error) {
        toast.error(error.response.data.error, {
          toastId: error.response.data.error,
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
    } else if (user === "customer") {
      try {
        const response = await Api.post(`/api/customer/verify`, {
          phone_number: number,
          verify_code: verifyNumber.current.value,
        });
        Cookies.remove("number");
        Cookies.set("AT", response.data.token, { expires: 365 * 10 });
        if (formerUrl) {
          if(!formerUrl.includes("/seller")){
            router.replace(formerUrl);
            Cookies.remove("url");
          }else{
            Cookies.remove("url");
            router.replace("/")
          }
        } else {
          router.replace("/");
        }
        setIsLoading(false);
        if (response.status !== 200) {
          throw new Error(response);
        }
      } catch (error) {
        toast.error(error.response.data.error, {
          toastId: error.response.data.error,
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

  const resendCode = async () => {
    const number = Cookies.get("number");
    const user = Cookies.get("user");
    if (user == "seller") {
      try {
        const response = Api.post(`/api/seller/resend-verification`, {
          phone_number: number,
        });
      } catch (error) {}
    } else if (user == "customer") {
      try {
        const response = Api.post(`/api/customer/resend-verification`, {
          phone_number: number,
        });
      } catch (error) {}
    }
  };

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleVerify(e);
    }
  }

  return (
    <Fragment>
      <div className={`w-screen h-screen bg-white `}>
        <div className="flex flex-col justify-start items-center gap-12 mx-auto px-4 pt-28 w-fit ">
          <Link href={"/"}>
            <Image src={Logo} alt="Logo" width={400} height={290} />
          </Link>
          <span className="text-xl font-medium text-center ">
            {/* الرجاء ادخال رمز التحقق الذي تم ارساله اليكم عن طؤيق الواتس أب أو التواصل معنل على الرقم التالي  */}
            <p> {t("verification.contactUs")}</p>
            <Link href="tel:+963987000888" legacyBehavior>
              <a
                target="_blank"
                className="text-skin-primary border-b border-skin-primary"
              >
                {t("verification.contactUsNumber")}
              </a>
            </Link>
          </span>
          <form
            className="flex flex-col justify-start items-center gap-7"
            onSubmit={handleVerify}
            onKeyDown={handleKeyDown}
            dir="ltr"
          >
            <VerificationInput
              autoFocus={true}
              id="code"
              pattern="[0-9]*"
              ref={verifyNumber}
            />
            <div className="">
              <button
                className="px-3 py-2 bg-skin-primary rounded-md text-white outline-none "
                type="submit"
              >
                {isLoading == true ? (
                  <div className="flex justify-center items-center">
                    <Ring size={25} lineWeight={5} speed={2} color="white" />
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>

          <span className="sm:text-lg text-base">
            {t("verification.didntGetCode")}{" "}
            <button
              className="text-skin-primary border-b border-skin-primary"
              onClick={resendCode}
            >
              {" "}
              {t("verification.resendCode")}{" "}
            </button>
          </span>
        </div>
      </div>
    </Fragment>
  );
};

export default Code;

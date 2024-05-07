import React, { Fragment, useRef, useState } from "react";
import VerificationInput from "react-verification-input";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import styles from "../../components/componentsStyling/sellerStyles.module.css";
import Logo from "@/public/images/tawasylogoorange.png";
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
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { MdClose } from "react-icons/md";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { BiPlus } from "react-icons/bi";

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
  const [openSelectStore, setOpenSelectStore] = useState(false);
  const [sellerStores, setSellerStores] = useState();
  const [selectedStore, setSelectedStore] = useState();
  const [role, setRole] = useState();
  const [gettingStores, setGettingStores] = useState(false);

  async function fetchStores() {
    setGettingStores(true);
    try {
      const response = await Api.get(`/api/seller/get-seller-stores`);
      setSellerStores(response.data.stores);
      setGettingStores(false);
    } catch (error) {
      setGettingStores(false);
    }
    setGettingStores(false);
  }

  function closeChangeStore() {
    setOpenSelectStore(false);
  }

  function selectStore() {
    Cookies.remove("Sid");
    Cookies.remove("role");
    Cookies.set("Sid", selectedStore, { expires: 365 * 10 });
    Cookies.set("role", role, { expires: 365 * 10 });
    router.replace("/seller");
    closeChangeStore();
  }

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
        // Cookies.remove("number");
        Cookies.set("AT", response.data.token, { expires: 365 * 10 });
        Cookies.set("SName", response.data.seller.name, { expires: 365 * 10 });
        setOpenSelectStore(true);
        fetchStores();
        setIsLoading(false);
        // if (response.status !== 200) {
        //   throw new Error(response);
        // }
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
          if (!formerUrl.includes("/seller")) {
            router.replace(formerUrl);
            Cookies.remove("url");
          } else {
            Cookies.remove("url");
            router.replace("/");
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
    <>
      <div className={`w-screen h-screen bg-white `}>
        <div className="flex flex-col justify-start items-center gap-12 mx-auto px-4 pt-28 w-fit ">
          <Link href={"/"}>
            <Image src={Logo} alt="Logo" width={400} height={290} />
          </Link>
          <span className="text-xl font-medium text-center ">
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

      <Dialog
        open={openSelectStore}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle className="w-full flex justify-start items-center">
          <p>{t("seller.employees.chooseStore")} :</p>
        </DialogTitle>
        <DialogContent>
          {gettingStores == true ? (
            <div className="w-full h-full flex justify-center items-center">
              <TawasyLoader width={200} height={300} />
            </div>
          ) : sellerStores ? (
            sellerStores?.length < 1 ? (
              <p className="text-center">You have No Stores.</p>
            ) : (
              <div className="w-full h-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 items-center">
                {sellerStores?.map((store, i) => {
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedStore(store.store_id);
                        setRole(store.role);
                      }}
                      className={`flex flex-col justify-around py-1 cursor-pointer items-center m-1 w-full border-2 rounded-lg hover:border-skin-primary transition-all duration-500 ease-in-out ${
                        selectedStore == store.store_id
                          ? `border-skin-primary`
                          : `border-zinc-500 `
                      } `}
                    >
                      <div className="w-full mx-auto flex justify-center items-center">
                        <Image
                          src={store.store_logo ?? Logo}
                          alt={store.store_name ?? ""}
                          width={0}
                          height={0}
                          className="object-contain lg:w-[225px] w-[150px] lg:h-[225px] h-[150px]"
                        />
                      </div>
                      <p>{store.store_name}</p>
                      <p>
                        {store.role == `super`
                          ? router.locale == "ar"
                            ? `( مالك المتجر ) `
                            : `( Owner ) `
                          : router.locale == "ar"
                          ? `( موظف )`
                          : `( Employee )`}
                      </p>
                    </div>
                  );
                })}
                <Link
                  href={`/seller/requestStore`}
                  className={`flex flex-col justify-center cursor-pointer items-center m-1 w-full h-full border-2 rounded-lg hover:border-skin-primary transition-all duration-500 ease-in-out`}
                >
                  <div className="w-full flex justify-center items-center mx-auto h-auto text-skin-primary ">
                    <BiPlus className="w-[15%] h-auto" />
                  </div>
                  <p>{t("seller.employees.createNewStore")}</p>
                </Link>
              </div>
            )
          ) : (
            <button
              className="text-skin-primary border-b-2 border-transparent hover:border-skin-primary"
              onClick={fetchStores}
            >
              Refresh
            </button>
          )}
        </DialogContent>
        <DialogActions className="w-full flex justify-center items-center border-t-2 border-skin-primary">
          <button
            className="bg-skin-primary rounded-lg px-2 py-3 text-center text-white disabled:bg-gray-500 disabled:cursor-not-allowed "
            disabled={!selectedStore}
            onClick={selectStore}
          >
            {t("seller.employees.confirm")}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Code;

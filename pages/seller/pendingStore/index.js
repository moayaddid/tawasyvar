import Image from "next/image";
import Logo from "../../../public/images/tawasylogo.png";
import { AiOutlineStop } from "react-icons/ai";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import Cookies from "js-cookie";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { BiPlus } from "react-icons/bi";

export async function getServerSideProps(context) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

function PendingPage() {
  let token;
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const { t } = useTranslation("");
  const [openSelectStore, setOpenSelectStore] = useState(false);
  const [sellerStores, setSellerStores] = useState();
  const [selectedStore, setSelectedStore] = useState();
  const [role, setRole] = useState();
  const [gettingStores, setGettingStores] = useState(false);

  const { data, isLoading, isError, error } = useQuery(
    `StoreStatus`,
    getStoreStatus,
    {
      staleTime: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchInterval: 300000,
    }
  );

  async function getStoreStatus() {
    return await Api.get(`/api/seller/store/status`);
  }

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
    router.push("/seller");
    closeChangeStore();
  }

  if (data) {
    if (data.data.status && data.data.status === "approved") {
      Cookies.remove("Sid");
      Cookies.remove("role");
      Cookies.remove("SName");
      Cookies.remove("STName");
      Cookies.remove("slug");
      Cookies.set("Sid", data.data.store_id, { expires: 365 * 10 });
      Cookies.set("role", data.data.role, { expires: 365 * 10 });
      Cookies.set("SName", data.data.name, { expires: 365 * 10 });
      Cookies.set("STName", data.data.store_name, {
        expires: 365 * 10,
      });
      Cookies.set("slug", data.data.slug, { expires: 365 * 10 });
      router.replace(`/seller`);
    }
  }

  function openStores() {
    setOpenSelectStore(true);
    fetchStores();
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen">
        <TawasyLoader />
      </div>
    );
  }
  // we should use useQuery to make a repeatable query about the store status because wen it gets available reRoute to the main dashboard
  return (
    <div className="flex flex-col items-center justify-start h-screen bg-white space-y-14 mx-auto px-4 pt-14 w-full">
      <Link href={"/"}>
        <Image
          src={Logo}
          alt="Logo"
          width={400}
          height={290}
          className="mx-3"
        />
      </Link>
      <div className="flex flex-col justify-start items-center space-y-3">
        {/* <AiOutlineStop className="text-red-600 text-9xl w-[150px] h-[150px] " /> */}
        <div className="flex flex-col justify-start items-center gap-3">
          <h3 className="text-3xl text-black font-medium">
            {t("pending.weRecieved")}
          </h3>
          <h3 className="text-xl font-medium">{t("pending.ourTeam")}</h3>
          <h3 className="text-xl font-medium">{t("pending.thankyou")}</h3>
          <h3 className="text-xl font-medium">{t("pending.meanwhile")}</h3>
          <button
            className="px-2 py-1 bg-skin-primary text-white rounded-lg"
            onClick={openStores}
          >
            {t("seller.employees.changeStore")}
          </button>
        </div>
      </div>

      <Dialog
        open={openSelectStore}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle className="w-full flex justify-start items-center">
          <p>{t("seller.employees.changeStore")} :</p>
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
                      className={`flex flex-col justify-around cursor-pointer items-center m-1 w-full border-2 rounded-lg hover:border-skin-primary transition-all duration-500 ease-in-out ${
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
        <DialogActions className="w-full flex justify-center items-center">
          <button
            className="bg-skin-primary rounded-lg px-2 py-3 text-center text-white disabled:bg-gray-500 disabled:cursor-not-allowed "
            disabled={!selectedStore}
            onClick={selectStore}
          >
            {t("seller.employees.confirm")}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PendingPage;

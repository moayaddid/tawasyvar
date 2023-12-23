import Image from "next/image";
import Logo from "../../../public/images/tawasylogo.png";
import { AiOutlineStop } from "react-icons/ai";
import { useQuery } from "react-query";
import { useEffect } from "react";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import Cookies from "js-cookie";
import Link from 'next/link';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

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
  const router = useRouter() ;
  const Api = createAxiosInstance(router);
  const {t} = useTranslation("");


  function getStoreStatus() {
    return Api.get(`/api/seller/store/status`);
  }
  const { data, isLoading, isError, error } = useQuery(
    `StoreStatus`,
    getStoreStatus,
    { staleTime: 1, refetchOnMount: true, refetchOnWindowFocus: false  , refetchInterval : 300000}
  );

  if (data) {
    if(data.data.status && data.data.status === "approved"){
      Cookies.set('Sid' , data.data.store_id , {expires : 365 * 10});
      router.replace(`/seller`);
    }
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen" >
        <TawasyLoader />
      </div>
    );
  }
  // we should use useQuery to make a repeatable query about the store status because wen it gets available reRoute to the main dashboard
  return (
    <div className="flex flex-col items-center justify-start h-screen bg-white space-y-14 mx-auto px-4 pt-14 w-full">
      <Link href={'/'} ><Image src={Logo} alt="Logo" width={400} height={290} className="mx-3" /></Link>
      <div className="flex flex-col justify-start items-center space-y-3">
        {/* <AiOutlineStop className="text-red-600 text-9xl w-[150px] h-[150px] " /> */}
        <div className="flex flex-col justify-start items-center gap-3">
          <h3 className="text-3xl text-black font-medium">
            {t("pending.weRecieved")}
          </h3>
          <h3 className="text-xl font-medium">
          {t("pending.ourTeam")}
          </h3>
          <h3 className="text-xl font-medium">
            {t("pending.thankyou")}
          </h3>
          <h3 className="text-xl font-medium">
           {t("pending.meanwhile")}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default PendingPage;

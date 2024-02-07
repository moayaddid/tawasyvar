import { useTranslation } from "next-i18next";
import Image from "next/image";
import React from "react";
import logo from "@/public/images/tawasylogo.png";
import Link from "next/link";
import { useRouter } from "next/navigation";

function PublicStoreCard({ store }) {
  // console.log(store);
  const router = useRouter();
  const {t} = useTranslation();
  return (
    <>
      {store && store.publish == 1 ? (
        <Link
          href={`/Stores/${store.slug}`}
          className="shadow-xl flex flex-col lg:h-[250px] md:h-[200px] h-[225px] "
        >
          <div className=" overflow-hidden flex justify-center items-center min-h-[144.5px] max-h-[144.5px] ">
            <Image
              src={store.image ? store.image : logo}
              alt={store.name}
              className="object-contain transform transition duration-1000  "
              width={0}
              height={0}
              style={{ width: "auto", height: "100%" }}
            />
          </div>
          <div className="flex justify-between items-center w-[90%] mx-auto py-3">
            <div>
              <h2>{store.name}</h2>
              <p>{store.location}</p>
            </div>
            {/* <div className=" w-[30%] h-auto p-4 "> */}
            <Image
              src={store.logo ? store.logo : logo}
              alt={store.name}
              className="w-full object-cover rounded-full "
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "75px", height: "75px" }}
            />
            {/* </div> */}
          </div>
        </Link>
      ) : (
        <div
          className="shadow-xl  flex flex-col h-auto "
        >
          <div className=" opacity-40 overflow-hidden flex justify-center items-center min-h-[144.5px] max-h-[144.5px] ">
            <Image
              src={store.image ? store.image : logo}
              alt={store.name}
              className="object-contain transform transition duration-1000 "
              width={0}
              height={0}
              style={{ width: "auto", height: "100%" }}
            />
          </div>
          <div className="flex justify-between items-center w-[90%] mx-auto py-3">
            <div>
              <h2 className="opacity-40" >{store.name}</h2>
              <p className="opacity-40" >{store.location}</p>
              <p className={`w-max italic ${router.locale == `en` ? `text-[13px]` : `text-[17px]`} bg-skin-primary rounded-lg px-2 py-1 text-white opacity-100`} >{t("soon")}</p>
            </div>
            {/* <div className=" w-[30%] h-auto p-4 "> */}
            <Image
              src={store.logo ? store.logo : logo}
              alt={store.name}
              className="w-full object-cover rounded-full "
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "75px", height: "75px" }}
            />
            {/* </div> */}
          </div>
        </div>
      )}
    </>
  );
}

export default PublicStoreCard;

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/tawasylogo.png";
import { useTranslation } from "next-i18next";
import Cookies from "js-cookie";

function StoreComponent({ store }) {
  const { t } = useTranslation("");
  const tk = Cookies.get("AT");
  const us = Cookies.get("user");
  const delivery = store.free_delivery === 1 ? true : false;
  const withinRange =
    tk &&
    us &&
    us === "customer" &&
    store.is_within_delivery_range &&
    store.is_within_delivery_range === true
      ? true
      : false;

  return (
    <>
      {store.publish && store.publish === 1 ? (
        <Link
          href={`/Stores/${store.slug}`}
          className=" 2xl:w-[70%] lg:w-[90%] md:w-[70%] sm:w-[80%] w-[90%] cursor-pointer bg-white shadow-xl flex justify-start items-center gap-4 rounded-lg overflow-hidden pr-2 border-2 border-gray-200 hover:scale-105 transition-all duration-500 mx-auto "
        >
          <div className=" md:w-[100px] w-[100px] md:h-[100px] h-[100px]">
            <Image
              className=" object-contain select-none pointer-events-none "
              src={store.logo ? store.logo : logo}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="w-[60%] h-full flex flex-col justify-center items-start box-border px-2 space-y-1 ">
            <div
              className=" line-clamp-2 text-start md:text-xl text-lg w-full text-ellipsis select-none "
              title={store.name}
            >
              {store.name}
            </div>
            {delivery === true &&
              (withinRange === true ? (
                <div className="px-1 sm:py-1 py-[3px] bg-green-500 rounded-lg text-center text-xs text-white">
                  {" "}
                  {t("freetoYou")}{" "}
                </div>
              ) : (
                <div className="px-1 sm:py-1 py-[2px] bg-green-500 rounded-lg text-center sm:text-sm text-xs text-white ">
                  {t("freeOut")} {store.radius} {t("meter")}
                </div>
              ))}
          </div>
        </Link>
      ) : (
        <div className="  2xl:w-[70%] lg:w-[90%] md:w-[70%] sm:w-[80%] w-[90%] bg-white shadow-xl flex justify-start items-center gap-4 rounded-lg overflow-hidden pr-2 border-2 border-gray-200 transition-all duration-500 mx-auto ">
          <div className=" opacity-40 md:w-[100px] w-[100px] md:h-[100px] h-[100px]">
            <Image
              className=" object-contain select-none pointer-events-none "
              // src={`https://www.befunky.com/images/prismic/e8c80c0a-bc59-4df2-a86e-cc4eabd44285_hero-blur-image-1.jpg?auto=avif,webp&format=jpg&width=900`}
              src={store.logo ? store.logo : logo}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "100%" }} // optional
            />
          </div>
          <div className="w-[60%] h-full flex flex-col justify-center items-start box-border px-2 ">
            <div
              className=" opacity-40 line-clamp-2 text-start md:text-xl text-lg w-full text-ellipsis select-none "
              title={store.name}
            >
              {store.name}
            </div>
            <p className=" italic text-[13px] bg-skin-primary rounded-lg px-2 py-1 text-white opacity-100">
              {t("soon")}
            </p>
            {/* <h5 className="md:line-clamp-2 line-clamp-1 w-full text-gray-500 text-base font-medium m-0 select-none " >
          fasdhjgfsdahgfsdhjgfasdhjkgasfdhjg asd asd asd asd asd asd asd asd asd asd 
        </h5> */}
            {/* <div className="flex sm:flex-row flex-col justify-start items-start w-full sm:gap-2 ">
            <h2 className="">Delivery Fee :</h2>
            <h3 className="text-skin-primary ">
            6000 S.P
            </h3>
          </div> */}
            {/* <div className="flex justify-start items-start w-full gap-2 ">
            <div className="md:text-xl text-md ">Delivery Time :</div>
            <div className="md:text-xl text-md text-skin-primary ">
            ~30 mins
            </div>
          </div>  */}
          </div>
        </div>
      )}
    </>
  );
}

export default StoreComponent;

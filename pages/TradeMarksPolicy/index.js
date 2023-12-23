import Image from "next/image";
import React, { useEffect } from "react";
// import Logo from '../../../public/images/tawasylogo.png';
import Logo from "../../public/images/tawasylogo.png";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import LocaleSwitcher from "@/components/UI/localeSwitcher/localeSwitcher";
import { useRouter } from "next/router";
import { RiEnglishInput } from "react-icons/ri";

export async function getServerSideProps(context) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

function TermsAndConditions() {
  const { t } = useTranslation("");
  const router = useRouter();

  useEffect(() => {
    let dir = router.locale == "ar" ? "rtl" : "ltr";
    let lang = router.locale == "ar" ? "ar" : "en";
    document.querySelector("html").setAttribute("dir", dir);
    document.querySelector("html").setAttribute("lang", lang);
    // router.reload();
  }, [router.locale]);

  return (
    <>
      <div
        className="flex flex-col justify-center items-center sm:w-[70%] w-[85%] mx-auto space-y-16 pt-6 pb-32"
        dir={router.locale == "ar" ? "rtl" : "ltr"}
      >
        <div className="lg:block hidden w-full ">
          <div className="flex flex-row-reverse w-full justify-between items-center ">
            <LocaleSwitcher color={`text-black hover:text-skin-primary`} />
            <Image
              src={Logo}
              alt="Logo"
              width={500}
              height={290}
              className="mx-3"
            />
            <Link href={`/`} className="box-border">
              <div className="w-max px-2 py-1 border-2 border-skin-primary">
                Home
              </div>
            </Link>
          </div>
        </div>

        <div className="lg:hidden block w-full ">
          <div className="flex flex-col w-full justify-start items-center space-y-4 ">
            <Image
              src={Logo}
              alt="Logo"
              width={500}
              height={290}
              className="mx-3"
            />
            <div className="flex justify-between items-center">
              <LocaleSwitcher color={`text-black hover:text-skin-primary`} />
              <Link href={`/`} className="box-border">
                <div className="w-max px-2 py-1 border-2 border-skin-primary">
                  Home
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <h1 className="font-bold sm:text-3xl text-xl text-center ">
            {t("tradeMark.title")}
          </h1>
          <p className="sm:text-lg text-base p-0 ">{t("tradeMark.info")}</p>
        </div>

        <div className="flex flex-col justify-start text-start space-y-2 w-full">
          <li>
            <h3 className="text-lg font-bold">
            {t("tradeMark.contactTitle")}
            </h3>
            <p className="sm:text-lg text-base ">
            {t("tradeMark.contactInfo")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
            {t("tradeMark.amendTitle")}
            </h3>
            <p className="sm:text-lg text-base ">
            {t("tradeMark.amendInfo")}
            </p>
          </li>
        </div>
      </div>
    </>
  );
}

export default TermsAndConditions;

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

function PrivacyPolicy() {
  const { t } = useTranslation("");
  const router = useRouter();

  // console.log(router)

  // const { locales, locale: activeLocale } = router;

  // const otherLocales = locales?.filter((locale) => locale !== activeLocale);

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
        className="flex flex-col justify-center items-center w-[70%] mx-auto space-y-16 py-6"
        dir={router.locale == "ar" ? "rtl" : "ltr"}
      >
        <div className="lg:block hidden w-full ">
          <div className="flex flex-row-reverse w-full justify-between items-center ">
            <LocaleSwitcher color={`text-black hover:text-skin-primary`} />

            {/* <span className="cursor-pointer">
              {otherLocales?.map((locale) => (
                <span key={"locale-" + locale}>
                  <a
                    href={`/${locale}${router.asPath}`}
                    className={`px-2 text-black`}
                  >
                    {locale == "en" ? (
                      <RiEnglishInput className="w-[20px] h-[20px] mx-5" />
                    ) : locale == "ar" ? (
                      <p className="text-xl mx-5">عربى</p>
                    ) : null}
                  </a>
                </span>
              ))}
            </span> */}

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

            {/* <span className="cursor-pointer">
              {otherLocales?.map((locale) => (
                <span key={"locale-" + locale}>
                  <a
                    href={`/${locale}${router.asPath}`}
                    className={`px-2 text-black`}
                  >
                    {locale == "en" ? (
                      <RiEnglishInput className="w-[20px] h-[20px] mx-5" />
                    ) : locale == "ar" ? (
                      <p className="text-xl mx-5">عربى</p>
                    ) : null}
                  </a>
                </span>
              ))}
            </span> */}
              <Link href={`/`} className="box-border">
                <div className="w-max px-2 py-1 border-2 border-skin-primary">
                  Home
                </div>
              </Link>
            </div>
          </div>
        </div>

        <h1 className="font-bold sm:text-3xl text-xl ">{t("privacy.title")}</h1>

        <div className="flex flex-col justify-start text-start space-y-2 w-full">
          <h2 className="font-semibold sm:text-xl text-lg text-start ">
            {t("privacy.intro.title")}
          </h2>
          <p className="sm:text-lg text-base ">{t("privacy.intro.info")}</p>
        </div>

        <div className="flex flex-col justify-start space-y-2 w-full">
          <h2 className="font-semibold text-xl">
            {t("privacy.personal.title")}
          </h2>
          <p className="text-lg">{t("privacy.personal.info")}</p>
        </div>

        <div className="flex flex-col justify-start space-y-2 w-full">
          <h2 className="font-semibold sm:text-xl text-lg">
            {t("privacy.use.title")}
          </h2>
          <p className="sm:text-lg text-base">{t("privacy.use.info")}</p>
        </div>

        <div className="flex flex-col justify-start space-y-2 w-full">
          <h2 className="font-semibold sm:text-xl text-lg">
            {t("privacy.cookies.title")}
          </h2>
          <p className="sm:text-lg text-base">{t("privacy.cookies.info")}</p>
        </div>

        <div className="flex flex-col justify-start space-y-2 w-full">
          <h2 className="font-semibold sm:text-xl text-lg">
            {t("privacy.third.title")}
          </h2>
          <p className="sm:text-lg text-base">{t("privacy.third.info")}</p>
        </div>

        <div className="flex flex-col justify-start space-y-2 w-full">
          <h2 className="font-semibold sm:text-xl text-lg">
            {t("privacy.registration.title")}
          </h2>
          <p className="sm:text-lg text-base">
            {t("privacy.registration.info")}
          </p>
        </div>

        <div className="flex flex-col justify-start space-y-2 w-full ">
          <h2 className="font-semibold sm:text-xl text-lg">
            {t("privacy.tele.title")}
          </h2>
          <p className="sm:text-lg text-base">{t("privacy.tele.info")}</p>
        </div>

        <div className="flex flex-col justify-start space-y-2 w-full ">
          <h2 className="font-semibold sm:text-xl text-lg">
            {t("privacy.tawasy.title")}
          </h2>
          <p className="sm:text-lg text-base">{t("privacy.tawasy.info")}</p>
        </div>

        <div className="flex flex-col justify-start space-y-2 w-full ">
          <h2 className="font-semibold sm:text-xl text-lg">
            {t("privacy.amendments.title")}
          </h2>
          <p className="sm:text-lg text-base">{t("privacy.amendments.info")}</p>
        </div>

        <div className="flex flex-col justify-start space-y-2 w-full ">
          <h2 className="font-semibold sm:text-xl text-lg">
            {t("privacy.contact.title")}
          </h2>
          <p className="sm:text-lg text-base">{t("privacy.contact.info")}</p>
        </div>

        <div className="flex flex-col justify-start space-y-2 w-full ">
          <h2 className="font-semibold sm:text-xl text-lg">
            {t("privacy.finally.title")}
          </h2>
          <p className="sm:text-lg text-base">{t("privacy.finally.info")}</p>
        </div>
      </div>
    </>
  );
}

export default PrivacyPolicy;

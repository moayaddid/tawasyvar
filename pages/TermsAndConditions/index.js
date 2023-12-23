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
            {t("terms.title")}
          </h1>
          <p className="sm:text-lg text-base p-0 ">{t("terms.info")}</p>
        </div>

        <div className="flex flex-col justify-start text-start space-y-2 w-full">
          <h2 className="font-semibold sm:text-xl text-lg text-start ">
            {t("terms.definitions.title")}
          </h2>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.termsAndConditions.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.termsAndConditions.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.tawasyShopping.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.tawasyShopping.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.tawasyExpress.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.tawasyExpress.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.onlineShoppingPlatform.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.onlineShoppingPlatform.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.mobileApplication.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.mobileApplication.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.activityWithinPlatform.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.activityWithinPlatform.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.buyers.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.buyers.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.storesSellers.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.storesSellers.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.advertisers.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.advertisers.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.prices.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.prices.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.availability.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.availability.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.deliveryService.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.deliveryService.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.deliveryFees.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.deliveryFees.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.acceptanceOfTheOrder.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.acceptanceOfTheOrder.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.rejectionOfTheOrder.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.rejectionOfTheOrder.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.buyersAddress.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.buyersAddress.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.storeAddressSeller.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.storeAddressSeller.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.images.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.images.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.categories.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.categories.info")}
            </p>
          </li>

          <li>
            <h3 className="text-lg font-bold">
              {t("terms.definitions.whoWeAre.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.whoWeAre.info")}
            </p>
          </li>
        </div>

        <div className="flex flex-col justify-start text-start space-y-2 w-full">
          <h2 className="font-semibold sm:text-xl text-lg text-start ">
            {t("terms.ourgoal.title")}
          </h2>

          <li>
            <p className="sm:text-lg text-base ">{t("terms.ourgoal.info1")}</p>
          </li>
          <li>
            <p className="sm:text-lg text-base ">{t("terms.ourgoal.info2")}</p>
          </li>
          <li>
            <p className="sm:text-lg text-base ">{t("terms.ourgoal.info3")}</p>
          </li>
          <li>
            <p className="sm:text-lg text-base ">{t("terms.ourgoal.info4")}</p>
          </li>
        </div>

        <div className="flex flex-col justify-start text-start space-y-3 w-full">
          <div className="flex flex-col space-y-3">
            <h4 className="font-bold sm:text-xl text-lg text-start">
              {t("terms.shoppingMechanism.title")}
            </h4>
            <p>{t("terms.shoppingMechanism.info")}</p>
          </div>
          <div className="w-[95%] mx-auto">
            <h5 className="font-bold">
              {t("terms.shoppingMechanism.noteThat.title")}
            </h5>
            <p>{t("terms.shoppingMechanism.noteThat.info")}</p>
          </div>
        </div>

        <div className="flex flex-col justify-start text-start space-y-3 w-full">
          <div className="flex flex-col space-y-3">
            <h4 className="font-bold sm:text-xl text-lg text-start">
              {t("terms.creatingSeller.title")}
            </h4>
            <p>{t("terms.creatingSeller.info")}</p>
          </div>
          <div className="w-[95%] mx-auto">
            <h5 className="font-bold">
              {t("terms.creatingSeller.noteThat.title")}
            </h5>
            <p>{t("terms.creatingSeller.noteThat.info")}</p>
          </div>
        </div>

        <div className="flex flex-col justify-start text-start space-y-3 w-full">
          <div className="flex flex-col space-y-3">
            <h4 className="font-bold sm:text-xl text-lg text-start">
              {t("terms.creatingCustomer.title")}
            </h4>
            <p>{t("terms.creatingCustomer.info")}</p>
          </div>
          <div className="w-[95%] mx-auto">
            <h5 className="font-bold">
              {t("terms.creatingCustomer.noteThat.title")}
            </h5>
            <p>{t("terms.creatingCustomer.noteThat.info")}</p>
          </div>
        </div>

        <div className="flex flex-col justify-start text-start space-y-3 w-full">
          <div className="flex flex-col space-y-3">
            <h4 className="font-bold sm:text-xl text-lg text-start">
              {t("terms.express.title")}
            </h4>
            <p>{t("terms.express.info")}</p>
          </div>
          <div className="w-[95%] mx-auto">
            <h5 className="font-bold">{t("terms.express.noteThat.title")}</h5>
            <li>
              <p>{t("terms.express.noteThat.info1")}</p>
            </li>
            <li>
              <p>{t("terms.express.noteThat.info2")}</p>
            </li>
            <li>
              <p>{t("terms.express.noteThat.info3")}</p>
            </li>
            <li>
              <p>{t("terms.express.noteThat.info4")}</p>
            </li>
            <li>
              <p>{t("terms.express.noteThat.info5")}</p>
            </li>
            <li>
              <p>{t("terms.express.noteThat.info6")}</p>
            </li>
          </div>
        </div>

        <div className="flex flex-col justify-start text-start space-y-3 w-full">
          <div className="flex flex-col space-y-3">
            <h4 className="font-bold sm:text-xl text-lg text-start">
              {t("terms.classifications.title")}
            </h4>
            <p>{t("terms.classifications.info")}</p>
          </div>
        </div>

        <div className="flex flex-col justify-start text-start space-y-3 w-full">
          <div className="flex flex-col space-y-3">
            <h4 className="font-bold sm:text-xl text-lg text-start">
              {t("terms.payment.title")}
            </h4>
            <p>{t("terms.payment.info")}</p>
          </div>
          <div className="w-[95%] mx-auto">
            {/* <h5 className="font-bold">{t("terms.payment.noteThat.title")}</h5> */}
            <li>
              <p>{t("terms.payment.info1")}</p>
            </li>
            <li>
              <p>{t("terms.payment.info2")}</p>
            </li>
            <li>
              <p>{t("terms.payment.info3")}</p>
            </li>
          </div>
        </div>

        <div className="flex flex-col justify-start text-start space-y-3 w-full">
          <div className="flex flex-col space-y-3">
            <h4 className="font-bold sm:text-xl text-lg text-start">
              {t("terms.offers.title")}
            </h4>
            <p>{t("terms.offers.info")}</p>
          </div>
        </div>

        <div className="flex flex-col justify-start text-start space-y-3 w-full">
          <div className="flex flex-col space-y-3">
            <h4 className="font-bold sm:text-xl text-lg text-start">
              {t("terms.genral.title")}
            </h4>
            <p>{t("terms.genral.info")}</p>
          </div>
          <div className="w-[95%] mx-auto">
            {/* <h5 className="font-bold">{t("terms.payment.noteThat.title")}</h5> */}
            <li>
              <p>{t("terms.genral.info1")}</p>
            </li>
            <li>
              <p>{t("terms.genral.info2")}</p>
            </li>
          </div>
        </div>

      </div>
    </>
  );
}

export default TermsAndConditions;

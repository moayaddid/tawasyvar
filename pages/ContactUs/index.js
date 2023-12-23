import React, { useState } from "react";
import withLayoutCustomer from "@/components/wrapping components/WrappingCustomerLayout";
// import Contact from "../../../public/images/contactus3.jpg";
import Form from "@/components/ContactForm/form";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ContactUs = () => {
  const { t } = useTranslation("");
  return (


    <div className="w-full max-h-max text-white ">
      <div height 
        style={{
          backgroundImage: `url(/images/contactus3.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          height : "100%"
        }}
      >
     <div className="bg-[#00000056] h-[100%] py-9">
      <h1 className="text-center  md:text-4xl text-xl font-medium md:mb-4 mb-2 ">
        {t("contacUs.main")}
      </h1>
      <div className="w-[40%] mx-auto flex flex-col justify-start text-start" >
        <div className="flex flex-col justify-start items-center space-y-1 e ">
          <h2 className="font-semibold text-xl ">
            {t("contacUs.general.title")}
          </h2>
          <p className="text-lg">{t("contacUs.general.info")}</p>
          <p className="text-lg text-center ">
            {t("contacUs.general.email.title")}
            {t("contacUs.general.email.info")}
          </p>
        </div>

        <div className="flex flex-col justify-start items-center space-y-1 e ">
          <h2 className="font-semibold text-xl ">
            {t("contacUs.commercial.title")}
          </h2>
          <p className="text-lg text-center">{t("contacUs.commercial.info")}</p>
          <p className="text-lg text-center ">
            {t("contacUs.commercial.email.title")}{" "}
            {t("contacUs.commercial.email.info")}
          </p>
        </div>

        <div className="flex flex-col justify-start items-center space-y-1 e ">
          <h2 className="font-semibold text-xl ">
            {t("contacUs.delivery.title")}
          </h2>
          <p className="text-lg">{t("contacUs.delivery.info")}</p>
          <p className="text-lg text-center ">
            {t("contacUs.delivery.email.title")}{" "}
            {t("contacUs.delivery.email.info")}
          </p>
        </div>

        {/* <div className="flex flex-col justify-start items-center space-y-1 e ">
          <h2 className="font-semibold text-xl ">
            {t("contacUs.management.title")}
          </h2>
          <p className="text-lg">{t("contacUs.management.info")}</p>
          <p className="text-lg text-center">
            {t("contacUs.management.email.title")}{" "}
            {t("contacUs.management.email.info")}
          </p>
        </div> */}
      </div>

      {/* <Form /> */}
      </div>
      </div>
    </div>
  );
};

export default withLayoutCustomer(ContactUs);

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

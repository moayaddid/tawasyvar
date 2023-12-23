import React from "react";
// import about3 from '../../../public/images/about3.jpg';
import about3 from "../../public/images/about3.jpg";
import about1 from "../../public/images/about1.jpg";
import Image from "next/image";
import withLayoutCustomer from "@/components/wrapping components/WrappingCustomerLayout";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const AboutUs = () => {
  const { t } = useTranslation("");
  return (
    <div className="md:flex md:flex-row flex-col justify-center md:space-x-4 mx-auto p-[50px]">
      <div className="md:w-[60%] w-[90%]">
        <div className="md:flex md:flex-row flex-col">
          <div>
            <Image
              src={about3}
              unoptimized={false}
              alt="about us"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
          <div className="flex flex-col justify-center md:items-start items-center px-8">
            <h3 className="text-lg font-bold">
              {t("terms.definitions.whoWeAre.title")}
            </h3>
            <p className="sm:text-lg text-base ">
              {t("terms.definitions.whoWeAre.info")}
            </p>
            <div className="flex flex-col justify-start text-start space-y-2 w-full">
              <h2 className="font-semibold sm:text-xl text-lg text-start ">
                {t("terms.ourgoal.title")}
              </h2>

              <li>
                <p className="sm:text-lg text-base ">
                  {t("terms.ourgoal.info1")}
                </p>
              </li>
              <li>
                <p className="sm:text-lg text-base ">
                  {t("terms.ourgoal.info2")}
                </p>
              </li>
              <li>
                <p className="sm:text-lg text-base ">
                  {t("terms.ourgoal.info3")}
                </p>
              </li>
              <li>
                <p className="sm:text-lg text-base ">
                  {t("terms.ourgoal.info4")}
                </p>
              </li>
            </div>
          </div>
        </div>
      </div>
      <div className="md:w-[40%] w-[90%]">
        <Image
          src={about1}
          unoptimized={false}
          alt="about us"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "auto", height: "auto" }}
        />
      </div>
    </div>
  );
};

export default withLayoutCustomer(AboutUs);

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

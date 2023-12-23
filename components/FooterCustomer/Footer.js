import React from "react";
import Logo from "../../public/images/tawasylogowhite.png";
import Image from "next/image";
import Link from "next/link";
import { FaTelegram } from "react-icons/fa";
import { BsFacebook, BsWhatsapp } from "react-icons/bs";
import { BsFillTelephoneFill, BsInstagram } from "react-icons/bs";
import { MdCopyright } from "react-icons/md";
import { useTranslation } from "next-i18next";

const Footer = () => {
  const { t } = useTranslation("");

  return (
    <>
      <div
        onClick={() => {
          window.scroll({
            top: 0,
            behavior: "smooth",
          });
        }}
        className="bg-[#262626d2] py-2 text-white text-center"
      >
        <p className="cursor-pointer">Return to Top</p>
      </div>
      <div className="bg-[#262626] bottom-0 w-full">
        <div className="grid md:grid-cols-3 sm:grid-cols-1 grid-col-1 gap-4 py-10">
          <div className="text-white flex flex-col justify-center items-center text-center">
            <Link href="/">
              <Image src={Logo} alt="logo" className="w-[30%] mx-auto" />
            </Link>

            <div className="flex justify-center py-4">
              <p className="text-white text-base">{t("footer.Text")}</p>
            </div>
          </div>

          <div className=" flex flex-col items-center justify-center space-y-5 ">
            <Link
              href="/Products"
              className="border-2 text-center bg-skin-primary border-skin-primary text-white py-1 w-[40%] rounded-lg "
            >
              {t("footer.ALLProducts")}
            </Link>
            <Link
              href="/Stores"
              className="border-2 text-center border-skin-primary text-white py-1 w-[40%] rounded-lg"
            >
              {t("footer.ALLStores")}
            </Link>
          </div>

          <div className="text-white flex justify-center space-x-7 items-center text-center">
            {/* <h2 className="mb-3 text-skin-primary">Menu</h2> */}
            <ul className="text-xl">
              <li className="mb-2 text-base ">
                {/* <p>{`Damascus , Syria`}</p> */}
                <p>{t("footer.syria")}</p>
              </li>
              <li className="mb-2">
                <Link href={`https://sellers.tawasyme.com/advertise-with-us`} target="_blank" className="hover:text-skin-primary text-base" >{t("footer.Advertise")}</Link>
              </li>
              <li className="mb-2">
                <Link href="mailto:sales@tawasyme.com" legacyBehavior>
                  <a
                    target="_blank"
                    className="hover:text-skin-primary sm:text-base text-sm"
                  >
                    sales@tawasyme.com
                  </a>
                </Link>
              </li>
              <div className="mt-4">
                <ul className="flex justify-center">
                  <li className="mr-2">
                    <Link href="https://t.me/tawasyshopping" legacyBehavior>
                      <a target="_blank">
                        <FaTelegram className="w-[20px] h-[20px] hover:text-skin-primary" />
                      </a>
                    </Link>
                  </li>
                  <li className="mr-2">
                    <Link href="tel:+963987000888" legacyBehavior>
                      <a target="_blank">
                        <BsFillTelephoneFill className="w-[20px] h-[20px] hover:text-skin-primary" />
                      </a>
                    </Link>
                  </li>
                  <li className="mr-2">
                    <Link
                      href="https://www.facebook.com/tawasyshop"
                      legacyBehavior
                    >
                      <a target="_blank">
                        <BsFacebook className="w-[20px] h-[20px] hover:text-skin-primary" />
                      </a>
                    </Link>
                  </li>
                  <li className="mr-2">
                    <Link
                      href="https://www.instagram.com/tawasyshopping/"
                      legacyBehavior
                    >
                      <a target="_blank">
                        <BsInstagram className="w-[20px] h-[20px] hover:text-skin-primary" />
                      </a>
                    </Link>
                  </li>
                  <li className="mr-2">
                    <Link href="https://wa.me/+963987000888" legacyBehavior>
                      <a target="_blank">
                        <BsWhatsapp className="w-[20px] h-[20px] hover:text-skin-primary" />
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </ul>
            <div className="grid  grid-cols-1 gap-4 text-white text-center p-4 ">
              {/* <Link href= "#" > */}
              <Link href="/" className="hover:text-skin-primary">
                {t("footer.home")}
                {/* {`Home Page`} */}
              </Link>
              {/* </Link> */}

              <div className="flex justify-center">
                <Link href="/AboutUs" className="hover:text-skin-primary">
                  {t("footer.aboutUs")}
                </Link>
              </div>

              <div>
                <Link href="/ContactUs" className="hover:text-skin-primary">
                  {t("footer.contactUS")}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div>
          {/* <hr /> */}
          <div className="flex md:flex-row flex-col  justify-center items-center gap-11 pb-3 text-center text-gray-400">
            <div className="flex justify-start items-center">
              {/* {`Copyrights reserved for Tawasy.`} */}
              {t("footer.copyrights")}
              <MdCopyright />
            </div>
            <div className="flex justify-start items-center space-x-1">
              <p className="px-2" >{t("footer.developed")}</p>
              <Link href={"https://deskindamas.com/"} legacyBehavior>
                <a
                  target="_blank"
                  className="text-base text-skin-primary w-max border-b-2 border-transparent hover:border-skin-primary transition-all duration-500"
                >
                  desk in Damas
                </a>
              </Link>
            </div>
            <div className="">
              <Link
                href="/PrivacyPolicy"
                target="_blank"
                className=" border-b-2 border-transparent hover:text-skin-primary hover:border-skin-primary transition-all duration-500"
              >
                {/* {`Privacy Policy`} */}
                {t("footer.privacy")}
              </Link>
            </div>
            <div className="">
              <Link
                href="/TermsAndConditions"
                target="_blank"
                className=" border-b-2 border-transparent hover:text-skin-primary hover:border-skin-primary transition-all duration-500"
              >
                {/* {`Terms and Conditions`} */}
                {t("footer.terms")}
              </Link>
            </div>
            <div className="">
              <Link
                href="/TradeMarksPolicy"
                target="_blank"
                className=" border-b-2 border-transparent hover:text-skin-primary hover:border-skin-primary transition-all duration-500"
              >
                {/* {`Terms and Conditions`} */}
                {t("tradeMark.title")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;

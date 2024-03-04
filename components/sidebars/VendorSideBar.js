import { useState } from "react";
import Link from "next/link";
import Logo from "@/public/images/tawasylogowhite.png";
import ProfileLogo from "../../public/images/profile-removebg-preview.png";
import Image from "next/image";
import { Accordion, AccordionItem } from "@nextui-org/react";
import {
  AiOutlineCloseCircle,
  AiOutlineCarryOut,
  AiTwotoneEye,
} from "react-icons/ai";
import { FiChevronDown, FiChevronRight, FiSettings } from "react-icons/fi";
import { BsCartCheckFill, BsBox, BsColumns } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { VscArchive } from "react-icons/vsc";
import { MdPendingActions, MdOutlineDisabledVisible, MdDataset, MdRequestPage, MdRequestQuote } from "react-icons/md";
import { useRouter } from "next/router";
import { IoSettingsSharp, IoStorefrontSharp } from "react-icons/io5";
import Cookies from "js-cookie";
import LocaleSwitcher from "../UI/localeSwitcher/localeSwitcher";
import { useTranslation } from "next-i18next";
import { LuClipboardCopy, LuClipboardEdit } from "react-icons/lu";

export default function VendorSidebar(props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("");

  function logOut() {
    Cookies.remove("AT");
    Cookies.remove("user");
    Cookies.remove("vendorSelectedProducts");
    router.replace("/vendor/login");
  }

  return (
    <div className={`w-max h-max  `}>
      <div
        style={{ position: "fixed", overflow: "auto" }}
        className={`top-0 bottom-0 left-0 w-[20%]  bg-[#ff6600] shadow duration-300 pl-2`}
      >
        <div className="space-y-3">
          <div className=" flex justify-center">
            <Image src={Logo} className="items-center pt-6 pb-3 md:w-44 w-10" />
          </div>

          {/* <LocaleSwitcher /> */}
          <div className="flex-1 pt-16">
            <ul className="pt-2 pb-4 space-y-1 text-lg font-normal">
              <li className="rounded-sm pb-3">
                <Link
                  href="/vendor"
                  className="flex items-center pl-2 space-x-3 rounded-md text-gray-100"
                >
                  <BsColumns className="block text-[20px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    {t("seller.sidebar.dashbaord")}
                  </p>
                </Link>
              </li>

              <Accordion showDivider={false} className="w-full" >
                <AccordionItem
                  startContent={
                    <BsBox
                      style={{
                        marginRight: "30px",
                        width: "25px",
                        height: "25px",
                      }}
                    />
                  }
                  itemScope = {true}
                  className={`text-zinc-100 outline-none mb-4`}
                  key="2"
                  aria-label="Products"
                  title={t("seller.sidebar.products")}
                  indicator={({ isOpen }) =>
                    isOpen ? (
                      <FiChevronDown className={`text-zinc-100`} />
                    ) : (
                      <FiChevronRight className={`text-zinc-100`} />
                    )
                  }
                >
                  <ul>
                    <li className={`pt-3`}>
                      <button
                        className="flex items-center justify-start p-2 space-x-3 rounded-md text-gray-100"
                        onClick={() => {
                          router.push({
                            pathname: "/vendor/generalProducts",
                          });
                        }}
                      >
                        <MdDataset className="block text-[23px] text-white mt-1" />
                        <p className="hidden md:block">
                          General Products
                        </p>
                      </button>
                    </li>

                    <li className={`pt-3`}>
                      <button
                        className="flex items-center p-2 space-x-4 rounded-md text-gray-100"
                        onClick={() => {
                          router.push({
                            pathname: "/vendor/myProducts",
                          });
                        }}
                      >
                        <BsBox className="block text-[19px] text-white " />
                        <p className="hidden md:block">
                          My Products
                        </p>
                      </button>
                    </li>

                    <li className={`pt-3`}>
                      <Link
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={'/vendor/productsManagment'}
                      >
                        <LuClipboardEdit className="block text-[20px] text-white " />
                        <p className="hidden md:block">{t("productManagment")}</p>
                      </Link>
                    </li>

                    <li className={`pt-3`}>
                      <button
                        className="flex items-center p-2 space-x-4 rounded-md text-gray-100"
                        onClick={() => {
                          router.push({
                            pathname: "/vendor/productsPricing",
                          });
                        }}
                      >
                        <VscArchive className="block text-[19px] text-white " />
                        <p className="hidden md:block">
                          Requested Products
                        </p>
                      </button>
                    </li>
                  </ul>
                </AccordionItem>
              </Accordion>

              <li className="rounded-sm pb-3">
                <Link
                  href="/vendor/followers"
                  className="flex items-center pl-2 space-x-3 pt-2 rounded-md text-gray-100"
                >
                  <IoStorefrontSharp className="block text-[20px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    Followers
                  </p>
                </Link>
              </li>

              <li className="rounded-sm pb-3">
                <Link
                  href="/vendor/sellersOrders"
                  className="flex items-center pl-2 space-x-3 pt-2 rounded-md text-gray-100"
                >
                  <LuClipboardCopy className="block text-[20px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    Sellers Order Requests
                  </p>
                </Link>
              </li>

              <li className="rounded-sm pb-3">
                <button
                  className="flex items-center pl-2 pt-3 space-x-3 rounded-md text-gray-100"
                  onClick={logOut}
                >
                  <CiLogout className="block text-[20px] text-white" />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    {t("seller.sidebar.logout")}
                  </p>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

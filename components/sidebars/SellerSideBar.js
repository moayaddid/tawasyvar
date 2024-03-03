import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "../../public/images/tawasylogowhite.png";
import ProfileLogo from "../../public/images/profile-removebg-preview.png";
import Image from "next/image";
import { Accordion, AccordionItem } from "@nextui-org/react";
import {
  AiOutlineCloseCircle,
  AiOutlineCarryOut,
  AiTwotoneEye,
} from "react-icons/ai";
import { LuClipboardCopy, LuClipboardEdit } from "react-icons/lu";
import { FiChevronDown, FiChevronRight, FiSettings } from "react-icons/fi";
import { BsCartCheckFill, BsBox, BsColumns } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import {
  MdPendingActions,
  MdOutlineDisabledVisible,
  MdOutlineManageAccounts,
} from "react-icons/md";
import { useRouter } from "next/router";
import { IoSettingsSharp, IoStorefrontSharp } from "react-icons/io5";
import Cookies from "js-cookie";
import LocaleSwitcher from "../UI/localeSwitcher/localeSwitcher";
import { useTranslation } from "next-i18next";
import { FaRegHandshake, FaUserFriends } from "react-icons/fa";
import { VscArchive } from "react-icons/vsc";

export default function Sidebar(props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("");
  const [name, setName] = useState();

  function logOut() {
    Cookies.remove("AT");
    Cookies.remove("user");
    Cookies.remove("SName");
    router.replace("/login");
  }

  useEffect(() => {
    if (Cookies?.get("SName")) {
      setName(Cookies.get("SName"));
    }
  }, [Cookies]);

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
          <div className="   hidden w-full px-3 md:flex md:flex-col justify-start items-start text-center text-white">
            <p className="text-xl">{t("welcome")} :</p>
            <p className="text-2xl w-full text-start px-4 line-clamp-3 ">
              {name ?? ` - `}
            </p>
          </div>
          <LocaleSwitcher />
          <div className="flex-1">
            <ul className="pt-2 pb-4 space-y-1 text-lg font-normal">
              <li className="rounded-sm pb-3">
                <Link
                  href="/seller"
                  className="flex items-center pl-2 space-x-3 rounded-md text-gray-100"
                >
                  <BsColumns className="block text-[20px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    {t("seller.sidebar.dashbaord")}
                  </p>
                </Link>
              </li>

              <Accordion showDivider={false} className="w-full">
                <AccordionItem
                  startContent={
                    <BsCartCheckFill
                      style={{
                        marginRight: "30px",
                        width: "25px",
                        height: "25px",
                      }}
                    />
                  }
                  className={`text-zinc-100 outline-none mb-1 mt-2 w-full text-lg text-left `}
                  key="1"
                  title={t("seller.sidebar.orders")}
                  indicator={({ isOpen }) =>
                    isOpen ? (
                      <FiChevronDown className={`stroke-orange-50`} />
                    ) : (
                      <FiChevronRight />
                    )
                  }
                >
                  <ul>
                    <li className={`pt-3`}>
                      <button
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        onClick={() => {
                          router.push({
                            pathname: "/seller/orders",
                            query: { type: "pendingOrders" },
                          });
                        }}
                      >
                        <MdPendingActions className="block text-[20px] text-white " />
                        <p className="hidden md:block">
                          {t("seller.sidebar.order.pending")}
                        </p>
                      </button>
                    </li>

                    <li className={`pt-3`}>
                      <button
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        onClick={() => {
                          router.push({
                            pathname: "/seller/orders",
                            query: { type: "rejectedOrders" },
                          });
                        }}
                      >
                        <AiOutlineCloseCircle className="block text-[20px] text-white " />
                        <p className="hidden md:block">
                          {t("seller.sidebar.order.rejected")}
                        </p>
                      </button>
                    </li>
                    <li className={`pt-3`}>
                      <button
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        onClick={() => {
                          router.push({
                            pathname: "/seller/orders",
                            query: { type: "acceptedOrders" },
                          });
                        }}
                      >
                        <AiOutlineCarryOut className="block text-[20px] text-white " />
                        <p className="hidden md:block">
                          {t("seller.sidebar.order.accepted")}
                        </p>
                      </button>
                    </li>
                    <li className={`pt-3`}>
                      <button
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        onClick={() => {
                          router.push({
                            pathname: "/seller/orders",
                            query: { type: "allOrders" },
                          });
                        }}
                      >
                        <BsBox className="block text-[20px] text-white " />
                        <p className="hidden md:block">
                          {t("seller.sidebar.order.all")}
                        </p>
                      </button>
                    </li>
                  </ul>
                </AccordionItem>

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
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        onClick={() => {
                          router.push({
                            pathname: "/seller/products",
                            query: { type: "disabledProducts" },
                          });
                        }}
                      >
                        <MdOutlineDisabledVisible className="block text-[20px] text-white " />
                        <p className="hidden md:block">
                          {t("seller.sidebar.product.unpublished")}
                        </p>
                      </button>
                    </li>
                    <li className={`pt-3`}>
                      <button
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        onClick={() => {
                          router.push({
                            pathname: "/seller/products",
                            query: { type: "activeProducts" },
                          });
                        }}
                      >
                        <AiTwotoneEye className="block text-[20px] text-white " />
                        <p className="hidden md:block">
                          {t("seller.sidebar.product.published")}
                        </p>
                      </button>
                    </li>

                    <li className={`pt-3`}>
                      <button
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        onClick={() => {
                          router.push({
                            pathname: "/seller/products/addProducts",
                            query: { type: "allProducts" },
                          });
                        }}
                      >
                        <IoMdAdd className="block text-[20px] text-white mt-1" />
                        <p className="hidden md:block">
                          {t("seller.sidebar.product.add")}
                        </p>
                      </button>
                    </li>

                    <li className={`pt-3`}>
                      <Link
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={"/seller/products/productsManagment"}
                      >
                        <LuClipboardEdit className="block text-[20px] text-white " />
                        <p className="hidden md:block">
                          {t("productManagment")}
                        </p>
                      </Link>
                    </li>

                    <li className={`pt-3`}>
                      <button
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        onClick={() => {
                          router.push({
                            pathname: "/seller/products",
                            query: { type: "allProducts" },
                          });
                        }}
                      >
                        <BsBox className="block text-[20px] text-white " />
                        <p className="hidden md:block">
                          {t("seller.sidebar.product.all")}
                        </p>
                      </button>
                    </li>
                  </ul>
                </AccordionItem>

                <AccordionItem
                  startContent={
                    <FaRegHandshake
                      style={{
                        marginRight: "30px",
                        width: "25px",
                        height: "25px",
                      }}
                    />
                  }
                  className={`text-zinc-100 outline-none mb-3`}
                  key="3"
                  aria-label="vendors"
                  title={t("vendors")}
                  indicator={({ isOpen }) =>
                    isOpen ? (
                      <FiChevronDown className={`text-zinc-100`} />
                    ) : (
                      <FiChevronRight className={`text-zinc-100`} />
                    )
                  }
                >
                  <ul>
                    <li className={``}>
                      <Link
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={"/seller/Vendors"}
                      >
                        <FaUserFriends className="block text-[23px] text-white " />
                        <p className="hidden md:block">{t("allVendors")}</p>
                      </Link>
                    </li>
                    <li className={`pt-3`}>
                      <Link
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={"/seller/Vendors/Orders"}
                      >
                        <LuClipboardCopy className="block text-[22px] text-white " />
                        <p className="hidden md:block">{t("myVendorOrders")}</p>
                      </Link>
                    </li>
                  </ul>
                </AccordionItem>
              </Accordion>

              <li className="rounded-sm pb-3">
                <Link
                  href="/seller/store"
                  className="flex items-center pl-2 space-x-3 pt-2 rounded-md text-gray-100"
                >
                  <IoStorefrontSharp className="block text-[20px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    {t("seller.sidebar.store")}
                  </p>
                </Link>
              </li>

              <li className="rounded-sm pb-3">
                <Link
                  href="/seller/Setting"
                  className="flex items-center pl-2 space-x-3 pt-4 rounded-md text-gray-100"
                >
                  <IoSettingsSharp className="block text-[20px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    {t("seller.sidebar.settings")}
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

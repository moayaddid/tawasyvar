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
  MdOutlineLocalOffer,
  MdClose,
} from "react-icons/md";
import { useRouter } from "next/router";
import { IoSettingsSharp, IoStorefrontSharp } from "react-icons/io5";
import Cookies from "js-cookie";
import LocaleSwitcher from "../UI/localeSwitcher/localeSwitcher";
import { useTranslation } from "next-i18next";
import { FaRegHandshake, FaUserFriends, FaUsers } from "react-icons/fa";
import { VscArchive } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { BiPlus, BiSolidStore } from "react-icons/bi";
import createAxiosInstance from "@/API";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import TawasyLoader from "../UI/tawasyLoader";
import { getCookiesSeller } from "@/Store/sellerAuthSlice";

export default function Sidebar(props) {
  const sellerName = useSelector((state) => state.SAS.sellerName);
  const storeName = useSelector((state) => state.SAS.storeName);
  const sellerRole = useSelector((state) => state.SAS.role);
  const storeSlug = useSelector((state) => state.SAS.slug);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState();
  const [selectedRole, setSelectedRole] = useState();
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const { t } = useTranslation("");
  const [sellerStores, setSellerStores] = useState();
  const [slug, setSlug] = useState();
  // const [name, setName] = useState();
  // const [STname , setSTname] = useState();

  useEffect(() => {
    if (storeSlug) {
      if (router.isReady) {
        if (router.locale == "ar") {
          setSlug(`/ar/Stores/${encodeURIComponent(storeSlug)}`);
        } else {
          setSlug(`/Stores/${storeSlug}`);
        }
      }
    }
  }, [storeSlug]);

  useEffect(() => {
    dispatch(getCookiesSeller());
  }, [dispatch]);

  function logOut() {
    Cookies.remove("AT");
    Cookies.remove("user");
    Cookies.remove("SName");
    router.replace("/login");
  }

  // useEffect(() => {
  //   if (Cookies?.get("SName")) {
  //     setName(Cookies.get("SName"));
  //   }
  //   if(Cookies?.get("STName")){
  //     setSTname(Cookies.get("STName"))
  //   }
  // }, [Cookies]);

  async function openChangeStore() {
    setOpen(true);
    setIsLoading(true);
    try {
      const response = await Api.get(`/api/seller/get-seller-stores`);
      setSellerStores(response.data.stores);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  function closeChangeStore() {
    setSelectedRole();
    setSelectedStore();
    setSellerStores();
    setOpen(false);
  }

  return (
    <div className={`w-max h-screen`}>
      <div
        style={{ position: "fixed", overflow: "auto" }}
        className={`top-0 bottom-0 left-0 w-[20%]  bg-[#ff6600] shadow duration-300 pl-2`}
      >
        <div className="space-y-3">
          <div className=" flex justify-center">
            <Image
              src={Logo}
              className="items-center pt-6 pb-3 md:w-44 w-10"
              alt=""
            />
          </div>
          <div className="hidden w-full px-3 md:flex md:flex-col justify-start items-start text-center text-white">
            <p className="text-xl">{t("welcome")} :</p>
            <p className="text-2xl w-full text-start px-4 line-clamp-3 ">
              {sellerName ?? ` - `} {`( ${storeName ?? " - "} )`}
            </p>
          </div>
          <button
            onClick={openChangeStore}
            className=" w-full text-center text-white pt-5 border-b-2 border-transparent hover:border-white transition-all duration-300 ease-in-out"
          >
            {t("seller.employees.changeStore")}
          </button>
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
                  className={`text-zinc-100 outline-none mt-2 w-full text-lg text-left `}
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
                      <Link
                        href={`/seller/orders?type=pendingOrders`}
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        // onClick={() => {
                        //   router.push({
                        //     pathname: "/seller/orders",
                        //     query: { type: "pendingOrders" },
                        //   });
                        // }}
                      >
                        <MdPendingActions className="block text-[20px] text-white " />
                        <p className="hidden md:block">
                          {t("seller.sidebar.order.pending")}
                        </p>
                      </Link>
                    </li>

                    <li className={`pt-3`}>
                      <Link
                        href={`/seller/orders?type=rejectedOrders`}
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        // onClick={() => {
                        //   router.push({
                        //     pathname: "/seller/orders",
                        //     query: { type: "rejectedOrders" },
                        //   });
                        // }}
                      >
                        <AiOutlineCloseCircle className="block text-[20px] text-white " />
                        <p className="hidden md:block">
                          {t("seller.sidebar.order.rejected")}
                        </p>
                      </Link>
                    </li>
                    <li className={`pt-3`}>
                      <Link
                        href={`/seller/orders?type=acceptedOrders`}
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        // onClick={() => {
                        //   router.push({
                        //     pathname: "/seller/orders",
                        //     query: { type: "acceptedOrders" },
                        //   });
                        // }}
                      >
                        <AiOutlineCarryOut className="block text-[20px] text-white " />
                        <p className="hidden md:block">
                          {t("seller.sidebar.order.accepted")}
                        </p>
                      </Link>
                    </li>
                    <li className={`pt-3`}>
                      <Link
                        href={`/seller/orders?type=allOrders`}
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        // onClick={() => {
                        //   router.push({
                        //     pathname: "/seller/orders",
                        //     query: { type: "allOrders" },
                        //   });
                        // }}
                      >
                        <BsBox className="block text-[20px] text-white " />
                        <p className="hidden md:block">
                          {t("seller.sidebar.order.all")}
                        </p>
                      </Link>
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
                  className={`text-zinc-100 outline-none `}
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
                      <Link
                        href={`/seller/products?type=disabledProducts`}
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        // onClick={() => {
                        //   router.push({
                        //     pathname: "/seller/products",
                        //     query: { type: "disabledProducts" },
                        //   });
                        // }}
                      >
                        <MdOutlineDisabledVisible className="block text-[20px] text-white " />
                        <p className="hidden md:block">
                          {t("seller.sidebar.product.unpublished")}
                        </p>
                      </Link>
                    </li>
                    <li className={`pt-3`}>
                      <Link
                        href={`/seller/products?type=activeProducts`}
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        // onClick={() => {
                        //   router.push({
                        //     pathname: "/seller/products",
                        //     query: { type: "activeProducts" },
                        //   });
                        // }}
                      >
                        <AiTwotoneEye className="block text-[20px] text-white " />
                        <p className="hidden md:block">
                          {t("seller.sidebar.product.published")}
                        </p>
                      </Link>
                    </li>

                    <li className={`pt-3`}>
                      <Link
                        href={`/seller/products/addProducts`}
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        // onClick={() => {
                        //   router.push({
                        //     pathname: "/seller/products/addProducts",
                        //     query: { type: "allProducts" },
                        //   });
                        // }}
                      >
                        <IoMdAdd className="block text-[20px] text-white mt-1" />
                        <p className="hidden md:block">
                          {t("seller.sidebar.product.add")}
                        </p>
                      </Link>
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
                      <Link
                        href={`/seller/products?type=allProducts`}
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
                      </Link>
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
                  href="/seller/promotions"
                  className="flex items-center pl-2 space-x-3 pt-2 rounded-md text-gray-100"
                >
                  <MdOutlineLocalOffer className="block text-[20px] font-bold text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    {t("promotions")}
                  </p>
                </Link>
              </li>

              {slug && (
                <li className="rounded-sm pb-3">
                  <Link
                    href={slug}
                    target="_blank"
                    className="flex items-center pl-2 space-x-3 pt-2 rounded-md text-gray-100"
                  >
                    <IoStorefrontSharp className="block text-[20px] text-white " />
                    <p
                      className="hidden md:block"
                      style={{ marginLeft: "43px" }}
                    >
                      {t("seller.sidebar.store")}
                    </p>
                  </Link>
                </li>
              )}

              {sellerRole && sellerRole == "super" && (
                <li className="rounded-sm pb-3">
                  <Link
                    href="/seller/employees"
                    className="flex items-center pl-2 space-x-3 pt-4 rounded-md text-gray-100"
                  >
                    <FaUsers className="block text-[20px] text-white " />
                    <p
                      className="hidden md:block"
                      style={{ marginLeft: "43px" }}
                    >
                      {t("seller.employees.myEmployees")}
                    </p>
                  </Link>
                </li>
              )}

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

              {/* <li className="rounded-sm pb-3">
                <Link
                  href={`/seller/newStore`}
                  className="flex items-center pl-2 pt-3 space-x-3 rounded-md text-gray-100"
                >
                  <BiSolidStore className="block text-[20px] text-white" />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    {t("seller.employees.createNewStore")}
                  </p>
                </Link>
              </li> */}

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

      <Dialog
        open={open}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        maxWidth="lg"
        fullWidth
        onClose={closeChangeStore}
      >
        <DialogTitle className="w-full flex justify-between items-center">
          <p>{t("seller.employees.changeStore")} :</p>
          <MdClose
            className="w-[20px] h-[20px] text-black hover:text-red-500 border-b-2 border-transparent hover:border-red-500"
            onClick={closeChangeStore}
          />
        </DialogTitle>
        <DialogContent>
          {isLoading == true ? (
            <div className="w-full h-full flex justify-center items-center">
              <TawasyLoader width={200} height={300} />
            </div>
          ) : sellerStores && sellerStores?.length < 1 ? (
            <p className="text-center">You have No Stores.</p>
          ) : (
            <div className="w-full flex flex-wrap justify-center items-center  ">
              {sellerStores?.map((store, i) => {
                return (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedStore(store.store_id);
                      setSelectedRole(store.role);
                    }}
                    className={`flex flex-col justify-around cursor-pointer items-center m-1 w-[25%] border-2 rounded-lg hover:border-skin-primary transition-all duration-500 ease-in-out ${
                      selectedStore == store.store_id
                        ? `border-skin-primary`
                        : `border-zinc-500 `
                    } `}
                  >
                    <div className="w-[40%] mx-auto h-auto">
                      <Image
                        src={store.store_logo ?? Logo}
                        alt={store.store_name ?? ""}
                        width={0}
                        height={0}
                        className="object-contain w-full h-auto"
                      />
                    </div>
                    <p>{store.store_name}</p>
                    <p>
                      {store.role == `super`
                        ? router.locale == "ar"
                          ? `( مالك المتجر ) `
                          : `( Owner ) `
                        : router.locale == "ar"
                        ? `( موظف )`
                        : `( Employee )`}
                    </p>
                  </div>
                );
              })}
              <Link
                href={`/seller/newStore`}
                className={`flex flex-col justify-around cursor-pointer items-center m-1 w-[25%] h-full border-2 rounded-lg hover:border-skin-primary transition-all duration-500 ease-in-out`}
              >
                <div className="w-full flex justify-center items-center mx-auto h-auto text-skin-primary ">
                  <BiPlus className="w-[15%] h-auto" />
                </div>
                <p>{t("seller.employees.createNewStore")}</p>
              </Link>
            </div>
          )}
        </DialogContent>
        {sellerStores && (
          <DialogActions className="w-full flex justify-center items-center">
            <button
              className="bg-skin-primary rounded-lg px-2 py-3 text-white disabled:bg-gray-500 disabled:cursor-not-allowed "
              disabled={!selectedStore}
              onClick={() => {
                Cookies.remove("Sid");
                Cookies.set("Sid", selectedStore, { expires: 365 * 10 });
                Cookies.remove("role");
                Cookies.set("role", selectedRole, { expires: 365 * 10 });
                router.reload();
                closeChangeStore();
              }}
            >
              {t("seller.employees.confirm")}
            </button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "../../public/images/tawasylogowhite.png";
import Image from "next/image";
import { Accordion, AccordionItem } from "@nextui-org/react";
import {
  AiOutlineCloseCircle,
  AiOutlineCarryOut,
  AiTwotoneEye,
  AiOutlineUser,
} from "react-icons/ai";
import { FaCompressArrowsAlt } from "react-icons/fa";
import { FaCompressAlt } from "react-icons/fa";
import { SiAdminer, SiSellfy } from "react-icons/si";
import { FiChevronDown, FiChevronRight, FiSettings } from "react-icons/fi";
import { BsCartCheckFill, BsBox, BsColumns } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import {
  MdPendingActions,
  MdOutlineDisabledVisible,
  MdOutlineManageAccounts,
  MdOutlineLocalOffer,
} from "react-icons/md";
import { useRouter } from "next/router";
import {
  TbArrowsSort,
  TbBrandShopee,
  TbCategory2,
  TbGitBranch,
  TbTruckDelivery,
} from "react-icons/tb";
import { RiCoupon2Line } from "react-icons/ri";
import { FaStore } from "react-icons/fa";
import Cookies from "js-cookie";
import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import { IoMdGitNetwork } from "react-icons/io";
import { FaRegHandshake } from "react-icons/fa6";
import { VscArchive } from "react-icons/vsc";

export default function SidebarAdmin(props) {
  const [open, setOpen] = useState(false);
  const [logginOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [name, setName] = useState("");

  async function logOut() {
    try {
      setLoggingOut(true);
      const response = await Api.get(`/api/admin/logout`);
      Cookies.remove("AT");
      Cookies.remove("user");
      router.replace("/admin/securelogin");
      setLoggingOut(false);
    } catch (error) {
      setLoggingOut(false);
    }
    setLoggingOut(false);
  }

  useEffect(() => {
    if (Cookies) {
      const name = Cookies.get("AName");
      if (name) {
        setName(name);
      }
    }
  }, [Cookies]);

  return (
    <div className="w-full h-screen ">
      <div
        style={{ position: "fixed" }}
        className={`top-0 overflow-y-auto overflow-x-hidden left-0 w-[20%] h-screen  bg-[#ff6600] shadow duration-300 `}
      >
        <div className="space-y-3">
          <div className=" flex justify-center">
            <Image src={Logo} className="items-center pt-6 pb-3 md:w-44 w-10" />
          </div>
          <p className="text-2xl text-white underline decoration-2 text-center ">
            {name}
          </p>
          <div className="flex-1">
            <ul className="pt-5 pb-4 space-y-1 text-lg font-normal">
              <li className="rounded-sm pb-3">
                <Link
                  href="/admin/Dashboard"
                  className="flex items-center pl-2 space-x-3 rounded-md text-gray-100"
                >
                  <BsColumns className="block text-[20px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    Dashboard
                  </p>
                </Link>
              </li>

              <label
                htmlFor="customerbreaker"
                className="text-white w-max mx-auto"
              >
                Customers & Orders
              </label>
              <hr id="customerbreaker"></hr>

              <li className="rounded-sm">
                <Link
                  href="/admin/Customers"
                  className="flex items-center pl-1 space-x-3 pt-2 pb-1 rounded-md text-gray-100"
                >
                  <AiOutlineUser className="block text-[25px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    Customers
                  </p>
                </Link>
              </li>

              <Accordion className="w-full">
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
                  title="Orders"
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
                        href={"/admin/Orders/CancelledOrders"}
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                      >
                        <AiOutlineCloseCircle className="block text-[20px] text-white " />
                        <p className="hidden md:block"> Cancelled Orders</p>
                      </Link>
                    </li>
                    <li className={`pt-3`}>
                      <Link
                        href={`/admin/Orders/PendingOrders`}
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                      >
                        <MdPendingActions className="block text-[20px] text-white " />
                        <p className="hidden md:block"> Pending Orders</p>
                      </Link>
                    </li>

                    <li className={`pt-3`}>
                      <Link
                        href={`/admin/Orders/RejectedOrders`}
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                      >
                        <AiOutlineCloseCircle className="block text-[20px] text-white " />
                        <p className="hidden md:block">Declined Orders</p>
                      </Link>
                    </li>
                    <li className={`pt-3`}>
                      <Link
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={`/admin/Orders/AcceptedOrders`}
                      >
                        <AiOutlineCarryOut className="block text-[20px] text-white " />
                        <p className="hidden md:block">Accepted Orders</p>
                      </Link>
                    </li>
                    <li className={`pt-3`}>
                      <Link
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={`/admin/Orders/AllOrders`}
                      >
                        <BsBox className="block text-[20px] text-white " />
                        <p className="hidden md:block">All Orders</p>
                      </Link>
                    </li>
                  </ul>
                </AccordionItem>
              </Accordion>

              <label
                htmlFor="productsbreaker"
                className="text-white w-max mx-auto"
              >
                Vendors
              </label>
              <hr id="vendorsbreaker"></hr>

              <Accordion showDivider={false} className="w-full">
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
                  key="9"
                  aria-label="vendors"
                  title="Vendors"
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
                        href={"/admin/Vendors"}
                      >
                        <MdOutlineManageAccounts className="block text-[25px] text-white " />
                        <p className="hidden md:block">Vendors Managment</p>
                      </Link>
                    </li>
                    <li className={`pt-3`}>
                      <Link
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={"/admin/Vendors/ProductsRequests"}
                      >
                        <VscArchive className="block text-[20px] text-white " />
                        <p className="hidden md:block">
                          Vendors Product Requests
                        </p>
                      </Link>
                    </li>
                  </ul>
                </AccordionItem>
              </Accordion>

              <label
                htmlFor="productsbreaker"
                className="text-white w-max mx-auto"
              >
                Products & related settings
              </label>
              <hr id="productsbreaker"></hr>

              <Accordion showDivider={false} className="w-full">
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
                  className={`text-zinc-100 outline-none mb-2`}
                  key="2"
                  aria-label="Products"
                  title="Products"
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
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={"/admin/Products/PendingProduct"}
                      >
                        <MdOutlineDisabledVisible className="block text-[20px] text-white " />
                        <p className="hidden md:block">Pending Products</p>
                      </Link>
                    </li>
                    <li className={`pt-3`}>
                      <Link
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={"/admin/Products/ShareProduct"}
                      >
                        <AiTwotoneEye className="block text-[20px] text-white " />
                        <p className="hidden md:block">Shared Products</p>
                      </Link>
                    </li>
                    <li className={`pt-3`}>
                      <Link
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={"/admin/Products/AllProducts"}
                      >
                        <BsBox className="block text-[20px] text-white " />
                        <p className="hidden md:block">All Products</p>
                      </Link>
                    </li>
                    <li className={`pt-3`}>
                      <Link
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={`/admin/Products/newStoreProducts`}
                      >
                        <BsBox className="block text-[20px] text-white " />
                        <p className="hidden md:block">New Store Products</p>
                      </Link>
                    </li>
                    <li className={`pt-3`}>
                      <Link
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={`/admin/Products/AttachableProducts`}
                      >
                        <FaCompressArrowsAlt className="block text-[20px] text-white " />
                        <p className="hidden md:block">Attachable Products</p>
                      </Link>
                    </li>
                    <li className={`pt-3`}>
                      <Link
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={`/admin/Products/AttachedProducts`}
                      >
                        <FaCompressAlt className="block text-[20px] text-white " />
                        <p className="hidden md:block">Attached Products</p>
                      </Link>
                    </li>
                  </ul>
                </AccordionItem>

                <AccordionItem
                  startContent={
                    <FaStore
                      style={{
                        marginRight: "30px",
                        width: "25px",
                        height: "25px",
                      }}
                    />
                  }
                  className={`text-zinc-100 outline-none mb-2`}
                  key="3"
                  aria-label="Stores"
                  title="Stores"
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
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={"/admin/Store/PendingStores"}
                      >
                        <MdOutlineDisabledVisible className="block text-[20px] text-white " />
                        <p className="hidden md:block">Pending Store</p>
                      </Link>
                    </li>
                    <li className={`pt-3`}>
                      <Link
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={"/admin/Store/ActiveStores"}
                      >
                        <AiTwotoneEye className="block text-[20px] text-white " />
                        <p className="hidden md:block">Active Store</p>
                      </Link>
                    </li>
                    <li className={`pt-3`}>
                      <Link
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={"/admin/Store/AllStore"}
                      >
                        <BsBox className="block text-[20px] text-white " />
                        <p className="hidden md:block">All Store</p>
                      </Link>
                    </li>
                  </ul>
                </AccordionItem>
              </Accordion>

              <li className="rounded-sm pb-3">
                <Link
                  href="/admin/products-sort"
                  className="flex items-center pl-2 space-x-3 pt-2 pb-1 rounded-md text-gray-100"
                >
                  <TbArrowsSort  className="block text-[25px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    Products Sort Order
                  </p>
                </Link>
              </li>

              <li className="rounded-sm pb-3">
                <Link
                  href="/admin/Promotions"
                  className="flex items-center pl-2 space-x-3 pt-2 pb-1 rounded-md text-gray-100"
                >
                  <MdOutlineLocalOffer className="block text-[25px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    Promotion Requests
                  </p>
                </Link>
              </li>

              <li className="rounded-sm pb-3">
                <Link
                  href="/admin/Variations"
                  className="flex items-center pl-2 space-x-3 pt-2 pb-1 rounded-md text-gray-100"
                >
                  <TbGitBranch className="block text-[25px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    Variations
                  </p>
                </Link>
              </li>

              <li className="rounded-sm pb-3">
                <Link
                  href="/admin/Options"
                  className="flex items-center pl-2 space-x-3 pt-2 pb-1 rounded-md text-gray-100"
                >
                  <IoMdGitNetwork className="block text-[25px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    Options
                  </p>
                </Link>
              </li>

              <li className="rounded-sm pb-3">
                <Link
                  href="/admin/Brands"
                  className="flex items-center pl-2 space-x-3 pt-2 pb-1 rounded-md text-gray-100"
                >
                  <TbBrandShopee className="block text-[25px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    Brands
                  </p>
                </Link>
              </li>

              <li className="rounded-sm pb-3">
                <Link
                  href="/admin/StoreTypes"
                  className="flex items-center pl-2 space-x-3 pt-2 pb-1 rounded-md text-gray-100"
                >
                  <FaStore className="block text-[25px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    Store Types
                  </p>
                </Link>
              </li>

              <li className="rounded-sm pb-3">
                <Link
                  href="/admin/Categories"
                  className="flex items-center pl-2 space-x-3 pt-2 pb-1 rounded-md text-gray-100"
                >
                  <TbCategory2 className="block text-[25px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    Categories
                  </p>
                </Link>
              </li>

              <li className="rounded-sm pb-3">
                <Link
                  href="/admin/Sellers"
                  className="flex items-center pl-2 space-x-3 pt-2 pb-1 rounded-md text-gray-100"
                >
                  <SiSellfy className="block text-[25px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    Sellers
                  </p>
                </Link>
              </li>

              <li className="rounded-sm pb-3">
                <Link
                  href="/admin/AdminDelivery"
                  className="flex items-center pl-2 space-x-3 pt-2 pb-1 rounded-md text-gray-100"
                >
                  <TbTruckDelivery className="block text-[25px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    Delivery
                  </p>
                </Link>
              </li>

              <label
                htmlFor="couponbreaker"
                className="text-white w-max mx-auto"
              >
                Others
              </label>
              <hr id="couponbreaker"></hr>

              <li className="rounded-sm pb-3">
                <Link
                  href="/admin/Coupons"
                  className="flex items-center pl-2 space-x-3 pt-2 pb-1 rounded-md text-gray-100"
                >
                  <RiCoupon2Line className="block text-[25px] text-white " />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    Coupons
                  </p>
                </Link>
              </li>

              <Accordion showDivider={false} className="w-full">
                <AccordionItem
                  startContent={
                    <SiAdminer
                      style={{
                        marginRight: "30px",
                        width: "25px",
                        height: "25px",
                      }}
                    />
                  }
                  className={`text-zinc-100 outline-none mb-3`}
                  key="4"
                  aria-label="ADS"
                  title="ADS"
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
                        href={"/admin/Ads/StoreTypeADS"}
                      >
                        <MdOutlineDisabledVisible className="block text-[20px] text-white " />
                        <p className="hidden md:block">Store Type ADS</p>
                      </Link>
                    </li>
                    <li className={`pt-3`}>
                      <Link
                        className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
                        href={"/admin/Ads/HomeADS"}
                      >
                        <AiTwotoneEye className="block text-[20px] text-white " />
                        <p className="hidden md:block">Home ADS</p>
                      </Link>
                    </li>
                  </ul>
                </AccordionItem>
              </Accordion>

              <hr></hr>

              <li className="rounded-sm pb-3">
                <button
                  className="flex items-center pl-2 pt-3 space-x-3 rounded-md text-gray-100"
                  onClick={logOut}
                >
                  <CiLogout className="block text-[25px] text-white" />
                  <p className="hidden md:block" style={{ marginLeft: "43px" }}>
                    Logout
                  </p>
                  {logginOut == true && (
                    <Ring size={20} lineWeight={5} speed={2} color="white" />
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* {props.children} */}
    </div>
  );
}

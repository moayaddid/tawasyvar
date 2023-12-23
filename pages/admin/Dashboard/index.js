import createAxiosInstance from "@/API";
import withLayoutAdmin from "@/components/UI/adminLayout";
import TawasyLoader from "@/components/UI/tawasyLoader";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BiSolidUserDetail } from "react-icons/bi";
import { BsBox, BsFillCartCheckFill } from "react-icons/bs";
import { FaStore } from "react-icons/fa";
import { FaUsersBetweenLines } from "react-icons/fa6";
import {
  MdOutlinePendingActions,
  MdOutlineStorefront,
  MdRestore,
} from "react-icons/md";
import { useQuery } from "react-query";

function AdminPage() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const { data: adminDashboard, isLoading } = useQuery(
    "adminDashboard",
    fetcAdminDashboard,
    { staleTime: 1, refetchOnMount: true, refetchOnWindowFocus: false }
  );

  async function fetcAdminDashboard() {
    try {
      return await Api.get(`/api/admin/dashboard`);
    } catch (error) {}
  }

  const icons = [
    {
      title: "Total Customers",
      icon: (
        <BiSolidUserDetail
          style={{ width: "25px", height: "25px", color: "#ff6600" }}
        />
      ),
    },
    {
      title: "Total Sellers",
      icon: (
        <FaUsersBetweenLines
          style={{ width: "25px", height: "25px", color: "#ff6600" }}
        />
      ),
    },
    {
      title: "Total Products",
      icon: (
        <BsBox style={{ width: "25px", height: "25px", color: "#ff6600" }} />
      ),
    },
    {
      title: "Total Stores",
      icon: (
        <FaStore style={{ width: "25px", height: "25px", color: "#ff6600" }} />
      ),
    },
    {
      title: "Total Store Types",
      icon: (
        <MdOutlineStorefront
          style={{ width: "25px", height: "25px", color: "#ff6600" }}
        />
      ),
    },
    {
      title: "Total Orders",
      icon: (
        <BsFillCartCheckFill
          style={{ width: "25px", height: "25px", color: "#ff6600" }}
        />
      ),
    },
    {
      title: "Pending Store Requests",
      icon: (
        <MdOutlinePendingActions
          style={{ width: "25px", height: "25px", color: "#ff6600" }}
        />
      ),
    },
    {
      title: "Pending  Requests",
      icon: (
        <MdRestore
          style={{ width: "25px", height: "25px", color: "#ff6600" }}
        />
      ),
    },
  ];

  if(isLoading){
    return <div className="w-full h-full" >
      <TawasyLoader width={400} height={400} />
    </div>
  }

  // if(adminDashboard){
  //   console.log(adminDashboard);
  // }

  return (
    <>
      { adminDashboard && <div className="md:px-10">
        <h1 className="py-6 text-2xl">Dashboard</h1>
        <div className="grid md:grid-cols-3 sm:grid-cols-1 grid-col-1 gap-4">
          <Link href='/admin/Customers' className="border-2 border-gray-400 py-4 px-5 rounded-md hover:border-skin-primary">
            <div className="flex justify-between pb-4">
              <div>
                <h2 className="text-xl">Total Customers</h2>
              </div>
              <div className="text-skin-primary w-[25px] h-[25px]">
                <BiSolidUserDetail
                  style={{ width: "25px", height: "25px", color: "#ff6600" }}
                />
              </div>
            </div>
            <div>
              <p >{adminDashboard.data.data.total_customers}</p>
            </div>
          </Link>

          <Link href='/admin/Sellers' className="border-2 border-gray-400 py-4 px-5 rounded-md hover:border-skin-primary">
            <div className="flex justify-between pb-4">
              <div>
                <h2 className="text-xl">Total Sellers</h2>
              </div>
              <div className="text-skin-primary w-[25px] h-[25px]">
                <FaUsersBetweenLines
                  style={{ width: "25px", height: "25px", color: "#ff6600" }}
                />
              </div>
            </div>
            <div>
              <p>{adminDashboard.data.data.total_sellers}</p>
            </div>
          </Link>

          <Link href='/admin/Products/AllProducts' className="border-2 border-gray-400 py-4 px-5 rounded-md hover:border-skin-primary">
            <div className="flex justify-between pb-4">
              <div>
                <h2 className="text-xl">Total Products</h2>
              </div>
              <div className="text-skin-primary w-[25px] h-[25px]">
                <BsBox
                  style={{ width: "25px", height: "25px", color: "#ff6600" }}
                />
              </div>
            </div>
            <div>
              <p>{adminDashboard.data.data.total_products}</p>
            </div>
          </Link>

          <Link href='/admin/StoreTypes' className="border-2 border-gray-400 py-4 px-5 rounded-md hover:border-skin-primary">
            <div className="flex justify-between pb-4">
              <div>
                <h2 className="text-xl">Total Store Types</h2>
              </div>
              <div className="text-skin-primary w-[25px] h-[25px]">
                <MdOutlineStorefront
                  style={{ width: "25px", height: "25px", color: "#ff6600" }}
                />
              </div>
            </div>
            <div>
              <p>{adminDashboard.data.data.total_store_types}</p>
            </div>
          </Link>

          <Link href='/admin/Orders/AllOrders' className="border-2 border-gray-400 py-4 px-5 rounded-md hover:border-skin-primary">
            <div className="flex justify-between pb-4">
              <div>
                <h2 className="text-xl">Total Orders</h2>
              </div>
              <div className="text-skin-primary w-[25px] h-[25px]">
                <BsFillCartCheckFill
                  style={{ width: "25px", height: "25px", color: "#ff6600" }}
                />
              </div>
            </div>
            <div>
              <p>{adminDashboard.data.data.total_orders}</p>
            </div>
          </Link>

          <Link href='/admin/Store/PendingStores' className="border-2 border-gray-400 py-4 px-5 rounded-md hover:border-skin-primary">
            <div className="flex justify-between pb-4">
              <div>
                <h2 className="text-xl">Pending Store Requests</h2>
              </div>
              <div className="text-skin-primary w-[25px] h-[25px]">
                <MdOutlinePendingActions
                  style={{ width: "25px", height: "25px", color: "#ff6600" }}
                />
              </div>
            </div>
            <div>
              <p>{adminDashboard.data.data.pending_store_requests}</p>
            </div>
          </Link>

          <Link href='/admin/Products/PendingProduct' className="border-2 border-gray-400 py-4 px-5 rounded-md hover:border-skin-primary">
            <div className="flex justify-between pb-4">
              <div>
                <h2 className="text-xl">Pending Product Requests</h2>
              </div>
              <div className="text-skin-primary w-[25px] h-[25px]">
                <MdRestore
                  style={{ width: "25px", height: "25px", color: "#ff6600" }}
                />
              </div>
            </div>
            <div>
              <p>{adminDashboard.data.data.pending_product_requests}</p>
            </div>
          </Link>

          <Link href='/admin/Store/AllStore' className="border-2 border-gray-400 py-4 px-5 rounded-md hover:border-skin-primary">
            <div className="flex justify-between pb-4">
              <div>
                <h2 className="text-xl">Total Stores</h2>
              </div>
              <div className="text-skin-primary w-[25px] h-[25px]">
                <MdOutlineStorefront
                  style={{ width: "25px", height: "25px", color: "#ff6600" }}
                />
              </div>
            </div>
            <div>
              <p>{adminDashboard.data.data.total_stores}</p>
            </div>
          </Link>

        </div>
      </div>}
    </>
  );
}

export default withLayoutAdmin(AdminPage);

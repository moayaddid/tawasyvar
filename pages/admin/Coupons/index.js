import React, { useState, useEffect, useRef } from "react";
import withLayoutAdmin from "@/components/UI/adminLayout";
import CouponsAdmin from "@/components/AdminCoupons/CouponsAdmin";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { Ring } from "@uiball/loaders";

const tableheading = [
  {
    heading: "Store Id",
  },
  {
    heading: "Code",
  },
  {
    heading: "Discount",
  },
  {
    heading: "Expire Date",
  },
  {
    heading: "Created At",
  },
  {
    heading: "Updated At",
  },
  {
    heading: "Action",
  },
];

function Coupons() {
  const [open, openchange] = useState(false);
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const Api = createAxiosInstance(router);
  const {
    data: coupons,
    isLoading,
    refetch,
  } = useQuery(`coupons`, fetchCoupons, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
  const codeRef = useRef();
  const discountRef = useRef();
  const dateRef = useRef();
  const storeIdRef = useRef();

  async function fetchCoupons() {
    return await Api.get(`/api/admin/coupons`);
  }

  const functionopenpopup = async () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={400} height={400} />
      </div>
    );
  }

  async function submitCoupon(e) {
    e.preventDefault();
    setIsAdding(true);
    let data = {};
    if (storeIdRef.current.value) {
      data = {
        code: codeRef.current.value,
        discount_value: discountRef.current.value,
        expire_date: dateRef.current.value,
        store_id: storeIdRef.current.value,
      };
    } else {
      data = {
        code: codeRef.current.value,
        discount_value: discountRef.current.value,
        expire_date: dateRef.current.value,
      };
    }
    try {
      const response = await Api.post(`/api/admin/coupon/create`, data);
      refetch();
      setIsAdding(false);
      openchange(false);
    } catch (error) {
      setIsAdding(false);
    }
    setIsAdding(false);
  }

  return (
    <div className="md:px-6">
      <div className="h-screen">
        <div className="m-5 p-5">
          <h2 className="text-2xl text-stone-500 pb-5 ">Coupons</h2>
          <div className="flex justify-end ">
            <div className="w-[50%] flex justify-end ">
              <button
                onClick={functionopenpopup}
                className="bg-skin-primary text-white py-1 px-3 rounded-md"
              >
                Add Coupons
              </button>
            </div>
          </div>
        </div>

        {coupons && (
          <div className="w-full h-[70%] overflow-x-auto ">
            {coupons.data && coupons.data.length > 0 ? (
              <table className="w-full overflow-x-auto table-auto">
                <thead className="">
                  <tr className="text-sm font-semibold text-center border-b-2 border-gray-400 uppercase">
                    <th>Id</th>
                    {tableheading.map((index) => (
                      <th className="px-4 " key={index.id}>
                        {index.heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-lg font-normal text-gray-700 text-center">
                  {coupons.data &&
                    coupons.data.map((coupon) => {
                      return (
                        <CouponsAdmin
                          names={coupon}
                          key={coupon.id}
                          refetch={() => {
                            refetch();
                          }}
                        />
                      );
                    })}
                </tbody>
              </table>
            ) : (
              <div className="w-max mx-auto"> There are no coupons. </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="md">
        <DialogTitle className=" border-b-2 border-gray-200">
          <h3 className="py-2 pl-3 text-gray-600">Create New Coupons</h3>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} margin={2}>
            <form onSubmit={submitCoupon}>
              <div className="md:grid md:grid-cols-2 sm:grid-cols-1 items-center">
                <div className="w-full px-4 py-3">
                  <input
                    type="text"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] w-full transition-all duration-700"
                    placeholder="Coupon Code"
                    inputMode="code"
                    ref={codeRef}
                    required
                  />
                </div>

                <div className="w-full px-4 py-3">
                  <input
                    type="number"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] w-full transition-all duration-700"
                    placeholder="Discount"
                    inputMode="discount"
                    ref={discountRef}
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    }}
                    required
                  />
                </div>

                <div className="w-full px-4 py-3">
                  <input
                    type="date"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500]  w-full transition-all duration-700"
                    placeholder="Expiration Date"
                    inputMode="expire_date"
                    ref={dateRef}
                    required
                  />
                </div>

                <div className="w-full px-4 py-3">
                  <input
                    type="text"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500]  w-full transition-all duration-700"
                    placeholder="Store ID / if not set the coupon will be for all the stores"
                    inputMode="store_id"
                    ref={storeIdRef}
                  />
                </div>
              </div>

              <div className="flex justify-start pt-6">
                {isAdding == true ? (
                  <div className="w-full flex justify-center">
                    <Ring size={20} speed={2} lineWeight={5} color="#ff6600" />
                  </div>
                ) : (
                  <button
                    className="bg-skin-primary rounded-md text-white px-8 py-2"
                    type="submit"
                  >
                    Add Coupons
                  </button>
                )}
              </div>
            </form>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withLayoutAdmin(Coupons);

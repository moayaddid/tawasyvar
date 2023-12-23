import createAxiosInstance from "@/API";
import withLayoutAdmin from "@/components/UI/adminLayout";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useQuery } from "react-query";

function AdminDelivery() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [savingMin, setSavingMin] = useState(false);
  const [savingKilo, setSavingKilo] = useState(false);
  const minDRef = useRef();
  const kiloDRef = useRef();
  const {
    data: pricing,
    isLoading,
    refetch,
  } = useQuery(`deliveryPricing`, fetchDeliveryPricing, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchDeliveryPricing() {
    try {
      return await Api.get(`/api/admin/showdeliveryprice`);
    } catch (error) {}
  }

  async function editMinimumDelivery(e) {
    // console.log(`asdasd`)
    e.preventDefault();
    setSavingMin(true);
    try {
      const response = await Api.post(`/api/admin/editdeliveryprice`, {
        key: "min_delivery_cost",
        value: minDRef.current.value,
      });
      refetch();
      setSavingMin(false);
    } catch (error) {
      setSavingMin(false);
    }
    setSavingMin(false);
  }

  async function editKilometerDelivery(e) {
    // console.log(`min`);
    e.preventDefault();
    setSavingKilo(true);
    try {
      const response = await Api.post(`/api/admin/editdeliveryprice`, {
        key: "price_per_kilometer",
        value: kiloDRef.current.value,
      });
      refetch();
      setSavingKilo(false);
    } catch (error) {
      setSavingKilo(false);
    }
    setSavingKilo(false);
  }

  // if (pricing) {
  //   // console.log(pricing);
  // }

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={400} height={400} />
      </div>
    );
  }

  return (
    <>
      <div className="py-10">
        <h1 className="bg-gray-100 text-center py-3 text-xl">Delivery</h1>
        <div className="flex flex-col justify-center items-center md:py-10">
          {pricing && (
            <div className=" w-[90%]">
              <form
                className="flex w-full gap-6 items-center py-4"
                onSubmit={editMinimumDelivery}
              >
                <label className="text-lg w-[20%]">Min Delivery Price :</label>
                <input
                  className="my-3 w-[60%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                  type="number"
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                  }}
                  placeholder={pricing.data.min_delivery_cost}
                  ref={minDRef}
                  required
                />
                <div className="w-[20%]">
                  <button
                    className="bg-skin-primary text-white px-6 py-1"
                    type="submit"
                  >
                    {savingMin == true ? (
                      <div className="w-full flex justify-center">
                        <Ring
                          size={25}
                          speed={2}
                          lineWeight={5}
                          color="white"
                        />
                      </div>
                    ) : (
                      `Save`
                    )}
                  </button>
                </div>
              </form>

              <form
                className="flex w-full gap-6 items-center py-2"
                onSubmit={editKilometerDelivery}
              >
                <label className="text-lg w-[20%]">Price Per Kilometer:</label>
                <input
                  className="my-3 w-[60%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                  type="number"
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                  }}
                  placeholder={pricing.data.price_per_kilometer}
                  ref={kiloDRef}
                  required
                />
                <div className="w-[20%]">
                  <button
                    className="bg-skin-primary text-white px-6 py-1"
                    type="submit"
                  >
                    {savingKilo == true ? (
                      <div className="w-full flex justify-center">
                        <Ring
                          size={25}
                          speed={2}
                          lineWeight={5}
                          color="white"
                        />
                      </div>
                    ) : (
                      `Save`
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default withLayoutAdmin(AdminDelivery);

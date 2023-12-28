import createAxiosInstance from "@/API";
import Locations from "@/components/Location/Location";
import TawasyLoader from "@/components/UI/tawasyLoader";
import withLayoutCustomer from "@/components/wrapping components/WrappingCustomerLayout";
import { Ring } from "@uiball/loaders";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useState, useEffect } from "react";
import { useRef } from "react";
import { BiArrowBack } from "react-icons/bi";
import { IoLocation } from "react-icons/io5";
import { useQuery } from "react-query";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Order = () => {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [address, setAddress] = useState();
  const { t } = useTranslation("");

  // const [useAddress, setUseAddress] = useState();
  const noteRef = useRef();
  const [useExisting, setUseExisting] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleOptionChange = (e) => {
    const value = e.target.value === "existing";
    setUseExisting(value);
    // onSelectAddress(value ? "existing" : "new");
  };

  const {
    data: submitOrder,
    isLoading,
    isRefetching,
  } = useQuery(`submitOrder`, fetchSubmitOrder, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchSubmitOrder() {
    return await Api.get(`/api/customer/cart/show`);
  }

  async function submit() {
    setSubmitting(true);
    let postData;
    if (useExisting === true) {
      postData = {
        use_customer_location: true,
        note: noteRef.current.value || " ",
      };
    } else {
      postData = {
        use_customer_location: false,
        shipping_address_lat: address.lat,
        shipping_address_lon: address.lng,
        note: noteRef.current.value || " ",
      };
    }
    try {
      const response = await Api.post(
        `/api/customer/convert-to-order`,
        postData
      );
      // console.log(response);
      router.replace(`/Orders`);
      setSubmitting(false);
    } catch (error) {
      // console.log(error);
    }
    setSubmitting(false);
    setSubmitting(false);
  }

  function GetLocation(data) {
    setAddress(data);
  }

  if (isLoading == true || isRefetching == true) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={400} height={400} />
      </div>
    );
  }

  return (
    <>
      <NextSeo
        title={`Tawasy Shopping - Submit Order`}
        description={`Submmiting order from Tawasy Shopping website`}
      />
      <div className="w-[100%] h-full">
        <div className="w-full bg-gray-200 pt-2 mb-7">
          <button
            className="flex w-max justify-start items-center border-b-2 border-transparent hover:border-skin-primary transition-all duration-500 bg-gray-200 text-skin-primary py-2 md:mx-16 mx-2"
            onClick={() => {
              router.back();
            }}
          >
            <BiArrowBack className="w-[20px] h-[20px] mx-1 mt-[2px]" />
            {/* <span className="text-skin-primary text-xl">{`Back`}</span> */}
            <span className="text-skin-primary text-xl">
              {t("profile.back")}
            </span>
          </button>
        </div>

        {isLoading == true ? (
          <div className="w-full h-full">
            <TawasyLoader width={400} height={400} />
          </div>
        ) : (
          <div>
            <div className="md:px-16 px-2">
              <div className="w-[100%]">
                <div className="grid grid-cols-5  gap-4 text-gray-800 text-xl font-medium bg-gray-200 py-2">
                  <div className="col-span-2">
                    {/* <h4>{`Name`}</h4> */}
                    <h4>{t("orders.orderDetails.name")}</h4>
                  </div>

                  <div className="">
                    {/* <h4>{`Quantity`}</h4> */}
                    <h4>{t("orders.orderDetails.quantity")}</h4>
                  </div>
                  <div className="">
                    {/* <h4>{`Price`}</h4> */}
                    <h4>{t("orders.orderDetails.price")}</h4>
                  </div>
                  <div className="">
                    {/* <h4>{`Total Price`}</h4> */}
                    <h4>{t("orders.totalPrice")}</h4>
                  </div>
                </div>

                {submitOrder &&
                  submitOrder.data.cart.lines &&
                  submitOrder.data.cart.lines.map((item, index) => {
                    const nid = [];
                    if (item.combination) {
                      item?.combination?.variations.map((vari) => {
                        nid.push(vari.option);
                      });
                    }
                    const name = item.combination
                      ? item.product.name +
                        ` ( ${nid.join(" - ")} )` +
                        ` [ ${
                          item.combination?.part_number
                            ? item.combination?.part_number
                            : `-`
                        } ]`
                      : item.product.name;
                    return (
                      <div
                        key={index}
                        className="grid grid-cols-5  gap-4 md:py-10 py-2 text-gray-700 text-lg font-medium border-b-2 border-gray-300"
                      >
                        <div className="col-span-2">
                          <h3 className="w-full">{name}</h3>
                        </div>
                        <div className="">
                          <h3 style={{ paddingLeft: "20px" }}>
                            {item.quantity}
                          </h3>
                        </div>
                        <div className="">
                          <h3>{item.price} S.P</h3>
                        </div>
                        <div className="">
                          <h3>{item.lineTotal} S.P</h3>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="my-6">
                <div className="grid md:grid-cols-2 gap-4 font-medium text-gray-800">
                  {submitOrder && submitOrder.data.cart && (
                    <div>
                      <div className="py-2 border-b-2 border-skin-primary w-full md:flex md:justify-between items-center">
                        {/* {`Total Quantity`}: */}
                        {t("orders.orderDetails.totalQuantity")}:
                        <p>{submitOrder.data.cart.total_quantity}</p>
                      </div>
                      <div className="py-2 border-b-2 border-skin-primary w-full md:flex md:justify-between items-center">
                        {/* {`Total Price`}: */}
                        {t("orders.totalPrice")}:
                        <p>{submitOrder.data.cart.total_price} S.P</p>
                      </div>
                      <div className="py-2 border-b-2 border-skin-primary w-full md:flex md:justify-between items-center">
                        {/* {`Delivery Price`}: */}
                        {t("orders.orderDetails.deliveryPrice")}:
                        <p>{submitOrder.data.cart.delivery_price} S.P</p>
                      </div>
                      <div className="py-2 border-b-2 border-skin-primary w-full md:flex md:justify-between items-center">
                        {/* {`Discount`}: */}
                        {t("orders.orderDetails.discount")}:
                        <p>{submitOrder.data.cart.discounted_price} S.P</p>
                      </div>

                      <div className="py-5 border-b-2 border-gray-300 w-full md:flex md:justify-between items-center">
                        {/* {`Final Price`}: */}
                        {t("orders.orderDetails.finalPrice")}:
                        <p>{submitOrder.data.cart.final_price} S.P</p>
                      </div>
                    </div>
                  )}
                  <div>
                    {/* <div>Location should be here</div> */}
                    <div>
                      <label>
                        <input
                          type="radio"
                          value="existing"
                          checked={useExisting}
                          onChange={handleOptionChange}
                        />
                        {/* {`Use My Address`} */}
                        {t("submitOrder.useExisting")}
                      </label>
                      <div className="flex flex-col justify-start items-center gap-1">
                        <div className="flex justify-start items-center gap-3 w-full">
                          <label>
                            <input
                              type="radio"
                              value="new"
                              checked={!useExisting}
                              onChange={handleOptionChange}
                              className="px-4"
                            />
                            {/* {`Use a New Address`} */}
                            {t("submitOrder.useNew")}
                          </label>
                          {!useExisting && (
                            <Locations
                              onLocation={GetLocation}
                              className={` text-zinc-500 pl-2 outline-none w-max border-b-2 border-zinc-500 focus:border-skin-primary h-[40px]`}
                            />
                          )}
                        </div>
                        {!useExisting && (
                          <p className="text-black">
                            {t("submitOrder.differ")}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* <h4 className="py-3">{`Note`}:</h4> */}
                    <h4 className="py-3">{t("submitOrder.Note")}:</h4>
                    <div className="relative mb-6">
                      <textarea
                        style={{ height: "125px" }}
                        className="peer border-2 block min-h-[auto] w-full rounded border-1 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 motion-reduce:transition-none focus:border-skin-primary"
                        id="exampleFormControlTextarea13"
                        ref={noteRef}
                        rows={3}
                      ></textarea>
                      <label
                        htmlFor="exampleFormControlTextarea13"
                        className={`bg-white pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] h-max leading-[1.6] text-neutral-500 transition-all duration-200 ease-out -translate-y-[0.9rem] scale-[0.8] peer-focus:text-skin-primary  `}
                      >
                        {/* {`Note`} */}
                        {t("submitOrder.Note")}
                      </label>
                    </div>
                    <button
                      style={{
                        backgroundColor: "#ff6600",
                        textAlign: "center",
                        width: "100%",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                        borderRadius: "5px",
                        color: "white",
                      }}
                      onClick={submit}
                    >
                      {/* {submitting == true ?  <div className="w-full flex justify-center items-center" ><Ring size = {20} lineWeight={5} speed={2} color="white" /></div> : `Submit Order`} */}
                      {submitting == true ? (
                        <div className="w-full flex justify-center items-center">
                          <Ring
                            size={20}
                            lineWeight={5}
                            speed={2}
                            color="white"
                          />
                        </div>
                      ) : (
                        t("submitOrder.submit")
                      )}
                    </button>
                    <hr />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default withLayoutCustomer(Order);

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

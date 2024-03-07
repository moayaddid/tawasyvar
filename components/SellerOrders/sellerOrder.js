import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  DialogActions,
} from "@mui/material";
import MdClose from "react-icons/md";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import TawasyLoader from "../UI/tawasyLoader";
import { Ring } from "@uiball/loaders";
import { useTranslation } from "next-i18next";

export function convertMoney(money) {
  const total = money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const finalTotal = `${total}`;
  return finalTotal;
}

export function convertDate(date) {
  const refined = new Date(date);
  const year = refined.getFullYear();
  const month = refined.getMonth() + 1;
  const day = refined.getDate();
  const finalDate = `${year}-${month}-${day}`;
  return finalDate;
}

function SellerOrders({ orders, refetch }) {
  const [open, openchange] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState();
  const Api = createAxiosInstance(router);
  const [rejecting, setRejecting] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const reasonRef = useRef();
  const { t } = useTranslation("");
  const [proName, setProName] = useState();

  async function fetchOrderDetails() {
    setIsLoading(true);
    try {
      const response = await Api.get(`/api/seller/order/${orders.order_id}`);
      // console.log(response.data.order);
      setOrderDetails(response.data.order);
      setIsLoading(false);
    } catch (error) {}
  }

  const functionopenpopup = async () => {
    openchange(true);
    await fetchOrderDetails();
  };
  const closepopup = () => {
    openchange(false);
  };

  const declinedOrders = orders.status == "declined" ? true : false;

  async function acceptOrder() {
    setAccepting(true);
    try {
      const response = await Api.post(
        `/api/seller/accept-decline-order/${orders.order_id}`,
        {
          action: "accept",
        }
      );
      refetch();
      setAccepting(false);
      openchange(false);
    } catch (error) {
      // console.log(error);
      setAccepting(false);
      openchange(false);
    }
    setAccepting(false);
    openchange(false);
  }

  async function rejectOrder() {
    setRejecting(true);
    try {
      const response = await Api.post(
        `/api/seller/accept-decline-order/${orders.order_id}`,
        {
          action: "decline",
          reason: reasonRef.current.value,
        }
      );
      refetch();
      setRejecting(false);
      openchange(false);
    } catch (error) {
      // console.log(error);
      setRejecting(false);
      // openchange(false);
    }
    setRejecting(false);
    // openchange(false);
  }

  const openGoogleMaps = (latitude, longitude, desLat, desLon) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${desLat},${desLon}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <tr
        key={orders.id}
        className="even:bg-zinc-200 odd:bg-zinc-50 text-center"
      >
        <td className="pb-5 md:px-0 px-2">{orders.order_id}</td>
        <td className="pb-5 md:px-0 px-2 ">{orders.status}</td>
        <td className="pb-5 md:px-0 px-2 ">{convertDate(orders.date)}</td>
        <td className="pb-5 md:px-0 px-2 ">
          {convertMoney(orders.final_price)}
        </td>
        <td
          className={`pb-5 ${
            orders.used_coupon == true ? `text-green-500` : `text-red-500`
          } `}
        >
          {orders.used_coupon == true
            ? router.locale == "ar"
              ? "نعم"
              : `Yes`
            : router.locale == "ar"
            ? "لا"
            : `No`}
        </td>
        {declinedOrders === true && router.query.type == "rejectedOrders" && (
          <td className="pb-5">
            {" "}
            {orders.reason
              ? orders.reason
              : router.locale == "ar"
              ? " لا يوجد"
              : "None given"}{" "}
          </td>
        )}
        <td className="pb-5 md:px-0 px-2 ">
          <button
            onClick={functionopenpopup}
            className="bg-transparent border-b-2 border-[#ff6600] "
          >
            {t("seller.orders.table.details")}
          </button>
        </td>
      </tr>

      <Dialog
        open={open}
        onClose={closepopup}
        fullWidth
        maxWidth="lg"
        dir={router.locale == "ar" ? "rtl" : "ltr"}
      >
        {isLoading !== true && orderDetails && (
          <DialogTitle className="md:flex flex-wrap  justify-between mx-auto border-b-2 border-skin-primary ">
            <span className="md:text-lg text-sm px-2 py-1">
              {t("seller.orders.orderDetails.storeName")}:{" "}
              {orderDetails.store_name}{" "}
            </span>
            <span className="md:text-lg text-sm px-2 py-1 ">
              {t("seller.orders.orderDetails.orderStatus")}:{" "}
              {orderDetails.status}{" "}
            </span>
            <span className="md:text-lg text-sm px-2 py-1 ">
              {t("seller.orders.orderDetails.orderDate")}:{" "}
              {convertDate(orderDetails.date)}
            </span>
            <span className="md:text-lg text-sm px-2 py-1 ">
              {t("seller.orders.orderDetails.orderId")}: {orderDetails.order_id}
            </span>
            {orderDetails.is_free_delivery === 1 &&
              orderDetails.status !== "delivered" && (
                <span className="md:text-lg text-sm px-2 py-1 ">
                  {t("seller.orders.orderDetails.customerName")} :{" "}
                  {orderDetails?.customer_data?.name}
                </span>
              )}
            {orderDetails.is_free_delivery === 1 &&
              orderDetails.status !== "delivered" && (
                <span className="md:text-lg text-sm px-2 py-1 ">
                  {t("seller.orders.orderDetails.customerNumber")} :{" "}
                  {orderDetails?.customer_data?.phone_number}
                </span>
              )}
            {orderDetails.is_free_delivery === 1 &&
              orderDetails.status !== "delivered" && (
                <button
                  onClick={() =>
                    openGoogleMaps(
                      orderDetails.customer_data.store_latitude,
                      orderDetails.customer_data.store_longitude,
                      orderDetails.customer_data.latitude,
                      orderDetails.customer_data.longitude
                    )
                  }
                  className="text-gray-400 hover:text-skin-primary w-fit "
                >
                  {t("seller.orders.orderDetails.showMap")}
                </button>
              )}
          </DialogTitle>
        )}
        <DialogContent
          className="md:mx-[24px] mx-[5px]"
          style={{ paddingLeft: "0px", paddingRight: "0px" }}
        >
          {isLoading === true ? (
            <div className="w-full h-full">
              <TawasyLoader width={300} height={300} />
            </div>
          ) : (
            // <Stack>
            <div>
              <table className=" w-full border-b-2 border-gray-300">
                <thead className="bg-zinc-200 h-8 py-2">
                  <tr className="md:text-xl grid grid-cols-7 text-sm">
                    <th className="pb-2 pt-2 col-span-3 ">
                      {t("seller.orders.orderDetails.productName")}
                    </th>
                    <th className="pb-2 pt-2">
                      {t("seller.products.table.partNumber")}
                    </th>
                    <th className="pb-2 pt-2">
                      {t("seller.orders.orderDetails.quantity")}
                    </th>
                    <th className="pb-2 pt-2">
                      {t("seller.orders.orderDetails.price")}
                    </th>
                    <th className="pb-2 pt-2">
                      {t("seller.orders.orderDetails.total")}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center md:text-xl text-sm">
                  {orderDetails?.order_details.map((product, index) => {
                    const nid = [];
                    if (product.combination) {
                      product?.combination?.variations.map((vari) => {
                        nid.push(vari.option);
                      });
                      // nid.join(" / ");
                    }
                    const name = product.combination
                      ? product.product_name + ` ( ${nid.join(" - ")} )`
                      : product.product_name;
                    return (
                      <tr key={index} className="text-center grid grid-cols-7">
                        <td className="pb-2 pt-2 col-span-3">{name}</td>
                        <td className="pb-2 pt-2">
                          {product.combination?.part_number
                            ? product.combination?.part_number
                            : `-`}
                        </td>
                        <td className="pb-2 pt-2">{product.quantity}</td>
                        <td className="pb-2 pt-2">{product.price}</td>
                        <td className="pb-2 pt-2">{product.line_total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flex flex-col justify-start items-start gap-3 md:text-xl text-base w-full ">
                <div className="w-full">
                  <p
                    className={`py-1 border-b-2 border-skin-primary flex justify-between items-center `}
                  >
                    {t("seller.orders.orderDetails.coupon")} :
                    <p
                      className={`${
                        orderDetails?.coupon == true
                          ? `text-green-500`
                          : `text-red-500`
                      } pr-5 `}
                    >
                      {orderDetails?.coupon == true
                        ? router.locale == "ar"
                          ? "نعم"
                          : `Yes`
                        : router.locale == "ar"
                        ? "لا"
                        : `No`}
                    </p>
                  </p>
                  <p className="py-1 border-b-2 border-skin-primary flex justify-between items-center">
                    {t("seller.orders.orderDetails.totalQuantity")} :
                    <p className="pr-5">{orderDetails?.total_quantity}</p>
                  </p>
                  <p className="py-1 border-b-2 border-skin-primary flex justify-between items-center">
                    {t("seller.orders.orderDetails.discount")} :
                    <p className="pr-5">{orderDetails?.discount}</p>
                  </p>
                  <p className="py-1 border-b-2 border-skin-primary flex justify-between items-center">
                    {t("seller.orders.orderDetails.totalPrice")} :
                    <p className="pr-5">{orderDetails?.total_price}</p>
                  </p>
                  <p className="py-1 border-b-2 border-skin-primary flex justify-between items-center">
                    {t("seller.orders.orderDetails.deliveryFee")} :
                    <p className="pr-5">{orderDetails?.delivery_price}</p>
                  </p>
                  <p className="py-1 border-b-2 border-skin-primary flex justify-between items-center">
                    {t("seller.orders.orderDetails.finalPrice")} :
                    <p className="pr-5">{orderDetails?.final_price}</p>
                  </p>
                </div>
                <p className="w-[50%]">
                  {t("seller.orders.orderDetails.notes")} :{" "}
                  {orderDetails?.note
                    ? `( ${orderDetails?.note} )`
                    : router.locale == "ar"
                    ? "(لا يوجد اي ملاحظات)"
                    : "( None Given )"}
                </p>
                {orderDetails?.is_free_delivery === 1 && (
                  <p className="px-2 py-1 bg-yellow-500 text-white rounded-lg text-base">
                    {t("storeDelivery")}
                  </p>
                )}
              </div>
            </div>
            // {/* </Stack> */}
          )}
        </DialogContent>
        {isLoading !== true &&
          orderDetails &&
          orderDetails.status === `pending` && (
            <DialogActions>
              <div className="flex md:flex-row flex-col md:justify-end md:items-center gap-2 ">
                <div className="md:flex justify-start items-center gap-3 w-fit ">
                  <label
                    className="pt-1 md:text-lg text-base "
                    htmlFor="freeform "
                  >
                    {t("seller.orders.table.reason")} :
                  </label>
                  <textarea
                    id="freeform"
                    name="freeform"
                    rows="2"
                    ref={reasonRef}
                    placeholder="Reason"
                    className="w-max shadow h-[50px] p-3 outline-none focus:outline-skin-primary transition-all duration-700 rounded-lg "
                  ></textarea>
                </div>
                <button
                  className="bg-red-700 px-8 py-3 hover:bg-red-600 text-white md:w-[25%] rounded-lg "
                  data-dismiss="modal"
                  onClick={rejectOrder}
                >
                  {rejecting == true ? (
                    <div className="flex justify-center items-center">
                      <Ring size={25} lineWeight={5} speed={2} color="white" />
                    </div>
                  ) : router.locale == "ar" ? (
                    "أرفض الطلب"
                  ) : (
                    "Reject Order"
                  )}
                </button>
                <button
                  type="button"
                  onClick={acceptOrder}
                  className="bg-lime-950 px-8 hover:bg-lime-800 py-3 text-white md:w-[25%] rounded-lg"
                  data-dismiss="modal"
                >
                  {accepting == true ? (
                    <div className="flex justify-center items-center">
                      <Ring size={25} lineWeight={5} speed={2} color="white" />
                    </div>
                  ) : router.locale == "ar" ? (
                    "اقبل الطلب"
                  ) : (
                    "Accept Order"
                  )}
                </button>
              </div>
            </DialogActions>
          )}
      </Dialog>
    </>
  );
}
export default SellerOrders;

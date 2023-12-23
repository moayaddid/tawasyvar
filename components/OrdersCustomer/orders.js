import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import TawasyLoader from "../UI/tawasyLoader";
import { convertDate } from "../SellerOrders/sellerOrder";
import { useRef } from "react";
import { toast } from "react-toastify";
import { Ring } from "@uiball/loaders";
import { useTranslation } from "next-i18next";

function OrdersCustomer({ order, refetch }) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState();
  const reasonRef = useRef();
  const [canceling, setCanceling] = useState(false);
  const { t } = useTranslation("");

  const [open, openchange] = useState(false);

  const functionopenpopup = async () => {
    openchange(true);
    setIsLoading(true);
    try {
      const response = await Api.get(`/api/customer/order/${order.order_id}`);
      // console.log(response);
      setOrderDetails(response.data.order);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  const closepopup = () => {
    openchange(false);
  };

  async function cancelOrder() {
    if (reasonRef.current.value.trim() == "" || !reasonRef.current.value) {
      toast.error(
        `Please give us a reason for cancelling the order | الرجاء تزويدنا بسبب رفض الطلب `,
        {
          toastId: `Please give us a reason for cancelling the order | الرجاء تزويدنا بسبب رفض الطلب `,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      return;
    } else {
      setCanceling(true);
      try {
        const response = Api.post(
          `/api/customer/order/${order.order_id}/cancel`,
          {
            reason: reasonRef.current.value.trim(),
          }
        );
        setCanceling(false);
        refetch();
        openchange(false);
      } catch (error) {
        setCanceling(false);
      }
      setCanceling(false);
    }
  }

  return (
    <>
      <div
        onClick={functionopenpopup}
        className="bg-gray-100 rounded-md my-1 px-4 cursor-pointer border-2 border-white hover:border-skin-primary transition-all duration-700 "
      >
        <div>
          <div className="flex justify-end">
            <h2 className="bg-skin-primary text-white px-2 py-1 rounded-md mt-[-10px] mr-6">
              {convertDate(order.date)}
            </h2>
          </div>
          <div className="pb-5">
            <h3 className="font-medium text-xl flex items-center gap-2 text-gray-500 mb-2">
              {/* <div>{`Store Name`} : </div> */}
              <div>Id : </div>
              <div>{order.order_id}</div>
            </h3>
            <h3 className="font-medium text-xl flex items-center gap-2 text-gray-500 mb-2">
              {/* <div>{`Store Name`} : </div> */}
              <div>{t("orders.storeName")} : </div>
              <div>{order.store_name}</div>
            </h3>
            <h3 className="font-medium text-lg flex items-center gap-2 text-gray-500 mb-2">
              {/* <div>{`Total Price`} :</div> */}
              <div>{t("orders.totalPrice")} :</div>
              <div>{order.final_price} S.P</div>
            </h3>
            <h3 className="font-medium text-lg flex items-center gap-2 text-gray-500">
              {/* <div>{`Status`}:</div> */}
              <div>{t("orders.status")}:</div>
              <div
                className={`${order.status == `pending` && `text-yellow-500`} ${
                  order.status == `accepted` && `text-green-500`
                } ${
                  (order.status == `declined` || order.status == `cancelled`) &&
                  `text-red-500`
                }`}
              >
                {order.status}
              </div>
            </h3>
          </div>
        </div>
      </div>

      <Dialog open={open} fullWidth maxWidth="lg" onClose={closepopup}>
        <DialogTitle className="flex justify-end">
          <div>
            <MdClose onClick={closepopup} className="w-[25px] cursor-pointer h-[25px] hover:text-red-500 transition-all duration-300 " />
          </div>
        </DialogTitle>
        <DialogContent>
          {isLoading == true ? (
            <div className="w-full h-full">
              <TawasyLoader width={400} height={400} />
            </div>
          ) : (
            orderDetails && (
              <div className="w-[100%] h-full">
                <div className="md:px-16 px-2 mb-5">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <h4 className="text-gray-700 text-lg font-medium">
                      Order Id: {orderDetails.order_id}
                    </h4>
                    <h4 className="text-gray-700 text-lg flex justify-start gap-2 items-center font-medium">
                      {/* <div>{`Date`} :</div> */}
                      <div>{t("orders.orderDetails.date")} :</div>
                      <div>{convertDate(orderDetails.date)}</div>
                    </h4>
                  </div>
                  <div className="flex flex-col md:flex-wrap ">
                    <h4 className="text-gray-700 text-lg flex justify-start gap-2 items-center font-medium ">
                      {/* <div>{`Store Name`}:</div> */}
                      <div>{t("orders.storeName")}:</div>
                      <div>{orderDetails.store_name}</div>
                    </h4>
                    <h4 className="text-gray-700 text-lg flex justify-start gap-2 items-center font-medium">
                      {/* <div>{`Status`} :</div> */}
                      <div>{t("orders.status")} :</div>
                      <div>{orderDetails.status}</div>
                    </h4>
                    {orderDetails.status == "declined" && (
                      <h4 className="text-gray-700 text-lg md:flex flex-wrap justify-start gap-2 items-center font-medium">
                        {/* <div>{`Status`} :</div> */}
                        <div>Reason of declining :</div>
                        <div>
                          {orderDetails.reason
                            ? `(${orderDetails.reason})`
                            : "None Given"}
                        </div>
                      </h4>
                    )}
                  </div>
                </div>

                <div className="md:px-16 px-2">
                  <div className="w-[100%]">
                    <div className="grid grid-cols-6  md:gap-4 gap-1 text-gray-800 md:text-xl text-xs font-medium bg-gray-200 py-2">
                      <div className="col-span-3">
                        {/* <h4>{`Name`}</h4> */}
                        <h4 className="text-center" >{t("orders.orderDetails.name")}</h4>
                      </div>

                      <div className="">
                        {/* <h4>{`Quantity`}</h4> */}
                        <h4 className="text-center" >{t("orders.orderDetails.quantity")}</h4>
                      </div>
                      <div className="">
                        {/* <h4>{`Price`}</h4> */}
                        <h4 className="text-center" >{t("orders.orderDetails.price")}</h4>
                      </div>
                      <div className="">
                        {/* <h4>{`Total Price`}</h4> */}
                        <h4 className="text-center" >{t("orders.totalPrice")}</h4>
                      </div>
                    </div>

                    {orderDetails.order_details.map((item, index) => {
                      const nid = [];
                      if (item.combination) {
                        item?.combination?.variations.map((vari) => {
                          nid.push(vari.option);
                        });
                        // nid.join(" / ");
                      }
                      const name = item.combination
                        ? item.product_name +
                          ` ( ${nid.join(" - ")} )` +
                          ` [ ${item.combination?.part_number ? item.combination?.part_number : `-`} ]`
                        : item.product_name;
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-6  md:gap-4 gap-1 md:py-10 py-2 text-gray-700 md:text-lg text-sm font-medium border-b-2 border-gray-300"
                        >
                          <div className="col-span-3">
                            <h3 className="w-full text-center">{name}</h3>
                          </div>
                          <div className="">
                            <h3 className="text-center">
                              {item.quantity}
                            </h3>
                          </div>
                          <div className="text-center">
                            <h3>{item.price} S.P</h3>
                          </div>
                          <div className="text-center">
                            <h3>{item.line_total} S.P</h3>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="my-6">
                    <div className="grid md:grid-cols-2 gap-4 font-medium text-gray-800">
                      <div>
                        <div className="py-2 border-b-2 border-skin-primary w-full md:flex md:justify-between items-center">
                          {/* {`Total Quantity`}: */}
                          {t("orders.orderDetails.totalQuantity")}:
                          <p>{orderDetails.total_quantity}</p>
                        </div>
                        <div className="py-2 border-b-2 border-skin-primary w-full md:flex md:justify-between items-center">
                          {/* {`Total Price`}: */}
                          {t("orders.totalPrice")}:
                          <p>{orderDetails.total_price} S.P</p>
                        </div>
                        <div className="py-2 border-b-2 border-skin-primary w-full md:flex md:justify-between items-center">
                          {/* {`Delivery Price`}: */}
                          {t("orders.orderDetails.deliveryPrice")}:
                          <p>{orderDetails.delivery_price} S.P</p>
                        </div>
                        <div className="py-2 border-b-2 border-skin-primary w-full md:flex md:justify-between items-center">
                          {/* {`Discount`}: */}
                          {t("orders.orderDetails.discount")}:
                          <p>{orderDetails.discount} S.P </p>
                        </div>
                        <div className="py-5 border-b-2 border-gray-300 w-full md:flex md:justify-between items-center">
                          {/* {`Final Price`}: */}
                          {t("orders.orderDetails.finalPrice")}:
                          <p>{orderDetails.final_price} S.P</p>
                        </div>
                      </div>
                      {orderDetails.status &&
                        (orderDetails.status == `pending` ||
                          orderDetails.status == `accepted`) && (
                          <div>
                            <h4 className="py-3 pl-2">
                              {/* {`Reason for cancelling the order`}: */}
                              {t("orders.orderDetails.reasonForCancel")}:
                            </h4>
                            <div className="relative mb-6">
                              <textarea
                                style={{ height: "125px" }}
                                className="peer border-2 block min-h-[auto] w-full rounded border-1 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 motion-reduce:transition-none focus:border-skin-primary"
                                id="exampleFormControlTextarea13"
                                ref={reasonRef}
                                rows={3}
                              ></textarea>
                              <label
                                htmlFor="exampleFormControlTextarea13"
                                className="peer-focus:bg-white pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary motion-reduce:transition-none "
                              >
                                {/* {`Reason`} */}
                                {t("orders.orderDetails.reason")}
                              </label>
                            </div>
                            <button
                              style={{
                                backgroundColor: "#ff1122",
                                textAlign: "center",
                                width: "100%",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                                color: "white",
                                borderRadius: "5px",
                              }}
                              onClick={cancelOrder}
                            >
                              {canceling == true ? (
                                <div className="flex justify-center items-center">
                                  <Ring
                                    size={25}
                                    lineWeight={5}
                                    speed={2}
                                    color="white"
                                  />
                                </div>
                              ) : (
                                `Cancel Order`
                              )}
                            </button>
                          </div>
                        )}
                      <p>
                        Notes :{" "}
                        {orderDetails.note
                          ? `( ${orderDetails.note} )`
                          : "( No Notes Provided. )"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </>
  );
}

export default OrdersCustomer;

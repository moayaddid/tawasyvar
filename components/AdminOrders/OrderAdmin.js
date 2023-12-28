import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import item1 from "../../public/images/kuala.jpg";
import Image from "next/image";
import { convertDate } from "../SellerOrders/sellerOrder";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import TawasyLoader from "../UI/tawasyLoader";
import { Ring } from "@uiball/loaders";
import { MdClose } from "react-icons/md";

export function convertDateStringToDate(inputString) {
  // Create a new Date object using the input string
  const dateObject = new Date(inputString);

  // Format the date and time
  const year = dateObject.getUTCFullYear();
  const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(dateObject.getUTCDate()).padStart(2, "0");
  const hours = String(dateObject.getUTCHours()).padStart(2, "0");
  const minutes = String(dateObject.getUTCMinutes()).padStart(2, "0");
  const seconds = String(dateObject.getUTCSeconds()).padStart(2, "0");

  // Create the formatted date and time string
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}

function OrderAdmin({ names, refetch }) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDelivering, setIsDelivering] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [orderDetails, setOrderDetails] = useState();
  const [open, openchange] = useState(false);

  const reason =
    router.pathname == "/admin/Orders/RejectedOrders" ||
    router.pathname == "/admin/Orders/CancelledOrders";

  console.log(names);

  const openGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  const functionopenpopup = async () => {
    setIsLoading(true);
    openchange(true);
    try {
      const response = await Api.get(`/api/admin/order/${names.order_id}`);
      setOrderDetails(response.data.data);
      setIsLoading(false);
    } catch (error) {}
  };
  const closepopup = () => {
    openchange(false);
  };

  async function cancelOrder() {
    setIsCancelling(true);
    try {
      const response = await Api.put(
        `/api/admin/updateOrderStatus/${names.order_id}`,
        {
          status: "cancelled",
        }
      );
      refetch();
      setIsCancelling(false);
      openchange(false);
    } catch (error) {
      setIsCancelling(false);
    }
  }

  async function delivered() {
    setIsDelivering(true);
    try {
      const response = await Api.put(
        `/api/admin/updateOrderStatus/${names.order_id}`,
        {
          status: "delivered",
        }
      );
      refetch();
      setIsDelivering(false);
      openchange(false);
    } catch (error) {
      setIsDelivering(false);
    }
  }

  async function Accepted() {
    setIsAccepting(true);
    try {
      const response = await Api.put(
        `/api/admin/updateOrderStatus/${names.order_id}`,
        {
          status: "accepted",
        }
      );
      refetch();
      setIsAccepting(false);
      openchange(false);
    } catch (error) {
      setIsAccepting(false);
    }
  }

  return (
    <>
      <tr
        key={names.id}
        className="even:bg-zinc-200 odd:bg-zinc-50 text-center"
      >
        <td className="py-5 ">{names.order_id}</td>
        <td className="py-5 ">{names.store_name}</td>
        <td className="py-5">{names.customer_name}</td>
        <td className="py-5">{names.status}</td>
        {reason == true && (
          <td className="py-5">{names.reason ? names.reason : "None Given"}</td>
        )}
        <td className="py-5">{names.shipping_address}</td>
        <td className="py-5">{convertDateStringToDate(names.date)}</td>
        {/* <td className="pb-5">{names.created}</td> */}
        <td className="py-5">{convertDateStringToDate(names.updated_at)}</td>
        <td className="py-5">
          <button
            onClick={functionopenpopup}
            className="bg-transparent border-b-2 border-[#ff6600] "
          >
            Details
          </button>
        </td>
      </tr>

      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="lg">
        {orderDetails && (
          <DialogTitle className=" border-b-2 border-gray-200">
            <div className="md:mx-5">
              <div className="flex justify-between mx-auto">
                <h4 className="text-xl text-gray-600" >
                  Order ID : {orderDetails.order_id}
                </h4>
                <h4 className="text-xl text-gray-600">
                  Store name: {orderDetails.store_name}
                </h4>
                <h4>Date : {convertDateStringToDate(names.date)}</h4> 
                <MdClose className="text-gray-600 cursor-pointer hover:text-red-500 w-[30px] h-[30px] " onClick={closepopup} />
              </div>
              <div className="grid grid-cols-3 mx-auto text-lg text-gray-400 font-light gap-3">
                <h6>Status : {orderDetails.status} </h6>
                {/* <h4>Phone : 0964328926</h4> */}
                <h6 className="text-lg text-gray-400 font-light">
                  Shipping Address :{" "}
                  {orderDetails.shipping_address
                    ? orderDetails.shipping_address
                    : "None"}
                </h6>
                {/* <h6 className="text-lg text-gray-400 font-light">
                  Shipping Address / Longitude : {orderDetails.longitude}
                </h6>
                <h6 className="text-lg text-gray-400 font-light">
                  Shipping Address Latitdue : {orderDetails.latitude}
                </h6> */}
                <button
                  onClick={() =>
                    openGoogleMaps(
                      orderDetails.latitude,
                      orderDetails.longitude
                    )
                  }
                  className="text-gray-400 hover:text-skin-primary w-max "
                >
                  Show on google maps
                </button>
                <p>
                  Order Note :
                  {orderDetails.note
                    ? `( ${orderDetails.note} )`
                    : "( None given )"}
                </p>
              </div>
              <p className="text-gray-400" >Customer Name : {orderDetails.customer_name && orderDetails.customer_name }</p>
              <p className="text-gray-400" >Customer Number : {orderDetails.customer_phone && orderDetails.customer_phone }</p>
            </div>
          </DialogTitle>
        )}
        <DialogContent>
          {isLoading ? (
            <div className="w-full h-full">
              <TawasyLoader width={200} height={200} />
            </div>
          ) : (
            orderDetails && (
              <Stack spacing={2} margin={2}>
                <table className="table w-full">
                  <thead className="">
                    <tr className="text-sm font-semibold text-center border-b-2 border-skin-primary uppercase">
                      <th>Product</th>
                      <th>Part-Number</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-lg font-normal text-gray-700 text-center">
                    {orderDetails &&
                      orderDetails.order_details &&
                      orderDetails.order_details.map((product , index) => {
                        const nid = [];
                    if (product.combination) {
                      product?.combination?.variations.map((vari) => {
                        nid.push(vari.option);
                      });
                      // nid.join(" / ");
                    }
                    const name = product.combination ? product.product_name + ` ( ${nid.join(" - ")} )` : product.product_name ;
                        return (
                          <tr
                            key={index}
                            className="even:bg-zinc-200 odd:bg-zinc-50 text-center "
                          >
                            <td className="pb-5 pt-5">
                              {name}
                            </td>
                            <td className="pb-5 pt-5">
                              {product.combination?.part_number ? product.combination?.part_number : `-`}
                            </td>
                            <td className="pb-5 pt-5 flex justify-center">
                              {product.price}
                            </td>
                            <td className="pb-5 pt-5">{product.quantity}</td>
                            <td className="pb-5 pt-5">{product.line_total}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {orderDetails.big_size && <div className="bg-red-400 text-center" > This order cant be delivered via a Motorcycle </div>}
                <div className="w-full flex flex-wrap border-t-2 border-gray-300 gap-2 pt-5">
                  <h3 className="border-b-2 flex justify-between items-center border-skin-primary w-[50%]">
                    <div>Delivery Price :</div>
                    <div>{orderDetails.delivery_price}</div>
                  </h3>
                  <h3 className="border-b-2 flex justify-between items-center border-skin-primary w-[50%]">
                    <div>Used Coupon :</div>
                    <div>{orderDetails.coupon == true ? `Yes` : `No`}</div>
                  </h3>
                  <h3 className="border-b-2 flex justify-between items-center border-skin-primary w-[50%]">
                    <div>Total Price :</div>
                    <div>{orderDetails.total_price}</div>
                  </h3>
                  <h3 className="border-b-2 flex justify-between items-center border-skin-primary w-[50%]">
                    <div>Discount :</div>
                    <div>{orderDetails.discount}</div>
                  </h3>
                  <h3 className="border-b-2 flex justify-between items-center border-skin-primary w-[50%]">
                    <div>Final Price :</div>
                    <div>{orderDetails.final_price}</div>
                  </h3>
                </div>
              </Stack>
            )
          )}
        </DialogContent>

        {orderDetails && isLoading == false &&
          (orderDetails.status === "pending" ||
            orderDetails.status === "accepted") && (
            <DialogActions className="grid md:grid-cols-2 grid-cols-1 ">
              <button
                type="button"
                className="bg-red-600 w-[20%] text-white px-14 py-2"
                data-dismiss="modal"
                onClick={cancelOrder}
              >
                {isCancelling ? (
                  <div className="w-full flex justify-center items-center">
                    <Ring size={20} lineWeight={5} speed={2} color="white" />
                  </div>
                ) : (
                  `Cancel Order`
                )}
              </button>
              <button
                type="button"
                className="bg-green-600 w-[20%] text-white px-14 py-2"
                data-dismiss="modal"
                onClick={delivered}
              >
                {isDelivering ? (
                  <div className="w-full flex justify-center items-center">
                    <Ring size={20} lineWeight={5} speed={2} color="white" />
                  </div>
                ) : (
                  `Order Delivered`
                )}
              </button>
              { orderDetails.status !== "accepted" &&  <button
                type="button"
                className="bg-green-400 w-[20%] text-white px-14 py-2"
                data-dismiss="modal"
                onClick={Accepted}
              >
                {isAccepting ? (
                  <div className="w-full flex justify-center items-center">
                    <Ring size={20} lineWeight={5} speed={2} color="white" />
                  </div>
                ) : (
                  `Accept Order`
                )}
              </button>}
            </DialogActions>
          )}
      </Dialog>
    </>
  );
}

export default OrderAdmin;

import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { MdClose } from "react-icons/md";
import TawasyLoader from "../UI/tawasyLoader";
import { useState } from "react";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { convertDate } from "../SellerOrders/sellerOrder";
import { useTranslation } from "next-i18next";
import { convertDateStringToDate } from "../AdminOrders/OrderAdmin";

function SellerVendorOrder({ order }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState();
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const { t } = useTranslation("");

  async function openOrder() {
    setOpen(true);
    setIsLoading(true);
    try {
      const response = await Api.get(
        `/api/seller/get-vendor-order-details/${order.id}`
      );
      setOrderDetails(response.data.order);
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  function closePopUp() {
    setOpen(false);
    setOrderDetails();
  }

  return (
    <>
      <div
        onClick={openOrder}
        className="bg-gray-100 rounded-md my-2 mx-2 px-4 cursor-pointer border-2 border-white hover:border-skin-primary transition-all duration-700 w-[20%] "
      >
        <div>
          <div className="flex justify-end">
            <h2 className="bg-skin-primary text-white px-2 py-1 rounded-md mt-[-10px] mr-6">
              {convertDateStringToDate(order.date)}
            </h2>
          </div>
          <div className="pb-5">
            <h3 className="font-medium text-xl flex items-center gap-2 text-gray-500 mb-2">
              <div>Id : </div>
              <div>{order.id}</div>
            </h3>
            <h3 className="font-medium text-xl flex items-center gap-2 text-gray-500 mb-2">
              <div>{t("vendor")} : </div>
              <div>{order.vendor}</div>
            </h3>
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        fullWidth
        maxWidth="lg"
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        onClose={closePopUp}
      >
        <DialogTitle className="flex justify-end items-center">
          <MdClose
            onClick={closePopUp}
            className="w-[25px] cursor-pointer h-[25px] hover:text-red-500 transition-all duration-300 "
          />
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
                    <h4 className="text-gray-700 text-lg font-medium flex justify-start items-center space-x-2 ">
                      <div className="px-2" >{t("orderId")}:</div>
                      <div>{orderDetails.id}</div>
                    </h4>
                    <h4 className="text-gray-700 text-lg flex justify-start gap-2 items-center font-medium">
                      <div className="px-2">{t("orders.orderDetails.date")} :</div>
                      <div>{convertDate(order.date)}</div>
                    </h4>
                  </div>
                  <div className="flex flex-col md:flex-wrap ">
                    <h4 className="text-gray-700 text-lg flex justify-start gap-2 items-center font-medium ">
                      <div className="px-2">{t("orders.storeName")}:</div>
                      <div>{orderDetails.seller}</div>
                    </h4>
                    <h4 className="text-gray-700 text-lg flex justify-start gap-2 items-center font-medium">
                      <div className="px-2">{t("vendor")} :</div>
                      <div>{orderDetails.vendor}</div>
                    </h4>
                  </div>
                </div>

                <div className="md:px-16 px-2">
                  <div className="w-[100%]">
                    <div className="grid grid-cols-6  md:gap-4 gap-1 text-gray-800 md:text-xl text-xs font-medium bg-gray-200 py-2">
                      <div className="col-span-3">
                        <h4 className="text-center">
                          {t("orders.orderDetails.name")}
                        </h4>
                      </div>
                      <div className="col-span-3">
                        <h4 className="text-center">
                          {t("orders.orderDetails.quantity")}
                        </h4>
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
                          ` [ ${
                            item.combination?.part_number
                              ? item.combination?.part_number
                              : `-`
                          } ]`
                        : item.product_name;
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-6  md:gap-4 gap-1 md:py-10 py-2 text-gray-700 md:text-lg text-sm font-medium border-b-2 border-gray-300"
                        >
                          <div className="col-span-3">
                            <h3 className="w-full text-center">{name}</h3>
                          </div>
                          <div className="col-span-3">
                            <h3 className="text-center">{item.quantity}</h3>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <hr />
                  <div className="my-6 flex justify-start items-center space-x-3 ">
                    <p className="px-1">{t("note")} :</p>
                    <p>
                      {orderDetails.note
                        ? `( ${orderDetails.note} )`
                        : "( No Notes Provided. )"}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SellerVendorOrder;

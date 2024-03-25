import { useEffect, useState } from "react";
import { convertDate } from "../SellerOrders/sellerOrder";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { MdClose } from "react-icons/md";
import Image from "next/image";
import { Ring } from "@uiball/loaders";
import logo from "@/public/images/tawasylogo.png";
import { useTranslation } from "next-i18next";

export function updateCounter(date) {
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const currentDate = new Date();
  let remainingTime = endDate - currentDate;
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  remainingTime %= 1000 * 60 * 60 * 24;
  const hours = Math.floor(remainingTime / (1000 * 60 * 60));
  remainingTime %= 1000 * 60 * 60;
  const minutes = Math.floor(remainingTime / (1000 * 60));
  remainingTime %= 1000 * 60;
  const seconds = Math.floor(remainingTime / 1000);

  return { days, hours, minutes, seconds };
}

export function calculateOfferPercentage(oldPrice, newPrice) {
  if (oldPrice > 0 && newPrice > 0) {
    const offerPercentage = ((oldPrice - newPrice) / oldPrice) * 100;
    return offerPercentage;
  }
}

function SellerPromotion({ promo, refetch }) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [openPromo, setOpenPromo] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [ending, setEnding] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState(null);

  const { t } = useTranslation("");

  let varis = [];

  if (promo?.combination?.variations) {
    promo.combination.variations.map((variation) => {
      if (variation.option) {
        varis.push(variation.option);
      }
    });
  }

  useEffect(() => {
    if (promo.end_date !== null) {
      setEnding(updateCounter(promo.end_date));
    }
  }, [promo.end_date]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (promo.end_date !== null) {
        setEnding(updateCounter(promo.end_date));
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (promo.status) {
      switch (promo.status) {
        case `expired`:
          setDefaultStatus(`border-gray-500`);
          break;
        case `cancelled`:
          setDefaultStatus(`border-red-500`);
          break;
        case `accepted`:
          setDefaultStatus(`border-green-500`);
          break;
        case `pending`:
          setDefaultStatus(`border-yellow-500`);
          break;
      }
    }
  }, [promo.status]);

  return (
    <>
      <div
        onClick={() => {
          setOpenPromo(true);
        }}
        className={`min-w-[25%] border-2 rounded-lg shadow-lg border-gray-100 m-2 px-2 py-1 bg-gray-100 cursor-pointer flex flex-col space-y-2 justify-center items-center ${defaultStatus} transition-all duration-500`}
      >
        <p className="text-lg w-[80%] text-center ">{promo.name}</p>
        <p className="md:text-lg text-base bg-skin-primary text-white rounded-lg px-2 py-1 ">
          Offer :{" "}
          {Math.round(
            calculateOfferPercentage(
              promo.final_price,
              Number(promo.promotion_price)
            )
          )}{" "}
          %
        </p>
        {promo.status === "expired" ? (
          <p className="text-center">Expired</p>
        ) : ending ? (
          <div
            className="flex justify-start items-center"
            dir={router.locale == "ar" ? "rtl" : "ltr"}
          >
            <p className="text-lg m-1 " dir="ltr">
              {t("ends")}
            </p>
            <p className="md:text-lg m-1 text-base" dir="ltr">
              {ending.days}
            </p>
            <p className="md:text-lg m-1 text-base" dir="ltr">
              {t("days")}
            </p>
            <p className="md:text-lg m-1 text-base" dir="ltr">
              ,
            </p>
            <div className="flex justify-start items-center" dir="ltr">
              <p className="md:text-lg m-1 text-base" dir="ltr">
                {ending.hours}
              </p>
              <p className="md:text-lg m-1 text-base" dir="ltr">
                :
              </p>
              <p className="md:text-lg m-1 text-base" dir="ltr">
                {ending.minutes}
              </p>
              <p className="md:text-lg m-1 text-base" dir="ltr">
                :
              </p>
              <p className="md:text-lg m-1 text-base" dir="ltr">
                {ending.seconds}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center">{t("thisPromo")}</p>
        )}
      </div>

      <Dialog
        open={openPromo}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        maxWidth="md"
        fullWidth
        onClose={() => {
          setOpenPromo(false);
        }}
        // PaperProps={`border-2 ${defaultStatus}`}
      >
        <DialogTitle className="w-full flex justify-between items-center">
          <p className="text-lg">{t("promotion")} :</p>
          <MdClose
            onClick={() => {
              setOpenPromo(false);
            }}
            className="w-[25px] h-[25px] cursor-pointer text-black hover:text-red-500 border-b-2 border-transparent hover:border-red-500 transition-all duration-300 "
          />
        </DialogTitle>
        <DialogContent className="flex flex-col justify-center items-center">
          <div className=" w-full mx-auto flex md:flex-row flex-col md:space-y-0 space-y-4  justify-between items-center py-3">
            <div className="w-[70%] flex flex-col justify-start items-start space-y-3 ">
              <p className="text-center md:text-xl text-base md:mx-0 mx-auto">
                {promo.name}
              </p>
              {promo.combination && (
                <div className="flex flex-col justify-start items-center md:mx-0 mx-auto ">
                  {promo.combination && promo.combination.part_number && (
                    <p className="m-1 text-blue-400">
                      {" "}
                      Part number : {promo.combination.part_number}
                    </p>
                  )}
                  {varis?.length > 0 && (
                    <p className="m-1 text-red-500 capitalize ">
                      {varis.join(" - ")}
                    </p>
                  )}
                </div>
              )}
              <div className="md:mx-0 mx-auto">
                <p className="md:text-lg md:mx-0 mx-auto text-base w-max bg-skin-primary text-white rounded-lg px-2 py-1 ">
                  {t("youOffered")}
                  {"  "}
                  {Math.round(
                    calculateOfferPercentage(
                      promo.final_price,
                      promo.promotion_price
                    )
                  )}
                  %
                </p>
                {promo.status === "expired" ? (
                  <p className="md:text-lg  text-base p-1 text-center mx-auto">
                    Expired
                  </p>
                ) : ending ? (
                  <div className="flex md:flex-row flex-col justify-start items-center md:space-x-1 md:space-y-0 space-y-1">
                    <p className="text-lg  text-center ">{t("ends")}</p>
                    <div className="flex flex-wrap justify-start items-center mx-auto ">
                      {/* <p className="md:text-lg  text-base p-1 text-center mx-auto ">
                        {ending.days} {t("days")} , {ending.hours}:
                        {ending.minutes}:{ending.seconds}
                      </p> */}

                      <div
                        className="md:text-lg  text-base p-1 text-center mx-auto flex justify-start items-center"
                        dir={router.locale == "ar" ? "rtl" : "ltr"}
                      >
                        <p className="md:text-lg m-1 text-base" dir="ltr">
                          {ending.days}
                        </p>
                        <p className="md:text-lg m-1 text-base" dir="ltr">
                          {t("days")}
                        </p>
                        <p className="md:text-lg m-1 text-base" dir="ltr">
                          ,
                        </p>
                        <div className="flex justify-start items-center" dir="ltr" >
                          <p className="md:text-lg m-1 text-base" dir="ltr">
                            {ending.hours}
                          </p>
                          <p className="md:text-lg m-1 text-base" dir="ltr">
                            :
                          </p>
                          <p className="md:text-lg m-1 text-base" dir="ltr">
                            {ending.minutes}
                          </p>
                          <p className="md:text-lg m-1 text-base" dir="ltr">
                            :
                          </p>
                          <p className="md:text-lg m-1 text-base" dir="ltr">
                            {ending.seconds}
                          </p>
                        </div>
                      </div>
                      <p className="md:text-lg  text-base p-1 text-center mx-auto ">
                        -
                      </p>
                      <p className="md:text-lg  text-base p-1 text-center mx-auto ">
                        ( {convertDate(promo.end_date)} )
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center">{t("thisPromo")}</p>
                )}
                <p className="md:mx-0 mx-auto text-center flex justify-center text-lg items-center  ">
                  {t("oldPrice")} :{" "}
                  <p className="line-through text-red-600 p-1 ">
                    {promo.final_price}
                  </p>
                </p>
                <p className="md:mx-0 mx-auto text-lg text-center flex justify-center items-center ">
                  {t("newPrice")} :{" "}
                  <p className=" text-green-600 p-1 ">
                    {promo.promotion_price}
                  </p>
                </p>
              </div>
            </div>
            <div className="md:w-[20%] w-[40%] h-auto">
              <Image
                src={
                  promo.combination
                    ? promo.combination.variations[0].image
                      ? promo.combination.variations[0].image
                      : logo
                    : promo.image
                    ? promo.image
                    : logo
                }
                alt={promo.name}
                width={0}
                height={0}
                className="object-contain w-full h-auto"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SellerPromotion;

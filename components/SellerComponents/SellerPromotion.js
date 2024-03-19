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
  const [isDeleting, setIsDeleting] = useState(false);
  const [ending, setEnding] = useState(null);
  const {t} = useTranslation("");


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

  async function deletePromo() {
    setIsDeleting(true);
    try {
      const response = await Api.delete(
        `/api/seller/pause-promotion/${promo.store_product_id}`
      );
      setIsDeleting(false);
      setOpenDelete(false);
      setOpenPromo(false);
      refetch();
    } catch (error) {
      setIsDeleting(false);
    }
    setIsDeleting(false);
  }

  return (
    <>
      <div
        onClick={() => {
          setOpenPromo(true);
        }}
        className="min-w-[25%] border-2 rounded-lg shadow-lg border-gray-100 m-2 px-2 py-1 bg-gray-100 cursor-pointer flex flex-col space-y-2 justify-center items-center hover:border-skin-primary transition-all duration-500"
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
        {ending ? (
          <div className="flex flex-wrap justify-start items-center space-x-3">
            <p className="text-lg m-1 ">{t("ends")}</p>
            <p className="md:text-lg m-1 text-base ">
              {ending.days} {t("days")} , {ending.hours}:{ending.minutes}:
              {ending.seconds}
            </p>
          </div>
        ) : (
          <p className="text-center">
           {t("thisPromo")}
          </p>
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
                  {t("youOffered")} :{"  "}
                  {Math.round(
                    calculateOfferPercentage(
                      promo.final_price,
                      promo.promotion_price
                    )
                  )}
                  %
                </p>
                {ending ? (
                  <div className="flex md:flex-row flex-col justify-start items-center md:space-x-1 md:space-y-0 space-y-1">
                    <p className="text-lg  text-center ">{t("ends")} :</p>
                    <div className="flex flex-wrap justify-start items-center mx-auto ">
                      <p className="md:text-lg  text-base p-1 text-center mx-auto ">
                        {ending.days} {t("days")} , {ending.hours}:{ending.minutes}:
                        {ending.seconds}
                      </p>
                      <p className="md:text-lg  text-base p-1 text-center mx-auto ">
                        -
                      </p>
                      <p className="md:text-lg  text-base p-1 text-center mx-auto ">
                        ( {convertDate(promo.end_date)} )
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center">
                    {t("thisPromo")}
                  </p>
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
        <DialogActions className="w-full flex justify-center items-center">
            <button onClick={() => {setOpenDelete(true)}} className="px-2 py-1 md:w-[20%] w-[40%] bg-red-500 rounded-lg text-white hover:opacity-80">
              {t("cancelPromo")}
            </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDelete}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        maxWidth="md"
        fullWidth
        onClose={() => {
          setOpenDelete(false);
        }}
      >
        <DialogTitle className="flex justify-between items-center">
          <p>{t("cancelPromo")} :</p>
          <MdClose
            onClick={() => {
              setOpenDelete(false);
            }}
            className="w-[25px] h-[25px] cursor-pointer text-black hover:text-red-500 border-b-2 border-transparent hover:border-red-500 transition-all duration-300 "
          />
        </DialogTitle>
        <DialogContent className="flex flex-col justify-start items-start w-full">
          <p>{t("RUSure")}</p>
          <div className="flex flex-wrap justify-start items-center">
            <p className="p-1">{promo.name}</p>
            {promo?.combination && (
              <p className="text-red p-1 ">({varis.join(" - ")})</p>
            )}
          </div>
        </DialogContent>
        <DialogActions className="flex justify-end items-center  ">
          {isDeleting == true ? (
            <div className="w-[20%] px-2 py-1 rounded-lg flex justify-center items-center text-white bg-green-500 hover:opacity-75 ">
              <Ring speed={3} lineWeight={5} color="white" size={20} />
            </div>
          ) : (
            <button
              onClick={deletePromo}
              className="w-[20%] px-2 py-1 rounded-lg text-white bg-green-500 hover:opacity-75 "
            >
              {t("yes")}
            </button>
          )}
          <button
            onClick={() => {
              setOpenDelete(false);
            }}
            className="w-[20%] px-2 py-1 rounded-lg text-white bg-red-500 hover:opacity-75 "
          >
            {t("no")}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SellerPromotion;

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
import {
  calculateOfferPercentage,
  updateCounter,
} from "../SellerComponents/SellerPromotion";

function AdminPromotion({ promo, refetch }) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [openPromo, setOpenPromo] = useState(false);
  const [status, setStatus] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const [ending, setEnding] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState(null);

  let varis = [];

  if (promo?.combination?.variations) {
    promo.combination.variations.map((variation) => {
      if (variation.option) {
        varis.push(variation.option);
      }
    });
  }

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

  async function editPromo() {
    if (status == undefined || status == null || promo.status === status) {
      setOpenPromo(false);
      setStatus(null);
      return;
    } else {
      setIsDeleting(true);
      try {
        const response = await Api.put(
          `/api/admin/change-promotion-status/${promo.id}`,
          {
            status,
          }
        );
        setIsDeleting(false);
        setOpenPromo(false);
        setStatus(null);
        refetch();
      } catch (error) {
        setIsDeleting(false);
      }
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div
        onClick={() => {
          setOpenPromo(true);
        }}
        className={`min-w-[25%] border-2 rounded-lg shadow-lg m-2 px-2 py-1 bg-gray-100 cursor-pointer flex flex-col space-y-2 justify-center items-center ${defaultStatus} transition-all duration-500`}
      >
        <div className="w-full flex justify-around items-center">
          <p>Id : {promo.id}</p>
          <p className="text-lg w-[80%] text-center underline decoration-skin-primary decoration-[2px] ">
            {promo.store}
          </p>
        </div>
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
        { promo.status === 'expired' ? <p className="text-center">Expired Promotion.</p> : (ending ? (
          <div className="flex flex-wrap justify-start items-center space-x-3">
            <p className="text-lg m-1 ">Ends in :</p>
            <p className="md:text-lg m-1 text-base ">
              {ending.days} Days , {ending.hours}:{ending.minutes}:
              {ending.seconds}
            </p>
          </div>
        ) : (
          <p className="text-center">This Promotion has no Ending Date.</p>
        ))}
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
          <p className="text-lg">Promotion by : {promo.store}</p>
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
                  Offer :{" "}
                  {Math.round(
                    calculateOfferPercentage(
                      promo.final_price,
                      promo.promotion_price
                    )
                  )}
                  %
                </p>
                <p>Started At : {promo.start_date}</p>
                { promo.status === 'expired' ? <p className="text-center" > Expired </p> : ending ? (
                  <div className="flex md:flex-row flex-col justify-start items-center md:space-x-1 md:space-y-0 space-y-1">
                    <p className="text-lg  text-center ">Ends in :</p>
                    <div className="flex flex-wrap justify-start items-center mx-auto ">
                      <p className="md:text-lg  text-base p-1 text-center mx-auto ">
                        {ending.days} Days , {ending.hours}:{ending.minutes}:
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
                    This Promotion has no Ending Date.
                  </p>
                )}
                <p className="md:mx-0 mx-auto text-center flex justify-center text-lg items-center  ">
                  Old Price :{" "}
                  <p className="line-through text-red-600 p-1 ">
                    {promo.final_price}
                  </p>
                </p>
                <p className="md:mx-0 mx-auto text-lg text-center flex justify-center items-center ">
                  New Price :{" "}
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
                      : promo.image ?? logo
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
          { promo.status !== "expired" && <div>
            <label htmlFor="status" className="px-2">
              Promotion Status :
              <select
                className="bg-transparent px-2"
                defaultValue={promo.status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              >
                {/* expired */}
                <option value={`accepted`}>Approved</option>
                <option value={`cancelled`}>Cancelled</option>
              </select>
            </label>
          </div>}
        </DialogContent>
        <DialogActions className="w-full flex justify-center items-center">
          { promo.status !== "expired" &&  ( isDeleting == true ? (
            <div className="px-2 py-1 md:w-[20%] w-[40%] bg-sky-500 flex justify-center items-center rounded-lg text-white ">
              <Ring speed={3} lineWeight={5} color="white" size={20} />
            </div>
          ) : (
            <button
              onClick={editPromo}
              className="px-2 py-1 md:w-[20%] w-[40%] bg-sky-500 rounded-lg text-white "
            >
              Save
            </button>
          ))}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AdminPromotion;

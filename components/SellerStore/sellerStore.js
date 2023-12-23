import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import Cookies from "js-cookie";
import Image from "next/image";
import logo from "../../public/images/tawasylogo.png"
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { MdCheck, MdClose, MdModeEdit } from "react-icons/md";

function SellerStore({ store, refetch }) {
  const [isToggled, setIsToggled] = useState(store.available);
  const [priceInputVisible, setPriceInputVisible] = useState(false);
  const [price, setPrice] = useState();
  const [editingPrice, setEditingPrice] = useState(false);
  const [savingPrice, setSavingPrice] = useState(false);
  const newPriceRef = useRef();
  const storeId = Cookies.get("Sid");
  const router = useRouter();
  const Api = createAxiosInstance(router);

  // function handleAvailable() {
  //   setIsToggled(!isToggled);
  // }

  // function togglePriceInput() {
  //   setPriceInputVisible(!priceInputVisible);
  // }

  // async function changeAvalability() {}

  useEffect(() => {
    if (store) {
      setPrice(store.price);
    }
  }, [store]);

  async function savePrice() {
    setSavingPrice(true);
    try {
      const response = await Api.put(
        `api/seller/store/${storeId}/product/${store.id}/price`,
        {
          price: newPriceRef.current.value,
        }
      );
      setPrice(newPriceRef.current.value);
      setSavingPrice(false);
      setEditingPrice(false);
      refetch();
    } catch (error) {
      // console.log(error);
    }
    setSavingPrice(false);
    setEditingPrice(false);
  }

  return (
    <>
      {/* <div key={store.id} className="mb-4"> */}
      <div key= {store.id}
          className="bg-white overflow-hidden shadow-2xl rounded-lg items-center justify-center "
        >
        <div className="bg-cover overflow-hidden flex justify-center items-center w-auto md:h-[343px] ">
            <Image
              src={store.image ? store.image : logo}
              alt={store.name}
              className="w-full  transform transition duration-1000 "
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "auto", height: "auto" }}
            />
          </div>

          <div className="flex flex-col justify-start items-start gap-3 w-full py-4 px-4 ">
            <h3
              className=" h-auto w-[90%] text-gray-600 md:text-2xl text-lg font-medium overflow-ellipsis md:line-clamp-2 line-clamp-2 select-none cursor-auto "
              alt={store.name}
              title={store.name}
            >
              {store.name}
            </h3>

            <div className="flex flex-wrap w-[100%] gap-2">
              {store.brand && (
                <h3 className="text-skin-primary text-sm font-medium border-2 border-skin-primary px-2 py-1 rounded-full ">
                  {store.brand}
                </h3>
              )}
            </div>
            <p
              className=" text-gray-700 text-base font-light overflow-hidden text-ellipsis select-none cursor-auto"
              title={store.description}
            >
              {store.description}
            </p>
            <div className="flex justify-end gap-3">
              {editingPrice == true ? (
                <input
                  type="text"
                  className="text-white rounded-md w-24 bg-skin-primary placeholder:text-white focus:outline-none px-2 py-1 text-sm mx-auto "
                  defaultValue={price}
                  ref={newPriceRef}
                />
              ) : (
                <span className="text-white rounded-md w-24 flex justify-center items-center  bg-skin-primary">
                  {price}
                </span>
              )}
              {editingPrice === true ? (
                <div className="flex items-center">
                  {savingPrice === true ? (
                    <div className="">
                      <Ring
                        size={18}
                        lineWeight={5}
                        speed={2}
                        color="#ff6600"
                      />
                    </div>
                  ) : (
                    <MdCheck
                      className="w-[25px] h-[25px] text-green-600 hover:text-green-500 "
                      onClick={savePrice}
                    />
                  )}
                  <MdClose
                    className="w-[25px] h-[25px] text-red-600 hover:text-red-500"
                    onClick={() => {
                      setEditingPrice(false);
                    }}
                  />
                </div>
              ) : (
                <MdModeEdit
                  className="w-[25px] h-[25px] bg-gray-400 text-white p-[3px] rounded-[50%]"
                  onClick={() => {
                    setEditingPrice(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      {/* </div> */}
    </>
  );
}

export default SellerStore;

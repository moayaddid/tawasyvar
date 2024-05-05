import React, { useRef, useState } from "react";
import { convertDateStringToDate } from "../AdminOrders/OrderAdmin";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { FiEdit } from "react-icons/fi";
import { Ring } from "@uiball/loaders";
import { MdClose } from "react-icons/md";
import Image from "next/image";
import logo from "@/public/images/tawasylogo.png";
import { BiStore } from "react-icons/bi";
import AdminLinks from "../AdminComponents/AdminLinks/AdminLinks";
import {
  createSellerContacts_endpoint,
  deleteSellerContacts_endpoint,
  editSellerContacts_endpoint,
  getSellerContacts_endpoint,
} from "@/api/endpoints/endPoints";

function SellersAdmin({ names, refetch }) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [openStores, setOpenStores] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const phoneNumberRef = useRef();

  async function EditSellerNumber(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await Api.post(`/api/admin/change-phone/${names.id}`, {
        new_phone_number: phoneNumberRef.current.value,
      });
      refetch();
      setIsSaving(false);
      setIsEditing(false);
    } catch (error) {
      setIsSaving(false);
    }
    setIsSaving(false);
  }

  return (
    <>
      <tr
        key={names.id}
        className="py-10 bg-gray-100 hover:bg-gray-200 font-medium   "
      >
        <td className="px-4 py-4">{names.id}</td>
        <td className="px-4 py-4 text-center ">{names.name}</td>
        <td className="px-4 py-4">{names.phone_number}</td>
        <td className="px-4 py-4">
          <div className="flex justify-center items-center h-full ">
            <button
              onClick={() => {
                setOpenStores(true);
              }}
              className="  flex justify-center items-center hover:opacity-75 rounded-lg bg-violet-800"
            >
              <BiStore className="text-white m-3 w-[20px] h-[20px]  " />
            </button>
          </div>
        </td>
        {/* <td className="px-4 py-4 w-[10%] ">
          {names.store_name ?? "this seller has no store. "}
        </td> */}
        <td className="px-4 py-4">{names.verify_code}</td>
        <td className="px-4 py-4">{names.city}</td>
        <td className="px-4 py-4">{names.location}</td>
        <td className="px-4 py-4">{names.longitude}</td>
        <td className="px-4 py-4">{names.latitude}</td>
        <td className="px-4 py-4  " width={`10%`}>
          {convertDateStringToDate(names.created_at)}
        </td>
        <td className="px-4 py-4" width={`10%`}>
          {convertDateStringToDate(names.updated_at)}
        </td>
        <td className="px-4 py-4">
          <div className="flex flex-wrap justify-start items-center">
            <button
              onClick={() => setIsEditing(true)}
              className="items-center px-2 py-2 m-1 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              <FiEdit />
            </button>
            <AdminLinks
              editEndPoint={editSellerContacts_endpoint}
              entityId={names.id}
              linksFor={names.name}
              className={`m-1`}
              getEndPoint={getSellerContacts_endpoint}
              postEndPoint={createSellerContacts_endpoint}
              resetEndPoint={deleteSellerContacts_endpoint}
            />
          </div>
        </td>
      </tr>

      <Dialog
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        open={isEditing}
        onClose={() => {
          setIsEditing(false);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className=" flex justify-between items-center border-b-2 border-gray-200">
          <p className="py-2 pl-3 text-gray-600">
            Edit Phone Number of seller : {names.name}
          </p>
          <div>
            <MdClose
              className="text-black border-b border-transparent hover:border-red-500 hover:text-red-500"
              onClick={() => setIsEditing(false)}
            />
          </div>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} margin={2}>
            <form onSubmit={EditSellerNumber}>
              <div className="md:grid md:grid-cols-2 sm:grid-cols-1 items-center">
                <div className="w-full px-4 py-3">
                  <input
                    type="text"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] w-full transition-all duration-700"
                    // placeholder="Brand name English - arabic"
                    defaultValue={names.phone_number}
                    inputMode="text"
                    ref={phoneNumberRef}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-start pt-6">
                <button
                  className="bg-skin-primary rounded-md text-white px-8 py-2"
                  type="submit"
                >
                  {isSaving == true ? (
                    <div className="w-full flex justify-center">
                      <Ring size={20} speed={2} lineWeight={5} color="white" />
                    </div>
                  ) : (
                    `Save`
                  )}
                </button>
              </div>
            </form>
          </Stack>
        </DialogContent>

        {/* <DialogActions className="grid md:grid-cols-2 grid-cols-1 "></DialogActions> */}
      </Dialog>

      <Dialog
        open={openStores}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        maxWidth={"lg"}
        fullWidth
        onClose={() => {
          setOpenStores(false);
        }}
      >
        <DialogTitle className="w-full flex justify-between items-center ">
          <p className="text-lg">Stores of ( {names.name} )</p>
          <MdClose
            onClick={() => {
              setOpenStores(false);
            }}
            className="w-[25px] h-[25px] text-black hover:text-red-500 border-b-2 border-transparent hover:border-red-500 transition-colors duration-300 ease-in-out "
          />
        </DialogTitle>
        <DialogContent className="w-full flex justify-start flex-col items-start space-y-3">
          {names.store_name.map((store, i) => {
            return (
              <div
                key={i}
                className="w-full px-3 py-1 rounded-lg border-2 border-skin-primary flex justify-around items-center space-x-2"
              >
                {/* <Image
                  src={store.store_logo ?? logo}
                  alt={store.store_name ?? "store"}
                  width={75}
                  height={75}
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.src = logo;
                    e.currentTarget.onerror = null;
                  }}
                /> */}
                <p className="font-medium">{store.store_name ?? " - "}</p>
                {store.role && (
                  <p>
                    (
                    {store.role == "super"
                      ? " Owner "
                      : " Normal User "}
                    )
                  </p>
                )}
              </div>
            );
          })}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SellersAdmin;

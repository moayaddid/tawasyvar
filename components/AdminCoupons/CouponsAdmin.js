import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { Ring } from "@uiball/loaders";
import { useState } from "react";
import { useRef } from "react";
import { convertDateStringToDate } from "../AdminOrders/OrderAdmin";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";

function CouponsAdmin({ names , refetch }) {
    
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const newCode = useRef();
  const newDiscount = useRef();
  // const newCode = useRef();
  const router = useRouter () ;
  const Api = createAxiosInstance(router);

  async function deleteCoupon () {
    setDeleting(true);
    try{
      const response = await Api.delete(`/api/admin/coupon/delete/${names.id}`);
      refetch();
    setIsDeleting(false);
    setDeleting(false);
    }catch(error){
    setDeleting(false);
    }
    setDeleting(false);
  }


  return (
    <>
      <tr
        key={names.id}
        className="py-10 bg-gray-100 hover:bg-gray-200 font-medium   "
      >
         <td className="px-4 py-4">{names.id}</td>
        <td className="px-4 py-4">{names.store_id}</td>
        <td className="px-4 py-4">{names.code}</td>
        <td className="px-4 py-4">{names.discount_value} %</td>
        <td className="px-4 py-4">{names.expire_date}</td>
        <td className="px-4 py-4  " width={`10%`} >{names.created_at ? convertDateStringToDate(names.created_at) : `None`}</td>
        <td className="px-4 py-4" width={`10%`} >{names.updated_at ? convertDateStringToDate(names.updated_at) : `None`}</td>
        <td class="px-4 py-4">
          <div class="flex-col lg:flex-row  items-center space-y-2 lg:space-y-0">
            <button
              class="items-center px-2 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none"
              onClick={() => {
                setIsDeleting(true);
              }}
            >
              <RiDeleteBin6Line />
            </button>
          </div>
        </td>
      </tr>

  
      <Dialog
        open={isDeleting}
        onClose={() => {
          setIsDeleting(false);
        }}
        fullWidth
      >
        <DialogTitle className="flex justify-between border-b-2 border-black ">
          <h4 className="">Delete Coupons:</h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <div className="flex flex-col justify-start items-start w-full ">
              <p className="text-lg ">
                Are you sure you want to delete this Coupons ?
              </p>
              <p className="text-xl pt-4">{names.code}</p>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="bg-green-700 px-8 py-3 text-white rounded-lg "
            data-dismiss="modal"
            onClick={deleteCoupon}
          >
            {deleting == true ? (
              <div className="flex justify-center items-center">
                <Ring size={25} lineWeight={5} speed={2} color="white" />
              </div>
            ) : (
              "Yes"
            )}
          </button>
          <button
            type="button"
            className="bg-zinc-500 px-8 py-3 text-white rounded-lg"
            data-dismiss="modal"
            onClick={() => {
              setIsDeleting(false);
            }}
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>

    </>
  );
}

export default CouponsAdmin;

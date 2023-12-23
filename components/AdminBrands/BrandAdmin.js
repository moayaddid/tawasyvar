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

function BrandAdmin({ names, refetch }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const newName = useRef();
  const [editing, setEditing] = useState(false);

  async function editBrand() {
    setEditing(true);
    try {
      const respones = await Api.put(`/api/admin/brand/update/${names.id}`, {
        name: newName.current.value,
      });
      refetch();
      setEditing(false);
      setIsEditing(false);
    } catch (error) {
      setEditing(false);
    }
    setEditing(false);
  }

  async function deleteBrand () {
    setDeleting(true);
    try{
      const response = await Api.delete(`/api/admin/brand/delete/${names.id}`);
      refetch();
    setDeleting(false);
    setIsDeleting(false);
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
        <td className="px-4 py-4">{names.name}</td>
        <td className="px-4 py-4  " width={`10%`}>
          {convertDateStringToDate(names.created_at)}
        </td>
        <td className="px-4 py-4" width={`10%`}>
          {convertDateStringToDate(names.updated_at)}
        </td>
        <td class="px-4 py-4">
          <div class="flex-col lg:flex-row items-center space-y-2 lg:space-y-0">
            <button
              onClick={() => setIsEditing(true)}
              class="items-center px-2 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              <FiEdit />
            </button>
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
        open={isEditing}
        onClose={() => {
          setIsEditing(false);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className="flex justify-between border-b-2 border-black">
          <h4 className="text-gray-500 md:pl-6 font-medium">
            Edit Brand : {names.name}
          </h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <div className="w-full">
              <div className="flex w-full items-center">
                {/* <form onSubmit={editBrand}> */}
                <label className="text-lg w-[20%] px-2">Brand Name :</label>
                <input
                  className="my-3 w-[80%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                  type="text"
                  defaultValue={names.name}
                  ref={newName}
                  required
                />
                {/* </form> */}
              </div>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="bg-lime-950 px-8 py-3 text-white rounded-lg "
            data-dismiss="modal"
            onClick={editBrand}
          >
            {editing == true ? (
              <div className="w-full flex justify-center">
                <Ring size={20} lineWeight={4} speed={2} color="white" />
              </div>
            ) : (
              `Save`
            )}
          </button>
          <button
            type="button"
            className="bg-zinc-500 px-8 py-3 text-white rounded-lg"
            data-dismiss="modal"
            onClick={() => {
              setIsEditing(false);
            }}
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleting}
        onClose={() => {
          setIsDeleting(false);
        }}
        fullWidth
      >
        <DialogTitle className="flex justify-between border-b-2 border-black ">
          <h4 className="">Delete Brand:</h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <div className="flex flex-col justify-start items-start w-full ">
              <p className="text-lg ">
                Are you sure you want to delete this Brand ?
              </p>
              <p className="text-xl pt-4">{names.name}</p>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="bg-green-700 px-8 py-3 text-white rounded-lg "
            data-dismiss="modal"
            onClick={deleteBrand}
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

export default BrandAdmin;

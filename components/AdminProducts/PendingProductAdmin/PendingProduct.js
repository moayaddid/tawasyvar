import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { Ring } from "@uiball/loaders";
import Image from "next/image";
import logo from "@/public/images/tawasylogo.png"

function AdminPendingProduct({ product , refetch }) {
    

  return (
    <>
      <tr
        key={product.id}
        className="py-10 bg-gray-100 hover:bg-gray-200 font-medium   "
      >
        <td className="px-4 py-4">{product.id}</td>
        <td className="px-4 py-4">{product.nameAr}</td>
        <td className="px-4 py-4">{product.nameEn}</td>
        <td className="px-4 py-4 ">{product.descAr}</td>
        <td className="px-4 py-4">{product.descEn}</td>
        <td className="px-4 py-4">{product.category}</td>
        <td className="px-4 py-4">
          <Image src={product.image ? product.image : logo} alt="photo" 
                 width={0}
                 height={0}
                 sizes="100vw"
                 style={{ width: "100%", height: "100%" }}  />
        </td>
        <td className="  ">
            <div className="w-min h-min mx-auto ">
              {/* <Ring size={15} lineWeight={5} speed={2} color="#ff6600" /> */}
            </div>
            <BsToggleOn
              className="cursor-pointer"
              style={{
                width: "18px",
                height: "25px",
                color: "#ff6600",
                margin: `auto`,
              }}
            />
            <BsToggleOff
              className="cursor-pointer"
              style={{
                width: "18px",
                height: "25px",
                color: "#ff6600",
                margin: `auto`,
              }}
            />
        </td>
        <td className="px-4 py-4">{product.brand && product.brand}</td>
        <td className="px-4 py-4">{product.sku}</td>
        <td className="px-4 py-4">{product.code}</td>
        <td>{product.sortOrder}</td>
        <td class="px-4 py-4">
          <div class="flex-col lg:flex-row  items-center space-y-2 lg:space-y-0">
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
        onClose={() => {
          setIsEditing(false);
        }}
        fullWidth
      >
        <DialogTitle className="flex justify-between border-b-2 border-black ">
          <h4 className="">Edit Product: {product.name}</h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <input
              className="mb-7 text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
              type="numbere"
              placeholder={product.price}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="bg-lime-950 px-8 py-3 text-white rounded-lg "
            data-dismiss="modal"
          >
              <div className="flex justify-center items-center">
                <Ring size={25} lineWeight={5} speed={2} color="white" />
              </div>
           
              {"Save"}
          </button>
          <button
            type="button"
            className="bg-zinc-500 px-8 py-3 text-white rounded-lg"
            data-dismiss="modal"
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
      >
        <DialogTitle className="flex justify-between border-b-2 border-black ">
          <h4 className="">Delete Product:</h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <div className="flex flex-col justify-start items-start w-full ">
              <p className="text-lg ">
                Are you sure you want to delete this product from your store ?
              </p>
              <p className="text-xl">{product.name}</p>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="bg-green-700 px-8 py-3 text-white rounded-lg "
            data-dismiss="modal"
          >
              <div className="flex justify-center items-center">
                <Ring size={25} lineWeight={5} speed={2} color="white" />
              </div>
    
          </button>
          <button
            type="button"
            className="bg-zinc-500 px-8 py-3 text-white rounded-lg"
            data-dismiss="modal"
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AdminPendingProduct;

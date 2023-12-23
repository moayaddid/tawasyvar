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
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import Image from "next/image";
import ImageUpload from "../ImageUpload/ImageUpload";
import { convertDate } from "../SellerOrders/sellerOrder";
import TawasyLoader from "../UI/tawasyLoader";
import { convertDateStringToDate } from "../AdminOrders/OrderAdmin";
import { toast } from "react-toastify";
import logo from "@/public/images/tawasylogo.png"

function StoreTypeADSAdmin({ storetypeads, refetch }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [logoImage, setLogoImage] = useState();
  const [isSaving, setIsSaving] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);

  function handleLogoImage(data) {
    setLogoImage(data);
  }

  async function openDialog() {
    setIsEditing(true);
  }

  async function deleteAd() {
    setDeleting(true);
    try {
      const response = await Api.delete(
        `/api/admin/ad/store-type/website/delete/${storetypeads.id}`
      );
      refetch();
      setDeleting(false);
      setIsDeleting(false);
    } catch (error) {
      setDeleting(false);
    }
    setDeleting(false);
  }

  async function editAd() {
    if (logoImage) {
      setIsSaving(true);
      try {
        const response = await Api.post(
          `/api/admin/ad/store-type/website/edit/${storetypeads.id}`,
          {
            image: logoImage,
          },
          {
            headers: { "Content-Type": `multipart/form-data` },
          }
        );
        refetch();
        setIsEditing(false);
        setIsSaving(false);
      } catch (error) {
        setEditing(false);
      }
      setIsSaving(false);
    } else {
      toast.error(`Please Select a photo to add | الرجاء اختيار صورة`, {
        toastId : `Please Select a photo to add | الرجاء اختيار صورة`,
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
  }

  return (
    <>
      <tr
        key={storetypeads.id}
        className="py-10 bg-gray-100 hover:bg-gray-200 font-medium   "
      >
        <td className="px-4 py-4">{storetypeads.id}</td>
        <td className="px-4 py-4 flex justify-center">
          <Image
            src={storetypeads.image ? storetypeads.image : logo}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "200px", height: "auto" }}
          />
        </td>
        <td className="px-4 py-4">{storetypeads[`store type`]}</td>
        <td className="px-4 py-4">
          {convertDateStringToDate(storetypeads.created_at)}
        </td>
        <td className="px-4 py-4">
          {convertDateStringToDate(storetypeads.updated_at)}
        </td>

        <td class="px-4 py-4">
          <div class="flex-col lg:flex-row  items-center space-y-2 lg:space-y-0">
            <button
              onClick={openDialog}
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
        maxWidth="sm"
      >
        <DialogTitle className="flex justify-between border-b-2 border-black">
          <h4 className="text-gray-500 md:pl-6 font-medium">
            Edit Website Store Type page AD : {storetypeads[`store type`]} / Ad
            id : {storetypeads.id}
          </h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <form>
              <div className="md:grid md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <ImageUpload
                    onSelectImage={handleLogoImage}
                    width={100}
                    height={100}
                    defaultImage={storetypeads.image}
                  />
                </div>
              </div>
              <hr className="text-gray-400" />
              <div className="w-full flex justify-center items-center">
                <button
                  type="button"
                  className="bg-skin-primary px-8 py-3 hover:bg-orange-500 text-white rounded-lg w-[50%] mx-auto "
                  data-dismiss="modal"
                  onClick={editAd}
                >
                  {isSaving == true ? (
                    <div className="flex justify-center items-center">
                      <Ring size={20} lineWeight={4} speed={2} color="white" />
                    </div>
                  ) : (
                    "Save Edits "
                  )}
                </button>
              </div>
            </form>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleting}
        onClose={() => {
          setIsDeleting(false);
        }}
        fullWidth
      >
        <DialogTitle className="flex justify-between border-b-2 border-black ">
          <h4 className="">Delete Store Type ADS:</h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <div className="flex flex-col justify-start items-start w-full ">
              <p className="text-lg ">
                Are you sure you want to delete this Delete Store Type ADS ?
              </p>
              <p className="text-xl pt-4">{storetypeads.id}</p>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <div className="w-[50%] flex justify-end items-center gap-3 " >
            <button className="px-2 py-1 bg-red-500 w-[50%] text-white rounded-lg " onClick={deleteAd} >
              {deleting == true ? (
                <div className="flex justify-center items-center">
                  <Ring size={20} lineWeight={4} speed={2} color="white" />
                </div>
              ) : (
                `Yes`
              )}
            </button>
            <button className="px-2 py-1 bg-gray-500 w-[50%] text-white rounded-lg" onClick={() => setIsDeleting(false)} >
                No
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default StoreTypeADSAdmin;

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
import HomeADS from "@/pages/admin/Ads/HomeADS";
import { convertDateStringToDate } from "../AdminOrders/OrderAdmin";
import { toast } from "react-toastify";
import logo from '@/public/images/tawasylogo.png';

function HomeADSAdmin({ ads, refetch }) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [open, openchange] = useState(false);
  const [openmobile, openmobilechange] = useState(false);
  const [image, setImage] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const storetypeId = useRef();

  const functionopenpopup = () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };

  function handleADSImage(image) {
    setImage(image);
  }

  async function saveEdits() {
    if (image) {
      setIsEditing(true);
      try {
        const response = await Api.post(
          `/api/admin/ad-website/edit/${ads.id}`,
          {
            new_image: image,
          },
          {
            headers: { "Content-Type": `multipart/form-data` },
          }
        );
        refetch();
        openchange(false);
        setIsEditing(false);
      } catch (error) {
        setIsEditing(false);
      }
      setIsEditing(false);
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
        key={ads.id}
        className="py-10 bg-gray-100 hover:bg-gray-200 font-medium   "
      >
        <td className="px-4 py-4">{ads.id}</td>
        <td className="px-4 py-4 flex justify-center">
          <Image
            src={ads.image_url ? ads.image_url : logo}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "200px", height: "auto" }}
          />
        </td>
        <td className="px-4 py-4">{convertDateStringToDate(ads.created_at)}</td>
        <td className="px-4 py-4">{convertDateStringToDate(ads.updated_at)}</td>

        <td class="px-4 py-4">
          <div class="flex-col lg:flex-row  items-center space-y-2 lg:space-y-0">
            <button
              onClick={functionopenpopup}
              class="items-center px-2 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              <FiEdit />
            </button>
          </div>
        </td>
      </tr>

      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
        <DialogTitle className="flex justify-between border-b-2 border-black">
          <h4 className="text-gray-500 md:pl-6 font-medium">
            Edit Website Home page AD with ID :{ads.id}
          </h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <div className="md:grid md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <ImageUpload
                  onSelectImage={handleADSImage}
                  width={100}
                  height={100}
                  defaultImage={ads.image_url}
                />
              </div>
            </div>
            <hr className="text-gray-400" />
            <div className="w-full flex justify-center items-center">
              <button
                type="button"
                className="bg-skin-primary px-8 py-3 hover:bg-orange-500 text-white rounded-lg w-[40%] mx-auto "
                data-dismiss="modal"
                onClick={saveEdits}
              >
                {isEditing == true ? (
                  <div className="flex justify-center items-center">
                    <Ring size={20} lineWeight={4} speed={2} color="white" />
                  </div>
                ) : (
                  `Save`
                )}
              </button>
            </div>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default HomeADSAdmin;

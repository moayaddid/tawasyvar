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
import Image from "next/image";
import logo from "@/public/images/tawasylogo.png";
import ImageUpload from "../ImageUpload/ImageUpload";
import AdminNotes from "../AdminComponents/AdminNotes";
import {
  createBrandContacts_endpoint,
  deleteBrandContacts_endpoint,
  editBrandContacts_endpoint,
  getBrandContacts_endpoint,
  getBrandNote_endpoint,
  postBrandNote_endpoint,
} from "@/api/endpoints/endPoints";
import { BiSolidContact } from "react-icons/bi";
import AdminLinks from "../AdminComponents/AdminLinks/AdminLinks";

function BrandAdmin({ names, refetch }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const newName = useRef();
  const newNameEn = useRef();
  const newNameAr = useRef();
  const newDescEn = useRef();
  const newDescAr = useRef();
  const [brandLogo, setBrandLogo] = useState();
  const [brandBanner, setBrandBanner] = useState();
  const [editing, setEditing] = useState(false);

  async function saveEdits() {
    setEditing(true);
    let editData = {};
    const addIfDifferent = (fieldValue, fieldName) => {
      const originalValue = names[fieldName];
      // console.log(fieldValue);
      if (
        fieldValue !== undefined &&
        fieldValue.trim() !== "" &&
        fieldValue !== originalValue
      ) {
        editData[fieldName] = fieldValue;
      }
    };
    addIfDifferent(newNameAr.current.value, "name_ar");
    addIfDifferent(newName.current.value, "name");
    addIfDifferent(newNameEn.current.value, "name_en");
    addIfDifferent(newDescAr.current.value, "description_ar");
    addIfDifferent(newDescEn.current.value, "description_en");
    if (brandLogo) {
      // editData.image = logoImage;
      try {
        const response2 = await Api.post(
          `/api/admin/brand-logo/${names.id}`,
          {
            logo: brandLogo,
          },
          {
            headers: { "Content-Type": `multipart/form-data` },
          }
        );
        setBrandLogo();
      } catch (error) {
        // console.log(error);
      }
    }
    if (brandBanner) {
      // editData.image = logoImage;
      try {
        const response2 = await Api.post(
          `/api/admin/brand-image/${names.id}`,
          {
            image: brandBanner,
          },
          {
            headers: { "Content-Type": `multipart/form-data` },
          }
        );
        setBrandBanner();
      } catch (error) {
        // console.log(error);
      }
    }
    if (Object.keys(editData).length < 1) {
      setIsEditing(false);
      setEditing(false);
      return;
    } else {
      try {
        const response = await Api.put(
          `/api/admin/brand/update/${names.id}`,
          editData
        );
        refetch();
        setEditing(false);
        setIsEditing(false);
      } catch (error) {
        setEditing(false);
      } finally {
        setEditing(false);
      }
      setEditing(false);
    }
  }

  async function deleteBrand() {
    setDeleting(true);
    try {
      const response = await Api.delete(`/api/admin/brand/delete/${names.id}`);
      refetch();
      setDeleting(false);
      setIsDeleting(false);
    } catch (error) {
      setDeleting(false);
    }
    setDeleting(false);
  }

  // console.log(names);

  return (
    <>
      <tr
        key={names.id}
        className="py-10 bg-gray-100 hover:bg-gray-200 font-medium   "
      >
        <td className="px-4 py-4">{names.id}</td>
        <td className="px-4 py-4">{names.name}</td>
        <td className="px-4 py-4">{names.name_en ?? ` - `}</td>
        <td className="px-4 py-4">{names.name_ar ?? ` - `}</td>
        <td className="px-4 py-4">
          <Image
            src={names.logo ?? logo}
            alt={names.name}
            width={100}
            height={100}
            className="object-contain min-w-[100px] min-h-[100px] object-center"
          />
        </td>
        <td className="px-4 py-4  " width={`10%`}>
          {convertDateStringToDate(names.created_at)}
        </td>
        <td className="px-4 py-4" width={`10%`}>
          {convertDateStringToDate(names.updated_at)}
        </td>
        <td className="px-4 py-4">
          <div className="flex-col lg:flex-row items-center space-y-2 lg:space-y-0">
            <button
              onClick={() => setIsEditing(true)}
              className="items-center mx-1 px-2 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              <FiEdit />
            </button>
            <button
              className="items-center mx-1 px-2 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none"
              onClick={() => {
                setIsDeleting(true);
              }}
            >
              <RiDeleteBin6Line />
            </button>
            <AdminNotes
              NotesFor={`${names.name}`}
              entityId={names.id}
              getEndpoint={getBrandNote_endpoint}
              postEndpoint={postBrandNote_endpoint}
              className={`mx-1`}
            />
            <AdminLinks
              entityId={names.id}
              linksFor={names.name}
              editEndPoint={editBrandContacts_endpoint}
              getEndPoint={getBrandContacts_endpoint}
              postEndPoint={createBrandContacts_endpoint}
              resetEndPoint={deleteBrandContacts_endpoint}
            />
          </div>
        </td>
      </tr>

      <Dialog
        open={isEditing}
        onClose={() => {
          setIsEditing(false);
        }}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
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
              <div className="flex flex-col justify-start w-full items-center space-y-2">
                {/* <form onSubmit={editBrand}> */}
                <div className="w-full flex flex-wrap items-center space-x-2 space-y-2">
                  <label htmlFor="name" className="text-lg px-2">
                    Brand Name :
                  </label>
                  <input
                    id="name"
                    className="my-3 w-[80%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="text"
                    defaultValue={names.name}
                    ref={newName}
                  />
                </div>
                <div className="w-full flex flex-wrap items-center space-x-2 space-y-2">
                  <label htmlFor="nameen" className="text-lg  px-2">
                    Brand English Name :
                  </label>
                  <input
                    id="nameen"
                    type="text"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] w-full transition-all duration-700"
                    placeholder="Brand English Name  "
                    inputMode="text"
                    defaultValue={names.name_en}
                    ref={newNameEn}
                  />
                </div>
                <div className="w-full flex flex-wrap items-center space-x-2 space-y-2 ">
                  <label htmlFor="namear" className="text-lg  px-2">
                    Brand Arabic Name :
                  </label>
                  <input
                    id="namear"
                    type="text"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] w-full transition-all duration-700"
                    placeholder="Brand Arabic Name"
                    inputMode="text"
                    defaultValue={names.name_ar}
                    ref={newNameAr}
                  />
                </div>
                <div className="w-full flex flex-wrap items-center space-x-2 space-y-2">
                  <label htmlFor="descen" className="text-lg  px-2">
                    English Description :
                  </label>
                  <textarea
                    id="descen"
                    type="text"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] w-full transition-all duration-700"
                    placeholder="Brand English Description "
                    inputMode="text"
                    defaultValue={names.description_en}
                    ref={newDescEn}
                  />
                </div>
                <div className="w-full flex flex-wrap items-center space-x-2 space-y-2">
                  <label htmlFor="descar" className="text-lg  px-2">
                    Arabic Description :
                  </label>
                  <textarea
                    id="descar"
                    type="text"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] w-full transition-all duration-700"
                    placeholder="Brand Arabic Description "
                    inputMode="text"
                    defaultValue={names.description_ar}
                    ref={newDescAr}
                  />
                </div>
                <div className="w-full flex flex-wrap justify-around items-center space-x-2 ">
                  <div className="w-max flex flex-wrap items-center space-x-2">
                    <label htmlFor="brandlogo">
                      Brand Logo :
                      <ImageUpload
                        id="brandlogo"
                        defaultImage={names.logo}
                        onSelectImage={(image) => {
                          setBrandLogo(image);
                        }}
                        width={100}
                        height={100}
                      />
                    </label>
                  </div>
                  <div className="w-max flex flex-wrap items-center space-x-2">
                    <label htmlFor="brandbanner">
                      Brand Banner :
                      <ImageUpload
                        id="brandbanner"
                        defaultImage={names.image}
                        onSelectImage={(image) => {
                          setBrandBanner(image);
                        }}
                        width={100}
                        height={100}
                      />
                    </label>
                  </div>
                </div>
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
            onClick={saveEdits}
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

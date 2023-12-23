import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Image from "next/image";
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { Ring } from "@uiball/loaders";
import ImageUpload from "../ImageUpload/ImageUpload";
import { convertDateStringToDate } from "../AdminOrders/OrderAdmin";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import Category from "../AdminStoreTypeCategory/AdminStoreTypeCategory";
import { MdAdd, MdClose, MdHdrPlus } from "react-icons/md";
import TawasyLoader from "../UI/tawasyLoader";
import { useQuery } from "react-query";
import logo from "@/public/images/tawasylogo.png";
import { toast } from "react-toastify";

function StoreTypeAdmin({ names, refetch }) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [isEditing, setIsEditing] = useState(false);
  const {
    data: storeTypeCategories,
    isLoading: StoreTypeLoading,
    refetch: refetchStoreTypeCategories,
  } = useQuery([`storeTypeCategories`, isEditing], fetchStoreTypeCategories, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: isEditing,
  });

  async function fetchStoreTypeCategories() {
    try {
      return await Api.get(`/api/admin/store-types/categories/${names.id}`);
    } catch (error) {}
  }

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addCategory, setAddCategory] = useState(false);
  // const [storeTypeCategories, setStoreTypeCategories] = useState();
  const [categories, setCategories] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [savingCategory, setSavingCategory] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [storeTypeImage, setStoreTypeImage] = useState();
  const newNameAr = useRef();
  const newNameEn = useRef();
  const newDescEn = useRef();
  const newDescAr = useRef();
  const newsortOrder = useRef();

  function handleLogoImage(data) {
    setStoreTypeImage(data);
  }

  async function editStoreType() {
    // console.log(`editing`);
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
    addIfDifferent(newNameEn.current.value, "name_en");
    addIfDifferent(newDescAr.current.value, "description_ar");
    addIfDifferent(newDescEn.current.value, "description_en");
    addIfDifferent(newsortOrder.current.value, "sort_order");

    if (storeTypeImage) {
      // editData.image = logoImage;
      try {
        const response2 = await Api.post(
          `/api/admin/store-types/${names.id}/edit-image`,
          {
            image_path: storeTypeImage,
          },
          {
            headers: { "Content-Type": `multipart/form-data` },
          }
        );
        setStoreTypeImage();
      } catch (error) {
        // console.log(error);
      }
    }

    if (Object.keys(editData).length > 0) {
    try {
      const response = await Api.put(
        `/api/admin/store-type/update/${names.id}`,
        editData
      );
      refetch();
      setEditing(false);
      setIsEditing(false);
    } catch (error) {
      setEditing(false);
    }
    } else {
      setEditing(false);
      // return
      // toast.error(`Please fill all the fields`, {
      //   toastId: `Please fill all the fields`,
      //       position: "top-right",
      //       autoClose: 5000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //       theme: "colored",
      // })
    }
    // console.log(editData);
    setEditing(false);
  }

  async function openEditor() {
    setIsEditing(true);
    setIsLoading(true);
    try {
      const responseCategories = await Api.get(`/api/admin/get-categories`);
      setCategories(responseCategories.data.categories);
    } catch (error) {}
    // try{
    //   const responseStoreTypeCategories = await Api.get(``) ;
    //   setStoreTypeCategories(responseStoreTypeCategories.data.categories);
    // }catch(error){}
    setIsLoading(false);
  }

  // if(storeTypeCategories){
  //   // console.log(`store type catygories`);
  //   // console.log(storeTypeCategories);
  // }

  async function AddCategory() {
    setSavingCategory(true);
    try {
      const response = await Api.post(
        `/api/admin/store-types/${names.id}/categories/attach`,
        {
          category_id: selectedCategory,
        }
      );
      refetchStoreTypeCategories();
      setAddCategory(false);
      setSavingCategory(false);
    } catch (error) {
    setSavingCategory(false);
    }
  }

  return (
    <>
      <tr
        key={names.id}
        className="py-5 bg-gray-100 hover:bg-gray-200 font-medium   "
        dir="ltr"
      >
        <td className="px-4 py-4">{names.id}</td>
        <td className="px-4 py-4">{names.name_ar}</td>
        <td className="px-4 py-4">{names.name_en}</td>
        <td className="px-4 py-4">{names.description_en}</td>
        <td className="px-4 py-4">{names.description_ar}</td>
        <td className="px-4 py-4">{names.sort_order}</td>
        <td className=" flex justify-center">
          <Image
            src={names.image ? names.image : logo}
            alt="photo"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "250px", height: "250px" }}
            className="object-contain "
          />
        </td>
        <td className="px-4 py-4  " width={`10%`}>
          {convertDateStringToDate(names.created_at)}
        </td>
        <td className="px-4 py-4" width={`10%`}>
          {convertDateStringToDate(names.updated_at)}
        </td>
        <td class="px-4 py-4">
          <div class="flex-col lg:flex-row lg:space-x-2 items-center space-y-2 lg:space-y-0">
            <button
              onClick={openEditor}
              class="items-center px-2 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              <FiEdit />
            </button>
            {/* <button
              class="items-center px-2 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none"
              onClick={() => {
                setIsDeleting(true);
              }}
            >
              <RiDeleteBin6Line />
            </button> */}
          </div>
        </td>
      </tr>

      <Dialog
        open={isEditing}
        onClose={() => {
          setIsEditing(false);
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle className="flex justify-between border-b-2 border-black">
          <h4 className="text-gray-500 md:pl-6 font-medium">
            Edit Store Type : {names.nameEn}
          </h4>
        </DialogTitle>
        <DialogContent>
          {isLoading == true || StoreTypeLoading == true ? (
            <div className="w-full h-full">
              <TawasyLoader width={200} height={200} />
            </div>
          ) : (
            <Stack spacing={1} margin={3}>
              <div className="md:grid md:grid-cols-2 gap-6 pb-5 ">
                <div className="flex w-full items-center">
                  <label className="text-lg w-[30%] px-2">NameAr :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="text"
                    defaultValue={names.name_ar}
                    ref={newNameAr}
                    required
                  />
                </div>

                <div className="flex items-center">
                  <label className="text-lg w-[30%] px-2">NameEn :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="text"
                    defaultValue={names.name_en}
                    ref={newNameEn}
                    required
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">Sort Order :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="number"
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    }}
                    defaultValue={names.sort_order}
                    ref={newsortOrder}
                    required
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">Arabic Desc :</label>
                  <textarea
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="number"
                    defaultValue={names.description_ar}
                    ref={newDescAr}
                    required
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">English Desc :</label>
                  <textarea
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="number"
                    defaultValue={names.description_en}
                    ref={newDescEn}
                    required
                  />
                </div>

                <div className="flex items-center">
                  <ImageUpload
                    onSelectImage={handleLogoImage}
                    width={100}
                    height={100}
                    defaultImage={names.image}
                  />
                </div>
              </div>
              <div className="flex flex-wrap justify-start items-center gap-2">
                Categories of this store type :
                {storeTypeCategories &&
                  storeTypeCategories.data.categories &&
                  storeTypeCategories.data.categories.map((category) => {
                    return (
                      <Category
                        key={category.id}
                        category={category}
                        storeTypeId={names.id}
                        refetch={() => refetchStoreTypeCategories()}
                      />
                    );
                  })}
                {/* <Category storeType={names.name_en} refetch={() => refetch()} /> */}
                {addCategory == true && (
                  <div className="flex justify-start items-center gap-2">
                    <select
                      className="md:w-[400px] w-full  form-select outline-none bg-transparent border-b-2 border-gray-300 "
                      aria-label="Category"
                      name="category"
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                      }}
                      required
                    >
                      <option
                        className="bg-white text-[#C3C7CE] "
                        value
                        selected
                        disabled
                      >
                        Select a Category
                      </option>
                      {categories &&
                        categories.map((category) => {
                          return (
                            <option key={category.id} value={category.id}>
                              {category.name_en}
                            </option>
                          );
                        })}
                    </select>
                    {savingCategory == true ? (
                      <Ring
                        size={15}
                        speed={2}
                        lineWeight={5}
                        color="#FF6600"
                      />
                    ) : (
                      <div className="flex justify-start gap-3">
                        <MdAdd
                          className="text-gray-500 hover:text-green-500 w-[15px] h-[17px] border-b-2 border-transparent hover:border-green-500 transition-all duration-700 cursor-pointer "
                          onClick={AddCategory}
                        />
                        <MdClose
                          className="text-gray-500 hover:text-red-500 w-[15px] h-[17px] border-b-2 border-transparent hover:border-red-500 transition-all duration-700 cursor-pointer "
                          onClick={() => setAddCategory(false)}
                        />
                      </div>
                    )}
                  </div>
                )}
                {addCategory == false && (
                  <div
                    className="flex justify-between items-center bg-gray-500 hover:bg-green-700 rounded-full cursor-pointer px-2 py-1 gap-2"
                    onClick={() => setAddCategory(true)}
                  >
                    <div className="text-md text-white text-center flex justify-center items-center ">
                      Add Category +
                    </div>
                  </div>
                )}
              </div>
            </Stack>
          )}
        </DialogContent>
        <DialogActions className="flex space-x-4" >
          <button
            type="button"
            className="bg-lime-950 px-8 py-3 mx-4 text-white rounded-lg "
            data-dismiss="modal"
            onClick={editStoreType}
          >
            {editing == true ? (
              <div className="w-full flex justify-center">
                <Ring size={20} speed={2} lineWeight={5} color="white" />
              </div>
            ) : (
              "Save"
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

      {/* <Dialog
        open={isDeleting}
        onClose={() => {
          setIsDeleting(false);
        }}
        fullWidth
      >
        <DialogTitle className="flex justify-between border-b-2 border-black ">
          <h4 className="">Delete Store Type:</h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <div className="flex flex-col justify-start items-start w-full ">
              <p className="text-lg ">
                Are you sure you want to delete this Store Type ?
              </p>
              <p className="text-xl pt-4">{names.nameEn}</p>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="bg-green-700 px-8 py-3 text-white rounded-lg "
            data-dismiss="modal"
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
      </Dialog> */}
    </>
  );
}

export default StoreTypeAdmin;

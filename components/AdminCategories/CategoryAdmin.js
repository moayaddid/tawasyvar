import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { Ring } from "@uiball/loaders";
import { convertDateStringToDate } from "../AdminOrders/OrderAdmin";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { toast } from "react-toastify";
import AdminNotes from "../AdminComponents/AdminNotes";
import { getCategoryNote_endpoint, postCategoryNote_endpoint } from "@/api/endpoints/endPoints";

function CategoryAdmin({ names, refetch }) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editing, setEditing] = useState(false);
  const newNameAr = useRef();
  const newNameEn = useRef();
  const newsortOrder = useRef();

  async function editCategory(e) {
    e.preventDefault();
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
    addIfDifferent(newsortOrder.current.value, "sort_order");

    // console.log(editData);
    if(Object.keys(editData).length < 1){
      // toast.error(`Please fill all the fields | الرجاء تعبئة جميع الحقول المطلوبة `, {
      //   toastId: `Please fill all the fields | الرجاء تعبئة جميع الحقول المطلوبة `,
      //       position: "top-right",
      //       autoClose: 5000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //       theme: "colored",
      // });
      setIsEditing(false);
      setEditing(false);
      return;
    }else{
      try {
        const response = await Api.put(
          `/api/admin/category/update/${names.id}`,
          editData
          );
          refetch();
          setEditing(false);
          setIsEditing(false);
        } catch (error) {
          setEditing(false);
        }
        setEditing(false);
      }
    }

  // async function deleteCategory() {
  //   setDeleting(true);
  //   try{
  //     const resposne = await Api.delete(``)
  //   }catch(error){

  //   }
  // }

  return (
    <>
      <tr
        key={names.id}
        className="py-10 bg-gray-100 hover:bg-gray-200 font-medium   "
      >
        <td className="px-4 py-4">{names.id}</td>
        <td className="px-4 py-4">{names.name_ar}</td>
        <td className="px-4 py-4">{names.name_en}</td>
        <td className="px-4 py-4">{names.sort_order}</td>
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
            <AdminNotes
              NotesFor={`${names.name_en}`}
              entityId={names.id}
              getEndpoint = {getCategoryNote_endpoint}
              postEndpoint={postCategoryNote_endpoint}
              className={`mx-1`}
            />
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
            Edit Category : {names.name_en}
          </h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <form onSubmit={editCategory}>
              <div className="md:grid md:grid-cols-2 gap-6">
                <div className="flex w-full items-center">
                  <label className="text-lg w-[30%] px-2">Arabic Name :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="text"
                    defaultValue={names.name_ar}
                    ref={newNameAr}
                  />
                </div>

                <div className="flex items-center">
                  <label className="text-lg w-[30%] px-2">English Name :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="text"
                    defaultValue={names.name_en}
                    ref={newNameEn}
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
                  />
                </div>
              </div>
              <div className="w-full flex justify-center items-center gap-5 mx-auto pt-5 ">
                <button
                  type="submit"
                  className="bg-lime-950 w-[20%] px-8 py-3 text-white rounded-lg "
                  data-dismiss="modal"
                >
                  {editing == true ? (
                    <div className="w-full flex justify-center">
                      <Ring size={20} speed={2} lineWeight={5} color="white" />
                    </div>
                  ) : (
                    `Save`
                  )}
                </button>
                <button
                  type="button"
                  className="bg-zinc-500 px-8 py-3 w-[20%] text-white rounded-lg"
                  data-dismiss="modal"
                  onClick={() => {
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Stack>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>

      {/* <Dialog
        open={isDeleting}
        onClose={() => {
          setIsDeleting(false);
        }}
        fullWidth
      >
        <DialogTitle className="flex justify-between border-b-2 border-black ">
          <h4 className="">Delete Category:</h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <div className="flex flex-col justify-start items-start w-full ">
              <p className="text-lg ">
                Are you sure you want to delete this Category ?
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

export default CategoryAdmin;

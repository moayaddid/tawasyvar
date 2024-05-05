import createAxiosInstance from "@/API";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { MdClose, MdDelete } from "react-icons/md";

function SellerEmployee({ employee, refetch }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const {t} = useTranslation("");

  async function deleteEmployee() {
    setDeleting(true);
    try {
      const response = await Api.delete(
        `/api/seller/delete-seller/${employee.seller_id}`
      );
      refetch();
      setDeleting(false);
      setOpenDelete(false);
    } catch (error) {
      setDeleting(false);
    }
    setDeleting(false);
  }

  return (
    <tr className="odd:bg-gray-200 even:bg-gray-100" >
      <td className="px-2 py-2 text-center ">{employee.seller_name}</td>
      <td className="px-2 py-1 text-center">{employee.seller_phone_number}</td>
      <td className="px-2 py-1 text-center">{employee.role == "normal" ? "Normal Seller" : " Super User "}</td>
      {/* <td className="px-2 py-1">{employee.address}</td> */}
      <td className="px-2 py-1">
        <div className="flex w-full justify-center items-center ">
          <button
            className="bg-red-500 text-white hover:opacity-80 p-2 rounded-lg"
            onClick={() => {
              setOpenDelete(true);
            }}
          ><MdDelete className="text-white w-[20px] h-[20px] " /></button>
        </div>
      </td>

      <Dialog
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
        }}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="w-full flex justify-between items-center">
          <div className="flex justify-start items-center space-x-2">
            <p>{t("seller.employees.deleteEmployee")} : </p>
            <p>{employee.name}</p>
          </div>
          <MdClose
            onClick={() => {
              setOpenDelete(false);
            }}
            className="w-[24px] h-[24px] text-black hover:text-red-500 border-b-2 border-transparent hover:border-red-500 transition-all duration-300 ease-in-out"
          />
        </DialogTitle>
        <DialogContent className="flex flex-col justify-start items-center space-y-3">
          <p>{t("seller.employees.rusDelete")}</p>
          <p>{employee.name}</p>
        </DialogContent>
        <DialogActions className="w-full flex justify-center items-center space-x-3">
          <button
            className="text-center text-white bg-red-500 hover:opacity-75 rounded-lg md:w-[30%] w-[45%] px-2 py-1"
            onClick={() => {
              setOpenDelete(false);
            }}
          >
            {t("seller.employees.no")}
          </button>
          {deleting == true ? (
            <div className="text-center text-white bg-green-500 hover:opacity-75 rounded-lg md:w-[30%] w-[45%] px-2 py-1 flex justify-center items-center ">
              <Ring color="white" speed={3} lineWeight={5} size={20} />
            </div>
          ) : (
            <button
              className="text-center text-white bg-green-500 hover:opacity-75 rounded-lg md:w-[30%] w-[45%] px-2 py-1"
              onClick={deleteEmployee}
            >
              {t("seller.employees.yes")}
            </button>
          )}
        </DialogActions>
      </Dialog>
    </tr>
  );
}

export default SellerEmployee;

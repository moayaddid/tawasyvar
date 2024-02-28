import Image from "next/image";
import logo from "@/public/images/tawasylogo.png";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useState } from "react";
// import logo from "@/public/images/tawasylogo.png"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { MdClose } from "react-icons/md";
import { Ring } from "@uiball/loaders";

function AdminAttachedProduct({ product, refetch, selectedStoreId }) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [open, setOpen] = useState(false);
  const [isDettaching, setIsDettaching] = useState(false);
  const [openDettach, setOpenDettach] = useState(false);

  function openAttached() {
    setOpen(true);
  }

  function closeAttached() {
    setOpen(false);
  }

  async function dettachProduct() {
    setIsDettaching(true);
    try {
      const response = await Api.post(
        `/api/admin/detach-product-waffer/${product.store_id}`
        // `/api/admin/detach-product-waffer/${storeId}` 
        , {
          attached_id : product.attached_id ,
          api : selectedStoreId
        }
      );
      refetch();
      setIsDettaching(false);
      setOpenDettach(false);
    } catch (error) {
      setIsDettaching(false);
    }
    setIsDettaching(false);
  }

  let varis = [] ;

  if(product.combination){
    product.combination?.variations.map((variant) => {
      if(variant.option){
        varis.push(variant.option);
      }
    })
  }

  return (
    <>
      <tr
        key={product.id}
        className="py-3 px-0 bg-gray-100 hover:bg-gray-200 font-medium  "
      >
        <td class="px-4 py-4">
          <div class="flex md:flex-wrap flex-col items-center space-y-3 lg:space-y-1">
            <button
              onClick={openAttached}
              class="items-center px-2 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              <FiEdit />
            </button>
          </div>
        </td>
        <td className="px-4 py-4">{product.name}</td>
        <td className="px-4 py-4">{product.combination ? varis.join(" - ") : `-`}</td>
        <td className="px-4 py-4">
          <div className="flex justify-center items-center">
            <Image
              src={product.image ? product.image : logo}
              alt="photo"
              width={150}
              height={150}
              className="object-contain max-h-[150px] max-w-[100px] min-h-[150px] min-w-[150px] "
            />
          </div>
        </td>
      </tr>

      <Dialog
        open={open}
        fullWidth
        maxWidth="lg"
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle className="flex justify-between items-center">
          <p>Attached Product : {product.name} {product.combination && `/ ${varis}`} </p>
          <MdClose
            onClick={closeAttached}
            className="text-red-500 text-[25px] cursor-pointer border-b-2 border-transparent hover:border-red-600 hover:text-red-600 transition-all duration-500"
          />
        </DialogTitle>
        <hr />
        <DialogContent className="w-full flex flex-col justify-start items-start space-y-4">
          <div className="flex flex-col w-full justify-start items-start space-y-1">
            <p className="text-lg">This product is attached to :</p>
            <div className="flex flex-wrap justify-start items-center space-x-1">
              <p>{product.waffer_name}</p>
              <Image
                src={product.waffer_image ? product.waffer_image : logo}
                alt="photo"
                width={150}
                height={150}
                className="object-contain max-h-[150px] max-w-[100px] min-h-[150px] min-w-[150px] "
              />
            </div>
          </div>
          <div className="w-full flex justify-center items-center">
            <button
              onClick={() => {
                setOpenDettach(true);
              }}
              className="w-[20%] text-center text-white bg-red-500 hover:opacity-80 rounded-lg"
            >
              Detach Product
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDettach}
        fullWidth
        maxWidth="md"
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle className="text-center">
          <p>Detach Product : {product.name} {product.combination && `/ ${varis}`}</p>
        </DialogTitle>
        <hr />
        <DialogContent className="w-full flex flex-col justify-start items-start space-y-4">
          <div className="flex w-full justify-start items-center space-x-5">
            <p className="text-lg">
              Are you sure you want to detach from this product : {product.waffer_name}
              ?
            </p>
            <Image
              src={product.waffer_image ? product.waffer_image : logo}
              width={100}
              height={100}
              alt="product"
              className="object-contain max-h-[100px] max-w-[100px] min-h-[100px] min-w-[100px] "
            />
          </div>
        </DialogContent>
        <DialogActions className="w-full flex justify-end items-center">
          {isDettaching == true ? (
            <div className="w-[10%] text-center flex justify-center items-center text-white bg-red-500 rounded-lg">
              <Ring size={20} lineWeight={5} speed={3} color="white" />
            </div>
          ) : (
            <button
              onClick={dettachProduct}
              className="w-[10%] text-center text-white bg-red-500 hover:opacity-80 rounded-lg"
            >
              Yes
            </button>
          )}
          <button
            onClick={() => {
              setOpenDettach(false);
            }}
            className="w-[10%] text-center text-white bg-gray-500 hover:opacity-80 rounded-lg"
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AdminAttachedProduct;

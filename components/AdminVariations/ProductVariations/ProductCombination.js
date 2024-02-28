import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { MdCancel, MdCheck, MdClose, MdEdit, MdEditNote } from "react-icons/md";
import logo from "@/public/images/tawasylogo.png";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
function ProductCombination({ product, refetch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingEdit, setIsSavingEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingHex, setEditingHex] = useState(false);
  const [isSavingHex, setSavingHex] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const partNumberRef = useRef();
  const hexRef = useRef();

  async function SavePartNumber() {
    setIsSavingEditing(true);
    try {
      const response = await Api.put(
        `/api/admin/edit-part-number/${product.line_id}`,
        { part_number: partNumberRef.current.value }
      );
      setIsSavingEditing(false);
      refetch();
      setIsEditing(false);
    } catch (error) {
      setIsSavingEditing(false);
    }
    setIsSavingEditing(false);
  }

  async function deleteCombination() {
    setDeleting(true);
    try {
      const response = await Api.delete(
        `/api/admin/delete-combination/${product.line_id}`
      );
      refetch();
      setDeleting(false);
      setIsDeleting(false);
    } catch (error) {
      setDeleting(false);
    }
    setDeleting(false);
  }

  async function EditHex() {
    setSavingHex(true);
    try {
      const response = await Api.put(`/api/admin/edit-hex/${product.line_id}` , {
        hex : hexRef.current.value
      });
      refetch();
      setSavingHex(false);
      setEditingHex(false);
    } catch (error) {
      setSavingHex(false);
    }
    setSavingHex(false);
  }

  let nig = [];
  const variations =
    product.variations &&
    product.variations.length > 0 &&
    product.variations.map((variant) => {
      nig.push(variant.option);
    });
  nig = nig.join(" / ");

  const imagesArray = [];

  if (product.variations && product.variations.length > 0) {
    product.variations.forEach((variation) => {
      if (variation.image) {
        imagesArray.push(variation.image);
      }
    });
  }

  if (imagesArray.length === 0) {
    if (product.image) {
      imagesArray.push(product.image);
    } else {
      imagesArray.push(logo);
    }
  }

  return (
    <>
      <div className=" w-full grid grid-cols-4 px-2 py-2 border-b border-gray-200">
        <p className="flex justify-center items-center text-center">
          {product.name_en}
        </p>
        <p className="flex justify-center items-center text-center">{nig}</p>
        <div className="flex justify-center w-max items-center space-x-1 px-3">
          {imagesArray &&
            imagesArray.map((image, i) => {
              return (
                <Image
                  key={i}
                  src={image}
                  alt={`asdasd`}
                  width={50}
                  height={50}
                  className="object-contain object-center"
                />
              );
            })}
        </div>
        <div className="flex-col justify-start items-center space-y-2">
          <div className="flex justify-end  items-center space-x-4 ">
            {isEditing == false ? (
              <p>{product.part_number ? product.part_number : "Part Number"}</p>
            ) : (
              <input
                type="text"
                ref={partNumberRef}
                placeholder="Part Number"
                defaultValue={product.part_number ? product.part_number : null}
                autoFocus
                maxLength={30}
                className="outline-none w-[80%] border-b border-transparent transition-all duration-500 focus:border-skin-primary"
              />
            )}
            {isSavingEdit == true ? (
              <div className="justify-self-end">
                <Ring size={20} speed={2} lineWeight={5} color="#ff6600" />
              </div>
            ) : isEditing == false ? (
              <button
                className="border-b border-black"
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                <MdEdit />
              </button>
            ) : (
              <div className="flex justify-center items-center space-x-3">
                <button onClick={SavePartNumber}>
                  <MdCheck className="w-[25px] h-[25px] text-green-500 border-b-2 border-transparent hover:border-green-500 transition-all duration-300 " />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                  }}
                >
                  <MdClose className="w-[25px] h-[25px] text-red-500 border-b-2 border-transparent hover:border-red-500 transition-all duration-300" />
                </button>
              </div>
            )}
            {isEditing == false && (
              <button
                onClick={() => {
                  setIsDeleting(true);
                }}
                className="px-2 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm"
              >
                Delete Combination
              </button>
            )}
          </div>
          <div className="flex justify-around items-center space-x-3 w-full ">
            <div
              className={`flex items-center justify-center w-[25px] px-3 h-[25px] rounded-full`}
              style={{ backgroundColor: `${product.hex && product.hex}` }}
            ></div>
            {editingHex == false ? (
              <p>Hex: {product.hex ? product.hex : `None`}</p>
            ) : (
              <input
                type="text"
                ref={hexRef}
                placeholder="Hex Color"
                defaultValue={product.hex ? product.hex : null}
                autoFocus
                maxLength={7}
                className="outline-none w-[80%] border-b border-transparent transition-all duration-500 focus:border-skin-primary"
              />
            )}
            {editingHex == false && (
              <button
                className="border-b border-black"
                onClick={() => {
                  setEditingHex(true);
                }}
              >
                <MdEditNote />
              </button>
            )}
            {editingHex == true &&
              (isSavingHex == true ? (
                <Ring size={20} speed={2} lineWeight={5} color="#ff6600" />
              ) : (
                <div className="flex justify-start items-center space-x-1">
                  <button onClick={EditHex}>
                    <MdCheck className="w-[25px] h-[25px] text-green-500 border-b-2 border-transparent hover:border-green-500 transition-all duration-300 " />
                  </button>
                  <button
                    onClick={() => {
                      setEditingHex(false);
                    }}
                  >
                    <MdClose className="w-[25px] h-[25px] text-red-500 border-b-2 border-transparent hover:border-red-500 transition-all duration-300" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      <Dialog
        open={isDeleting}
        onClose={() => {
          setIsDeleting(false);
        }}
        fullWidth
      >
        <DialogTitle className="flex justify-between border-b-2 border-black ">
          <p className="">Delete Combination:</p>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <div className="flex flex-col justify-start items-start w-full ">
              <p className="text-lg ">
                Are you sure you want to delete this Combination ?
              </p>
              <p className="text-xl pt-4">
                {product.name_en} : ( {nig} ) - [{" "}
                {product.part_number && product.part_number} ]
              </p>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="bg-green-700 px-8 py-3 text-white rounded-lg "
            data-dismiss="modal"
            onClick={deleteCombination}
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

export default ProductCombination;

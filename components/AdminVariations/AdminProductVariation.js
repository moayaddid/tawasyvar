import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import logo from "@/public/images/tawasylogo.png";
import ImageUpload from "../ImageUpload/ImageUpload";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";

function AdminProductVariation({ variant, deleteV, options, productId }) {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [option, setOption] = useState();
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [image, setImage] = useState();
  const router = useRouter();
  const Api = createAxiosInstance(router);

  async function deleteVariation() {
    setDeleting(true);
    try {
      const response = await Api.delete(
        `/api/admin/delete-variation/product/${productId}/variation/${variant.id}`
      );
      deleteV();
      setIsDeleting(false);
    } catch (error) {}
    setDeleting(false);
  }

  async function editOption() {
    const nig = JSON.parse(option);
    if (nig == null || nig == undefined || nig.value == variant.option) {
      toast.error(
        "Please provide a different option than the old in order to change it ",
        { theme: "colored" }
      );
    } else {
      setLoading(true);
      try {
        const response = Api.put(
          `/api/admin/update-variation/product/${productId}/variation/${variant.id}`,
          {
            attribute_id: nig.att_id,
            option_id: nig.id,
          }
        );
        deleteV();
        setEditing(false);
      } catch (error) {
        setLoading(false);
      }
    }
    setLoading(false);
  }

  async function editImage() {
    setSavingPhoto(true);
    try {
      const response = await Api.post(
        `/api/admin/update-variation-image/${variant.id}`,
        {
          new_image: image,
        },
        {
          headers: { "Content-Type": `multipart/form-data` },
        }
      );
      setImage();
      setSavingPhoto(false);
      deleteV();
      setEditingPhoto(false);
    } catch (error) {
      setSavingPhoto(false);
    }
    setSavingPhoto(false);
  }

  return (
    <>
      <div className="flex w-full justify-start space-x-4 items-center py-1 border-b border-gray-300">
        <p>{variant.attribute} :</p>
        {editing == true ? (
          <select
            onChange={(e) => {
              setOption(e.target.value);
            }}
            className="px-2 py-1 w-max mx-auto rounded-md h-max my-auto "
          >
            {options.map((option) => {
              return (
                <option
                  key={option.id}
                  selected={variant.option == option.value_en}
                  value={JSON.stringify({
                    id: option.id,
                    att_id: option.attribute_id,
                    value: option.value_en,
                  })}
                >
                  {option.value_en}
                </option>
              );
            })}
          </select>
        ) : (
          <p>{variant.option}</p>
        )}
        {editingPhoto == false ? (
          <Image
            src={variant.image ? variant.image : logo}
            alt="image"
            width={50}
            height={50}
          />
        ) : (
          <div className="w-[20%]">
            <ImageUpload
              onSelectImage={(data) => {
                setImage(data);
              }}
              defaultImage={variant.image ? variant.image : null}
              width={50}
              height={50}
            />
          </div>
        )}
        {editingPhoto == false && editing == false && (
          <button
            onClick={() => {
              setEditingPhoto(true);
            }}
            disabled={loading}
            className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:opacity-70"
          >
            Edit Option Image
          </button>
        )}
        {editingPhoto == true &&
          (savingPhoto == true ? (
            <div>
              <Ring size={20} speed={2} lineWeight={2} color="#ff6600" />
            </div>
          ) : (
            <div className="flex justify-start ittems-center space-x-2">
              <button
                onClick={editImage}
                className={`px-2 py-1 bg-green-500 text-white rounded-lg hover:opacity-70 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed`}
                disabled={!image}
              >
                Save Image
              </button>
              <button
                onClick={() => {
                  setEditingPhoto(false);
                  setImage();
                }}
                className="px-2 py-1 bg-red-500 text-white rounded-lg hover:opacity-70"
              >
                Cancel
              </button>
            </div>
          ))}
        {editing == false && editingPhoto == false && (
          <button
            onClick={() => {
              setEditing(true);
            }}
            disabled={loading}
            className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:opacity-70"
          >
            Edit Option
          </button>
        )}
        {editing == true && (
          <div className="flex justify-start ittems-center space-x-2">
            <button
              onClick={editOption}
              className={`px-2 py-1 bg-green-500 text-white rounded-lg hover:opacity-70 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed`}
              disabled={!option}
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setEditing(false);
              }}
              className="px-2 py-1 bg-red-500 text-white rounded-lg hover:opacity-70"
            >
              Cancel
            </button>
          </div>
        )}
        {editing == false && editingPhoto == false && (
          <button
            onClick={() => {
              setIsDeleting(true);
            }}
            disabled={loading == true}
            className={`px-2 py-1 bg-red-500 text-center hover:opacity-80 rounded-lg text-white ${
              loading == true ? `opacity-70` : `opacity-100`
            } transition-all duration-300 `}
          >
            Delete Variation
          </button>
        )}
        {loading == true && (
          <div>
            <Ring size={20} speed={2} lineWeight={5} color="#ff6600" />
          </div>
        )}
      </div>

      <Dialog
        open={isDeleting}
        onClose={() => {
          setIsDeleting(false);
        }}
        fullWidth
        disableRestoreFocus
        disableAutoFocus
      >
        <DialogTitle className="flex justify-between border-b-2 border-black ">
          <p className="">Delete Variation:</p>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <div className="flex flex-col justify-start items-start w-full ">
              <p className="text-lg ">
                Are you sure you want to delete this Variation ?
              </p>
              <p className="text-xl pt-4">
                {variant.attribute} : {variant.option}
              </p>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="bg-green-700 px-8 py-3 text-white rounded-lg "
            data-dismiss="modal"
            onClick={deleteVariation}
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

export default AdminProductVariation;

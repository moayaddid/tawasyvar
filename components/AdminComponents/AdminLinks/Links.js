import createAxiosInstance from "@/API";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Ring } from "@uiball/loaders";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import { IoMdLink } from "react-icons/io";
import { MdClose } from "react-icons/md";

function Links({
  links,
  entityId,
  editEndPoint,
  resetEndPoint,
  linksFor,
  refetch,
}) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resetting, setRestting] = useState(false);
  const [openReset, setopenReset] = useState(false);
  const WLinkRef = useRef();
  const TLinkRef = useRef();
  const FLinkRef = useRef();
  const LLinkRef = useRef();
  const ILinkRef = useRef();

  const addIfDifferent = (object, fieldValue, fieldName, originalValue) => {
    if (
      fieldValue &&
      fieldValue.trim() !== "" &&
      fieldValue != originalValue
    ) {
      object[fieldName] = fieldValue;
    }
  };

  async function resetLinks() {
    setRestting(true);
    try {
      const response = await Api.delete(`${resetEndPoint}/${entityId}`);
      refetch();
      setRestting(false);
      setopenReset(false);
    } catch (error) {
      setRestting(false);
    }
    setRestting(false);
  }

  async function saveEdits(e) {
    e.preventDefault();
    let editData = {};
    addIfDifferent(
      editData,
      WLinkRef.current?.value,
      "whatsapp",
      links.whatsapp
    );
    addIfDifferent(
      editData,
      TLinkRef.current?.value,
      "telegram",
      links.telegram
    );
    addIfDifferent(
      editData,
      FLinkRef.current?.value,
      "facebook",
      links.facebook
    );
    addIfDifferent(
      editData,
      ILinkRef.current?.value,
      "instagram",
      links.instagram
    );
    addIfDifferent(editData, LLinkRef.current?.value, "website", links.website);

    if (Object.keys(editData).length) {
      try {
        setSaving(true);
        const response = await Api.put(`${editEndPoint}/${entityId}`, editData);
        setSaving(false);
        setIsEditing(false);
        refetch();
      } catch (error) {
        setSaving(false);
      }
      setSaving(false);
    } else {
      setSaving(false);
      setIsEditing(false);
    }
  }

  return (
    <>
      <form
        onSubmit={saveEdits}
        className="w-full flex flex-col justify-center items-center space-y-3"
      >
        {isEditing == false && (
          <div className="flex w-full justify-end items-center space-x-3">
            <button
              onClick={() => {
                setIsEditing(true);
              }}
              className="w-[20%] px-2 py-1 rounded-lg hover:opacity-70 text-white bg-sky-500"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setopenReset(true);
              }}
              className="w-[20%] px-2 py-1 rounded-lg hover:opacity-70 text-white bg-red-500"
            >
              Reset
            </button>
          </div>
        )}

        <label
          htmlFor="whatsapp"
          className=" w-full flex justify-between items-center border-2 border-green-500 rounded-lg space-x-3 px-2 py-1"
        >
          {isEditing == true ? (
            <input
              id="whatsapp"
              type="url"
              ref={WLinkRef}
              defaultValue={links.whatsapp ?? ""}
              className="outline-none grow border-b-2 border-gray-400  duration-300 "
            />
          ) : links.whatsapp ? (
            // <Link  legacyBehavior >
            <a href={links.whatsapp ?? ""} target="_blank">
              {links.whatsapp ?? ""}
            </a>
          ) : (
            // </Link>
            <p className="text-start">No Link Provided.</p>
          )}
          <FaWhatsapp className="w-[25px] h-[25px] text-green-500" />
        </label>

        <label
          htmlFor="telegram"
          className=" w-full flex justify-between items-center border-2 border-blue-500 rounded-lg space-x-3 px-2 py-1"
        >
          {isEditing == true ? (
            <input
              id="telegram"
              type="url"
              ref={TLinkRef}
              defaultValue={links.telegram ?? ""}
              className="outline-none grow border-b-2 border-gray-400  duration-300 "
            />
          ) : links.telegram ? (
              <a href={links.telegram ?? ""} target="_blank" >{links.telegram ?? ""}</a>
          ) : (
            <p className="text-start">No Link Provided.</p>
          )}
          <FaTelegram className="w-[25px] h-[25px] text-blue-500" />
        </label>

        <label
          htmlFor="facebook"
          className=" w-full flex justify-between items-center border-2 border-sky-800 rounded-lg space-x-3 px-2 py-1"
        >
          {isEditing == true ? (
            <input
              id="facebook"
              type="url"
              ref={FLinkRef}
              defaultValue={links.facebook ?? ""}
              className="outline-none grow border-b-2 border-gray-400  duration-300 "
            />
          ) : links.facebook ? (
              <a href={links.facebook ?? ""} target="_blank"> {links.facebook ?? ""}</a>
          ) : (
            <p className="text-start">No Link Provided.</p>
          )}
          <FaFacebook className="w-[25px] h-[25px] text-sky-800" />
        </label>

        <label
          htmlFor="instagram"
          className=" w-full flex justify-between items-center border-2 border-violet-600 rounded-lg space-x-3 px-2 py-1"
        >
          {isEditing == true ? (
            <input
              id="instagram"
              type="url"
              ref={ILinkRef}
              defaultValue={links.instagram ?? ""}
              className="outline-none grow border-b-2 border-gray-400  duration-300 "
            />
          ) : links.instagram ? (
              <a href={links.instagram ?? ""} target="_blank">{links.instagram}</a>
          ) : (
            <p className="text-start">No Link Provided.</p>
          )}
          <FaInstagram className="w-[25px] h-[25px] text-violet-600" />
        </label>

        <label
          htmlFor="link"
          className=" w-full flex justify-between items-center border-2 border-skin-primary  rounded-lg space-x-3 px-2 py-1"
        >
          {isEditing == true ? (
            <input
              type="url"
              ref={LLinkRef}
              defaultValue={links.website ?? ""}
              className="outline-none grow border-b-2 border-gray-400  duration-300 "
            />
          ) : links.website ? (
              <a href={links.website} target="_blank">{links.website}</a>
          ) : (
            <p className="text-start">No Link Provided.</p>
          )}
          <IoMdLink className="w-[25px] h-[25px] text-skin-primary" />
        </label>

        {isEditing == true && (
          <div className="flex w-full justify-end items-center space-x-3">
            {saving == true ? (
              <div className="w-[20%] px-2 py-1 rounded-lg hover:opacity-70 text-white bg-green-500 flex justify-center items-center">
                <Ring speed={3} lineWeight={5} color="white" size={25} />
              </div>
            ) : (
              <button
                type="submit"
                onClick={saveEdits}
                className="w-[20%] px-2 py-1 rounded-lg hover:opacity-70 text-white bg-green-500"
              >
                Save
              </button>
            )}
            <button
              onClick={() => {
                setIsEditing(false);
              }}
              className="w-[20%] px-2 py-1 rounded-lg hover:opacity-70 text-white bg-red-500"
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      <Dialog
        open={openReset}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        maxWidth="md"
        fullWidth
        onClose={() => {
          setopenReset(false);
        }}
      >
        <DialogTitle className="flex w-full justify-between items-center">
          <p>Reset links of : {linksFor}</p>
          <MdClose
            onClick={() => {
              setopenReset(false);
            }}
            className="text-black cursor-pointer w-[20px] h-[20px] hover:text-red-500 border-b-2 border-transparent hover:border-red-500 transition-all duration-300"
          />
        </DialogTitle>
        <DialogContent>
          Are you sure you want to reset the links of {linksFor} ?{" "}
        </DialogContent>
        <DialogActions className="w-full flex justify-center items-center">
          <button
            onClick={() => {
              setopenReset(false);
            }}
            className="w-[30%] px-2 py-1 rounded-lg hover:opacity-70 text-white bg-red-500"
          >
            No
          </button>
          {resetting == true ? (
            <div className="w-[30%] px-2 py-1 rounded-lg hover:opacity-70 text-white bg-green-500 flex justify-center items-center ">
              <Ring speed={3} lineWeight={5} color="white" size={25} />
            </div>
          ) : (
            <button
              onClick={resetLinks}
              className="w-[30%] px-2 py-1 rounded-lg hover:opacity-70 text-white bg-green-500"
            >
              Yes
            </button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Links;

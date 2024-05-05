import createAxiosInstance from "@/API";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Ring } from "@uiball/loaders";
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
import { toast } from "react-toastify";

export function add(object, data, header) {
  if (data && data.trim() !== "") {
    object[header] = data;
  }
  return object;
}

function LinkCreation({
  postEndPoint,
  entityId,
  className,
  linksFor,
  refetchLinks,
}) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const WLinkRef = useRef();
  const TLinkRef = useRef();
  const FLinkRef = useRef();
  const LLinkRef = useRef();
  const ILinkRef = useRef();
  const [isAdding, setIsAdding] = useState(false);
  const [openAddLinks, setOpenAddLinks] = useState(false);

  async function submitLinks(e) {
    e.preventDefault();
    setIsAdding(true);
    let data = {};
    add(data, WLinkRef.current.value, `whatsapp`);
    add(data, TLinkRef.current.value, `telegram`);
    add(data, FLinkRef.current.value, `facebook`);
    add(data, ILinkRef.current.value, `instagram`);
    add(data, LLinkRef.current.value, `website`);

    if (Object.keys(data).length) {
      try {
        const response = await Api.post(`${postEndPoint}/${entityId}`, data);
        refetchLinks();
        setIsAdding(false);
        setOpenAddLinks(false);
      } catch (error) {
        setIsAdding(false);
      }
      setIsAdding(false);
    } else {
      toast.error("You did not enter any link.", {
        theme: "colored",
        autoClose: 3000,
      });
      setIsAdding(false);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setOpenAddLinks(true);
        }}
        className={`px-2 py-1 text-center bg-sky-500 rounded-lg text-white ${className} `}
      >
        Add Links
      </button>

      <Dialog
        open={openAddLinks}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        maxWidth="md"
        fullWidth
        onClose={() => {
          setOpenAddLinks(false);
        }}
      >
        <DialogTitle className="flex w-full justify-between items-center">
          <p>Add Links for : {linksFor}</p>
          <MdClose
            onClick={() => {
              setOpenAddLinks(false);
            }}
            className="text-black cursor-pointer w-[20px] h-[20px] hover:text-red-500 border-b-2 border-transparent hover:border-red-500 transition-all duration-300"
          />
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={submitLinks}
            className="w-full flex flex-col justify-start items-center space-y-3"
          >
            <label
              htmlFor="whatsapp"
              className=" w-full flex justify-start items-center border-2 border-green-500 rounded-lg space-x-3 px-2 py-1"
            >
              <input
                id="whatsapp"
                type="text"
                ref={WLinkRef}
                className="outline-none grow border-b-2 border-gray-400 focus:border-skin-primary duration-300 "
              />
              <FaWhatsapp className="w-[25px] h-[25px] text-green-500" />
            </label>

            <label
              htmlFor="telegram"
              className=" w-full flex justify-start items-center border-2 border-blue-500 rounded-lg space-x-3 px-2 py-1"
            >
              <input
                id="telegram"
                type="text"
                ref={TLinkRef}
                className="outline-none grow border-b-2 border-gray-400 focus:border-skin-primary duration-300 "
              />
              <FaTelegram className="w-[25px] h-[25px] text-blue-500" />
            </label>

            <label
              htmlFor="facebook"
              className=" w-full flex justify-start items-center border-2 border-sky-800 rounded-lg space-x-3 px-2 py-1"
            >
              <input
                id="facebook"
                type="text"
                ref={FLinkRef}
                className="outline-none grow border-b-2 border-gray-400 focus:border-skin-primary duration-300 "
              />
              <FaFacebook className="w-[25px] h-[25px] text-sky-800" />
            </label>

            <label
              htmlFor="instagram"
              className=" w-full flex justify-start items-center border-2 border-violet-600 rounded-lg space-x-3 px-2 py-1"
            >
              <input
                id="instagram"
                type="text"
                ref={ILinkRef}
                className="outline-none grow border-b-2 border-gray-400 focus:border-skin-primary duration-300 "
              />
              <FaInstagram className="w-[25px] h-[25px] text-violet-600" />
            </label>

            <label
              htmlFor="link"
              className=" w-full flex justify-start items-center border-2 border-skin-primary rounded-lg space-x-3 px-2 py-1"
            >
              <input
                type="text"
                ref={LLinkRef}
                className="outline-none grow border-b-2 border-gray-400 focus:border-skin-primary duration-300 "
              />
              <IoMdLink className="w-[25px] h-[25px] text-skin-primary" />
            </label>

            <div className="w-full flex justify-center items-center">
              {isAdding == true ? (
                <div className="text-center bg-green-500 rounded-lg px-2 py-1 flex justify-center items-center w-[50%]">
                  <Ring speed={3} lineWeight={5} color="white" size={25} />
                </div>
              ) : (
                <button
                  type="submit"
                  className="text-center text-white bg-green-500 rounded-lg px-2 py-1 w-[50%]"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default LinkCreation;

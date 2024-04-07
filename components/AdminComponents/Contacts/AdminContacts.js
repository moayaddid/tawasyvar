import createAxiosInstance from "@/API";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiSolidContact } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import Contacts from "./Contacts";

function AdminContacts({
  className,
  getEndpoint,
  addEndpoint,
  entityId,
  ContactsFor,
}) {

    const allContacts = [
        {
            id : 1 , name : "contact 1" , number : '0936467388'  
        } , 
        {
            id : 2 , name : "contact 2" , number : '0945812637'  
        } , 
        {
            id : 3 , name : "contact 3  " , number : '0955389461'  
        } , 
    ] ;

  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [open, setOpen] = useState(false);
//   const [allContacts, setAllContacts] = useState();
  const [isLoading, setIsLoading] = useState(false);

  async function openContacts() {
    setOpen(true);
    // setIsLoading(true);
    // try {
    //   const response = await Api.get(`${getEndpoint}/${entityId}`);
    //   if (response.data.contacts) {
    //     setAllContacts(response.data.contacts);
    //   } else {
    //     setAllContacts([]);
    //   }
    //   setIsLoading(false);
    // } catch (error) {
    //   setIsLoading(false);
    // }
    // setIsLoading(false);
  }

  function closeContacts() {
    setOpen(false);
    // setAllContacts();
  }

  return (
    <>
      <button
        onClick={openContacts}
        className={`items-center text-white px-2 py-2 opacity-70 bg-skin-primary rounded-md hover:opacity-100 focus:outline-none ${className}`}
      >
        <BiSolidContact />
      </button>

      <Dialog
        open={open}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        onClose={closeContacts}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <p> Contacts of : {ContactsFor}</p>
          <MdClose
            onClick={closeContacts}
            className="text-black cursor-pointer w-[20px] h-[20px] hover:text-red-500 border-b-2 border-transparent hover:border-red-500 transition-all duration-300"
          />
        </DialogTitle>
        <DialogContent className="flex justify-center items-center">
          {isLoading == true ? (
            <TawasyLoader width={300} height={300} />
          ) : (
            <Contacts contacts={allContacts} endpoint={"asdasdasd"} id={entityId} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminContacts;

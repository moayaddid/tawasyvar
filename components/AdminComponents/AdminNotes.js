import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { MdClose, MdOutlineSpeakerNotes } from "react-icons/md";
import TawasyLoader from "../UI/tawasyLoader";
import Notes from "./Notes";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useState } from "react";

function AdminNotes({
  NotesFor,
  className,
  postEndpoint,
  getEndpoint,
  entityId,
}) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [notesOpen, setNotesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState();

  async function openNotes() {
    setNotesOpen(true);
    try {
      setIsLoading(true);
      const response = await Api.get(`${getEndpoint}/${entityId}`);
      // setNotes(response.data.notes && []);
      if(response.data.notes){
        setNotes(response.data.notes);
      }else{
        setNotes([]);
      }
      setIsLoading(false);
    } catch (error) {
      setNotesOpen(false);
    }
    setIsLoading(false);
  }

  function closeNotes() {
    setNotesOpen(false);
    setNotes([]);
  }

  return (
    <>
      <button
        onClick={openNotes}
        className={`items-center text-white px-2 py-2 bg-green-500 rounded-md hover:bg-green-600 focus:outline-none ${className}`}
      >
        <MdOutlineSpeakerNotes />
      </button>

      <Dialog
        open={notesOpen}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        onClose={closeNotes}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <p> Notes of : {NotesFor}</p>
          <MdClose
            onClick={closeNotes}
            className="text-black cursor-pointer w-[20px] h-[20px] hover:text-red-500 border-b-2 border-transparent hover:border-red-500 transition-all duration-300"
          />
        </DialogTitle>
        <DialogContent className="flex justify-center items-center">
          {isLoading == true ? (
            <TawasyLoader width={300} height={300} />
          ) : (
            <Notes notes={notes} endpoint={postEndpoint} Id={entityId} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminNotes;

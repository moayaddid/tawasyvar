import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { MdClose, MdOutlineSpeakerNotes } from "react-icons/md";
import TawasyLoader from "../UI/tawasyLoader";
import Notes from "./Notes";

function AdminNotes({
  onCLickButton,
  ViewNotes,
  NotesFor,
  closeNotes,
  notes,
  SendNote,
  isLoading,
  className
}) {


    // console.log(notes);
  return (
    <>
      <button onClick={onCLickButton} className="items-center text-white px-2 py-2 bg-green-500 rounded-md hover:bg-green-600 focus:outline-none">
        <MdOutlineSpeakerNotes  />
      </button>

      <Dialog
        open={ViewNotes}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
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
          ) : 
            <Notes notes={notes} sendNote={(note) => {const sender = SendNote(note) ; return sender}} /> 
        }
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminNotes;

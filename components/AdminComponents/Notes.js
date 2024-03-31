import { useState } from "react";
import NoteItem from "./NoteItem";

function Notes({ notes, sendNote }) {
  const [newNote, setNote] = useState("");

    console.log(notes);

    function submitNote (e) {
        e.preventDefault();
      const sender =  sendNote(newNote);
        console.log(sender);
    //   if(sender === true) {
    //     setNote("");
    //   }
    }

  return (
    <div className="w-full flex flex-col flex-grow justify-start items-center space-y-2">
      {notes?.length > 0 ? (
        notes.map((note, i) => {
          return <NoteItem note={note} key={i} />;
        })
      ) : (
        <p>There are no note yet.</p>
      )}
      <form onSubmit={submitNote} className="justify-self-end w-full flex justify-start items-center space-x-3 py-3">
        <input
          type="text"
          value={newNote}
          onChange={(e) => {
            setNote(e.target.value);
          }}
          placeholder="Enter a note to send"
          className=" outline-none w-[85%] border-b-2 border-gray-300 focus:border-sky-500 transition-all duration-300"
        />
        <button type="submit" className="px-2 w-[15%] py-1 rounded-lg bg-sky-500 text-white hover:opacity-80" >
            Send
        </button>
      </form>
    </div>
  );
}

export default Notes;

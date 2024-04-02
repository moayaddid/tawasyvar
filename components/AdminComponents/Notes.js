import { useRef, useState } from "react";
import NoteItem from "./NoteItem";
import { MdClose } from "react-icons/md";
import { BiPlus } from "react-icons/bi";

function Notes({ notes, sendNote }) {
  // const [newNote, setNote] = useState("");
  const newNote = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);

  function submitNote(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("note", newNote.current.value);
    selectedFiles.forEach((file) => {
      formData.append("files[]", file);
    });
    sendNote(formData);
  }

  function removeFile(index) {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  }

  return (
    <div className="w-full flex flex-col flex-grow justify-start items-center space-y-2">
      {notes?.length > 0 ? (
        notes.map((note, i) => {
          return <NoteItem note={note} key={i} />;
        })
      ) : (
        <p>There are no notes yet.</p>
      )}
      <form
        onSubmit={submitNote}
        className="justify-self-end w-full flex flex-col justify-start items-center space-y-1 py-3"
      >
        <div className="justify-self-end flex w-full justify-start items-center space-x-3 py-3">
          <input
            type="text"
            ref={newNote}
            required
            placeholder="Enter a note to send"
            className="outline-none grow border-b-2 border-gray-300 focus:border-sky-500 transition-all duration-300"
          />
          <button
            type="submit"
            className="px-2 min-w-[15%] py-1 rounded-lg bg-sky-500 text-white hover:opacity-80 cursor-pointer"
          >
            Send
          </button>
        </div>
        <div className="w-full flex flex-wrap justify-start items-center px-2 py-1 border border-dashed rounded-lg border-gray-400 ">
          {selectedFiles &&
            selectedFiles.map((file, index) => {
              if (file.type.includes("application")) {
                return (
                  <div key={index} className="relative m-1">
                    <div
                      onClick={() => {
                        window.open(URL.createObjectURL(file), "_blank");
                      }}
                      title={file.name}
                      className="w-40 h-16 object-contain rounded-lg cursor-pointer px-4 py-1 border-2 border-gray-400"
                    >
                      {file.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center focus:outline-none"
                    >
                      <MdClose />
                    </button>
                  </div>
                );
              } 
              else {
                return (
                  <div key={index} className="relative m-1">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      onClick={() => {
                        window.open(URL.createObjectURL(file), "_blank");
                      }}
                      title={file.name}
                      className="w-16 h-16 object-cover rounded-lg border-2 cursor-pointer border-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center focus:outline-none"
                    >
                      <MdClose />
                    </button>
                  </div>
                );
              }
            })}
          {selectedFiles && selectedFiles.length > 0 && (
            <div className="w-16 h-16 object-contain rounded-lg border-2 border-gray-400 hover:bg-gray-100">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  setSelectedFiles([
                    ...selectedFiles,
                    ...Array.from(e.target.files),
                  ]);
                }}
                multiple
                
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="flex justify-center items-center w-full h-full select-none text-gray-400 cursor-pointer"
              >
                <BiPlus className="w-[50%] h-[50%]" />
              </label>
            </div>
          )}
          <i
            className={`${
              !selectedFiles || selectedFiles.length < 1 ? `block` : `hidden`
            } select-none text-gray-400 `}
          >
            <input
              type="file"
              onChange={(e) => {
                setSelectedFiles([
                  ...selectedFiles,
                  ...Array.from(e.target.files),
                ]);
              }}
              accept="image/*,application/pdf"
              multiple
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="px-2 min-w-[15%] text-center py-1 select-none text-gray-400 cursor-pointer"
            >
              Select a file to send as / with a note.
            </label>
          </i>
        </div>


      </form>
    </div>
  );
}

export default Notes;

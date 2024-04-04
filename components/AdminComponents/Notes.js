import { useRef, useState } from "react";
import NoteItem from "./NoteItem";
import { MdClose } from "react-icons/md";
import { BiPlus } from "react-icons/bi";
import createAxiosInstance from "@/API";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { TiAttachment } from "react-icons/ti";
import { FaRegFile } from "react-icons/fa";
import { Ring } from "@uiball/loaders";
import Cookies from "js-cookie";

function Notes({ notes, endpoint, Id }) {
  const [newNote, setNote] = useState("");
  const [allNotes , setAllNotes] = useState(notes ?? []);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  // const newNote = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSending, setIsSending] = useState(false);

  async function submitNote(e) {
    setIsSending(true);
    e.preventDefault();
    try {
      if (newNote !== null && newNote !== undefined && newNote.trim() !== "") {

        let noteData = {};
        if (
          newNote !== null &&
          newNote !== undefined &&
          newNote.trim() !== ""
        ) {
          noteData.note = newNote.trim();
        }
        if (selectedFiles.length > 0) {
          noteData.files = [...selectedFiles];
        }
        // const formData = new FormData();
        // formData.append("note", newNote);
        // selectedFiles.forEach((file) => {
        //   formData.append("files[]", file);
        // });
        let newFiles = [] ;
          selectedFiles.forEach((file) => {
            newFiles.push(URL.createObjectURL(file));
          })
        let newestNote = {
          admin : Cookies.get("AName") ?? "Me" ,
          note : newNote , 
          files : newFiles, 
          created_at : new Date()
        };
        const response = await Api.post(
          `${endpoint}/${Id}`,
          {
            ...noteData,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
          setAllNotes((prev) => {
            const old = [ ...prev , newestNote];
            return old
          })
        setSelectedFiles([]);
        setNote("");
        setIsSending(false);
      } else {
        toast.error("Please enter a note", {
          theme: "colored",
          autoClose: 3000,
        });
        throw new Error("error");
      }
    } catch (error) {
      setIsSending(false);
    }
    setIsSending(false);
    // sendNote(formData);
  }

  function removeFile(index) {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  }

  return (
    <div className="w-full flex flex-col flex-grow justify-start items-center space-y-2">
      <div className={`${ allNotes.length > 0 ? `max-h-[350px] h-max ` : `h-max` } overflow-y-auto w-full `}>
        {allNotes?.length > 0 ? (
          allNotes.map((note, i) => {
            return <NoteItem note={note} key={i} />;
          })
        ) : (
          <p>There are no notes yet.</p>
        )}
      </div>
      <form
        onSubmit={submitNote}
        className="justify-self-end w-full flex flex-col justify-start items-center space-y-1 py-3"
      >
        <div className="justify-self-end flex w-full justify-start items-end space-x-3 py-3">
          <div className="flex flex-col w-full justify-start items-start px-2 py-1 border-2 focus-within:border-sky-500 transition-all duration-500 border-dashed border-gray-400 rounded-lg">
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="w-full flex flex-wrap justify-start items-center px-2 py-1 h-max ">
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
                            className="w-40 h-16 flex justify-start items-center object-contain rounded-lg cursor-pointer px-4 py-1 border-2 border-gray-400 hover:border-sky-500 transition-all duration-500"
                          >
                            <FaRegFile className="w-auto h-[55%] mx-2" />
                            <p className="w-auto h-[82%] text-sm text-ellipsis line-clamp-2 ">
                              {file.name}
                            </p>
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
                    } else {
                      return (
                        <div key={index} className="relative m-1">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            onClick={() => {
                              window.open(URL.createObjectURL(file), "_blank");
                            }}
                            title={file.name}
                            className="w-16 h-16 object-cover overflow-clip rounded-lg border-2 cursor-pointer border-gray-400 hover:border-sky-500 transition-all duration-500"
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
              </div>
            )}
            <div className=" flex w-full grow justify-start items-center py-1">
              <input
                type="text"
                // ref={newNote}
                onChange={(e) => {
                  setNote(e.target.value);
                }}
                value={newNote}
                placeholder="Enter a note to send"
                className="outline-none grow border-b-2 border-gray-300 focus:border-sky-500 transition-all duration-300 placeholder:text-sm"
              />
              <div className="border-2 mx-2 border-gray-400 hover:border-sky-500 rounded-lg text-gray-400 h-max hover:text-sky-500 transition-all duration-500">
                <input
                  type="file"
                  onChange={(e) => {
                    // console.log(e.target.files);
                    setSelectedFiles([
                      ...selectedFiles,
                      ...Array.from(e.target.files),
                    ]);
                  }}
                  accept="image/*,application/pdf,application/xlsx,application/csv"
                  multiple
                  className="hidden"
                  id="fileInputButtonOut"
                />
                <label
                  htmlFor="fileInputButtonOut"
                  className="w-full h-full text-center select-none cursor-pointer"
                >
                  <TiAttachment className="w-[25px] h-[25px]" />
                </label>
              </div>
            </div>
          </div>
          { isSending == true ? 
            <div className="px-2 min-w-[15%] py-1 rounded-lg flex justify-center items-center bg-sky-500 text-white hover:opacity-80 cursor-pointer" >
                <Ring speed={3} lineWeight={5} size={20} color="white" />
            </div>  
          : <button
            type="submit"
            className="px-2 min-w-[15%] py-1 rounded-lg bg-sky-500 text-white hover:opacity-80 cursor-pointer"
          >
            Send
          </button>}
        </div>
        {/* <div className="w-full flex flex-wrap justify-start items-center px-2 py-1 border border-dashed rounded-lg border-gray-400 ">
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
              } else {
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
                accept="image/*,application/pdf,application/xlsx,application/csv"
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
              accept="image/*,application/pdf,application/xlsx,application/csv"
              multiple
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="px-2 w-full text-center py-1 select-none text-gray-400 cursor-pointer"
            >
              Select a file to send as / with a note.
            </label>
          </i>
        </div> */}
      </form>
    </div>
  );
}

export default Notes;

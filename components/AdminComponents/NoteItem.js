import { FaRegFile } from "react-icons/fa";
import { convertDateStringToDate } from "../AdminOrders/OrderAdmin";
import lego from "@/public/images/lego.png";
import Image from "next/image";
import { MdReply } from "react-icons/md";
import { Tooltip } from "@nextui-org/react";
import { RxDownload } from "react-icons/rx";

function NoteItem({ note }) {
  function getFileExtension(url) {
    return url.split(".").pop();
  }

  function getFileIcon(file) {
    const extension = getFileExtension(file);
    if (["jpg", "jpeg", "png", "gif"].includes(extension.toLowerCase())) {
      return (
        <Image
          src={file}
          alt={`Image`}
          width={0}
          height={0}
          className="w-full h-full object-cover"
          onClick={() => {
            window.open(file, "_blank");
          }}
        />
      );
    } else {
      return <FaRegFile className="w-auto h-[55%] mx-2" />;
    }
  }

  const handleDownload = (file) => {
    // Create a temporary anchor element
    const anchor = document.createElement("a");
    anchor.href = file;
    anchor.download = file.split("/").pop();
    anchor.click();
  };

  function isImage(url) {
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const extension = url.split(".").pop().toLowerCase();
    return imageExtensions.includes(extension);
  }

  return (
    <div className="w-full flex flex-col justify-start my-2 hover:border-sky-500 transition-all duration-300 items-start px-2 py-1 rounded-lg border-2 border-gray-400 ">
      <div className="w-full flex justify-start items-center px-2">
        <div className="text-lg font-semibold text-blue-500 grow ">
          {/* <Tooltip
            showArrow={true}
            color="primary"
            placement="right"
            content={
              <button className="text-gray-500 hover:text-sky-500 bg-white rounded-full border-2 border-gray-400 px-2 hover:border-sky-500 transition-all duration-500 ">
                @MahmoudHaraba
              </button>
            }
          > */}
          <p className="w-max cursor-default ">{note.admin}</p>
          {/* </Tooltip> */}
        </div>
        <i className="min-w-[20%] text-center">
          {convertDateStringToDate(note.created_at)}
        </i>
        {/* <button className="text-xs max-w-[5%] flex justify-start items-center border-b text-gray-500 hover:text-sky-400 hover:border-sky-500 ">
          <p>Reply</p>
          <MdReply />
        </button> */}
      </div>
      {/* <i className="min-w-[20%] text-center">
          {convertDateStringToDate(note.created_at)}
        </i> */}
      <p className="px-4 grow">{note.note}</p>
      {/* <div className="w-full flex justify-between items-center">
      </div> */}
      {/* {note.files && note?.files?.length > 0 && ( */}

      <hr />
      <div className="px-4 w-full flex flex-wrap justify-start items-center">
        {/* {note.files.map((file) => {})} */}

        {note.files.map((file, index) => (
          <div
            key={index}
            title={file.split("/").pop()}
            className={`${
              isImage(file) === false ? `w-40 h-12` : `w-12 h-12`
            } mx-1 relative flex justify-start items-center object-contain rounded-lg cursor-pointer border-2 border-gray-400 hover:border-sky-500 transition-all duration-500`}
          >
            {getFileIcon(file)}
            {isImage(file) === false && (
              <p
                onClick={() => {
                  window.open(file, "_blank");
                }}
                className="w-auto cursor-pointer hover:underline h-[100%] text-sm text-ellipsis text-left line-clamp-1 "
              >
                {file.split("/").pop()}
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                handleDownload(file);
              }}
              className="absolute -top-2 -right-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center focus:outline-none"
            >
              <RxDownload />
            </button>
          </div>
        ))}

        {/* <div
          onClick={() => {
            window.open(
              "blob:http://localhost:3000/9befb177-b2d3-4025-b800-5cbc44124aa9",
              "_blank"
            );
          }}
          title="asdasd asdasd asd asd asd "
          className="w-40 h-12 mx-1 flex justify-start items-center object-contain rounded-lg cursor-pointer px-4 py-1 border-2 border-gray-400 hover:border-sky-500 transition-all duration-500"
        >
          <FaRegFile className="w-auto h-[55%] mx-2" />
          <p className="w-auto h-[100%] text-sm text-ellipsis text-left line-clamp-1 ">
            my name is mahmoud and i like music
          </p>
        </div>

        <Image
          src={lego}
          alt={`asda`}
          onClick={() => {
            window.open(
              "blob:http://localhost:3000/30b00413-a4ab-4830-9714-593f96f0b510",
              "_blank"
            );
          }}
          title={`asda`}
          className="w-12 h-12 object-cover mx-1 overflow-clip rounded-lg border-2 cursor-pointer border-gray-400 hover:border-sky-500 transition-all duration-500"
        /> */}
      </div>
      {/* // )} */}
    </div>
  );
}

export default NoteItem;

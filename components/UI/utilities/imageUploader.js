import React, { useState } from "react";
import { BiImageAdd } from "react-icons/bi";

const ImageUploader = () => {
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="border border-dashed border-gray-400 p-8 text-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {!image && (
        <>
          <label
            htmlFor="fileInput"
            className="cursor-pointer h-full w-full flex flex-col justify-center items-center text-gray-400 hover:opacity-70 "
          >
            <BiImageAdd className="h-[50px] w-auto" />
            <p>Click to select an image or drag & drop here</p>
          </label>
          <input
            type="file"
            id="fileInput"
            className="hidden w-full h-full"
            onChange={handleFileChange}
          />
        </>
      )}
      {image && (
        <div className="relative">
          <img
            src={image}
            alt="Uploaded"
            className="max-w-full max-h-64 mx-auto"
          />
          <button
            className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => setImage(null)}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

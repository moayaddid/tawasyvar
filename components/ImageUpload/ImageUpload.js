import React, { useState, useRef } from "react";
// import '../imageupload/imageupload.css';
// import UploadImg from '../images/choose_file - Copy.png';
import UploadImg from "../../public/images/choose_file - Copy.png";
import Image from "next/image";

const ImageUpload = (props) => {
  const inputRef = useRef(null);
  const [imag, setimage] = useState(
    props.defaultImage ? props.defaultImage : null
  );

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    // console.log(file);
    var formData = new FormData();
    formData.append("fileToUpload", file);
    setimage(event.target.files[0]);
    props.onSelectImage(file);
  };

  return (
    <div className="w-full h-max">
      <div onClick={handleImageClick} className="w-full h-full">
        {imag ? (
          <div className="flex justify-start items-center w-full gap-6">
            <Image
              src={
                props.defaultImage && imag == props.defaultImage
                  ? props.defaultImage
                  : URL.createObjectURL(imag)
              }
              alt="upload image"
              unoptimized
              width={props.width}
              height={props.height}
              objectFit="cover"
            />
          </div>
        ) : (
          // <Image src={UploadImg} alt='upload image' width={200} height={150}/>
          <div
            className={`w-max h-max cursor-pointer border-b-2 border-white hover:opacity-80 hover:border-gray-300 m-4 ${
              props.className ?? ""
            }`}
          >
            Choose an Image
          </div>
        )}
        <input
          type="file"
          ref={inputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
          accept="image/*"
        />
      </div>

      {imag && (
        <div
          className="py-1 px-2 bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer w-max h-max my-3"
          onClick={() => {
            setimage(null);
            props.onSelectImage(null);
          }}
        >
          Remove
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

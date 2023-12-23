import React, { useEffect, useRef, useState } from "react";
import {
  Magnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION,
  SideBySideMagnifier,
  GlassMagnifier,
} from "react-image-magnifiers-v2";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "@/public/images/tawasylogo.png";
import {
  BsChevronDown,
  BsChevronLeft,
  BsChevronRight,
  BsChevronUp,
} from "react-icons/bs";
import { Carousel } from "react-responsive-carousel";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export function CarouselProduct({ productDialog, product , images }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const imageContainerRef = useRef(null);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleNext = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };


  useEffect(() => {
    const selectedImage = document.getElementById(`image-${selectedImageIndex}`);
    const container = imageContainerRef.current;
    if (selectedImage && container) {
      selectedImage.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
        container,
      });
    }
  }, [selectedImageIndex]);

  return (
    <>
      <div className="flex md:flex-row md:justify-center items-center flex-col-reverse space-y-3 md:space-x-2 w-full h-full">
        {images?.length > 1 && (
          <div ref={imageContainerRef} className=" flex md:flex-col flex-row md:justify-start md:items-center justify-center md:h-full md:w-[30%] mx-auto w-full py-1 h-min">
            <button className=" md:w-full w-min " onClick={handlePrevious}>
              <BsChevronUp className="md:block hidden text-skin-primary mx-auto w-[20px]" />
              <BsChevronLeft className="md:hidden block text-skin-primary mx-auto w-[20px]" />
            </button>
            <div
              className="md:max-h-[200px] h-min w-full flex md:flex-col md:space-y-1 space-x-1 flex-row justify-start items-center overflow-y-scroll"
              dir="ltr"
            >
              {images?.map((data, i) => (
                <Image
                  key={i}
                  unoptimized
                  id={`image-${i}`}
                  className={`${
                    selectedImageIndex == i
                      ? "border-2 border-skin-primary"
                      : ""
                  } object-contain mx-auto `}
                  width={100}
                  height={100}
                  src={data}
                  onClick={() => handleImageClick(i)}
                  style={{ width: "100px", height: "100px" }}
                />
              ))}
            </div>
            <button className=" md:w-full w-min " onClick={handleNext}>
              <BsChevronDown className="md:block hidden text-skin-primary mx-auto w-[20px]" />
              <BsChevronRight className="md:hidden block text-skin-primary mx-auto w-[20px]" />
            </button>
          </div>
        )}

        <div className="flex justify-center items-center">
          <Zoom>
            <img
              alt="image"
              src={images[selectedImageIndex]}
              className="h-[200px] w-[200px] m-auto object-contain"
            />
          </Zoom>
        </div>
      </div>
    </>
  );
}

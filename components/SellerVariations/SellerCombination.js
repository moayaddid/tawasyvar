import Image from "next/image";
import Variation from "../AdminVariations/Variation";
import { ResponsiveCarousel } from "../CarouselCustomer/carousel";
import kuala from "@/public/images/kuala.jpg";
import { useState } from "react";
import { useRouter } from "next/navigation";
import createAxiosInstance from "@/API";
import { set } from "nprogress";
import { MdCheck } from "react-icons/md";
import { Ring } from "@uiball/loaders";
import logo from "@/public/images/tawasylogo.png";

function SellerCombination({ product }) {
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);

  let vari = [];
  const variations = product.variations.map((variation) => {
    vari.push(variation.option);
  });
  vari = vari.join(" / ");

  const imagesArray = [];

  if (product.variations && product.variations.length > 0) {
    product.variations.forEach((variation) => {
      if (variation.image) {
        imagesArray.push(variation.image);
      }
    });
  }

  if (imagesArray.length === 0) {
    if(product.image){
      imagesArray.push(product.image);
    }else{
      imagesArray.push(logo);
    }
  }

  async function selectCombination() {
    setSelecting(true);
    try {
      const response = await Api.post(
        `/api/seller/select-product/${product.id}`,
        {
          variation: product.line_id,
        }
      );
      setSelecting(false);
      setSelected(true);
    } catch (error) {
      setSelecting(false);
    }
    setSelecting(false);
  }

  return (
    <div className="flex w-full justify-between items-center py-3 border-b-2 border-gray-300">
      <p>{product.name}</p>
      <p>{vari}</p>
      <p>Part Number: {product.part_number}</p>
      <div className="max-w-[200px] overflow-x-auto ">
        {imagesArray.map((image, i ) => {
          return (
            <Image
            key={i}
              src={image}
              width={50}
              height={50}
              alt={`image`}
              className="px-1"
            />
          );
        })}
      </div>
      {selected == true ? (
        <div className="text-center">
          <MdCheck className=" text-green-400 w-[25px] h-[25px]" />
        </div>
      ) : selecting == true ? (
        <div>
          <Ring size={2} speed={2} lineWeight={5} color="#ff6600" />
        </div>
      ) : (
        <button
          onClick={selectCombination}
          className="px-2 py-1 bg-skin-primary rounded-lg text-white text-center hover:opacity-70"
        >
          Select
        </button>
      )}
    </div>
  );
}

export default SellerCombination;

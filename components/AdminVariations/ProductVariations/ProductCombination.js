import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { MdCancel, MdCheck, MdClose, MdEdit } from "react-icons/md";
import logo from "@/public/images/tawasylogo.png";
function ProductCombination({ product, refetch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingEdit, setIsSavingEditing] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const partNumberRef = useRef();

  async function SavePartNumber() {
    setIsSavingEditing(true);
    try {
      const response = await Api.put(
        `/api/admin/edit-part-number/${product.line_id}`,
        { part_number: partNumberRef.current.value }
      );
      setIsSavingEditing(false);
      refetch();
      setIsEditing(false);
    } catch (error) {
      setIsSavingEditing(false);
    }
    setIsSavingEditing(false);
  }

  let nig = [];
  const variations =
    product.variations &&
    product.variations.length > 0 &&
    product.variations.map((variant) => {
      nig.push(variant.option);
    });
  nig = nig.join(" / ");

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

  return (
    <div className=" w-full grid grid-cols-4 px-2 py-2 border-b border-gray-200">
      <p className="text-center">{product.name_en}</p>
      <p className="text-center">{nig}</p>
      <div className="flex justify-center items-center space-x-1" >{imagesArray && imagesArray.map((image , i) => {
        return <Image
          key={i}
          src={image} alt={`asdasd`}
          width={50}
          height={50}
          className="object-contain object-center"
        />
      })}</div>
      <div className="flex justify-end  items-center space-x-4 ">
        { isEditing == false ? <p>{product.part_number ? product.part_number : "Part Number"}</p> :<input
          type="text"
          ref={partNumberRef}
          placeholder="Part Number"
          defaultValue={product.part_number ? product.part_number : null}
          autoFocus
          maxLength={30}
          className="outline-none w-max border-b border-transparent transition-all duration-500 focus:border-skin-primary"
        />}
        {isSavingEdit == true ? (
          <div className="justify-self-end">
            <Ring size={20} speed={2} lineWeight={5} color="#ff6600" />
          </div>
        ) : isEditing == false ? (
          <button
            className="border-b border-black"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            <MdEdit />
          </button>
        ) : (
          <div className="flex justify-center items-center space-x-3">
            <button onClick={SavePartNumber}>
              <MdCheck className="w-[25px] h-[25px] text-green-500 border-b-2 border-transparent hover:border-green-500 transition-all duration-300 " />
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
              }}
            >
              <MdClose className="w-[25px] h-[25px] text-red-500 border-b-2 border-transparent hover:border-red-500 transition-all duration-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCombination;

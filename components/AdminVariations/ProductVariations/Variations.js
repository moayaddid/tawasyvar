import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import Image from "next/image";

function Variations({ allVariations, allOptions , setVariants }) {
  const [addVariation, setAddVariation] = useState(false);
  const [variations, setVariations] = useState([]);
  const [variation, setVariation] = useState();
  const [option, setOption] = useState();
  const [variationImage, setVariationImage] = useState();

  function getImage(data) {
    setVariationImage(data);
  }

  useEffect(() => {
    console.log(`rendered`);
    setVariation();
    setOption();
    setVariationImage();
    setVariations([]);
  } , [])

  function addAVariation() {
    const exists = variations.some(
      (v) => v.attribute_id === variation && v.option_id === option
    );
    // console.log(`variation`) ;
    // console.log(variation) ;
    // console.log(`option`);
    // console.log(option);
      if(!variation || !option){
        toast.error("please fill all the required fields" , {theme : "colored"});
        return ;
      }
    if (!exists) {
      let newVariations = [
        ...variations,
        {
          attribute_id: variation,
          option_id: option,
          image: variationImage ? variationImage : null ,
        },
      ]
      setVariations(newVariations);
      setVariants(newVariations);
      setAddVariation(false);
      setOption();
      setVariation();
      setVariationImage();
      return;
    } else {
      toast.error("the variation already exists" , {theme : "colored"} );
      return ;
    }
  }

  function removeVariation(variationId, optionId) {
    const updatedVariations = variations.filter(
      (v) => v.attribute_id !== variationId || v.option_id !== optionId
    );
    setVariations(updatedVariations);
    setVariants(updatedVariations);
  }

  function variationName (id) {
    const targetVariation = allVariations.find(variation => { if (variation.id == id) {return variation.name_en}});
    return targetVariation.name_en
  }

  function optionName (id) {
    const targetOption = allOptions.find(option => { if (option.id == id) {return option.value_en}});
    return targetOption.value_en
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-col">
        <div className="w-full flex flex-col justify-start items-start py-3 border-b border-skin-primary">
          <p className="text-2xl select-none" >All Variations :</p>
          {variations.length > 0 ? (
            <div className="flex flex-col justify-start items-start space-y-5 py-2">
              {variations.map((vari, index) => {
                return (
                  <div
                    key={index}
                    className="w-full flex justify-start items-center space-x-5 "
                  >
                    <p className="text-xl select-none">
                      Variation : {variationName(vari.attribute_id)}
                    </p>
                    <p className="text-xl select-none">Option : {optionName(vari.option_id)}</p>
                    { vari.image ? <Image
                      src={URL.createObjectURL(vari.image)}
                      alt="variation image"
                      width={80}
                      height={80}
                    /> : <i className="text-gray-500" >no image provided.</i>}
                    <MdClose
                      onClick={() => {
                        removeVariation(vari.attribute_id, vari.option_id);
                      }}
                      className="text-red-500 w-[25px] h-[25px] border-b-2 border-transparent transition-all duration-300 hover:border-red-500 cursor-pointer "
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-max mx-auto" >There are no variations</div>
          )}
        </div>
        {addVariation && (
          <div className="w-full grid xl:grid-cols-4 md:grid-cols-3 py-3 ">
            <select
              onChange={(e) => {
                setVariation(e.target.value);
              }}
              className="px-2 py-1 w-[80%] mx-auto rounded-md h-max my-auto "
            >
              <option value selected disabled className=" bg-white">
                Select a Variation
              </option>
              {allVariations.map((variation) => {
                return (
                  <option
                    key={variation.id}
                    value={variation.id}
                    className="text-black  "
                  >
                    {variation.name_en}
                  </option>
                );
              })}
            </select>
            <select
              onChange={(e) => {
                setOption(e.target.value);
              }}
              className="px-2 py-1 w-[80%] mx-auto rounded-md h-max my-auto "
            >
              <option value disabled selected className=" bg-white">
                Select an Option
              </option>
              {allOptions.map((option) => {
                return (
                  <option
                    key={option.id}
                    value={option.id}
                    className="text-black"
                  >
                    {option.value_en}
                  </option>
                );
              })}
            </select>
            <div>
              <ImageUpload onSelectImage={getImage} width={100} height={100} />
            </div>
            <div className="flex justify-center items-center space-x-2">
              <div
                onClick={() => {
                  setAddVariation(false);
                }}
                className="px-2 py-1 bg-red-500 rounded-lg text-white my-auto h-max w-[50%] mx-auto text-center cursor-pointer hover:bg-red-600 "
              >
                Cancel
              </div>
              <div
                onClick={() => {
                  addAVariation();
                }}
                className="px-2 py-1 bg-green-500 rounded-lg text-white my-auto h-max w-[50%] mx-auto text-center cursor-pointer hover:bg-green-600 "
              >
                Save
              </div>
            </div>
          </div>
        )}
        {/* <div>{variations.map((vari) => {
          return 
        })}</div> */}
        {addVariation == false && (
          <div
            onClick={() => {
              setAddVariation(true);
            }}
            className="text-xl w-max py-3 cursor-pointer "
          >
            + Add variation
          </div>
        )}
      </div>
    </div>
  );
}

export default Variations;

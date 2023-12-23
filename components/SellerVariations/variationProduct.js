import { Ring } from "@uiball/loaders";
import Image from "next/image";
import { useState } from "react";
import Combination from "./Combination";

function generateCombinations(
  attributes,
  currentCombination = {},
  currentIndex = 0
) {
  if (currentIndex === attributes.length) {
    const combinationWithIdsArray = { ...currentCombination };
    combinationWithIdsArray.idArray = Object.values(currentCombination).filter(
      (value) => typeof value === "number"
    );
    return [combinationWithIdsArray];
  }

  const attributeKey = Object.keys(attributes[currentIndex])[0];
  const currentAttribute = attributes[currentIndex][attributeKey];
  const combinations = [];

  for (const option of currentAttribute) {
    const newCombination = { ...currentCombination };
    newCombination[attributeKey] = option.option;
    newCombination[`${attributeKey}Id`] = option.id;

    const nextCombinations = generateCombinations(
      attributes,
      newCombination,
      currentIndex + 1
    );
    combinations.push(...nextCombinations);
  }

  return combinations;
}

function VariationProduct({ variations, image, productId }) {
  // const [selectedVariations, setSelectedVariations] = useState([]);
  const [selectedCombinations, setSelectedCombinations] = useState([]);
  const groupedVariations = {};
  variations["variations"].forEach((variation) => {
    const attribute = variation.attribute;
    if (!groupedVariations[attribute]) {
      groupedVariations[attribute] = [];
    }
    groupedVariations[attribute].push(variation);
  });
  const attributeArray = Object.entries(groupedVariations).map(
    ([key, value]) => ({ [key]: value })
  );
  const allCombinations = generateCombinations(attributeArray);
  // console.log(allCombinations);
  // function selectVariation(id) {
  //   const isSelected = selectedVariations.includes(id);

  //   if (isSelected) {
  //     setSelectedVariations((prevSelected) =>
  //       prevSelected.filter((selectedId) => selectedId !== id)
  //     );
  //   } else {
  //     setSelectedVariations((prevSelected) => [...prevSelected, id]);
  //   }
  // }

  // const handleCheckboxChange = (index) => {
  //   const updatedSelectedCombinations = [...selectedCombinations];
  //   updatedSelectedCombinations[index] = !selectedCombinations[index];
  //   // console.log(updatedSelectedCombinations);
  //   setSelectedCombinations(updatedSelectedCombinations);
  // };
  // console.log(`asdasdasd`);
  // console.log(allCombinationsWithIds);

  return (
    <div className={`w-full flex flex-col justify-around items-start py-2 `}>
      <p className="pb-3 text-xl">
        Please select the desired variations for your product :
      </p>
      <div className="flex justify-start w-full items-center space-y-3">
        <div className="w-full">
          {/* {Object.keys(groupedVariations).map((key, index) => {
            return (
              <div
                key={index}
                className="flex flex-col px-2 justify-start w-full items-start space-y-1 py-2"
              >
                <p className="text-lg">{key} :</p>
                <div className="flex flex-wrap w-full px-2 justify-start items-center space-x-3 ">
                  {groupedVariations[key].map((item) => {
                    const isSelected = selectedVariations.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          selectVariation(item.id);
                        }}
                        className={`px-2 text-lg text-black cursor-pointer select-none border-b-2 border-gray-300 transition-all duration-300 ${
                          isSelected
                            ? "border-skin-primary opacity-100 "
                            : "opacity-60"
                        }`}
                      >
                        {item.option}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })} */}

          {/* {allCombinations.map((combination, index) => {
            return (
              // <div
              //   key={index}
              //   className="flex flex-wrap space-x-4 px-2 py-2 border-b border-gray-200"
              // >
              //   {Object.entries(combination).map(([key, value]) => {
              //     return (
              //       <div className="flex justify-center w-max  items-center ">
              //         {!key.startsWith("id") ? (
              //           !key.endsWith("Id") && (
              //             <div
              //               key={key}
              //               className="text-center"
              //             >{`${key}: ${value}`}</div>
              //           )
              //         ) : (
              //           <button
              //             onClick={() => {console.log(value)}}
              //             className="justify-self-end flex-grow text-skin-primary "
              //           >click</button>
              //         )}
              //       </div>
              //     );
              //   })}
              // </div>
              <Combination
                key={index}
                combination={combination}
                productId={productId}
              />
            );
          })} */}

          {/* {allCombinationsWithIds.forEach(())} */}
        </div>
        {/* <Image src={image} width={150} height={150} alt="Product image" className="m-auto shadow-xl border border-gray-300 rounded-sm " /> */}
      </div>
    </div>
  );
}

export default VariationProduct;

import React, { useState } from "react";

// const productVariations = {
//   success: true,
//   variations: [
//     {
//       id: 15,
//       attribute: "Size",
//       option: "Large",
//       image: null,
//     },
//     {
//       id: 16,
//       attribute: "Color",
//       option: "Blue",
//       image: null,
//     },
//     {
//       id: 17,
//       attribute: "Color",
//       option: "Red",
//       image: null,
//     },
//     {
//       id: 18,
//       attribute: "Size",
//       option: "Small",
//       image: null,
//     },
//   ],
// };

function Variations({ publicProduct , productVariations  }) {
  const [selectedAttributes, setSelectedAttributes] = useState([]);

  const isButtonDisabled = Object.values(selectedAttributes).some(
    (value) => !value
  );

  const groupedVariations = {};
  productVariations["variations"].forEach((variation) => {
    const attribute = variation.attribute;
    if (!groupedVariations[attribute]) {
      groupedVariations[attribute] = [];
    }
    groupedVariations[attribute].push(variation);
  });

  return (
    <>
      <div>
        {Object.keys(groupedVariations).map((key, index) => {
          return (
            <>
              {publicProduct == false ? (
                <div key={index} className="flex flex-col">
                  <p>{key}</p>
                  <div className="flex space-x-2">
                    {groupedVariations[key].map((item) => {
                      return (
                        <div
                          className="relative flex flex-wrap px-2 py-1"
                          key={item.id}
                        >
                          <label>
                            <input
                              className="mr-3 ml-1 hidden"
                              type="radio"
                              name={key}
                              value={item.option}
                              onChange={(event) => {
                                setSelectedAttributes({
                                  ...selectedAttributes,
                                  [key]: event.target.value,
                                });
                              }}
                              checked={selectedAttributes[key] === item.option}
                            />
                            <button
                              className={`border-2 border-orange-500 rounded-lg px-3 py-1 text-gray-700 ${
                                selectedAttributes[key] === item.option
                                  ? "opacity-100"
                                  : "opacity-60 "
                              } `}
                              onClick={() => {
                                setSelectedAttributes({
                                  ...selectedAttributes,
                                  [key]: item.option,
                                });
                              }}
                            >
                              {item.option}
                            </button>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div key={index} className="flex flex-wrap items-center">
                  <p
                    className={` px-3 py-1 text-skin-primary border-b-2 cursor-default `}
                  >
                    {key} :
                  </p>
                  {groupedVariations[key].map((item , index) => {
                    return (
                      <div
                        className="relative flex flex-wrap px-2 py-1 my-1"
                        key={index}
                      >
                        <label>
                          <button className={`text-gray-400 cursor-default`}>
                            {item.option}
                          </button>
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          );
        })}

        {publicProduct == false ? (
          <button
            className={`${
              isButtonDisabled
                ? "bg-gray-400 text-gray-700 opacity-50  px-4 py-1 rounded-md mt-3"
                : "bg-skin-primary text-white px-4 py-1 rounded-md mt-3"
            }`}
            disabled={isButtonDisabled}
          >
            Add to Cart
          </button>
        ) : (
          <div> </div>
        )}
      </div>
    </>
  );
}

export default Variations;

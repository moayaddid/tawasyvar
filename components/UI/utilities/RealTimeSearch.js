import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";

function RealTimeSearch({ searchAPI, setResults , children , closeSearch , placeholder }) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const searchRef = useRef();
  const [searchedResults, setSearchedResults] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const [inSearch, setInSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [delayedSearch, setDelayedSearch] = useState(null);

  const debounceSearch = () => {
    // setSearching(true);

    if (delayedSearch) {
      clearTimeout(delayedSearch);
    }

    setDelayedSearch(
      setTimeout(() => {
        if (searchRef.current.value.length >= 3) {
          search();
        } else {
          setSearching(false);
        }
      }, 500)
    );
  };

  const handleInputChange = () => {
    debounceSearch();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    debounceSearch();
  };

  useEffect(() => {
    return () => {
      if (delayedSearch) {
        clearTimeout(delayedSearch);
      }
    };
  }, [delayedSearch]);

  async function search(e = null) {
    if (e) {
      e.preventDefault();
    }
    // console.log(searchType);
    if (searchRef.current.value) {
      setSearching(true);
      try {
        const { data: searchResults } = await Api.get(
          searchAPI,
          {
            params: { query: searchRef.current.value },
          },
          {
            noSuccessToast: true,
          }
        );
        console.log(`search results`);
        console.log(searchResults);
        // const components = (
        //   <div className="flex flex-col justify-start items-center h-full w-full ">
        //     <p className=" text-base text-start text-skin-primary py-1 border-b w-full border-skin-primary ">
        //       {/* {`Store Types`} : */}
        //       Results :
        //     </p>
        //     {searchResults?.data && (
        //       <div
        //         className=" w-full flex flex-col space-y-2 py-3 max-h-[400px] overflow-y-scroll "
        //         dir="ltr"
        //       >
        //         {products?.data?.map((product, i) => {
        //           //   return (
        //           if (product.has_variation === 1) {
        //             return (
        //               <Accordion
        //                 key={`${i} - ${product.id} - ${product.name_en}`}
        //               >
        //                 <AccordionItem
        //                   title={`${product.id} - ${product.name_en}`}
        //                   indicator={({ isOpen }) =>
        //                     isOpen ? (
        //                       <MdOutlineArrowDropDown className="text-[30px]" />
        //                     ) : (
        //                       <MdArrowLeft className="text-[30px]" />
        //                     )
        //                   }
        //                   className="divide-y-2 transition-all duration-500 "
        //                 >
        //                   {product?.combination?.original?.product_combination.map(
        //                     (combination, i) => {
        //                       let vari = [];
        //                       combination?.product?.variations.map((vars) => {
        //                         if (vars.option) {
        //                           vari.push(vars.option);
        //                         }
        //                       });
        //                       return (
        //                         <div
        //                           key={`${combination.product.line_id} - ${i}`}
        //                           className="w-full cursor-pointer hover:bg-gray-100 xl:grid xl:grid-cols-2 flex flex-wrap justify-start items-center space-x-3 px-1 py-1"
        //                           onClick={() => {
        //                             let data = {};
        //                             data.productId = product.id;
        //                             data.combinationId =
        //                               combination.product.line_id;
        //                             data.productName = product.name_en;
        //                             data.variations = vari.join(" - ");
        //                             // console.log(
        //                             //   `data in accordion item "product combination :"`
        //                             // );
        //                             // console.log(data);
        //                             setSelectedProduct(data);
        //                           }}
        //                         >
        //                           <p className="text-start">{`Variation : ${vari.join(
        //                             " - "
        //                           )}`}</p>
        //                           <p className="text-start">{`Part Number : ${
        //                             combination.product.part_number
        //                               ? combination.product.part_number
        //                               : `-`
        //                           }`}</p>
        //                         </div>
        //                       );
        //                     }
        //                   )}
        //                 </AccordionItem>
        //               </Accordion>
        //             );
        //           } else {
        //             return (
        //               <div
        //                 key={`${i} - ${product.id} - ${product.name_en}`}
        //                 className="flex flex-wrap cursor-pointer justify-start items-center space-x-2 hover:bg-gray-100 px-1 w-full py-2 "
        //                 onClick={() => {
        //                   let data = {};
        //                   data.productId = product.id;
        //                   data.combinationId = null;
        //                   data.productName = product.name_en;
        //                   // console.log(`data in item "product combination :"`);
        //                   // console.log(data);
        //                   setSelectedProduct(data);
        //                 }}
        //               >
        //                 <p>{`${product.id} - `}</p>
        //                 <p>{product.name_en}</p>
        //               </div>
        //             );
        //           }
        //           //   );
        //         })}
        //       </div>
        //     )}
        //   </div>
        // );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // setSearchedResults(components);
        setSearchedResults(searchResults.items);
        setResults(searchResults.items);
        setSearching(false);
      } catch (error) {
        setSearching(false);
      }
    } else {
      return;
    }
  }

  return (
    <div className=" w-full flex flex-col justify-start items-start relative">
      <form
        onSubmit={handleFormSubmit}
        className="flex bg-gray-100 w-full items-center px-2 border-b-2 border-transparent focus-within:border-skin-primary transition-all duration-700 mx-auto "
      >
        <input
          className="w-full bg-gray-100 outline-none rounded-lg text-sm h-10 placeholder:text-sm  placeholder:text-gray-700"
          type="text"
          ref={searchRef}
          onChange={handleInputChange}
          placeholder={placeholder ?? "Search"}
          onClick={() => {
            setInSearch(true);
          }}
        />
        {searching == true ? (
          <Ring size={25} lineWeight={5} speed={2} color="#ff6600" />
        ) : (
          <MdClose
            className={`text-red-500 ${
              inSearch == true ? `block` : `hidden`
            } transition-all duration-300s hover:text-red-600 w-[25px] h-[25px] hover:border-b-2 hover:border-red-600 cursor-pointer`}
            onClick={() => {
              setInSearch(false);
            }}
          />
        )}
      </form>
      {inSearch == true && searchedResults && (
        <div className=" absolute top-full left-0 mx-auto w-full bg-white border border-gray-300 rounded-sm ">
          {children}
        </div>
      )}
    </div>
  );
}

export default RealTimeSearch;

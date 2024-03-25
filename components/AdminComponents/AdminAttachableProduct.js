import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import { IoMdGitBranch } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { convertMoney } from "../SellerOrders/sellerOrder";
import logo from "@/public/images/tawasylogo.png";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { MdArrowLeft, MdClose, MdOutlineArrowDropDown } from "react-icons/md";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import { Accordion, AccordionItem } from "@nextui-org/react";
import TawasyLoader from "../UI/tawasyLoader";

function AdminAttachableProduct({ product, selectedStoreId, refetch }) {
  const [isLoading, setIsLoading] = useState(false);
  const [OpenAttach, setOpenAttach] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const searchRef = useRef();
  const [attachedProducts, setAttachedProducts] = useState(null);
  const [searchedResults, setSearchedResults] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const [inSearch, setInSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [delayedSearch, setDelayedSearch] = useState(null);
  const [isAttaching, setIsAttaching] = useState(false);

  const GetAttachItem = async () => {
    try {
      setIsLoading(true);
      const response = await Api.get(
        `/api/admin/attached-item/${product.item_id}`
      );
      console.log(response.data);
      setAttachedProducts(response.data.products);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  function OpenAttachment() {
    setOpenAttach(true);
    if (product.attached == true) {
      GetAttachItem();
    }
    // admin/attached-item/{itemId}
  }

  function closeAttachment() {
    setOpenAttach(false);
    setSelectedProduct();
    setSearchedResults();
    setInSearch(false);
  }

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
        const { data: products } = await Api.get(
          `/api/admin/search-product`,
          {
            params: { search: searchRef.current.value },
          },
          {
            noSuccessToast: true,
          }
        );
        const components = (
          <div className="flex flex-col justify-start items-center h-full w-full ">
            <p className=" text-base text-start text-skin-primary py-1 border-b w-full border-skin-primary ">
              {/* {`Store Types`} : */}
              Products :
            </p>
            {products?.data && (
              <div
                className=" w-full flex flex-col space-y-2 py-3 max-h-[400px] overflow-y-scroll "
                dir="ltr"
              >
                {products?.data?.map((product, i) => {
                  //   return (
                  if (product.has_variation === 1) {
                    return (
                      <Accordion
                        key={`${i} - ${product.id} - ${product.name_en}`}
                      >
                        <AccordionItem
                          title={`${product.id} - ${product.name_en}`}
                          indicator={({ isOpen }) =>
                            isOpen ? (
                              <MdOutlineArrowDropDown className="text-[30px]" />
                            ) : (
                              <MdArrowLeft className="text-[30px]" />
                            )
                          }
                          className="divide-y-2 transition-all duration-500 "
                        >
                          {product?.combination?.original?.product_combination.map(
                            (combination, i) => {
                              let vari = [];
                              combination?.product?.variations.map((vars) => {
                                if (vars.option) {
                                  vari.push(vars.option);
                                }
                              });
                              return (
                                <div
                                  key={`${combination.product.line_id} - ${i}`}
                                  className="w-full cursor-pointer hover:bg-gray-100 xl:grid xl:grid-cols-2 flex flex-wrap justify-start items-center space-x-3 px-1 py-1"
                                  onClick={() => {
                                    let data = {};
                                    data.productId = product.id;
                                    data.combinationId =
                                      combination.product.line_id;
                                    data.productName = product.name_en;
                                    data.variations = vari.join(" - ");
                                    // console.log(
                                    //   `data in accordion item "product combination :"`
                                    // );
                                    // console.log(data);
                                    setSelectedProduct(data);
                                  }}
                                >
                                  <p className="text-start">{`Variation : ${vari.join(
                                    " - "
                                  )}`}</p>
                                  <p className="text-start">{`Part Number : ${
                                    combination.product.part_number
                                      ? combination.product.part_number
                                      : `-`
                                  }`}</p>
                                </div>
                              );
                            }
                          )}
                        </AccordionItem>
                      </Accordion>
                    );
                  } else {
                    return (
                      <div
                        key={`${i} - ${product.id} - ${product.name_en}`}
                        className="flex flex-wrap cursor-pointer justify-start items-center space-x-2 hover:bg-gray-100 px-1 w-full py-2 "
                        onClick={() => {
                          let data = {};
                          data.productId = product.id;
                          data.combinationId = null;
                          data.productName = product.name_en;
                          // console.log(`data in item "product combination :"`);
                          // console.log(data);
                          setSelectedProduct(data);
                        }}
                      >
                        <p>{`${product.id} - `}</p>
                        <p>{product.name_en}</p>
                      </div>
                    );
                  }
                  //   );
                })}
              </div>
            )}
          </div>
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSearchedResults(components);
        setSearching(false);
      } catch (error) {
        setSearching(false);
      }
    } else {
      return;
    }
  }

  async function attachProduct() {
    setIsAttaching(true);
    try {
      const response = await Api.post(`/api/admin/attach-product-waffer`, {
        product_id: selectedProduct.productId,
        product_combination_id: selectedProduct.combinationId ?? null,
        product_api_id: product.item_id,
      });
      refetch();
      closeAttachment();
      setIsAttaching(false);
    } catch (error) {
      setIsAttaching(false);
    }
    setIsAttaching(false);
  }

  return (
    <>
      <tr
        key={product.id}
        className=" px-0 bg-gray-100 hover:bg-gray-200 font-medium"
      >
        <td className="px-4 py-4">{product.item_id}</td>
        <td class="px-4 py-4">
          <div class="flex md:flex-wrap flex-col items-center space-y-3 lg:space-y-1">
            <button
              onClick={OpenAttachment}
              class="items-center px-2 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              <FiEdit />
            </button>
          </div>
        </td>
        <td className="px-4 py-4">{product.name}</td>
        <td
          className={`px-4 py-4 ${
            product.attached == true ? `text-green-500` : `text-red-500`
          } `}
        >
          {product.attached == true ? `Yes` : `No`}
        </td>
        <td className="px-4 py-4 flex justify-center items-center ">
          <Image
            src={product.image ? product.image : logo}
            alt="photo"
            width={100}
            height={100}
            className="object-contain max-h-[100px] max-w-[100px] object-center"
          />
        </td>
      </tr>

      <Dialog
        open={OpenAttach}
        fullWidth
        maxWidth="xl"
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle className="flex justify-between items-center">
          <div className="flex justify-start items-center space-x-3">
            <p>Attach Product : {product.name}</p>
          </div>
          <MdClose
            onClick={closeAttachment}
            className="text-red-500 text-[25px] cursor-pointer border-b-2 border-transparent hover:border-red-600 hover:text-red-600 transition-all duration-500"
          />
        </DialogTitle>
        <hr />
        <DialogContent className="w-full flex flex-col justify-start items-start space-y-4 h-[600px]">
          {isLoading == true ? (
            <div className="w-full h-full flex justfy-center items-center">
              <TawasyLoader width={300} height={300} />
            </div>
          ) : (
            <div className="flex flex-col justify-start items-start space-y-4 h-full w-full">
              <div className="flex justify-start items-center w-full ">
                <p className="text-lg">Search for a product to attach :</p>
                <div className=" w-[40%] flex flex-col justify-start items-start relative">
                  <form
                    onSubmit={handleFormSubmit}
                    className="flex bg-gray-100 w-full items-center px-2 border-b-2 border-transparent focus-within:border-skin-primary transition-all duration-700 mx-auto "
                  >
                    <input
                      className="w-full bg-gray-100 outline-none rounded-lg text-sm h-10 placeholder:text-xs placeholder:text-transparent placeholder:md:text-gray-400"
                      type="text"
                      ref={searchRef}
                      onChange={handleInputChange}
                      placeholder="Search a product name"
                      onClick={() => {
                        setInSearch(true);
                      }}
                    />
                    {searching == true ? (
                      <Ring
                        size={25}
                        lineWeight={5}
                        speed={2}
                        color="#ff6600"
                      />
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
                    <div className="px-4 z-10 absolute top-0 left-full mx-auto w-full bg-white border border-gray-300 rounded-sm ">
                      {searchedResults}
                    </div>
                  )}
                </div>
              </div>
              {product.attached == true && attachedProducts !== null && (
                <div className="w-full flex flex-col justify-start items-start">
                  <p className="p-1 m-1">This product has attached items :</p>
                  <div className="w-[50%] flex flex-wrap">
                    {attachedProducts.map((prod, id) => {
                      return (
                        <div
                          key={i}
                          className="flex flex-wrap justify-start items-center space-x-1 px-2 py-1 border-2 border-skin-primary"
                        >
                          <p>{prod.name}</p>
                          <Image
                            src={product.image ? product.image : logo}
                            alt="photo"
                            width={150}
                            height={150}
                            className="object-contain max-h-[150px] max-w-[100px] min-h-[150px] min-w-[150px] "
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {selectedProduct !== null && selectedProduct !== undefined ? (
                <div className="flex flex-wrap justify-start items-center space-x-4">
                  <p className="text-lg">Selected product : </p>
                  <p>{selectedProduct.productName}</p>
                  {selectedProduct.combinationId &&
                    selectedProduct.combinationId !== null && (
                      <div className="flex justify-start items-center space-x-4">
                        <p>/</p>
                        <p>{selectedProduct.variations}</p>
                      </div>
                    )}
                </div>
              ) : (
                <div>You did not select a product yet .</div>
              )}
              <div className="w-full">
                <Image
                  src={product.image ?? logo}
                  alt={product.name}
                  width={0}
                  height={0}
                  className="object-contain w-[35%] h-auto "
                />
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions className="w-full flex justify-center items-center">
          {isAttaching == true ? (
            <div className="w-[20%] bg-green-500 flex justify-center items-center rounded-lg px-2 text-white py-1 text-center">
              <Ring size={25} speed={3} lineWeight={5} color="white" />
            </div>
          ) : (
            <button
              onClick={attachProduct}
              disabled={!selectedProduct}
              className="w-[20%] disabled:bg-gray-500 bg-green-500 hover:opacity-75 rounded-lg px-2 text-white py-1 text-center"
            >
              Attach Product
            </button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AdminAttachableProduct;

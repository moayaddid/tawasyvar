import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import Image from "next/image";
import ImageUpload from "../ImageUpload/ImageUpload";
import { convertDate } from "../SellerOrders/sellerOrder";
import TawasyLoader from "../UI/tawasyLoader";
import logo from "@/public/images/tawasylogo.png";
import { toast } from "react-toastify";
import { IoMdGitNetwork } from "react-icons/io";
import { useQuery } from "react-query";
import ProductCombination from "../AdminVariations/ProductVariations/ProductCombination";
import { MdAdd, MdClose } from "react-icons/md";
import { generateCombinations } from "@/pages/admin/Products/addNewProduct";
import Combination from "../SellerVariations/Combination";
import Variations from "../AdminVariations/ProductVariations/Variations";
import AdminProductVariation from "../AdminVariations/AdminProductVariation";
import AdminNotes from "../AdminComponents/AdminNotes";
import {
  getProductNote_endpoint,
  postProductNote_endpoint,
} from "@/api/endpoints/endPoints";
import lego from "@/public/images/lego.png";

function AdminProduct({ product, refetch }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingVariations, setIsEditingVariations] = useState(false);
  const [logoImage, setLogoImage] = useState();
  const [categories, setCategories] = useState();
  const [brands, setBrands] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState();
  const [savingStatus, setSavingStatus] = useState(false);
  const [category, setCategory] = useState();
  const [brand, setBrand] = useState();
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingVariations, setIsSavingVariations] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingVariation, setDeletingVariation] = useState(false);
  const [isAddingVariation, setIsAddingVariation] = useState(false);
  const [savingAdd, setSavingAdd] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [combinations, setCombinations] = useState();
  const [loading, setLoading] = useState(false);
  const [bigSize, setBigSize] = useState(
    product.big_size ? product.big_size : false
  );
  const [loadingProductVariations, setLoadingProductVariations] =
    useState(false);
  // const [varis, setVaris] = useState();
  // const [options, setOptions] = useState();
  const [notesOpen, setNotesOpen] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [notes, setNotes] = useState([]);
  const [variants, setVariants] = useState();
  const newNameAr = useRef();
  const newNameEn = useRef();
  const newdescAr = useRef();
  const newdescEn = useRef();
  const newSku = useRef();
  const newEanCode = useRef();
  const newSortOrder = useRef();
  const packRef = useRef();
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const {
    data: variations,
    isLoading: loadingVariations,
    isFetching,
    isRefetching: isRefetchingVariations,
    refetch: refetchCombinations,
  } = useQuery([`proVariations`, isEditingVariations], fetchProductVariations, {
    enabled: isEditingVariations,
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const {
    data: productVariations,
    isLoading: productVariationsLoading,
    isFetching: isFetchingProductVariations,
    isRefetching: isRefetchingProductVariations,
    refetch: refetchProductVariations,
  } = useQuery([`productVaiants`, isEditingVariations], fetchVariations, {
    enabled: isEditingVariations,
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const {
    data: options,
    isLoading: optionsLoading,
    isFetching: optionsFetching,
    isRefetching: isRefetchingOptions,
  } = useQuery(["options", isEditingVariations], fetchOptions, {
    staleTime: 1,
    enabled: isEditingVariations,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const {
    data: varis,
    isLoading: varisLoading,
    isFetching: varisFetching,
    isRefetching: isRefetchingVaris,
  } = useQuery(["varis", isEditingVariations], fetchVaris, {
    staleTime: 1,
    enabled: isEditingVariations,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // console.log(product)

  async function fetchVaris() {
    try {
      const response = await Api.get(`/api/admin/attributes`);
      return response.data.data;
    } catch (error) {}
  }

  async function fetchOptions() {
    try {
      const response = await Api.get(`/api/admin/options`);
      return response.data.data;
    } catch (error) {}
  }

  async function fetchProductVariations() {
    try {
      return await Api.get(`/api/admin/get-product-combination/${product.id}`);
    } catch (error) {}
  }

  async function fetchVariations() {
    return await Api.get(`/api/product-variation/${product.id}`);
  }

  useEffect(() => {
    setVariants();
  }, []);

  function handleLogoImage(data) {
    setLogoImage(data);
  }

  async function openDialog() {
    setIsEditing(true);
    setIsLoading(true);
    try {
      const response = await Api.get(`/api/admin/get-categories`);
      // console.log(response);
      // setStoreTypes(response.data.data);
      setCategories(response.data.categories);
    } catch (error) {}
    try {
      const response = await Api.get(`/api/admin/brands`);
      // console.log(response);
      setBrands(response.data.brands);
    } catch (error) {}
    setIsLoading(false);
  }

  async function saveEdits() {
    setIsSaving(true);
    let editData = {};
    const addIfDifferent = (fieldValue, fieldName) => {
      const originalValue = product[fieldName];
      // console.log(fieldValue);
      if (
        fieldValue !== undefined &&
        fieldValue.trim() !== "" &&
        fieldValue !== originalValue
      ) {
        editData[fieldName] = fieldValue;
      }
    };
    addIfDifferent(newNameAr.current.value, "name_ar");
    addIfDifferent(newNameEn.current.value, "name_en");
    addIfDifferent(newdescAr.current.value, "description_ar");
    addIfDifferent(newdescEn.current.value, "description_en");
    // addIfDifferent((bigSize == false ? 0 : 1), "big_size");
    if (bigSize != product.big_size) {
      editData.big_size = bigSize == true ? 1 : 0;
    }
    if (category && category !== product.category) {
      editData.category_name = category;
    }
    if (brand && brand !== product.brand) {
      editData.brand_name = brand;
    }
    addIfDifferent(newSku.current.value, "sku");
    addIfDifferent(newEanCode.current.value, "ean_code");
    addIfDifferent(packRef.current.value, "pack");
    // addIfDifferent(newSortOrder.current.value, "sort_order");
    if (product.slug) {
      addIfDifferent(status, "status");
    }

    if (logoImage) {
      // editData.image = logoImage;
      try {
        const response2 = await Api.post(
          `/api/admin/update-product-image/${product.id}`,
          {
            new_image: logoImage,
          },
          {
            headers: { "Content-Type": `multipart/form-data` },
          }
        );
        setLogoImage();
      } catch (error) {
        // console.log(error);
      }
    }
    if (Object.keys(editData).length < 1) {
      setIsEditing(false);
      setIsSaving(false);
      return;
    } else {
      try {
        const response = await Api.put(
          `/api/admin/update-product/${product.id}`,
          editData,
          {
            // headers: { "Content-Type": `multipart/form-data` },
          }
        );
        setIsSaving(false);
        if (product.status != "pending") {
          setIsEditing(false);
        }
        refetch();
      } catch (error) {
        setIsSaving(false);
      } finally {
        // setIsEditing(false);
        setIsSaving(false);
        // setIsEditing(false);
      }
      setIsSaving(false);
    }
  }

  async function deleteProduct() {
    // setIsDeleting(true);
    setDeleting(true);
    try {
      const response = Api.delete(`/api/admin/delete-product/${product.id}`);
      refetch();
      setDeleting(false);
      setIsDeleting(false);
    } catch (error) {
      setDeleting(false);
    }
  }

  async function declineProduct() {
    setIsDeclining(true);
    try {
      const response = await Api.put(
        `/api/admin/accept-decline-product/${product.id}`,
        {
          status: "declined",
        }
      );
      refetch();
      setIsDeclining(false);
      setIsEditing(false);
    } catch (error) {
      setIsDeclining(false);
    }
    setIsDeclining(false);
  }

  async function approveProduct() {
    setIsApproving(true);
    try {
      const response = await Api.put(
        `/api/admin/accept-decline-product/${product.id}`,
        {
          status: "approved",
        }
      );
      refetch();
      setIsApproving(false);
      setIsEditing(false);
    } catch (error) {
      setIsApproving(false);
    }
  }

  async function openVariations() {
    setIsEditingVariations(true);
  }

  async function addCombination() {
    setIsAdding(true);
    setLoading(true);
    try {
      const groupedVariations = {};
      productVariations.data.variations.forEach((variation) => {
        const attribute = variation.attribute;
        if (!groupedVariations[attribute]) {
          groupedVariations[attribute] = [];
        }
        groupedVariations[attribute].push(variation);
      });
      const attributeArray = Object.entries(groupedVariations).map(
        ([key, value]) => ({ [key]: value })
      );
      const allCombinations = await generateCombinations(attributeArray);
      const filteredCombinations = allCombinations.filter(
        (combination) =>
          !variations.data.product_combination.some((product) =>
            combination.idArray.every((id) =>
              product.product.variations.some(
                (variation) => variation.id === id
              )
            )
          )
      );
      setCombinations(filteredCombinations);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  }

  async function deleteVariation() {
    refetchCombinations();
    refetchProductVariations();
    setIsAdding(false);
    setIsAddingVariation(false);
  }

  async function addVariation() {
    setIsAddingVariation(true);
    // setLoadingProductVariations(true);
    // try {
    //   const response = await Api.get(`/api/admin/attributes`);
    //   setVaris(response.data.data);
    //   const response2 = await Api.get(`/api/admin/options`);
    //   setOptions(response2.data.data);
    // } catch (error) {
    //   setLoadingProductVariations(false);
    // }
    // setLoadingProductVariations(false);
  }

  async function saveVariations() {
    setIsSavingVariations(true);
    if (
      variants == undefined ||
      variants == null ||
      (Array.isArray(variants) && variants.length < 1)
    ) {
      toast.error(
        "You are saving without providing any variations , Either cancel the addition or provide at least 1 variation",
        { theme: "colored" }
      );
      setIsSavingVariations(false);
      return;
    } else {
      let data = {};
      variants.forEach((item, index) => {
        data[`variations[${index}][attribute_id]`] = item.attribute_id;
        data[`variations[${index}][option_id]`] = item.option_id;
        data[`variations[${index}][image]`] = item.image;
      });
      // console.log(data);
      try {
        const response = await Api.post(
          `/api/admin/add-variation/${product.id}`,
          {
            ...data,
          },
          {
            headers: { "Content-Type": `multipart/form-data` },
          }
        );
        setIsAdding(false);
        setIsAddingVariation(false);
        refetchProductVariations();
        setVariants();
      } catch (error) {
        setIsSavingVariations(false);
      }
    }
    setIsSavingVariations(false);
  }

  return (
    <>
      <tr
        key={product.id}
        className=" bg-gray-100 hover:bg-gray-200 font-medium my-2 py-2 "
      >
        <td className="px-4 ">{product.id}</td>
        <td class="px-4 py-4">
          <div class="flex space-x-3 justify-center items-center ">
            <button
              onClick={openDialog}
              className="items-center px-2 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              <FiEdit />
            </button>
            <button
              onClick={openVariations}
              className="items-center px-2 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none"
            >
              <IoMdGitNetwork />
            </button>
            <AdminNotes
              NotesFor={product.name_en}
              entityId={product.id}
              getEndpoint={getProductNote_endpoint}
              postEndpoint={postProductNote_endpoint}
            />
          </div>
        </td>
        <td
          className={`px-4 w-[5%] ${
            product.has_variation ? `text-green-500` : `text-red-500`
          }`}
        >
          {product.has_variation ? `Yes` : `No`}
        </td>
        <td className=" px-4  w-[10%] ">{product.name_ar}</td>
        <td className="px-4  w-[10%]">{product.name_en}</td>
        <td className="px-4  w-[10%] ">{product.description_ar}</td>
        <td className="px-4  w-[10%]">{product.description_en}</td>
        <td className="px-4 ">{product.category}</td>
        <td className="px-4  h-full w-max ">
          {product.image ? (
            <Image
              src={product.image ? product.image : logo}
              alt={product.name_en}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "75px", height: "75px" }}
              className="object-center mx-auto "
            />
          ) : (
            `No image`
          )}
        </td>
        <td className=" px-4  ">{product.status}</td>
        <td className="px-4 ">{product.brand && product.brand}</td>
        <td className="px-4 ">{product.sku}</td>
        <td className="px-4 ">{product.ean_code}</td>
        <td className="px-4 ">{product.pack ?? " - "}</td>
        <td
          className={`${
            router.pathname === "/admin/Products/PendingProduct" && `hidden`
          }`}
        >
          {product.sold_quantity}
        </td>
        <td>{product.sort_order}</td>
        <td className="px-4 ">{convertDate(product.created_at)}</td>
        <td className="px-4 ">{convertDate(product.updated_at)}</td>
        <td
          className={` px-4  ${
            router.pathname === "/admin/Products/PendingProduct" && `hidden`
          }`}
        >
          {product.instores}
        </td>
      </tr>

      <Dialog
        open={isEditing}
        onClose={() => {
          setIsEditing(false);
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle className="flex justify-between border-b-2 border-black">
          <p className="text-gray-500 md:pl-6 font-medium">
            Edit Product : {product.name_en}
          </p>
        </DialogTitle>
        <DialogContent>
          {isLoading ? (
            <div className="w-full h-full">
              <TawasyLoader width={300} height={300} />
            </div>
          ) : (
            <Stack spacing={1} margin={3}>
              <div className="md:grid md:grid-cols-2 gap-6">
                <div className="flex w-full items-center">
                  <label className="text-lg w-[30%] px-2">Arabic name :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="text"
                    // placeholder={product.name_ar}
                    defaultValue={product.name_ar}
                    ref={newNameAr}
                  />
                </div>

                <div className="flex items-center">
                  <label className="text-lg w-[30%] px-2">English name :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="text"
                    // placeholder={product.name_en}
                    defaultValue={product.name_en}
                    ref={newNameEn}
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">descAr :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="numbere"
                    // placeholder={product.description_ar}
                    defaultValue={product.description_ar}
                    ref={newdescAr}
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">descEn :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="numbere"
                    // placeholder={product.description_en}
                    defaultValue={product.description_en}
                    ref={newdescEn}
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">Category :</label>
                  <select
                    className="w-[80%] form-select outline-none bg-transparent border-b-2 border-gray-300 "
                    aria-label="Category"
                    name="category"
                    defaultValue={product.category}
                    onChange={(e) => {
                      // console.log(e.target.value);
                      setCategory(e.target.value);
                    }}
                  >
                    <option className="bg-white" disabled selected value>
                      Select a category
                    </option>
                    {categories &&
                      categories.map((category, index) => {
                        return (
                          <option
                            key={index}
                            className="bg-white"
                            value={category.name_en}
                          >
                            {category.name_en}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">Brand :</label>
                  <select
                    className="w-[80%] form-select outline-none bg-transparent border-b-2 border-gray-300 "
                    aria-label="Category"
                    name="category"
                    defaultValue={product.brand}
                    onChange={(e) => {
                      // console.log(e.target.value);
                      setBrand(e.target.value);
                    }}
                  >
                    <option className="bg-white" disabled selected value>
                      Select a brand
                    </option>
                    {brands &&
                      brands.map((brand) => {
                        return (
                          <option
                            key={brand.name}
                            className="bg-white"
                            value={brand.name}
                          >
                            {brand.name}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">Sku :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="text"
                    // placeholder={product.sku}
                    defaultValue={product.sku}
                    min={0}
                    ref={newSku}
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">EAN Code :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="text"
                    // placeholder={product.ean_code}
                    defaultValue={product.ean_code}
                    ref={newEanCode}
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">
                    Number of items in a pack :
                  </label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="text"
                    // placeholder={product.ean_code}
                    defaultValue={product.pack}
                    ref={packRef}
                  />
                </div>

                {product.slug && (
                  <div className="flex items-center">
                    <label className="w-[30%] text-lg px-2">Status :</label>
                    <select
                      className="w-[80%] form-select outline-none bg-transparent border-b-2 border-gray-300 "
                      aria-label="Status"
                      name="Status"
                      defaultValue={product.status}
                      onChange={
                        (e) => {
                          setStatus(e.target.value);
                        }
                        // changeStatus
                      }
                    >
                      <option className="bg-white" disabled selected value>
                        Select a Status
                      </option>
                      <option className="bg-white" value="approved">
                        Approved
                      </option>
                      <option className="bg-white" value="declined">
                        Declined
                      </option>
                      <option className="bg-white" value="pending">
                        Pending
                      </option>
                    </select>
                  </div>
                )}

                {/* <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">Code :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="numbere"
                    placeholder={product.code}
                    ref={newCode}
                    required
                  />
                </div> */}

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">Sort Order :</label>
                  {/* <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700 "
                    type="text"
                    // placeholder={product.sort_order}
                    defaultValue={product.sort_order}
                    ref={newSortOrder}
                  /> */}
                  <p>{product.sort_order}</p>
                </div>

                <div className="flex items-center">
                  <ImageUpload
                    onSelectImage={handleLogoImage}
                    width={100}
                    height={100}
                    defaultImage={product.image}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="big"
                  type="checkbox"
                  checked={bigSize}
                  onChange={() => {
                    setBigSize(!bigSize);
                  }}
                  className="cursor-pointer"
                />
                <label htmlFor="big" className="cursor-pointer px-2">
                  {" "}
                  Big Size Product{" "}
                </label>
              </div>

              <hr className="text-gray-400" />
              <div className="w-full flex justify-center items-center">
                <button
                  type="button"
                  className="bg-skin-primary px-8 py-3 hover:bg-orange-500 text-white rounded-lg w-[20%] mx-auto "
                  data-dismiss="modal"
                  onClick={saveEdits}
                >
                  {isSaving == true ? (
                    <div className="flex justify-center items-center">
                      <Ring size={20} lineWeight={4} speed={2} color="white" />
                    </div>
                  ) : (
                    "Save Edits "
                  )}
                </button>
              </div>
            </Stack>
          )}
        </DialogContent>
        {product.status == "pending" && !product.slug && (
          <DialogActions>
            <button
              type="button"
              className="bg-lime-950 px-8 py-3 text-white rounded-lg "
              data-dismiss="modal"
              onClick={approveProduct}
            >
              {isApproving == true ? (
                <div className="flex justify-center items-center">
                  <Ring size={20} lineWeight={4} speed={2} color="white" />
                </div>
              ) : (
                "Approve Product"
              )}
            </button>
            <button
              type="button"
              className="bg-red-500 px-8 py-3 text-white rounded-lg"
              data-dismiss="modal"
              onClick={declineProduct}
            >
              {isDeclining == true ? (
                <div className="flex justify-center items-center">
                  <Ring size={20} lineWeight={4} speed={2} color="white" />
                </div>
              ) : (
                "Decline Product"
              )}
            </button>
          </DialogActions>
        )}
      </Dialog>

      <Dialog
        open={isDeleting}
        onClose={() => {
          setIsDeleting(false);
        }}
        fullWidth
      >
        <DialogTitle className="flex justify-between border-b-2 border-black ">
          <p className="">Delete Product:</p>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <div className="flex flex-col justify-start items-start w-full ">
              <p className="text-lg ">
                Are you sure you want to delete this Product ?
              </p>
              <p className="text-xl pt-4">
                {product.name_en ? product.name_en : product.name_ar}
              </p>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="bg-green-700 px-8 py-3 text-white rounded-lg "
            data-dismiss="modal"
            onClick={deleteProduct}
          >
            {deleting == true ? (
              <div className="flex justify-center items-center">
                <Ring size={25} lineWeight={5} speed={2} color="white" />
              </div>
            ) : (
              "Yes"
            )}
          </button>
          <button
            type="button"
            className="bg-zinc-500 px-8 py-3 text-white rounded-lg"
            data-dismiss="modal"
            onClick={() => {
              setIsDeleting(false);
            }}
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isEditingVariations}
        onClose={() => {
          setIsAdding(false);
          setIsEditingVariations(false);
          setIsAddingVariation(false);
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle className="flex justify-between border-b-2 border-black ">
          <p className="">Product Variations: {product.name_en}</p>
          <MdClose
            onClick={() => {
              setIsAdding(false);
              setIsEditingVariations(false);
              setIsAddingVariation(false);
            }}
            className="w-[25px] h-[25px] text-black cursor-pointer hover:text-red-500 transition-all duration-300"
          />
        </DialogTitle>
        <DialogContent>
          {loadingVariations ||
          // isFetching ||
          //asdhjgsdahjgasdhjg
          // isFetchingProductVariations ||
          // optionsFetching ||
          optionsLoading ||
          // varisFetching ||
          varisLoading ||
          productVariationsLoading == true ? (
            <div className="w-full h-full flex justify-center items-center">
              <TawasyLoader width={300} height={300} />
            </div>
          ) : (
            // variations && (
            <Stack spacing={3} margin={3}>
              {variations && (
                <div className="flex flex-col justify-start items-start w-full ">
                  <div className="flex flex-col space-y-2 justify-start items-start w-full">
                    <div className="py-1 text-xl border-b border-gray-300 w-full flex justify-start items-center space-x-2 ">
                      <p>Variation Combinations</p>
                      {isRefetchingVariations == true && (
                        <Ring
                          size={17}
                          speed={2}
                          lineWeight={5}
                          color="#ff6600"
                        />
                      )}
                    </div>
                    {variations.data.product_combination &&
                    variations.data.product_combination.length > 0 ? (
                      variations.data.product_combination.map(
                        (variation, i) => {
                          return (
                            <ProductCombination
                              key={i}
                              product={variation.product}
                              refetch={() => {
                                refetchCombinations();
                              }}
                            />
                          );
                        }
                      )
                    ) : (
                      <div> This Products has no variation combinations. </div>
                    )}
                  </div>
                </div>
              )}
              {isAdding == false ? (
                <button
                  onClick={addCombination}
                  className="flex justify-start items-center border-b-2 border-transparent w-max cursor-pointer hover:border-black transition-all duration-300"
                >
                  <MdAdd />
                  Add Combination
                </button>
              ) : loading == true ? (
                <div className="flex justify-center items-center w-full">
                  <Ring size={50} speed={2} lineWeight={3} color="#ff6600" />
                </div>
              ) : combinations && combinations.length > 0 ? (
                <div className="w-full">
                  {combinations.map((combination, index) => {
                    return (
                      <Combination
                        key={index}
                        combination={combination}
                        productId={product.id}
                        refetch={() => {
                          refetchCombinations();
                          setIsAdding(false);
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="flex justify-center items-center space-x-2 ">
                  <p className="text-center">
                    There are no other combinations.
                  </p>
                  <button
                    onClick={() => {
                      refetchCombinations();
                    }}
                    className="px-2 py-1 bg-skin-primary hover:opacity-70 text-white rounded-lg "
                  >
                    Refresh
                  </button>
                </div>
              )}
              <hr />
              <div className="py-1 text-xl border-b border-gray-300 w-full flex justify-start items-center space-x-2 ">
                <p>Product Variations</p>
                {isRefetchingProductVariations == true && (
                  <Ring size={20} speed={2} lineWeight={5} color="#ff6600" />
                )}
              </div>
              {productVariations &&
              varis &&
              productVariations?.data?.variations?.length > 0 ? (
                productVariations?.data?.variations?.map((variant, index) => {
                  return (
                    <AdminProductVariation
                      key={variant.id}
                      variant={variant}
                      productId={product.id}
                      deleteV={deleteVariation}
                      options={options}
                    />
                  );
                })
              ) : (
                <div> There are no variations. </div>
              )}
              {isAddingVariation == false ? (
                <button
                  onClick={addVariation}
                  className="flex justify-start items-center border-b-2 border-transparent w-max cursor-pointer hover:border-black transition-all duration-300"
                >
                  <MdAdd />
                  Add Variation
                </button>
              ) : loadingProductVariations == true ? (
                <div className="flex justify-center items-center w-full">
                  <Ring size={50} speed={2} lineWeight={3} color="#ff6600" />
                </div>
              ) : (
                varis &&
                options && (
                  <div className="w-full p-6">
                    <Variations
                      setVariants={(data) => {
                        setVariants(data);
                      }}
                      allVariations={varis}
                      allOptions={options}
                    />
                    {isSavingVariations == true ? (
                      <div>
                        <Ring
                          size={20}
                          speed={2}
                          lineWeight={5}
                          color="#ff6600"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-start items-center space-x-3">
                        <button
                          onClick={saveVariations}
                          className="px-2 py-1 text-center  bg-green-500 rounded-lg text-white"
                        >
                          Done
                        </button>
                        <button
                          onClick={() => {
                            setVariants();
                            setIsAddingVariation(false);
                          }}
                          className="px-2 py-1 bg-red-500 text-center rounded-lg text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )
              )}
            </Stack>
            // )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminProduct;

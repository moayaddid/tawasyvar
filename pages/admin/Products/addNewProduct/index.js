import React, {
  useState,
  useRef,
  useEffect,
  useSyncExternalStore,
} from "react";
import ImageUpload from "../../../../components/ImageUpload/ImageUpload";
import withLayoutAdmin from "@/components/UI/adminLayout";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { Ring } from "@uiball/loaders";
import Variations from "../../../../components/AdminVariations/ProductVariations/Variations";
import { toast } from "react-toastify";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { DialogHeader } from "@material-tailwind/react";
import Combination from "@/components/SellerVariations/Combination";
import AdminSearchDropDown from "@/components/AdminComponents/AdminSearchDropDown";

export function generateCombinations(
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

const AddNewProductAdmin = () => {
  const [image, setImage] = useState();
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [saving, setSaving] = useState(false);
  const arNameRef = useRef();
  const enNameRef = useRef();
  const arDescRef = useRef();
  const enDescRef = useRef();
  const skuRef = useRef();
  const eanRef = useRef();
  const sortRef = useRef();
  const packRef = useRef();
  const [category, setCategory] = useState();
  const [brand, setBrand] = useState();
  const [bigSize, setBigSize] = useState(false);
  const [variants, setVariants] = useState();
  const [hasVariations, setHasVariations] = useState(false);
  const [productId, setProductId] = useState();
  const [loadingVariations, setLoadingVariations] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [combinations, setCombinations] = useState();
  const { data: brands, isLoading: brandsLoading } = useQuery(
    `brands`,
    fetchBrands,
    { staleTime: 1, refetchOnMount: true, refetchOnWindowFocus: false }
  );
  const { data: categories, isLoading: categoriesLoading } = useQuery(
    `categories`,
    fetchCategories,
    { staleTime: 1, refetchOnMount: true, refetchOnWindowFocus: false }
  );
  const { data: variations, isLoading: variationsLoading } = useQuery(
    "variations",
    fetchVariations,
    { staleTime: 1, refetchOnMount: true, refetchOnWindowFocus: false }
  );
  const { data: options, isLoading: optionsLoading } = useQuery(
    "options",
    fetchOptions,
    { staleTime: 1, refetchOnMount: true, refetchOnWindowFocus: false }
  );

  async function fetchOptions() {
    try {
      return await Api.get(`/api/admin/options`);
    } catch (error) {}
  }

  async function fetchVariations() {
    try {
      return await Api.get(`/api/admin/attributes`);
    } catch (error) {}
  }

  async function fetchBrands() {
    try {
      return await Api.get(`/api/admin/brands`);
    } catch (error) {}
  }

  async function fetchCategories() {
    try {
      return await Api.get(`/api/admin/get-categories`);
    } catch (error) {}
  }

  function handleStoreImage(image) {
    setImage(image);
  }

  async function openPop(variations) {
    setOpenPopUp(true);
    setLoadingVariations(true);
    // try {
    const groupedVariations = {};
    variations.forEach((variation) => {
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
    setCombinations(allCombinations);
    setLoadingVariations(false);
    // } catch (error) {}
  }

  async function createNewProduct(e) {
    e.preventDefault();
    setSaving(true);
    if (hasVariations) {
      if (
        variants == undefined ||
        variants == null ||
        (Array.isArray(variants) && variants.length < 1)
      ) {
        toast.error(
          "You have checked the has variation option without providing any variations , Either uncheck the option or provide at least 1 variation",
          { theme: "colored" }
        );
        setSaving(false);
        return;
      } else {
        let data = {};
        data.name_ar = arNameRef.current.value;
        data.name_en = enNameRef.current.value;
        data.description_ar = arDescRef.current.value;
        data.description_en = enDescRef.current.value;
        data.image = image;
        data.sort_order = sortRef.current.value;
        data.category_name = category;
        data.pack = packRef.current.value;
        data.ean_code = eanRef.current.value;
        data.sku = skuRef.current.value;
        data.brand_name = brand;
        data.big_size = bigSize == false ? 0 : 1;
        variants.forEach((item, index) => {
          data[`variations[${index}][attribute_id]`] = item.attribute_id;
          data[`variations[${index}][option_id]`] = item.option_id;
          data[`variations[${index}][image]`] = item.image;
        });
        try {
          const response = await Api.post(
            `/api/admin/add-product`,
            {
              ...data,
            },
            {
              headers: { "Content-Type": `multipart/form-data` },
            }
          );
          setProductId();
          setProductId(response.data.product.id);
          setSaving(false);
          // router.push("/admin/Products/AllProducts");
          openPop(response.data.variations);
        } catch (error) {
          setSaving(false);
        }
        setSaving(false);
        return;
      }
    } else {
      try {
        const response = await Api.post(
          `/api/admin/add-product`,
          {
            name_ar: arNameRef.current.value,
            name_en: enNameRef.current.value,
            description_ar: arDescRef.current.value,
            description_en: enDescRef.current.value,
            image: image,
            sort_order: sortRef.current.value,
            category_name: category,
            pack : packRef.current.value,
            ean_code: eanRef.current.value,
            sku: skuRef.current.value,
            brand_name: brand,
            big_size: bigSize == false ? 0 : 1,
          },
          {
            headers: { "Content-Type": `multipart/form-data` },
          }
        );
        setSaving(false);
        router.push("/admin/Products/AllProducts");
      } catch (error) {
        setSaving(false);
        // console.log(error);
      }
    }
    setSaving(false);
  }

  if (
    categoriesLoading == true ||
    brandsLoading == true ||
    variationsLoading == true ||
    optionsLoading == true
  ) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={400} height={500} />
      </div>
    );
  }

  return (
    <>
      <div className="py-4">
        <div className="flex justify-center">
          <h2 className="items-center text-2xl pt-9 pb-6 text-zinc-700">
            Create New Product
          </h2>
        </div>
        <form
          className=" w-[80%] flex flex-col justify-center mx-auto gap-3 h-max "
          onSubmit={createNewProduct}
        >
          {/* <div className="items-center"> */}
          <div className="grid md:grid-cols-2 grid-col-1 gap-2">
            <div className="px-6 py-4">
              <input
                className="md:w-[400px] w-full border-b-2 outline-none  text-xl focus:border-skin-primary transition-all duration-700 "
                name="nameAr"
                placeholder="Arabic Name"
                ref={arNameRef}
                required
              />
            </div>
            <div className="px-6 py-4">
              <input
                className="md:w-[400px] w-full border-b-2  outline-none text-xl focus:border-skin-primary transition-all duration-700"
                name="nameEn"
                placeholder="English Name"
                ref={enNameRef}
                required
              />
            </div>
            <div className="px-6 py-4">
              <input
                className="md:w-[400px] w-full border-b-2 outline-none  text-xl focus:border-skin-primary transition-all duration-700"
                name="descriptionAr"
                placeholder="Arabic Description"
                ref={arDescRef}
              />
            </div>
            <div className="px-6 py-4">
              <input
                className="md:w-[400px] w-full border-b-2  outline-none  text-xl focus:border-skin-primary transition-all duration-700"
                name="descriptionEn"
                placeholder="English Description "
                ref={enDescRef}
              />
            </div>

            <div className="px-6 py-4">
              {categories && (
                <AdminSearchDropDown
                  data={categories.data.categories}
                  title={`Select a category`}
                  selectItem={(item) => {setCategory(item.name_en);}}
                />
              )}
              {/* <select
                className="md:w-[400px] w-full  form-select outline-none bg-transparent border-b-2 border-gray-300 "
                aria-label="Category"
                name="category"
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                required
              >
                <option
                  className="bg-white text-[#C3C7CE] "
                  value
                  selected
                  disabled
                >
                  Select a Category
                </option>
                {categories &&
                  categories.data.categories.map((category, index) => {
                    return (
                      <option key={index} value={category.name_en}>
                        {category.name_en}
                      </option>
                    );
                  })}
              </select> */}
            </div>

            <div className="px-6 py-4">
            {brands && (
                <AdminSearchDropDown
                  data={brands.data.brands}
                  title={`Select a brand`}
                  selectItem={(item) => {setBrand(item.name);}}
                />
              )}
              {/* <select
                className="md:w-[400px] w-full  form-select outline-none bg-transparent border-b-2 border-gray-300 "
                aria-label="Brand"
                name="Brand"
                onChange={(e) => {
                  setBrand(e.target.value);
                }}
              >
                <option className="bg-white " value selected disabled>
                  Select a Brand
                </option>
                {brands &&
                  brands.data.brands.map((category, index) => {
                    return (
                      <option key={index} value={category.name}>
                        {category.name}
                      </option>
                    );
                  })}
              </select> */}
            </div>

            <div className="px-6 py-4">
              <input
                className="md:w-[400px] w-full border-b-2  outline-none  text-xl focus:border-skin-primary transition-all duration-700"
                name="sku"
                type="number"
                placeholder="sku"
                style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
                ref={skuRef}
              />
            </div>

            <div className="px-6 py-4">
              <input
                className="md:w-[400px] w-full border-b-2  outline-none  text-xl focus:border-skin-primary transition-all duration-700"
                name="ean_code"
                type="number"
                style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
                placeholder="ean_code"
                ref={eanRef}
              />
            </div>

            <div className="px-6 py-4">
              <input
                className="md:w-[400px] w-full h-max border-b-2  outline-none  text-xl focus:border-skin-primary transition-all duration-700"
                name="sort_order"
                type="number"
                style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
                placeholder="sort_order"
                ref={sortRef}
                required
              />
            </div>
            <div className="px-6 py-4">
              <input
                className="md:w-[400px] w-full h-max border-b-2  outline-none  text-xl focus:border-skin-primary transition-all duration-700"
                name="pack"
                type="number"
                style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
                placeholder="Number of Items in a Pack"
                ref={packRef}
              />
            </div>

            <div className="px-6 py-4 ">
              <input
                id="big"
                type="checkbox"
                checked={bigSize}
                onChange={() => {
                  setBigSize(!bigSize);
                }}
                className="cursor-pointer"
              />
              <label htmlFor="big" className="px-2 cursor-pointer ">
                Big Size Product
              </label>
            </div>

            <div className="px-6 pl-3 w-[80%]  h-max  ">
              <div className="h-max">
                <ImageUpload
                  onSelectImage={handleStoreImage}
                  width={150}
                  height={50}
                />
              </div>
            </div>

            <div className="px-6">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasVariations}
                  onChange={() => setHasVariations(!hasVariations)}
                  className="mr-2 cursor-pointer"
                />
                Product has Variations ?
              </label>
            </div>
          </div>
          {variations && options && (
            <div className="w-full px-6 ">
              {hasVariations && (
                <Variations
                  setVariants={(data) => {
                    setVariants(data);
                  }}
                  allVariations={variations.data.data}
                  allOptions={options.data.data}
                />
              )}
            </div>
          )}

          {/* <div className="w-full flex justify-center "> */}
          {saving == true ? (
            <div className="w-full flex justify-center bg-[#ff6600] text-white md:w-[400px] py-2 rounded-lg">
              <Ring size={20} speed={2} lineWeight={5} color="  white" />
            </div>
          ) : (
            <button
              className="bg-[#ff6600] text-white md:w-[400px] py-2 rounded-lg hover:bg-[#ff8800]"
              type="submit"
            >
              Add Product
            </button>
          )}
          {/* </div> */}
          {/* </div> */}
        </form>
      </div>
      <Dialog
        open={openPopUp}
        // onClose={() => {
        //   setOpenPopUp(false);
        // }}
        disableAutoFocus
        disableRestoreFocus
        fullWidth
        maxWidth="lg"
      >
        <DialogHeader>Variation Combinations:</DialogHeader>
        <DialogContent>
          {loadingVariations == true ? (
            <div className="w-full h-full flex justify-center items-center">
              <TawasyLoader width={300} height={300} />
            </div>
          ) : (
            combinations &&
            combinations.map((combination, index) => {
              return (
                <Combination
                  key={index}
                  combination={combination}
                  productId={productId}
                  refetch={() => {}}
                />
              );
            })
          )}
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => {
              setOpenPopUp(false);
              router.push("/admin/Products/AllProducts");
            }}
            className="w-[10%] px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:cursor-pointer"
          >
            Confirm
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default withLayoutAdmin(AddNewProductAdmin);

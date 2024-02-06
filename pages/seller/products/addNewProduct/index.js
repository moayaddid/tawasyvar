import withLayout from "@/components/wrapping components/WrappingSellerLayout";
import React, { useState, useRef, useEffect } from "react";
import ChooseFile from "../../../images/choose_file - Copy.png";
import { Button } from "@mui/material";
import Image from "next/image";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { Ring } from "@uiball/loaders";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export async function getServerSideProps(context) {
  const { locale } = context;
  
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const AddNewProduct = () => {
  // const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [brands, setBrands] = useState();
  const [categories, setCategories] = useState();
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [selectedBrand, setSelectedBrand] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [image, setImage] = useState();
  const ArNameRef = useRef();
  const EnNameRef = useRef();
  const ArDescRef = useRef();
  const EnDescRef = useRef();
  const eanRef = useRef();
  // const {t} = useTranslation("");
  const { t } = useTranslation("");

  useEffect(() => {
    setImage(null);
  }, []);

  useEffect(() => {
    async function fetchBrandsCategories() {
      setIsLoading(true);
      try {
        const response = await Api.get(`api/seller/brands`);
        setBrands(response.data.brands);
      } catch (error) {
        console.log(error);
      }
      try {
        const response2 = await Api.get(`api/seller/categories`);
        // console.log(`store categories`);
        // console.log(response2);
        setCategories(response2.data.categories);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    fetchBrandsCategories();
  }, []);

  if (isLoading == true) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={500} height={500} />
      </div>
    );
  }

  function handleStoreImage(image) {
    setImage(image);
  }

  async function requestProduct(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await Api.post(`api/seller/product`, {
        name_ar: ArNameRef.current.value,
        name_en: EnNameRef.current.value,
        description_ar: ArDescRef.current.value,
        description_en: EnDescRef.current.value,
        image: image,
        category_name: selectedCategory,
        brand_name: selectedBrand,
        ean_code : eanRef.current.value,
      } , {
        headers: { "Content-Type": `multipart/form-data` },
      });
      // console.log(response);
      router.push("/seller/products/addProducts");
    } catch (error) {
      console.log(error);
    }
    setIsSubmitting(false);
  }

  return (
    <div className="form-product">
      <div className="container">
        <div className="flex justify-center">
          <h2 className="items-center text-2xl pt-9 pb-6 text-zinc-700">
            {t("seller.addNewProduct.create")}
          </h2>
        </div>
        <form className="flex justify-center" onSubmit={requestProduct}>
          <div className="items-center">
            <div className="grid md:grid-cols-2 grid-col-1 gap-2">
              <div className="px-6 py-4">
                <input
                  className="md:w-[400px] w-full border-b-2 outline-none  text-xl focus:border-skin-primary transition-all duration-700 "
                  name="nameAr"
                  placeholder={t("seller.addNewProduct.arProductName")}
                  ref={ArNameRef}
                  required={true}
                />
              </div>
              <div className="px-6 py-4">
                <input
                  className="md:w-[400px] w-full border-b-2  outline-none text-xl focus:border-skin-primary transition-all duration-700"
                  name="nameEn"
                  placeholder={t("seller.addNewProduct.engProductName")}
                  ref={EnNameRef}
                />
              </div>
              <div className="px-6 py-4">
                <input
                  className="md:w-[400px] w-full border-b-2 outline-none  text-xl focus:border-skin-primary transition-all duration-700"
                  name="descriptionAr"
                  placeholder={t("seller.addNewProduct.arDesc")}
                  ref={ArDescRef}
                />
              </div>
              <div className="px-6 py-4">
                <input
                  className="md:w-[400px] w-full border-b-2  outline-none  text-xl focus:border-skin-primary transition-all duration-700"
                  name="descriptionEn"
                  placeholder={t("seller.addNewProduct.engDesc")}
                  ref={EnDescRef}
                />
              </div>
              <div className="px-6 py-4">
                <input
                  className="md:w-[400px] w-full border-b-2  outline-none  text-xl focus:border-skin-primary transition-all duration-700"
                  name="EAN code"
                  placeholder={t("seller.addNewProduct.eanCode")}
                  ref={eanRef}
                />
              </div>
              {brands && brands.length > 0 && (
                <div className="px-6 py-4">
                  <select
                    className="md:w-[400px] w-full border-b-2  text-lg p-1 bg-transparent border-skin-primary "
                    aria-label="Category"
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                    }}
                  >
                    <option disabled selected value>
                      -- {t("seller.addNewProduct.brandSelection")} --
                    </option>
                    {brands.map((brand) => {
                      return (
                        <option key={brand.id} value={brand.name}>
                          {brand.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
              {categories && categories.length > 0 && (
                <div className="px-6 py-4">
                  <select
                    className="form-select md:w-[400px] w-full border-b-2  text-lg p-1 bg-transparent border-skin-primary"
                    aria-label="Category"
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                    }}
                    required={true}
                  >
                    <option disabled selected value="">
                      -- {t("seller.addNewProduct.categorySelection")} --
                    </option>
                    {categories.map((category) => {
                      return (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
              <div className="flex flex-col justify-start items-start box-border pl-3 w-[80%] mx-auto ">
                <label className=" border-b-2 border-skin-primary my-2  ">
                  {t("seller.addNewProduct.productImage")}
                </label>
                <div className="w-[200px] h-max">
                  <ImageUpload
                    onSelectImage={handleStoreImage}
                    width={150}
                    height={50}
                  />
                </div>
              </div>

              <div className="px-6 py-4">
                <button
                  className="bg-[#ff6600] text-white md:w-[400px] py-2 px-2 rounded-lg hover:bg-[#ff8800] "
                  type="submit"
                >
                  {isSubmitting == true ? (
                    <div className="flex justify-center items-center">
                      <Ring size={25} lineWeight={5} speed={2} color="white" />
                    </div>
                  ) : (
                    t("seller.addNewProduct.addProduct")
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withLayout(AddNewProduct);

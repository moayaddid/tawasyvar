import withVendorLayout from "@/components/wrapping components/WrappingVendorLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import logo from "@/public/images/tawasylogo.png";
import Image from "next/image";
import createAxiosInstance from "@/API";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { Ring } from "@uiball/loaders";
import { toast } from "react-toastify";
import { MdArrowDropDown, MdClose } from "react-icons/md";

export async function getServerSideProps(context) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const tableheading = [
  {
    heading: `id`,
  },
  {
    heading: `product name`,
  },
  {
    heading: `variations`,
  },
  {
    heading: `part Number`,
  },
  {
    heading: `category`,
  },
  {
    heading: `brand`,
  },
  {
    heading: `image`,
  },
  {
    heading: `Price`,
  },
];

function ProductsPricingPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toggleFilters, settoggleFilters] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [brandFilters, setBrandFilters] = useState([]);
  const [categories, setCategories] = useState();
  const [brands, setBrands] = useState();
  const [isLoadingCatBrand, setIsLoadingCatBrand] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const {
    data: products,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    [`pricingProducts`, brandFilters, categoryFilters],
    () => fetchPricingProducts(categoryFilters, brandFilters),
    {
      staleTime: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  async function fetchCategoriesBrands() {
    setIsLoadingCatBrand(true);
    try {
      const allCategories = await Api.get(
        `/api/vendor/categories-products-selected`
      );
      setCategories(allCategories?.data?.data);
      const allBrands = await Api.get(`/api/vendor/brands-products-selected`);
      setBrands(allBrands?.data?.data);
      setIsLoadingCatBrand(false);
    } catch (error) {
      setIsLoadingCatBrand(false);
    }
    setIsLoadingCatBrand(false);
  }

  useEffect(() => {
    if (toggleFilters == true) {
      try {
        fetchCategoriesBrands();
      } catch (error) {}
    }
  }, [toggleFilters]);

  function addCategoryFilter(id) {
    try {
      setCategoryFilters((prev) => {
        if (prev && !prev.includes(id)) {
          return [...prev, id];
        } else {
          return [...prev];
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  function addBrandFilter(id) {
    try {
      setBrandFilters((prev) => {
        if (prev && !prev.includes(id)) {
          return [...prev, id];
        } else {
          return [...prev];
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  function removeBrandfilter(id) {
    try {
      setBrandFilters((prev) => {
        const old = [...prev];
        const newone = old.filter((filterId) => filterId !== id);
        return newone;
      });
    } catch (error) {
      console.log(error);
    }
  }

  function removeCategoryFilter(id) {
    try {
      setCategoryFilters((prev) => {
        const old = [...prev];
        const newone = old.filter((filterId) => filterId !== id);
        return newone;
      });
    } catch (error) {
      console.log(error);
    }
  }

  function getName(array, id) {
    try {
      let name;
      array.forEach((itm) => {
        if (itm.id == id) {
          name = itm.name;
        }
      });
      return name;
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchPricingProducts(categoriesF , brandsF) {
    try {
      let newC = [];
      let newB = [];
      categoriesF.map((category) => {
        newC.push({ category_id: category });
      });
      brandsF.map((brand) => {
        newB.push({ brand_id: brand });
      });
      return await Api.get(`/api/vendor/selected-products` , {
        params : {
          brands: newB,
          categories: newC,
        }
      });
    } catch (error) {}
  }

  async function setProducts() {
    let pros = [];
    products?.data?.selected_products?.map((product) =>
      pros.push({ ...product, price: null })
    );
    setAllProducts(pros);
  }

  useEffect(() => {
    if (products && products.data.selected_products) {
      setProducts();
    }
  }, [products]);

  function changePrice(productId, lineId, price) {
    const products = allProducts;
    const product = allProducts.findIndex((product) => {
      if (lineId && product.line_id) {
        return product.line_id === lineId;
      } else {
        return product.product_id === productId;
      }
    });
    if (product != -1 || product) {
      products[product].price = price;
    }
    // console.log(products);
    setAllProducts(products);
  }

  async function saveProducts() {
    setIsSaving(true);
    let data = [];
    allProducts.map((product) => {
      if (product.price != null) {
        data.push({
          id: product.product_id,
          variation: product.line_id || null,
          price: product.price,
        });
      }
    });
    if (data?.length < 1) {
      toast.error(`You did not add a price to any product`, {
        theme: "colored",
      });
    } else {
      try {
        const response = await Api.post(`/api/vendor/price-products`, {
          products: data,
        });
        setIsSaving(false);
        refetch();
        setProducts();
      } catch (error) {
        setIsSaving(false);
      }
    }
    setIsSaving(false);
  }

  return (
    <div className="w-full h-screen flex flex-col justify-start items-start space-y-2">
      <div className="px-5 py-10 text-3xl h-[10%] ">
        Requested Products Pricing :
      </div>
      { (allProducts && allProducts.length > 0) && <div className="px-5 py-5 flex flex-col justify-start items-start space-y-5">
        <button
          onClick={() => {
            settoggleFilters((prev) => !prev);
          }}
          className="flex justify-around items-center"
        >
          <p className="px-1">Filters</p>
          <MdArrowDropDown
            className={` transition-all duration-300 text-[22px] ${
              toggleFilters == true && `rotate-90`
            }`}
          />
        </button>
        <div
          className={`flex justify-start items-start space-x-4 ${
            toggleFilters == true ? `block` : `hidden`
          } transition-all overflow-clip duration-300 `}
        >
          {isLoadingCatBrand == true ? (
            <div className="w-full flex justify-start items-start">
              <Ring speed={3} size={25} lineWeight={5} color="#ff6600" />
            </div>
          ) : (
            <div className="flex flex-wrap justify-start items-center space-x-4">
              {toggleFilters == true && <p>Filter by :</p>}
              {toggleFilters == true && categories && (
                <label
                  htmlFor="categories px-1 "
                  className="border border-skin-primary px-2 py-1 select-none rounded-lg "
                >
                  Filter by Categories :
                  <select
                    id="categories"
                    className="bg-transparent box-content px-2 w-min hover:bg-gray-100 cursor-pointer "
                    onChange={(e) => {
                      addCategoryFilter(e.target.value);
                    }}
                    value={1}
                  >
                    <option disabled selected className="box-content" value={1}>
                      Select a category
                    </option>
                    {categories &&
                      categories
                        .filter((obj) => !categoryFilters?.includes(obj.id))
                        .map((category) => {
                          return (
                            <option
                              key={category.id}
                              value={category.id}
                              className="cursor-pointer"
                            >
                              {category.name}
                            </option>
                          );
                        })}
                  </select>
                </label>
              )}
              {toggleFilters == true && brands && (
                <label
                  htmlFor="brands "
                  className="border border-skin-primary px-2 py-1 select-none rounded-lg "
                >
                  Filter by Brands :
                  <select
                    id="brands"
                    className="bg-transparent px-2 hover:bg-gray-100 cursor-pointer py-1 "
                    onChange={(e) => {
                      addBrandFilter(e.target.value);
                    }}
                    value={1}
                  >
                    <option disabled selected value={1}>
                      Select a Brand
                    </option>
                    {brands &&
                      brands.map((brand) => {
                        return (
                          <option
                            key={brand.id}
                            value={brand.id}
                            className="cursor-pointer"
                          >
                            {brand.name}
                          </option>
                        );
                      })}
                  </select>
                </label>
              )}
            </div>
          )}
        </div>
        <hr />
        <div className="flex flex-wrap gap-2 items-center">
          <p>Applied Filters :</p>
          {categoryFilters?.length < 1 && brandFilters?.length < 1 ? (
            <p>( None )</p>
          ) : (
            <div className="flex flex-wrap gap-2 items-center">
              {categoryFilters?.length > 0 &&
                categoryFilters?.map((filterId, i) => {
                  return (
                    <div
                      key={i}
                      className="px-2 py-1 flex justify-between items-center space-x-2 rounded-2xl border border-skin-primary select-none "
                    >
                      <p>{getName(categories, filterId)}</p>
                      <MdClose
                        onClick={() => {
                          removeCategoryFilter(filterId);
                        }}
                        className="w-[20px] h-auto text-red-400 cursor-pointer hover:text-red-500"
                      />
                    </div>
                  );
                })}
              {brandFilters?.length > 0 &&
                brandFilters?.map((filterId, i) => {
                  return (
                    <div
                      key={i}
                      className="px-2 py-1 flex justify-between items-center space-x-2 rounded-2xl border border-skin-primary select-none "
                    >
                      <p>{getName(brands, filterId)}</p>
                      <MdClose
                        onClick={() => {
                          removeBrandfilter(filterId);
                        }}
                        className="w-[20px] h-auto text-red-400 cursor-pointer hover:text-red-500"
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>}
      <hr />
      {isLoading == true || isFetching == true ? (
        <div className="py-5 px-5 w-full h-full">
          <TawasyLoader width={300} height={300} />
        </div>
      ) : (
        <div className="px-5 w-full h-[80%]  ">
          {allProducts && allProducts.length > 0 ? (
            <div className=" flex flex-col justify-between w-full h-full space-y-4 overflow-scroll">
              <table className="w-full overflow-x-auto table relative">
                <thead className="sticky top-0 bg-white">
                  <tr className="text-lg font-semibold text-center border-b-2 border-blue-500 capitalize">
                    {tableheading.map((index) => (
                      <th key={index.heading}>{index.heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-lg font-normal text-gray-700 text-center divide-y-2">
                  {allProducts &&
                    allProducts.map((product, i) => {
                      return (
                        <tr
                          className=""
                          key={`${i} - ${product.product_id} - ${
                            product.line_id || "null"
                          }`}
                        >
                          <td className="py-6">{product.product_id}</td>
                          <td>{product.name}</td>
                          <td>
                            {product.combiantion
                              ? product.combiantion?.variations
                                  ?.map((combo) => combo.option)
                                  .join(" - ")
                              : `-`}
                          </td>
                          <td>
                            {product.combiantion
                              ? product.combiantion.part_number
                              : `-`}
                          </td>
                          <td>{product.category ? product.category : `-`}</td>
                          <td>{product.brand ? product.brand : `-`}</td>
                          <td className="flex justify-center items-center my-auto h-full">
                            <Image
                              src={
                                product.combiantion
                                  ? product?.combiantion?.variations[0]?.image
                                  : product.image
                                  ? product.image
                                  : logo
                              }
                              width={75}
                              alt={product.name}
                              height={75}
                              className="object-contain object-center my-auto max-h-[75px] max-w-[75px] "
                            />
                          </td>
                          <td>
                            <input
                              placeholder="Price"
                              type="number"
                              className="outline-none border-b border-transparent focus:border-skin-primary transition-all duration-500"
                              onChange={(e) => {
                                changePrice(
                                  product.product_id,
                                  product.line_id || null,
                                  e.target.value
                                );
                              }}
                              min={0}
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-xl">
              You have no Products that needs pricing.
            </p>
          )}
        </div>
      )}
      {allProducts && allProducts.length > 0 && (
        <div className="w-full flex justify-center items-center h-[10%]">
          {isSaving == true ? (
            <div className="w-[10%] flex justify-center items-center bg-green-500 rounded-lg px-2 py-1 text-center text-white hover:opacity-80 transition-all duration-500 ">
              <Ring size={25} speed={3} lineWeight={5} color="white" />
            </div>
          ) : (
            <button
              // disabled={allProducts.some(
              //   (product) => product.price != null
              // )}
              onClick={saveProducts}
              className="w-[10%] my-2 disabled:bg-gray-400 disabled:opacity-80 disabled:cursor-not-allowed bg-green-500 rounded-lg px-2 py-1 text-center text-white hover:opacity-80 transition-all duration-500 "
            >
              Save Prodcuts
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default withVendorLayout(ProductsPricingPage);

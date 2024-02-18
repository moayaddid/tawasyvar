import withVendorLayout from "@/components/wrapping components/WrappingVendorLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import lego from "@/public/images/lego.png";
import logo from "@/public/images/tawasylogo.png";
import Image from "next/image";
import createAxiosInstance from "@/API";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { Ring } from "@uiball/loaders";
import { toast } from "react-toastify";

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

const dummyData = [
  {
    id: 1,
    name: `product 1`,
    variation: `Red / big`,
    partNumber: `HFDY544`,
    category: `automotives`,
    brand: `Cars Brand`,
    image: lego,
    price: null,
  },
  {
    id: 2,
    name: `product 2`,
    category: `automotives`,
    brand: `Cars Brand`,
    image: lego,
    price: null,
  },
  {
    id: 3,
    name: `product 3`,
    variation: `Red / big`,
    category: `automotives`,
    brand: `Cars Brand`,
    image: lego,
    price: null,
  },
  {
    id: 4,
    name: `product 1`,
    variation: `Red / big`,
    partNumber: `HFDY544`,
    category: `automotives`,
    brand: `Cars Brand`,
    image: lego,
    price: null,
  },
  {
    id: 5,
    name: `product 2`,
    category: `automotives`,
    brand: `Cars Brand`,
    image: lego,
    price: null,
  },
  {
    id: 6,
    name: `product 3`,
    variation: `Red / big`,
    category: `automotives`,
    brand: `Cars Brand`,
    image: lego,
    price: null,
  },
  {
    id: 7,
    name: `product 1`,
    variation: `Red / big`,
    partNumber: `HFDY544`,
    category: `automotives`,
    brand: `Cars Brand`,
    image: lego,
    price: null,
  },
  {
    id: 8,
    name: `product 2`,
    category: `automotives`,
    brand: `Cars Brand`,
    image: lego,
    price: null,
  },
  {
    id: 9,
    name: `product 3`,
    variation: `Red / big`,
    category: `automotives`,
    brand: `Cars Brand`,
    image: lego,
    price: null,
  },
  {
    id: 11,
    name: `product 1`,
    variation: `Red / big`,
    partNumber: `HFDY544`,
    category: `automotives`,
    brand: `Cars Brand`,
    image: lego,
    price: null,
  },
  {
    id: 12,
    name: `product 2`,
    category: `automotives`,
    brand: `Cars Brand`,
    image: lego,
    price: null,
  },
  {
    id: 13,
    name: `product 3`,
    variation: `Red / big`,
    category: `automotives`,
    brand: `Cars Brand`,
    image: lego,
    price: null,
  },
];

function ProductsPricingPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const {
    data: products,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(`pricingProducts`, fetchPricingProducts, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchPricingProducts() {
    try {
      return await Api.get(`/api/vendor/selected-products`);
    } catch (error) {}
  }

  async function setProducts() {
    // if (products && products.data.selected_products) {
    let pros = [];
    products?.data?.selected_products?.map((product) =>
      pros.push({ ...product, price: null })
    );
    // console.log(pros);
    setAllProducts(pros);
    // }
  }

  useEffect(() => {
    if (products && products.data.selected_products) {
      // let pros = [];
      // products?.data?.selected_products?.map((product) =>
      //   pros.push({ ...product, price: null })
      // );
      // setAllProducts(pros);
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
    // console.log(data);
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
      { (allProducts && allProducts.length > 0) && <div className="w-full flex justify-center items-center h-[10%]">
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
            className="w-[10%] disabled:bg-gray-400 disabled:opacity-80 disabled:cursor-not-allowed bg-green-500 rounded-lg px-2 py-1 text-center text-white hover:opacity-80 transition-all duration-500 "
          >
            Save Prodcuts
          </button>
        )}
      </div>}
    </div>
  );
}

export default withVendorLayout(ProductsPricingPage);

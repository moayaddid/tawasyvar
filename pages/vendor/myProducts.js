import createAxiosInstance from "@/API";
import { getCookiesProducts } from "@/Store/VendorSlice";
import TawasyLoader from "@/components/UI/tawasyLoader";
import VendorProduct from "@/components/VendorComponents/vendorProduct";
import withVendorLayout from "@/components/wrapping components/WrappingVendorLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";

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
    heading: `action`,
  },
  {
    heading: `price`,
  },
  {
    heading: `name`,
  },
  {
    heading : `items per pack`
  },
  {
    heading: `variations`,
  },
  {
    heading: `part Number`,
  },
  {
    heading: `brand`,
  },
  {
    heading: `image`,
  },
];

function MyProducts() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const dispatch = useDispatch();
  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery(`vendorProducts`, fetchVendorProducts, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchVendorProducts () {
    try{
      return await Api.get(`/api/vendor/products`);
    }catch(error){}
  }

  // if(products){
  //   console.log(products.data);
  // }

  useEffect(() => {
    dispatch(getCookiesProducts());
  }, []);

  return (
    <div className="w-full h-full">
      <div className="w-[95%] mx-auto py-10 flex flex-col justify-start items-start">
        <p className="text-3xl">My Products</p>
        <hr className="pb-5" />
        { isLoading == true ? <div className="flex justify-center items-center w-full h-full " ><TawasyLoader width = {300} height = {300} /></div> : <div className="mt-6 overflow-x-auto w-full  ">
          { products && products.data.products && products.data.products.length > 0 ? <table className="w-full overflow-x-auto table-auto">
            <thead className="">
              <tr className="text-sm font-semibold text-center border-b-2 border-blue-500 capitalize">
                <th>{`id`}</th>
                {tableheading.map((index) => (
                  <th key={index.heading}>{index.heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-lg font-normal text-gray-700 text-center">
              { products &&  products.data.products.map((names, index) => {
                return (
                  <VendorProduct
                    product={names}
                    key={`${index} - ${names.id} - ${names.name}`}
                    refetch={() => {
                      refetch();
                    }}
                  />
                );
              })}
            </tbody>
          </table> : <div className="text-lg text-center" > You have No Products yet. </div>}
        </div>}
      </div>
    </div>
  );
}

export default withVendorLayout(MyProducts);

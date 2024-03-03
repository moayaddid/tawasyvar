import createAxiosInstance from "@/API";
import TawasyLoader from "@/components/UI/tawasyLoader";
import withLayout from "@/components/wrapping components/WrappingSellerLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { useTranslation } from "next-i18next";

export async function getServerSideProps(context) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

function SellerVendors() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const { t } = useTranslation("");

  const { data: vendors, isLoading } = useQuery(`sellerVendors`, fetchSellerVendors , {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchSellerVendors () {
    try{    
        return await Api.get(`/api/seller/get-vendors`);
    }catch(error){} 
  }

  return (
    <div className=" w-[90%] mx-auto py-10 flex flex-col space-y-5">
      <p className="text-start text-3xl">{t("allVendors")}</p>
      <hr />
      {isLoading == true ? (
        <div className="w-full flex justify-center items-center">
          <TawasyLoader width={300} height={300} />
        </div>
      ) : (
        vendors && vendors.data && vendors.data.vendors && vendors.data.vendors.length > 0 ?
        <div className="flex flex-wrap w-full ">
          {vendors.data.vendors.map((vendor) => {
            return (
              <div
                key={vendor.id}
                onClick={() => {
                  router.push(`/seller/Vendors/${vendor.id}`);
                }}
                className="w-[20%] px-2 py-1 mx-2 my-2 group border-2 rounded-md cursor-pointer select-none border-skin-primary  hover:bg-skin-primary transition-all duration-[850ms]"
              >
                <p className="text-skin-primary text-lg group-hover:text-white">
                  {vendor.name}
                </p>
                <p className="text-skin-primary text-lg group-hover:text-white opacity-100 ">
                  {t("viewVendor")}
                </p>
              </div>
            );
          })}
        </div> : <p className="w-full text-center" >{t("noVendorsFound")} </p>
      )}
    </div>
  );
}

export default withLayout(SellerVendors);

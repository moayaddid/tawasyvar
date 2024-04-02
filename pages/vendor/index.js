import createAxiosInstance from "@/API";
import TawasyLoader from "@/components/UI/tawasyLoader";
import withVendorLayout from "@/components/wrapping components/WrappingVendorLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link  from "next/link";
import { useRouter } from "next/router";
import { BiSolidUserDetail } from "react-icons/bi";
import { BsBox } from "react-icons/bs";
import { FaUsersBetweenLines } from "react-icons/fa6";
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

function VendorHome() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const { t } = useTranslation("");
  const { data, isLoading } = useQuery(
    "vendordahsboard",
    fetchVendorDashboard,
    {
      staleTime: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  async function fetchVendorDashboard() {
    try {
      return await Api.get(`/api/vendor/dashboard`);
    } catch (error) {}
  }

  return (
    <div className="w-[90%] h-full mx-auto">
      <p className="text-3xl py-10 px-7 ">{t("v.mainDashboard")} :</p>
      <hr className="h-px bg-gray-700 mb-10" />
      {isLoading == true ? (
        <div className="w-full h-full flex justify-center items-center">
          <TawasyLoader width={300} height={300} />
        </div>
      ) : (
        data && data.data &&
        <div className="grid md:grid-cols-3 sm:grid-cols-1 grid-col-1 gap-4" dir={router.locale === "ar" ? "rtl" : "ltr" } >
          <Link
            href="/vendor/followers"
            className="border-2 border-gray-400 py-4 px-5 rounded-md hover:border-skin-primary"
          >
            <div className="flex justify-between pb-4">
              <div>
                <h2 className="text-xl">{t("v.myFollowers")} : </h2>
              </div>
              <div className="text-skin-primary w-[25px] h-[25px]">
                <BiSolidUserDetail
                  style={{ width: "25px", height: "25px", color: "#ff6600" }}
                />
              </div>
            </div>
            <div>
              <p>{data.data.followers}</p>
            </div>
          </Link>

          <Link
            href="/vendor/myProducts"
            className="border-2 border-gray-400 py-4 px-5 rounded-md hover:border-skin-primary"
          >
            <div className="flex justify-between pb-4">
              <div>
                <h2 className="text-xl">{t("v.myProducts")} : </h2>
              </div>
              <div className="text-skin-primary w-[25px] h-[25px]">
                <FaUsersBetweenLines
                  style={{ width: "25px", height: "25px", color: "#ff6600" }}
                />
              </div>
            </div>
            <div>
              <p>{data.data.totalProducts}</p>
            </div>
          </Link>

          <Link
            href="/vendor/productsPricing"
            className="border-2 border-gray-400 py-4 px-5 rounded-md hover:border-skin-primary"
          >
            <div className="flex justify-between pb-4">
              <div>
                <h2 className="text-xl">{t("v.pricingProducts")} :</h2>
              </div>
              <div className="text-skin-primary w-[25px] h-[25px]">
                <BsBox
                  style={{ width: "25px", height: "25px", color: "#ff6600" }}
                />
              </div>
            </div>
            <div>
              <p>{data.data.selectedProdcuts}</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default withVendorLayout(VendorHome);

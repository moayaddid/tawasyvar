import withLayoutCustomer from "@/components/wrapping components/WrappingCustomerLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import image404 from "@/public/images/404.jpg";
import Link from "next/link";

function Error() {
  const { t } = useTranslation("");

  return (
    <>
      <NextSeo title={`Not Found | ${t("titles.home")}`} />
      <div className="xl:w-[60%] lg:w-[70%] md:-[70%] sm:w-[90%] w-[90%] mx-auto h-min py-10 flex md:flex-row flex-col md:space-x-5 space-y-4 justify-between items-center" >
        <Image
            src={image404}
            unoptimized
            width={0}   
            height={0}
            className="lg:w-[42%] md:w-[50%] sm:w-[60%] h-auto  object-contain"
        />
        {/* <p className="text-xl text-center " >Sadly .. we could no find what you're looking for</p> */}
        <div className="md:w-[60%] w-full m-0 mx-auto text-center md:space-y-4 space-y-2 py-3 flex flex-col justify-around items-center" >
            <p className="uppercase md:text-6xl text-4xl font-bold" >Oops! .. Page Not Found</p>
            <p className="text-center text-2xl w-[80%] " >This page is currently not available, Please browse our website for more information. </p>
            <Link href={'/'} className="px-2 py-1 bg-skin-primary rounded-lg text-white hover:opacity-80 text-xl md:w-[40%] w-[70%] " >Back To Home</Link>
        </div>
      </div>
    </>
  );
}
export default withLayoutCustomer(Error);

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

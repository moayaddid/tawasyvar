import withVendorLayout from "@/components/wrapping components/WrappingVendorLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps(context) {
    const { locale } = context;
    
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  }

function MyProducts () {

    return <div>Vendor my products page</div>

}

export default withVendorLayout(MyProducts);
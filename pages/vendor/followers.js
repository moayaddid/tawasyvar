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

function MyFollowers () {

    return <div>Vendor Followers page</div>

}

export default withVendorLayout(MyFollowers);
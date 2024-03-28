import createAxiosInstance from "@/API";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TawasyLoader from "../UI/tawasyLoader";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { getCookiesSeller } from "@/Store/sellerAuthSlice";

const isFirstTime = true;

function SellerGuard({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(isFirstTime);
  const router = useRouter();
  const Api = createAxiosInstance(router);

  useEffect(() => {
    async function initialStoreStatus() {
      try {
        const response2 = await Api.get(`/api/seller/store/status`);
        dispatch(getCookiesSeller());
        // console.log(response2);
        switch (response2.data.status) {
          case "Store not found":
            router.replace("/seller/requestStore");
            break;

          case "approved":
            // console.log(`approved store`);
            Cookies.set("Sid", response2.data.store_id, { expires: 365 * 10 });
            Cookies.set("SName", response2.data.name, { expires: 365 * 10 });
            Cookies.set("STName", response2.data.store_name, {
              expires: 365 * 10,
            });
            setIsLoading(false);
            break;

          case "pending":
            Cookies.set("Sid", response2.data.store_id, { expires: 365 * 10 });
            router.replace(`/seller/pendingStore`);
            break;
        }
      } catch (error) {
        // console.log(error);
        setIsLoading(false);
      }
      setIsLoading(false);
    }
    if (isLoading == true) {
      initialStoreStatus();
    } else {
      return;
    }
  }, [isFirstTime]);

  //   if (isLoading == true) {
  //     return (
  //       <div className="w-full h-full flex justify-center items-center">
  //         <TawasyLoader width={300} height={300} />
  //       </div>
  //     );
  //   }

//   if (isLoading == false) {
    return <div className="flex" dir="ltr" >{children}</div>;
//   }
}

export default SellerGuard;

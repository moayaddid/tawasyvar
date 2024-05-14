import createAxiosInstance from "@/API";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TawasyLoader from "../UI/tawasyLoader";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { getCookiesSeller } from "@/Store/sellerAuthSlice";

let isFirstTime = true;

function SellerGuard({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(isFirstTime);
  const router = useRouter();
  const Api = createAxiosInstance(router);

  useEffect(() => {
    const sid = Cookies.get("Sid");
    async function initialStoreStatus() {
      try {
        const response2 = await Api.get(`/api/seller/store/status`);
        // dispatch(getCookiesSeller());
        // console.log(response2);
        switch (response2.data.status) {
          case "Store not found":
            Cookies.remove("Sid");
            Cookies.remove("role");
            Cookies.remove("SName");
            Cookies.remove("STName");
            Cookies.remove("slug");
            router.replace("/seller/requestStore");
            // isFirstTime = false ;
            setIsLoading(false);
            break;

          case "approved":
            // console.log(`approved store`);
            Cookies.remove("Sid");
            Cookies.remove("role");
            Cookies.remove("SName");
            Cookies.remove("STName");
            Cookies.remove("slug");
            Cookies.set("Sid", response2.data.store_id, { expires: 365 * 10 });
            Cookies.set("role", response2.data.role, { expires: 365 * 10 });
            Cookies.set("SName", response2.data.name, { expires: 365 * 10 });
            Cookies.set("STName", response2.data.store_name, {
              expires: 365 * 10,
            });
            Cookies.set("slug", response2.data.slug, { expires: 365 * 10 });
            // isFirstTime = false ;
            setIsLoading(false);
            break;

          case "pending":
            Cookies.remove("Sid");
            Cookies.remove("role");
            Cookies.set("Sid", response2.data.store_id, { expires: 365 * 10 });
            Cookies.set("role", response2.data.role, { expires: 365 * 10 });
            router.replace(`/seller/pendingStore`);
            // isFirstTime = false ;
            setIsLoading(false);
            break;
        }
      } catch (error) {
        // console.log(error);
        setIsLoading(false);
      }
      setIsLoading(false);
      dispatch(getCookiesSeller());
    }
    dispatch(getCookiesSeller());
    if (isLoading == true) {
      dispatch(getCookiesSeller());
      if (sid) {
        initialStoreStatus();
      }
    }
  }, [isFirstTime, isLoading, Cookies]);

  // if (isLoading == true) {
  //   return (
  //     // <div className="w-full h-screen flex justify-center items-center">
  //     //   <TawasyLoader width={400} height={400}  />
  //     // </div>
  //     <></>
  //   );
  // }

  return (
    <div className="flex" dir="ltr">
      {children}
    </div>
  );
  //   }
}

export default SellerGuard;

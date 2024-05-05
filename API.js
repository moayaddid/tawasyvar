import axios from "axios";
import { toast } from "react-toastify";
import url from "./URL";
import Cookies from "js-cookie";

const createAxiosInstance = (router) => {
  const axiosInstance = axios.create({
    baseURL: url,
    options: false,
  });

  const updateAuthorizationHeader = () => {
    const token = Cookies.get("AT");
    return token ? `Bearer ${token}` : "";
  };

  const updateStoreId = () => {
    const storeID = Cookies.get("Sid");
    return storeID ?? "";
  };

  updateAuthorizationHeader();
  axiosInstance.interceptors.request.use(
    (config) => {
      if (router) {
        const locale = router.locale || "en";

        config.headers["Accept-Language"] = `${locale}`;
      }
      config.headers.Authorization = updateAuthorizationHeader();
      if (config.url && config.url.includes("/seller/")) {
        config.headers["storeId"] = updateStoreId();
      }

      config.headers["Accept"] = "application/json";
      // config.headers["Content-Type"] = "application/json";

      if (config.method === "options") {
        config.headers["Access-Control-Max-Age"] = "3600";
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      if (
        (response.config.method === "post" ||
          response.config.method === "put" ||
          response.config.method === "delete") &&
        !response.config.noSuccessToast
      ) {
        toast.success(
          response.data.message || "Request successful \b نفّذ الطلب بنجاح ",
          {
            toastId: response.data.message,
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      }
      return response;
    },
    (error) => {
      if (error.response) {
        const { status } = error.response;

        if (status === 401 || status === 402) {
          toast.error(error.response.data.message, {
            toastId: error.response.data.message,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          const isAdmin =
            error.config.url && error.config.url.includes("/admin/");

          const isVendor =
            error.config.url && error.config.url.includes("/vendor");

          if (isAdmin == true) {
            router.push(`/admin/securelogin`);
          } else if (isVendor == true) {
            router.push(`/vendor/login`);
          } else {
            if (error.config.url && !error.config.url.includes("/seller")) {
              Cookies.set("url", router.asPath, { expires: 365 * 10 });
            }
            router.push(`/login`);
          }
        } else {
          toast.error(
            error.response.data.message ||
              error.response.data.error ||
              "Request failed \b فشل في طلب قاعدة البيانات",
            {
              toastId: error.response.data.message || error.response.data.error,
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
        }
      } else {
        toast.error(`Please check your connection \bالرجاء التأكد من الاتصال`, {
          toastId: "Request failed",
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }

      return Promise.reject(error);
    }
  );
  return axiosInstance;
};

export default createAxiosInstance;

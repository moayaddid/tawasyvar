// axiosInstance.js
import axios from "axios";
import { toast } from "react-toastify";
import url from "./URL";
import Cookies from "js-cookie";

// Set your API base URL here
// const baseURL = 'https://your-api-base-url.com';

const createAxiosInstance = (router) => {
  const axiosInstance = axios.create({
    // url is the base URL that we provided for use in the URL.js file
    baseURL: url,
    options: false,
  });

  const updateAuthorizationHeader = () => {
    const token = Cookies.get("AT");
    return token ? `Bearer ${token}` : "";
  };

  // Initial setup
  updateAuthorizationHeader();

  // console.log(`token in interceptor`) ;
  // console.log(token);

  // Add a request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      // Set the Authorization header here (if you have a token, for example)
      //   config.headers.Authorization = token ? `Bearer ${token}` : ``;
      if (router) {
        const locale = router.locale || "en"; // Adjust as needed

        // // Add the Accept-Language header
        config.headers["Accept-Language"] = `${locale}`;
      }
      config.headers.Authorization = updateAuthorizationHeader();

      if (config.method === "options") {
        config.headers["Access-Control-Max-Age"] = "3600"; // Set the desired max age in seconds
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      // Show success notification
      if (
        (response.config.method === "post" ||
          response.config.method === "put" ||
          response.config.method === "delete") &&
        !response.config.noSuccessToast
      ) {
        toast.success(response.data.message || "Request successful \b نفّذ الطلب بنجاح ", {
          toastId: response.data.message,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
      return response;
    },
    (error) => {
      // Handle specific error codes
      if (error.response) {
        const { status } = error.response;

        // Redirect to login on 401 or 402
        if (status === 401 || status === 402) {
          // You might want to use Next.js router for redirection
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

          if (isAdmin == true) {
            router.push(`/admin/securelogin`);
          } else {
            // console.log(router);
            Cookies.set("url" , router.asPath , { expires: 365 * 10 });
            router.push(`/login`);
          }

          // router.push(`/login`) ;
          // Example: router.push('/login');
        } else {
          // Show error notification for other status codes
          toast.error(
            error.response.data.message ||
              error.response.data.error ||
              "Request failed \b فشل في طلب قاعدة البيانات",
            {
              toastId: error.response.data.message || error.response.data.error,
              position: "top-right",
              autoClose: 5000,
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
        // Show error notification for other types of errors
        toast.error(`Please check your connection \bالرجاء التأكد من الاتصال`, {
          toastId: "Request failed",
          position: "top-right",
          autoClose: 5000,
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

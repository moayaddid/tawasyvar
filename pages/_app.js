import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider, QueryClient } from "react-query";
import { ThemeProvider } from "@material-tailwind/react";
import localfont from "next/font/local";
import { appWithTranslation } from "next-i18next";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import nProgress, { NProgress } from "nprogress";
import { Provider } from "react-redux";
import { Analytics } from '@vercel/analytics/react';
// import { store } from "@/Store";
// import {store} from "../Store/index";
import { GoogleTagManager , GoogleAnalytics } from '@next/third-parties/google' ; 
import cartSlice from "@/Store/CartSlice";
import selectedSlice from "@/Store/SelectedSlice";
import vendorSlice from "@/Store/VendorSlice";
import sellerAuthSlice from "@/Store/sellerAuthSlice";
// import { GoogleAnalytics } from '@next/third-parties/google';

const tawasyFont = localfont({
  src: "../public/fonts/local/MYRIADAM.ttf",
});

const queryClient = new QueryClient();

function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", () => nProgress.start());

    router.events.on("routeChangeComplete", () => nProgress.done());
    router.events.on("routeChangeError", () => nProgress.done());
  }, []);

  const { configureStore } = require("@reduxjs/toolkit");

const store = configureStore({
    reducer : {
        SAS : sellerAuthSlice.reducer,
        cart : cartSlice.reducer,
        selected : selectedSlice.reducer,
        vendor : vendorSlice.reducer,
    }
}) ; 

  return (
    <>
      <main className={tawasyFont.className}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <DefaultSeo
            title={'Tawasy Shopping | تواصي شوبينغ'}
            description={`Elsouq Bebitak | السوق ببيتك`}
          />
          <Provider store={store} >
            <Component {...pageProps} />
            <Analytics/>
            <GoogleTagManager gtmId="GTM-WJTGWG84" />
            {/* <GoogleAnalytics gaId="G-4C6MQ427TW" />  */}
          </Provider>
          <ToastContainer />
        </ThemeProvider>
      </QueryClientProvider>
      </main>
    </>
  );
}

export default appWithTranslation(App);

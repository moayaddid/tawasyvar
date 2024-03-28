import withLayout from "@/components/wrapping components/WrappingSellerLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import lego from "@/public/images/lego.png";
import Image from "next/image";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import SellerVendorProduct from "@/components/SellerComponents/sellerVendorProduct";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { MdClose } from "react-icons/md";
import { useTranslation } from "next-i18next";
import TawasyLoader from "@/components/UI/tawasyLoader";
import logo from "@/public/images/tawasylogo.png";
import { Ring } from "@uiball/loaders";

export async function getServerSideProps(context) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

function SellerVendorPage() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showSelected, setShowSelected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { t } = useTranslation("");
  const noteRef = useRef();
  const {
    data: vendorDetails,
    isLoading,
    refetch,
  } = useQuery([`VendorDetails`, router.query.vendorId], fetchVendorDetails, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: Boolean(router.query.vendorId),
  });

  async function fetchVendorDetails() {
    try {
      if (router.query.vendorId) {
        return await Api.get(
          `/api/seller/get-vendor-products/${router.query.vendorId}`
        );
      }
    } catch (error) {}
  }

  function selectProduct(vendorProduct) {
    setSelectedProducts((prev) => {
      if (prev && !prev.some((obj) => obj.compare === vendorProduct.compare)) {
        return [...prev, vendorProduct];
      } else {
        const newPros = prev.filter(
          (product) => product.compare !== vendorProduct.compare
        );
        return [...newPros];
      }
    });
  }

  async function SendOrder() {
    setIsSending(true);
    try {
      let data = [];
      selectedProducts.map((product) => {
        data.push({
          product_id: product.id,
          quantity: product.amount ?? 1,
          product_combination_id: product.line_id ?? null,
        });
      });
      const response = await Api.post(`/api/seller/make-order`, {
        products: [...data],
        note : noteRef.current.value ?? null ,
        vendor_id : router.query.vendorId
      });
      setSelectedProducts([]);
      refetch();
      setIsSending(false);
      setShowSelected(false);
    } catch (error) {
      setIsSending(false);
    }
    setIsSending(false);
  }

  return (
    <>
      <div className="w-[90%] flex flex-col space-y-5 mx-auto py-7 ">
        {vendorDetails?.data?.vendor?.name && (
          <p className="text-3xl">{vendorDetails?.data?.vendor?.name} </p>
        )}
        <hr />
        {isLoading == true ? (
          <div className="w-full justify-center items-center">
            <TawasyLoader width={300} height={300} />
          </div>
        ) : (
          <div className="w-full flex flex-col space-y-5 mx-auto py-7 ">
            {vendorDetails?.data?.vendor && (
              <div className="w-full flex flex-col justify-start items-start space-y-2">
                <p className="text-center w-full text-xl ">
                  {t("brands")} :
                </p>
                <div className="w-[80%] mx-auto flex justify-center space-x-4 items-center overflow-scroll">
                  {vendorDetails?.data?.vendor?.brands.map((brand, i) => {
                    if (brand.logo) {
                      return (
                        <Image
                          key={i}
                          src={brand.logo ?? logo}
                          alt={brand?.name}
                          width={75}
                          height={75}
                          className="object-contain px-2"
                        />
                      );
                    } else {
                      return (
                        <p key={i} className="text-xl px-2">
                          {brand.name}
                        </p>
                      );
                    }
                  })}
                </div>
              </div>
            )}
            {vendorDetails?.data?.vendor && <hr />}
            <div className="w-full flex justify-start items-center space-x-3">
              <p>({t("productsSelected")}) : {selectedProducts.length}</p>
              <button
                disabled={selectedProducts.length < 1}
                className="bg-sky-400 px-2 py-1 rounded-lg text-white hover:opacity-75 disabled:bg-gray-400 disabled:opacity-75 "
                onClick={() => {
                  setShowSelected(true);
                }}
              >
                {t("showSelectedProducts")}
              </button>
              <button
                disabled={selectedProducts.length < 1}
                className="bg-red-500 px-2 py-1 rounded-lg text-white hover:opacity-75 disabled:bg-gray-400 disabled:opacity-75 "
                onClick={() => {
                  setSelectedProducts([]);
                }}
              >
                {t("unselectAll")}
              </button>
            </div>
            <hr />
            <div className="w-full grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-col-1 gap-4 mb-4">
              {vendorDetails?.data?.products.map((product, i) => {
                return (
                  <SellerVendorProduct
                    key={`${i} - ${product.vendor_product_id}`}
                    selectedProducts={selectedProducts}
                    selectProduct={(selectedId) => {
                      selectProduct(selectedId);
                    }}
                    product={product}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={showSelected}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        scroll="paper"
        maxWidth="lg"
        fullWidth
        onClose={() => setShowSelected(false)}
      >
        <DialogTitle className="flex justify-between items-center">
          <div className="flex justify-start items-center space-x-2">
            <p>{t("mySelected")}</p>
            <p>:</p>
          </div>
          <MdClose
            onClick={() => {
              setShowSelected(false);
            }}
            className="text-red-500 w-[25px] cursor-pointer h-[25px] border-b-2 border-transparent hover:text-red-600 hover:border-red-600 transition-all duration-300 "
          />
        </DialogTitle>
        <DialogContent>
          <div className="w-full flex flex-col justify-start items-start">
            <table className=" w-full overflow-x-auto table-auto">
              <thead className="sticky top-0">
                <tr className="text-sm font-semibold text-center border-b-2 border-blue-500 capitalize">
                  <th>{t("name")}</th>
                  <th>{t("combination")}</th>
                  <th>{t("packs")}</th>
                  <th>{t("itemsInPack")}</th>
                  <th>{t("quantity")}</th>
                </tr>
              </thead>
              <tbody className="  text-lg font-normal text-gray-700 text-center">
                {selectedProducts?.length > 0 &&
                  selectedProducts?.map((product, i) => {
                    let varis = [];
                    if (product?.combination?.variations) {
                      product?.combination?.variations.map((variation) => {
                        if (variation.option) {
                          varis.push(variation.option);
                        }
                      });
                    }

                    return (
                      <tr key={i} className=" odd:bg-gray-100 even:bg-gray-200">
                        <td className="px-2 py-2">{product.name}</td>
                        <td className="text-red-500">
                          {product?.combination ? varis.join(" - ") : ` - `}
                        </td>
                        <td className="px-2 py-2">{product.amount}</td>
                        <td>{product.packs}</td>
                        <td>{Number(product.packs) * Number(product.amount)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <hr />
        </DialogContent>
        <DialogActions className="flex flex-col justify-center items-center w-[80%] mx-auto space-y-4">
          <label htmlFor="note" className="w-full text-black">
          {t("noteForVendor")} :
            <textarea
              id="note"
              ref={noteRef}
              className="w-full outline-none border focus:border-skin-primary px-2 py-1 transition-all duration-500"
              placeholder={t("note")}
            />
          </label>
          {isSending == true ? (
            <div
              className=" text-lg w-[20%] px-3 py-1 flex justify-center items-center rounded-lg text-white bg-sky-500 transition-all duration-500"
            >
              <Ring size={20} speed={3} lineWeight={5} color="white" />
            </div>
          ) : (
            <button
              onClick={SendOrder}
              className=" text-lg w-[20%] px-3 py-1 text-center rounded-lg text-white bg-sky-500 transition-all duration-500"
            >
              {t("sendOrder")}
            </button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default withLayout(SellerVendorPage);

import withLayout from "@/components/wrapping components/WrappingSellerLayout";
import React, { useEffect, useState } from "react";
import item1 from "../../../../public/images/kuala.jpg";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import withLayoutAdmin from "@/components/UI/adminLayout";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { useRef } from "react";
import StoreTypeADSAdmin from "@/components/AdminStoreTypeADS/StoreTypeADSAdmin";
import StoreTypeMobileADS from "../../../../components/StoreTypesMobileADS/StoreTypeMobileADS";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { toast } from "react-toastify";
import { Ring } from "@uiball/loaders";

const tableheading = [
  {
    heading: "Image",
  },
  {
    heading: "Store Type",
  },
  {
    heading: "Created at",
  },
  {
    heading: "Updated at",
  },
];

const StoreType = [
  {
    id: 1,
    image: item1,
    store_typeId: 5,
    Created: "12/3/2022",
  },
  {
    id: 2,
    image: item1,
    store_typeId: 5,
    Created: "12/3/2022",
  },
  {
    id: 3,
    image: item1,
    store_typeId: 5,
    Created: "12/3/2022",
  },
];

function StoreTypeADS() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const {
    data: websiteStoreTypeAds,
    isLoading: websiteLoading,
    refetch: refetchWebsite,
  } = useQuery(`storeTypeWebsiteAds`, fetchStoreTypeWebsiteAds, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
  const {
    data: mobileStoreTypeAds,
    isLoading: mobileLoading,
    refetch: refetchMobile,
  } = useQuery(`storeTypeMobileAds`, fetchStoreTypeMobileAds, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
  const [open, openchange] = useState(false);
  const [openmobile, openmobilechange] = useState(false);
  const [websiteImage, setWebsiteImage] = useState();
  const [mobileImage, setMobileImage] = useState();
  const [addingMobile, setAddingMobile] = useState(false);
  const [addingWebsite, setAddingWebsite] = useState(false);
  const websiteStoreTypeId = useRef();
  const mobileStoreTypeId = useRef();

  async function fetchStoreTypeWebsiteAds() {
    try {
      return await Api.get(`/api/admin/ads/store-type/website/get`);
    } catch (error) {}
  }

  async function fetchStoreTypeMobileAds() {
    try {
      return await Api.get(`/api/admin/ads/store-type/mobile/get`);
    } catch (error) {}
  }

  const functionopenpopup = () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };

  function handleWebsiteStoreTypeADSImage(image) {
    setWebsiteImage(image);
  }
  function handleMobileStoreTypeADSImage(image) {
    setMobileImage(image);
  }

  useEffect(() => {
    setWebsiteImage();
    setMobileImage();
  }, []);

  const functionopenMobilepopup = () => {
    openmobilechange(true);
  };

  const closepopupMobile = () => {
    openmobilechange(false);
  };

  async function addMobileAd(e) {
    e.preventDefault();
    if (mobileImage) {
      setAddingMobile(true);
      try {
        const response = await Api.post(
          `/api/admin/ad/store-type/mobile/add`,
          {
            store_type_id: mobileStoreTypeId.current.value,
            image_path: mobileImage,
          },
          {
            headers: { "Content-Type": `multipart/form-data` },
          }
        );
        refetchMobile();
        openmobilechange(false);
        setAddingMobile(false);
      } catch (error) {
        setAddingMobile(false);
      }
      setAddingMobile(false);
    } else {
      toast.error(`Please Select a photo to add | الرجاء اختيار صورة`, {
        toastId: `Please Select a photo to add | الرجاء اختيار صورة`,
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
  }

  async function addWebsiteAd(e) {
    // console.log(`website`);
    // console.log(websiteImage)
    e.preventDefault();
    if (websiteImage) {
      setAddingWebsite(true);
      try {
        // console.log(`in try`);
        const response = await Api.post(
          `/api/admin/ad/store-type/website/add`,
          {
            store_type_id: websiteStoreTypeId.current.value,
            image_path: websiteImage,
          },
          {
            headers: { "Content-Type": `multipart/form-data` },
          }
        );
        refetchWebsite();
        openchange(false);
        setAddingWebsite(false);
      } catch (error) {
        setAddingWebsite(false);
      }
      setAddingWebsite(false);
    } else {
      toast.error(`Please Select a photo to add | الرجاء اختيار صورة`, {
        toastId: `Please Select a photo to add | الرجاء اختيار صورة`,
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
  }

  if (mobileLoading == true || websiteLoading == true) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={400} height={400} />
      </div>
    );
  }

  return (
    <div>
      <div className="md:px-6">
        <div className="w-full h-screen mx-auto">
          <div className="py-7">
            <div className="flex justify-between">
              <h2 className="text-2xl text-stone-500 pb-5 ">
                All Store Type ADS
              </h2>
              <div className="w-[50%] flex justify-end ">
                <button
                  className="bg-skin-primary text-white py-1 px-3 rounded-md"
                  onClick={functionopenpopup}
                >
                  Add Website Store Type ADS
                </button>
                <button
                  className="bg-skin-primary text-white py-1 px-3 rounded-md ml-2"
                  onClick={functionopenMobilepopup}
                >
                  Add Mobile Store Type ADS
                </button>
              </div>
            </div>
          </div>

          <h2 className="text-2xl text-gray-500 bg-slate-50 py-1 px-2">
            Website Ads
          </h2>
          {websiteStoreTypeAds &&
          websiteStoreTypeAds.data.ads &&
          websiteStoreTypeAds.data.ads.length > 0 ? (
            <table className="w-full mt-6 overflow-auto table-auto">
              <thead className="h-auto">
                <tr className="text-sm font-semibold text-center border-b-2 border-blue-500 uppercase">
                  <th>Id</th>
                  {tableheading.map((index) => (
                    <th className=" px-4 py-2" key={index.heading}>
                      {index.heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-lg h-[10%] font-normal text-gray-700 text-center">
                {websiteStoreTypeAds.data.ads.map((names) => {
                  return (
                    <StoreTypeADSAdmin
                      storetypeads={names}
                      key={names.id}
                      refetch={() => {
                        refetchWebsite();
                      }}
                    />
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="w-max mx-auto">
              There are no Ads for any website store Type page.
            </div>
          )}

          <h2 className="text-2xl text-gray-500 bg-slate-50 py-1 px-2 mt-7">
            Mobile Ads
          </h2>
          {mobileStoreTypeAds &&
          mobileStoreTypeAds.data.ads &&
          mobileStoreTypeAds.data.ads.length > 0 ? (
            <table className="w-full mt-6  overflow-auto table-auto">
              <thead className="">
                <tr className="text-sm font-semibold text-center border-b-2 border-blue-500 uppercase">
                  <th>Id</th>
                  {tableheading.map((index) => (
                    <th className=" px-4 py-4 " key={index.heading}>
                      {index.heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-lg h-[10%] font-normal  text-gray-700 text-center">
                {mobileStoreTypeAds.data.ads.map((names) => {
                  return (
                    <StoreTypeMobileADS
                      storetypemobileads={names}
                      key={names.id}
                      refetch={() => {
                        refetchMobile();
                      }}
                    />
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="w-max mx-auto">
              There are no Ads for any mobile store Type page.
            </div>
          )}
          {/* <div className="w-max mx-auto" > There are no store type ads. </div> */}
        </div>
      </div>

      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="md">
        <DialogTitle className=" border-b-2 border-gray-200">
          <h3 className="py-2 pl-3 text-gray-600">
            Create New Website Store Type ADS
          </h3>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} margin={2}>
            <form onSubmit={addWebsiteAd}>
              <div className="flex justify-between">
                <div className="px-6 py-2">
                  <input
                    className="md:w-[400px] w-full border-b-2  outline-none  text-xl focus:border-skin-primary transition-all duration-700"
                    name="store_type Id"
                    type="number"
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    }}
                    placeholder="store_type Id"
                    ref={websiteStoreTypeId}
                    required
                  />
                </div>

                <div className="px-6 py-2 flex flex-col justify-start items-start box-border pl-3 w-[80%] mx-auto ">
                  <div className="w-[200px] h-[100px]">
                    <ImageUpload
                      onSelectImage={handleWebsiteStoreTypeADSImage}
                      width={120}
                      height={50}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-start">
                <button
                  className="bg-skin-primary w-[20%] rounded-md text-white px-8 py-2"
                  type="submit"
                >
                  {addingWebsite == true ? (
                    <div className="w-full h-full flex justify-center items-center">
                      <Ring size={20} lineWeight={5} speed={2} color="white" />
                    </div>
                  ) : (
                    `Save`
                  )}
                </button>
              </div>
            </form>
          </Stack>
        </DialogContent>

        <DialogActions className="grid md:grid-cols-2 grid-cols-1 "></DialogActions>
      </Dialog>

      <Dialog
        open={openmobile}
        onClose={closepopupMobile}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className=" border-b-2 border-gray-200">
          <h3 className="py-2 pl-3 text-gray-600">
            Create New Mobile Store Type ADS
          </h3>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} margin={2}>
            <form onSubmit={addMobileAd}>
              <div className="flex justify-between">
                <div className="px-6 py-2">
                  <input
                    className="md:w-[400px] w-full border-b-2  outline-none  text-xl focus:border-skin-primary transition-all duration-700"
                    name="store_type Id"
                    type="number"
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    }}
                    placeholder="store_type Id"
                    ref={mobileStoreTypeId}
                    required
                  />
                </div>

                <div className="px-6 py-2 flex flex-col justify-start items-start box-border pl-3 w-[80%] mx-auto ">
                  <div className="w-[200px] h-[100px]">
                    <ImageUpload
                      onSelectImage={handleMobileStoreTypeADSImage}
                      width={150}
                      height={50}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-start">
                <button
                  className="bg-skin-primary w-[20%] rounded-md text-white px-8 py-2"
                  type="submit"
                >
                  {addingMobile == true ? (
                    <div className="w-full h-full flex justify-center items-center">
                      <Ring size={20} lineWeight={5} speed={2} color="white" />
                    </div>
                  ) : (
                    `Save`
                  )}
                </button>
              </div>
            </form>
          </Stack>
        </DialogContent>

        <DialogActions className="grid md:grid-cols-2 grid-cols-1 "></DialogActions>
      </Dialog>
    </div>
  );
}

export default withLayoutAdmin(StoreTypeADS);

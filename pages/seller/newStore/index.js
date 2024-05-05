import withLayout from "@/components/wrapping components/WrappingSellerLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import TawasyLoader from "@/components/UI/tawasyLoader";
import createAxiosInstance from "@/API";
import Locations from "@/components/Location/Location";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { Ring } from "@uiball/loaders";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { MdClose } from "react-icons/md";
import { useQuery } from "react-query";

export async function getServerSideProps(context) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

function NewStore() {
  // const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const { t } = useTranslation("");
  const [address, setAddress] = useState();
  const ArNameRef = useRef();
  const EnNameRef = useRef();
  const areaRef = useRef();
  const streetRef = useRef();
  const [logo, setLogo] = useState();
  const [image, setImage] = useState();
  const openTimeRef = useRef();
  const closeTimeRef = useRef();
  const [storeType, selectedStoreType] = useState();
  // const [storeTypes, setStoreTypes] = useState();
  const maxLength = 255;
  const [areaMaxLength, setAreaMaxLength] = useState(maxLength);
  const [streetMaxLength, setStreetMaxLength] = useState(maxLength);
  const [open, openchange] = useState(false);
  const [checkedDays, setCheckedDays] = useState([]);
  const { data: storeTypes, isLoading } = useQuery(
    "storeTypesforAddStore",
    fetchStoreTypesNew,
    {
      staleTime: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  async function fetchStoreTypesNew() {
    try {
      return await Api.get(`/api/seller/store-types/all`);
    } catch (error) {}
  }

  useEffect(() => {
    setImage(null);
    setLogo(null);
  }, []);

  const handleCheckboxChange = (event) => {
    const day = event.target.value;
    if (event.target.checked) {
      setCheckedDays([...checkedDays, day]);
    } else {
      setCheckedDays(checkedDays.filter((d) => d !== day));
    }
  };

  const functionopenpopup = () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };

  function handleAddress(address) {
    setAddress(address);
  }

  async function submitStore(e) {
    e.preventDefault();
    if (!address) {
      toast.error(
        "Please fill all of the required fields \b الرجاء تعبئة جميع الحقول ",
        {
          toastId:
            "Please fill all of the required fields \b الرجاء تعبئة جميع الحقول ",
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
      return;
    }
    setSubmitting(true);
    try {
      const response = await Api.post(
        `/api/seller/create-store`,
        {
          name_en: EnNameRef.current.value,
          name_ar: ArNameRef.current.value,
          address: address.address,
          street: streetRef.current.value,
          area: areaRef.current.value,
          longitude: address.lng,
          latitude: address.lat,
          image: image,
          logo: logo,
          opening_time: openTimeRef.current.value,
          closing_time: closeTimeRef.current.value,
          store_type_name: storeType,
          opening_days: checkedDays,
        },
        {
          headers: { "Content-Type": `multipart/form-data` },
        }
      );
      setSubmitting(false);
      router.replace("/seller");
    } catch (error) {
      setSubmitting(false);
    }
  }

  function handleLogoImage(logo) {
    setLogo(logo);
  }

  function handleStoreImage(image) {
    setImage(image);
  }

  return (
    <div className=" h-full w-full flex flex-col justify-center items-center space-y-3 pt-5 pb-7">
      <div className=" w-[80%] mx-auto pt-8 ">
        <p className=" text-start font-medium text-3xl pb-5">
          {t("seller.request.requestStore")} :
        </p>
        <hr />
      </div>

      {isLoading == true ? (
        <TawasyLoader height={300} width={300} />
      ) : (
        <form className="h-full w-[80%]  mx-auto " onSubmit={submitStore}>
          <div className="grid md:grid-cols-2 grid-col-1 gap-4  text-zinc-50 h-max my-8 ">
            {/* <div> */}
            <div>
              <label className="text-zinc-500" htmlFor="name">
                {t("seller.request.arName")}
              </label>
              <input
                id="name"
                className="mb-7 text-zinc-500 pl-2 focus:text-skin-primary border-b-2 border-zinc-500 focus:border-skin-primary transition-colors duration-300 outline-none w-full h-[40px] "
                type="text"
                maxLength={65}
                placeholder={t("seller.request.arName")}
                ref={ArNameRef}
                required
              />
            </div>
            <div>
              <label className="text-zinc-500">
                {t("seller.request.engName")}{" "}
              </label>
              <input
                className="mb-7 text-zinc-500 pl-2 focus:text-skin-primary border-b-2 border-zinc-500 focus:border-skin-primary transition-colors duration-300 outline-none w-full h-[40px]"
                type="text"
                placeholder={t("seller.request.engName")}
                ref={EnNameRef}
                required
              />
            </div>
            <div>
              <label className="text-zinc-500">
                {t("seller.request.openingTime")}
              </label>
              <br />
              <input
                className="mb-7 text-zinc-500 pl-2 focus:text-skin-primary border-b-2 border-zinc-500 focus:border-skin-primary transition-colors duration-300 outline-none w-full h-[40px] "
                type="time"
                placeholder={t("seller.request.openingTime")}
                ref={openTimeRef}
                required
              />
            </div>
            <div>
              <label className="text-zinc-500">
                {t("seller.request.closingTime")}
              </label>
              <br />
              <input
                className="mb-7 text-zinc-500 pl-2 focus:text-skin-primary border-b-2 border-zinc-500 focus:border-skin-primary transition-colors duration-300 outline-none w-full h-[40px] "
                type="time"
                placeholder={t("seller.request.closingTime")}
                ref={closeTimeRef}
                required
              />
            </div>

            <div>
              <label className="text-zinc-500">
                {t("seller.request.openingDays")}
              </label>
              <br />
              <div className="print-value">
                <input
                  className="mb-7 text-zinc-500 pl-2 focus:text-skin-primary border-b-2 border-zinc-500 focus:border-skin-primary transition-colors duration-300 outline-none w-full h-[40px] "
                  onClick={functionopenpopup}
                  variant="contained"
                  type="text"
                  value={checkedDays.join(", ")}
                  placeholder="Opening Days"
                />
              </div>
            </div>
            <div className="h-max">
              <div className="flex justify-between items-center">
                <label className="text-zinc-500">
                  {t("seller.request.area")}
                </label>
                <p className="text-gray-300">{areaMaxLength} Characters left</p>
              </div>
              <textarea
                className="mb-7 text-zinc-500 pl-2 focus:text-skin-primary border-b-2 border-zinc-500 focus:border-skin-primary transition-colors duration-300 outline-none w-full h-[40px] "
                type="text"
                placeholder={t("seller.request.area")}
                maxLength={255}
                onChange={() => {
                  setAreaMaxLength(maxLength - areaRef.current.value.length);
                }}
                ref={areaRef}
                required
              />
            </div>

            {/* </div> */}

            {/* <div className=""> */}
            <div className="mb-16">
              <div className="flex justify-between  items-center ">
                <label className="text-zinc-500">
                  {t("seller.request.street")}
                </label>
                <p className="text-gray-300">
                  {streetMaxLength} Characters left
                </p>
              </div>
              <textarea
                className="mb-7 outline-none w-full focus:text-skin-primary border-b-2 border-zinc-500 focus:border-skin-primary transition-colors duration-300 h-[40px] text-zinc-500 pl-2"
                type="text"
                placeholder={t("seller.request.street")}
                onChange={() => {
                  setStreetMaxLength(
                    maxLength - streetRef.current.value.length
                  );
                }}
                ref={streetRef}
                required
              />
            </div>

            <div>
              <label className="text-zinc-500">
                {t("seller.request.storeType")}
              </label>
              <br />
              {storeTypes && (
                <select
                  className="form-select mb-7 h-[40px] w-full text-zinc-500 border-b-2 bg-transparent border-zinc-500 focus:border-skin-primary transition-colors duration-300 pl-2 outline-none"
                  aria-label={t("seller.request.storeType")}
                  onChange={(e) => {
                    // console.log(e.target.value);
                    selectedStoreType(e.target.value);
                  }}
                >
                  <option disabled selected value>
                    {router.locale == "ar"
                      ? "-- اختر نوع المتجر --"
                      : "-- select a Store Type --"}
                  </option>
                  {storeTypes.data.data.map((storeType) => {
                    return (
                      <option key={storeType.id} value={storeType.name}>
                        {storeType.name}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>

            <div className="w-full ">
              <label className="text-zinc-500">
                {t("seller.request.address")}
              </label>
              <Locations
                className={`mb-7 text-skin-primary pl-2 outline-none w-max h-[40px]`}
                onLocation={handleAddress}
              />
            </div>

            {/* <div className="flex justify-start items-center"></div> */}
            <div className="flex flex-col justify-start items-start  box-border ">
              <label className="text-zinc-500">
                {t("seller.request.storeImage")}
              </label>
              <div className="w-[200px] h-max  ">
                <ImageUpload
                  className="text-skin-primary"
                  onSelectImage={handleStoreImage}
                  width={150}
                  height={50}
                />
              </div>
            </div>

            <div className="">
              <label className="text-zinc-500">
                {t("seller.request.storeLogo")}
              </label>

              <div className="w-[200px] h-max  ">
                <ImageUpload
                  className="text-skin-primary"
                  onSelectImage={handleLogoImage}
                  width={100}
                  height={100}
                />
              </div>
            </div>
            {/* </div> */}
          </div>

          <div className="flex items-center justify-center w-full ">
            <button
              className="px-2 py-1 bg-white rounded-md hover:opacity-75 border-2 border-skin-primary text-[#ff6600] w-[20%]  "
              // onClick={handleLogin}
              type="submit"
            >
              {submitting == true ? (
                <div className="flex justify-center items-center">
                  <Ring size={25} lineWeight={5} speed={2} color="#ff6600" />
                </div>
              ) : (
                t("seller.request.submit")
              )}
            </button>
          </div>
        </form>
      )}

      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
        <DialogTitle className="flex w-full justify-between items-center" >
          <p>{t("seller.request.openingDays")}</p>
          <IconButton onClick={closepopup} style={{ float: "right" }}>
            <MdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} margin={2}>
            <fieldset className="check">
              <div className="row">
                <div className="col-md-6">
                  <label>
                    <input
                      type="checkbox"
                      name="Sunday"
                      value="Sunday"
                      checked={checkedDays.includes("Sunday")}
                      onChange={handleCheckboxChange}
                    />{" "}
                    {router.locale == "ar" ? "الأحد" : "Sunday"}
                  </label>
                  <br />
                  <label>
                    {" "}
                    <input
                      type="checkbox"
                      name="Monday"
                      value="Monday"
                      checked={checkedDays.includes("Monday")}
                      onChange={handleCheckboxChange}
                    />{" "}
                    {router.locale == "ar" ? "الإثنين" : "Monday"}
                  </label>
                  <br />
                  <label>
                    <input
                      type="checkbox"
                      name="Tuesday"
                      value="Tuesday"
                      checked={checkedDays.includes("Tuesday")}
                      onChange={handleCheckboxChange}
                    />{" "}
                    {router.locale == "ar" ? "الثلاثاء" : "Tuesday"}
                  </label>
                  <br />
                  <label>
                    {" "}
                    <input
                      type="checkbox"
                      name="Wednesday"
                      value="Wednesday"
                      checked={checkedDays.includes("Wednesday")}
                      onChange={handleCheckboxChange}
                    />{" "}
                    {router.locale == "ar" ? "الأربعاء" : "Wednesday"}
                  </label>
                  <br />
                </div>

                <div className="col-md-6">
                  <label>
                    <input
                      type="checkbox"
                      name="Thursday"
                      value="Thursday"
                      checked={checkedDays.includes("Thursday")}
                      onChange={handleCheckboxChange}
                    />{" "}
                    {router.locale == "ar" ? "الخميس" : "Thursday"}
                  </label>
                  <br />
                  <label>
                    <input
                      type="checkbox"
                      name="Friday"
                      value="Friday"
                      checked={checkedDays.includes("Friday")}
                      onChange={handleCheckboxChange}
                    />{" "}
                    {router.locale == "ar" ? "الجمعة" : "Friday"}
                  </label>
                  <br />{" "}
                  <label>
                    <input
                      type="checkbox"
                      name="Saturday"
                      value="Saturday"
                      checked={checkedDays.includes("Saturday")}
                      onChange={handleCheckboxChange}
                    />{" "}
                    {router.locale == "ar" ? "السبت" : "Saturday"}
                  </label>
                  <br />
                </div>
              </div>
            </fieldset>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withLayout(NewStore);

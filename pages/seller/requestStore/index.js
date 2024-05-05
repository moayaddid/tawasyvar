import React, { useState, useRef, useEffect, Fragment } from "react";
import UploadImg from "../../../public/images/choose_file - Copy.png";
import styles from "../../../components/componentsStyling/sellerStyles.module.css";
import LogoRequest from "../../../public/images/tawasylogowhite.png";
import { AiOutlineLinkedin } from "react-icons/ai";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { MdClose } from "react-icons/md";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import Image from "next/image";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Locations from "@/components/Location/Location";
import axios from "axios";
import url from "@/URL";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export async function getServerSideProps(context) {
  const { locale } = context;
  
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const RequestStore = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const {t} = useTranslation("");
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
  const [storeTypes, setStoreTypes] = useState();
  const maxLength = 255;
  const [areaMaxLength, setAreaMaxLength] = useState(maxLength);
  const [streetMaxLength, setStreetMaxLength] = useState(maxLength);
  // const streetMaxLength = 255 ;

  useEffect(() => {
    setImage(null);
    setLogo(null);
  }, []);

  useEffect(() => {
    async function fetchStoreTypes() {
      setIsLoading(true);
      try {
        const response = await Api.get(`/api/seller/store-types/all`);
        setStoreTypes(response.data.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    fetchStoreTypes();
  }, []);

  const [checkedDays, setCheckedDays] = useState([]);

  const handleCheckboxChange = (event) => {
    const day = event.target.value;
    if (event.target.checked) {
      setCheckedDays([...checkedDays, day]);
    } else {
      setCheckedDays(checkedDays.filter((d) => d !== day));
    }
  };

  const [open, openchange] = useState(false);
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
      router.replace("/seller/pendingStore");
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

  if (isLoading == true) {
    return (
      <div className="w-screen h-screen">
        <TawasyLoader />
      </div>
    );
  }

  return (
      <div className={`h-screen w-screen bg-[#ff6600] overflow-scroll `}>
        <div className="w-[70%] mx-auto h-full ">
          <div className=" w-full">
            <div className="flex justify-center items-center pt-16 pb-7">
              <Image src={LogoRequest} className="w-72 " />
            </div>
          </div>

          <form className="h-full  " onSubmit={submitStore}>
            <div className="grid md:grid-cols-2 grid-col-1 gap-2 text-zinc-50 h-max my-16 ">
              {/* <div> */}
              <div>
                <label className="" htmlFor="name">
                  {t("seller.request.arName")}
                </label>
                <input
                  id="name"
                  className="mb-7 text-zinc-500 pl-2 focus:text-skin-primary outline-none w-full h-[40px] "
                  type="text"
                  maxLength={65}
                  placeholder={t("seller.request.arName")}
                  ref={ArNameRef}
                  required
                />
              </div>
              <div>
                <label>{t("seller.request.engName")} </label>
                <input
                  className="mb-7 text-zinc-500 pl-2 focus:text-skin-primary outline-none w-full h-[40px]"
                  type="text"
                  placeholder={t("seller.request.engName")}
                  ref={EnNameRef}
                  required
                />
              </div>
              <div>
                <label>{t("seller.request.openingTime")}</label>
                <br />
                <input
                  className="mb-7 text-zinc-500 pl-2 focus:text-skin-primary outline-none w-full h-[40px] "
                  type="time"
                  placeholder={t("seller.request.openingTime")}
                  ref={openTimeRef}
                  required
                />
              </div>
              <div>
                <label>{t("seller.request.closingTime")}</label>
                <br />
                <input
                  className="mb-7 text-zinc-500 pl-2 focus:text-skin-primary outline-none w-full h-[40px] "
                  type="time"
                  placeholder={t("seller.request.closingTime")}
                  ref={closeTimeRef}
                  required
                />
              </div>

              <div>
                <label>{t("seller.request.openingDays")}</label>
                <br />
                <div className="print-value">
                  <input
                    className="mb-7 text-zinc-500 pl-2 focus:text-skin-primary outline-none w-full h-[40px] "
                    onClick={functionopenpopup}
                    variant="contained"
                    type="text"
                    value={checkedDays.join(", ")}
                    placeholder="Opening Days"
                  />
                </div>
              </div>
              <div className="h-max">
                <div className="flex justify-between items-center ">
                  <label>{t("seller.request.area")}</label>
                  <p className="text-gray-300">
                    {areaMaxLength} Characters left
                  </p>
                </div>
                <textarea
                  className="mb-7 text-zinc-500 pl-2 focus:text-skin-primary outline-none w-full h-[40px] "
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
                  <label>{t("seller.request.street")}</label>
                  <p className="text-gray-300">
                    {streetMaxLength} Characters left
                  </p>
                </div>
                <textarea
                  className="mb-7 outline-none w-full focus:text-skin-primary h-[40px] text-zinc-500 pl-2"
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
                <label>{t("seller.request.storeType")}</label>
                <br />
                {storeTypes && (
                  <select
                    className="form-select mb-7 h-[40px] w-full text-zinc-500 pl-2 outline-none"
                    aria-label={t("seller.request.storeType")}
                    onChange={(e) => {
                      // console.log(e.target.value);
                      selectedStoreType(e.target.value);
                    }}
                  >
                    <option disabled selected value>
                      { router.locale == "ar" ? "-- اختر نوع المتجر --" : "-- select a Store Type --"}
                    </option>
                    {storeTypes.map((storeType) => {
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
                <label>{t("seller.request.address")}</label>
                <Locations
                  className={`mb-7 text-white pl-2 outline-none w-max h-[40px]`}
                  onLocation={handleAddress}
                />
              </div>

              <div className="flex justify-start items-center" >

              </div>
              <div className="flex flex-col justify-start items-start  box-border ">
                <label className=" ">{t("seller.request.storeImage")}</label>
                <div className="w-[200px] h-[100px]">
                  <ImageUpload
                    onSelectImage={handleStoreImage}
                    width={150}
                    height={50}
                  />
                </div>
              </div>

              <div className="">
                <label>{t("seller.request.storeLogo")}</label>
                <br />
                <div>
                  <ImageUpload
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
                className="px-2 py-1 bg-white rounded-md hover:bg-gray-200 text-[#ff6600] w-[20%]  "
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

          <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
            <DialogTitle>
            {t("seller.request.openingDays")}
              <IconButton onClick={closepopup} style={{ float: "right" }}>
                <MdClose />
              </IconButton>{" "}
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
                        { router.locale == "ar" ? "الأحد" : "Sunday"}
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
                        { router.locale == "ar" ? "الإثنين" : "Monday"}
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
                        { router.locale == "ar" ? "الثلاثاء" : "Tuesday"}
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
                        { router.locale == "ar" ? "الأربعاء" : "Wednesday"}
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
                        { router.locale == "ar" ? "الخميس" : "Thursday"}
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
                        { router.locale == "ar" ? "الجمعة" : "Friday"}
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
                        { router.locale == "ar" ? "السبت" : "Saturday"}
                      </label>
                      <br />
                    </div>
                  </div>
                </fieldset>
              </Stack>
            </DialogContent>
          </Dialog>
        </div>
      </div>
  );
};
export default RequestStore;

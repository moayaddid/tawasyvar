import React, { useState, useRef } from "react";
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
import withLayout from "@/components/wrapping components/WrappingSellerLayout";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import store from "../store";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Ring } from "@uiball/loaders";
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

const Setting = () => {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [checkedDays, setCheckedDays] = useState([]);
  const [oldDays, setOldDays] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const openingTimeRef = useRef();
  const closingTimeRef = useRef();
  const { t } = useTranslation("");
  const {
    data: storeData,
    isLoading,
    refetch,
  } = useQuery(`storeData`, fetchStoreData, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchStoreData() {
    try {
      return await Api.get(`/api/seller/get-opening-time`);
    } catch (error) {}
  }

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

  useEffect(() => {
    if (storeData) {
      if (storeData.data.store.opening_days) {
        const capitalizedDaysArray = storeData.data.store.opening_days.map(
          (day) => day.charAt(0).toUpperCase() + day.slice(1)
        );
        setOldDays(capitalizedDaysArray);
        setCheckedDays(capitalizedDaysArray);
      }
    }
  }, [storeData]);

  async function saveEdits(e) {
    e.preventDefault();
    function arraysAreEqual(arr1, arr2) {
      return JSON.stringify(arr1) === JSON.stringify(arr2);
    }
    let editData = {};

    const addIfDifferent = (fieldValue, fieldName) => {
      const originalValue = storeData.data.store[fieldName];
      if (
        fieldValue !== undefined &&
        fieldValue.trim() !== "" &&
        fieldValue !== originalValue
      ) {
        editData[fieldName] = fieldValue;
      }
    };
    addIfDifferent(openingTimeRef.current.value, "opening_time");
    addIfDifferent(closingTimeRef.current.value, "closing_time");

    if (arraysAreEqual(oldDays, checkedDays) == false) {
      editData[`opening_days`] = checkedDays;
    }
    if (Object.keys(editData).length < 1) {
      toast.error(
        `Please fill all the fields | الرجاء تعبئة جميع الحقول المطلوبة `,
        {
          toastId: `Please fill all the fields | الرجاء تعبئة جميع الحقول المطلوبة `,
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
    } else {
      setIsSaving(true);
      try {
        const response = await Api.put(`/api/seller/store/edit`, editData);
        refetch();
        setIsSaving(false);
      } catch (error) {
        setIsSaving(false);
      }
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={400} height={400} />
      </div>
    );
  }

  return (
    <>
      {storeData && (
        <div
          className="w-full h-screen flex flex-col justify-start items-center "
          dir={router.locale == "ar" ? "rtl" : "ltr"}
        >
          <div className="w-full bg-gray-100 py-1 md:px-4">
            <h4 className="text-2xl text-skin-primary">
              {t("seller.setting.storeSettings")} : {storeData.data.store.name}
            </h4>
          </div>
          <form
            className="flex flex-col justify-start items-center my-auto space-y-5 md:pt-14 pt-4 md:px-4 px-1 md:w-[70%] w-[90%] mx-auto h-[90%]"
            onSubmit={saveEdits}
          >
            <div className="flex justify-center gap-3 md:w-[50%] w-[100%]">
              <label className="md:text-xl text-base text-gray-600">
                {t("seller.setting.openingTime")} :
              </label>
              <br />
              <input
                className="outline-none"
                type="time"
                defaultValue={storeData.data.store.opening_time}
                ref={openingTimeRef}
              />
            </div>

            <div className="flex justify-center gap-3 md:w-[50%] w-[100%]">
              <label className="md:text-xl text-base text-gray-600">
                {t("seller.setting.closingTime")} :{" "}
              </label>
              <br />
              <input
                className="outline-none"
                type="time"
                defaultValue={storeData.data.store.closing_time}
                ref={closingTimeRef}
              />
            </div>

            <div className="md:flex md:flex-row sm:flex-col justify-center md:gap-3  w-[100%]">
              <label className="md:text-xl text-base text-gray-600">
                {t("seller.setting.openingDays")} :{" "}
              </label>
              <br />
              <div className="print-value">
                <input
                  className="border-b-2 border-gray-500 focus:border-skin-primary outline-none md:my-0 my-4 md:w-[400px] w-[90%]"
                  onClick={functionopenpopup}
                  value={checkedDays.join(", ")}
                  variant="contained"
                  type="text"
                  placeholder={checkedDays.join(", ")}
                />
              </div>
            </div>

            <div className="w-full flex justify-center  ">
              {isSaving == true ? (
                <div className="text-white px-10 py-2 my-2 rounded-md flex justify-center items-center bg-skin-primary md:w-[15%] w-[90%]">
                  <Ring size={20} speed={2} lineWeight={5} color="white" />
                </div>
              ) : (
                <button
                  className="text-white px-10 py-2 my-2 rounded-md bg-skin-primary md:w-[15%] w-[100%]"
                  type="submit"
                >
                  {t("seller.setting.saveChanges")}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
        <DialogTitle>
          {t("seller.setting.openingDays")}
          <IconButton onClick={closepopup} style={{ float: "right" }}>
            <MdClose />
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} margin={2}>
            <fieldset className="check w-full">
              <div className="flex flex-wrap gap-10 w-full">
                <div className="flex flex-col gap-y-1">
                  <label>
                    <input
                      type="checkbox"
                      name="Sunday"
                      value="Sunday"
                      checked={checkedDays.includes("Sunday")}
                      onChange={handleCheckboxChange}
                    />{" "}
                    Sunday
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
                    Monday
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
                    Tuesday
                  </label>
                  <br />
                </div>

                <div className="flex flex-col gap-y-1">
                  <label>
                    {" "}
                    <input
                      type="checkbox"
                      name="Wednesday"
                      value="Wednesday"
                      checked={checkedDays.includes("Wednesday")}
                      onChange={handleCheckboxChange}
                    />{" "}
                    Wednesday
                  </label>
                  <br />
                  <label>
                    <input
                      type="checkbox"
                      name="Thursday"
                      value="Thursday"
                      checked={checkedDays.includes("Thursday")}
                      onChange={handleCheckboxChange}
                    />{" "}
                    Thursday
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
                    Friday
                  </label>
                  <br />{" "}
                </div>

                <div className="flex flex-col gap-y-1">
                  <label>
                    <input
                      type="checkbox"
                      name="Saturday"
                      value="Saturday"
                      checked={checkedDays.includes("Saturday")}
                      onChange={handleCheckboxChange}
                    />{" "}
                    Saturday
                  </label>
                  <br />
                </div>
              </div>
            </fieldset>
          </Stack>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </>
  );
};

export default withLayout(Setting);

import Image from "next/image";
import React, { useRef, useState } from "react";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { FiEdit, FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import ImageUpload from "../ImageUpload/ImageUpload";
import { convertDateStringToDate } from "../AdminOrders/OrderAdmin";
import Locations from "../Location/Location";
import logo from "@/public/images/tawasylogo.png";
import TawasyLoader from "../UI/tawasyLoader";
import { useEffect } from "react";
import { toast } from "react-toastify";

const openingDays = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

function StoreAdmin({ names, refetch }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [logoImage, setLogoImage] = useState();
  const [address, setAddress] = useState();
  const [storeImage, setStoreImage] = useState();
  const [storeTypes, setStoreTypes] = useState();
  const [storeType, setStoreType] = useState(
    names.store_type && names.store_type
  );
  const [freeDelivery, setFreeDelivery] = useState(
    Number(names.free_delivery) ?? 0
  );
  const [status, setStatus] = useState(names.status && names.status);
  const [published, setPublished] = useState(
    names.publish ? Number(names.publish) : 0
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const newNameAr = useRef("");
  const newNameEn = useRef("");
  const NewopeningTime = useRef("");
  const newClosingTime = useRef("");
  const newStreet = useRef("");
  const newArea = useRef("");
  const radius = useRef();
  const router = useRouter();
  const Api = createAxiosInstance(router);

  function handleLogoImage(data) {
    setLogoImage(data);
  }

  function handleStoreImage(data) {
    setStoreImage(data);
  }

  let days = names.opening_days && names.opening_days;

  var capitalizedDaysArray =
    days &&
    days.map(function (day) {
      return day.charAt(0).toUpperCase() + day.slice(1);
    });

  const [checkedDays, setCheckedDays] = useState(
    names.opening_days ? capitalizedDaysArray : []
  );

  const handleCheckboxChange = (event) => {
    const day = event.target.value;
    if (event.target.checked) {
      setCheckedDays([...checkedDays, day]);
    } else {
      setCheckedDays(checkedDays.filter((d) => d !== day));
    }
  };

  useEffect(() => {
    setLogoImage();
    setStoreImage();
  }, []);

  async function openEdit() {
    setIsEditing(true);
    setIsLoading(true);
    try {
      const response = await Api.get(`/api/admin/store-types/all`);
      // console.log(response.data.data);
      setStoreTypes(response.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  function handlesAddress(data) {
    setAddress(data);
  }

  async function saveEdits() {
    setIsSaving(true);
    let editData = {};

    function arraysAreEqual(arr1, arr2) {
      return JSON.stringify(arr1) === JSON.stringify(arr2);
    }

    const addIfDifferent = (fieldValue, fieldName) => {
      const originalValue = names[fieldName];

      if (
        fieldValue !== undefined &&
        fieldValue.trim() !== "" &&
        fieldValue !== originalValue
      ) {
        editData[fieldName] = fieldValue;
      }
    };

    addIfDifferent(newNameAr.current.value, "name_ar");
    addIfDifferent(newNameEn.current.value, "name_en");
    addIfDifferent(NewopeningTime.current.value, "opening_time");
    addIfDifferent(newClosingTime.current.value, "closing_time");
    addIfDifferent(newArea.current.value, "area");
    addIfDifferent(newStreet.current.value, "street");
    if (storeType !== names.store_type) {
      editData["store_type_name"] = storeType;
    }
    if (status !== names.status) {
      editData.status = status;
    }
    if (published !== names.publish) {
      editData.publish = published;
    }
    if (address) {
      addIfDifferent(address.address, "address");
      editData.longitude = address.lng;
      editData.latitude = address.lat;
    }
    if (!arraysAreEqual(capitalizedDaysArray, checkedDays)) {
      editData[`opening_days`] = checkedDays;
    }
    if(freeDelivery !== names.free_delivery){
      editData.free_delivery = freeDelivery ?? 0 ;
      if( radius?.current?.value && radius.current.value != names.radius ){
        editData.radius = radius.current.value ;
      }
    }else{
      if(radius.current.value != names.radius ){
        editData.radius = radius.current.value ;
      }
    }

    if (logoImage) {
      try {
        const response = await Api.post(
          `/api/admin/update-store-logo/${names.id}`,
          {
            new_logo: logoImage ? logoImage : null,
          },
          {
            headers: { "Content-Type": `multipart/form-data` },
          }
        );
        setLogoImage();
      } catch (error) {
        setIsSaving(false);
        return;
      }
    }

    if (storeImage) {
      try {
        const response = await Api.post(
          `/api/admin/update-store-image/${names.id}`,
          {
            new_image: storeImage ? storeImage : null,
          },
          {
            headers: { "Content-Type": `multipart/form-data` },
          }
        );
        setStoreImage();
      } catch (error) {
        setIsSaving(false);

      }
    }

    if (Object.keys(editData).length < 1) {
      // toast.error(`Please fill all the fields | الرجاء تعبئة جميع الحقول المطلوبة `, {
      //   toastId: `Please fill all the fields | الرجاء تعبئة جميع الحقول المطلوبة `,
      //       position: "top-right",
      //       autoClose: 5000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //       theme: "colored",
      // });
      setIsEditing(false);
      setIsSaving(false);
      return;
    } else {
      try {
        const response = await Api.put(
          `/api/admin/edit-store/${names.id}`,
          editData
        );
        refetch();
        setIsSaving(false);
        setIsEditing(false);
      } catch (error) {
        setIsSaving(false);
      }
      setIsSaving(false);
    }

    // console.log(editData);
  }

  return (
    <>
      <tr
        key={names.id}
        className="py-10 bg-gray-100 hover:bg-gray-200 font-medium   "
      >
        <td className="px-4 py-4">{names.id}</td>
        <td class="px-4 py-4">
          <div class="flex-col lg:flex-row lg:space-x-2 items-center space-y-2 lg:space-y-0">
            <button
              onClick={openEdit}
              class="items-center px-2 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              <FiEdit2 />
            </button>
            {/* <button
              class="items-center px-2 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none"
              onClick={() => {
                setIsDeleting(true);
              }}
            >
              <RiDeleteBin6Line />
            </button> */}
          </div>
        </td>
        <td className="px-4 py-4">{names.seller_id}</td>
        <td className="px-4 py-4" width={`10%`}>
          {names.name_ar}
        </td>
        <td className="px-4 py-4" width={`10%`}>
          {names.name_en}
        </td>
        <td className="px-4 py-4 ">{names.opening_time}</td>
        <td className="px-4 py-4">{names.closing_time}</td>
        <td className="px-4 py-4">{names.status}</td>
        <td className="px-4 py-4 flex justify-center">
          <Image
            src={names.image ? names.image : logo}
            alt="photo"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "150px", height: "150px" }}
            className="object-contain"
          />
        </td>

        <td className="px-4 py-4">
          <Image
            src={names.logo ? names.logo : logo}
            alt="photo"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "150px", height: "150px" }}
            className="object-contain"
          />
        </td>

        <td className="px-4 py-4">
          {names.store_type ? names.store_type : names.store_type_id}
        </td>
        <td className="px-4 py-4">
          {days &&
            days.map((day) => {
              return `${day}, `;
            })}
        </td>
        <td className="px-4 py-4">{names.address}</td>
        <td className="px-4 py-4">{names.street}</td>
        <td>{names.area}</td>
        <td>{convertDateStringToDate(names.created_at)}</td>
        <td>{convertDateStringToDate(names.updated_at)}</td>
      </tr>

      <Dialog
        open={isEditing}
        onClose={() => {
          setIsEditing(false);
        }}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle className="flex justify-between border-b-2 border-black">
          <h4 className="text-gray-500 md:pl-6 font-medium">
            Edit Store : {names.name_en}
          </h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            {isLoading == true ? (
              <div className="w-full h-full">
                <TawasyLoader width={200} height={200} />
              </div>
            ) : (
              <div className="md:grid md:grid-cols-2 gap-6">
                <div className="flex w-full items-center">
                  <label className="text-lg w-[30%] px-2">NameAr :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="text"
                    defaultValue={names.name_ar}
                    ref={newNameAr}
                    required
                  />
                </div>

                <div className="flex items-center">
                  <label className="text-lg w-[30%] px-2">NameEn :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="text"
                    defaultValue={names.name_en}
                    ref={newNameEn}
                    required
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">opening Time :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="time"
                    defaultValue={names.opening_time}
                    ref={NewopeningTime}
                    required
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">Closing Time :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="time"
                    defaultValue={names.closing_time}
                    ref={newClosingTime}
                    required
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">Store Type :</label>
                  <select
                    className="w-[80%] form-select outline-none bg-transparent border-b-2 border-gray-300 "
                    aria-label="Store Type"
                    name="Store Type"
                    defaultValue={storeType}
                    onChange={(e) => {
                      setStoreType(e.target.value);
                    }}
                  >
                    <option
                      className="bg-white text-center "
                      disabled
                      selected
                      value
                    >
                      Select a Store Type
                    </option>
                    {storeTypes &&
                      storeTypes.map((storeType) => {
                        return (
                          <option key={storeType.id} value={storeType.name_en}>
                            {storeType.name_en}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">Status :</label>
                  <select
                    className="w-[80%] form-select outline-none bg-transparent border-b-2 border-gray-300 "
                    aria-label="Status"
                    name="Status"
                    defaultValue={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                  >
                    <option
                      className="bg-white text-center "
                      disabled
                      selected
                      value
                    >
                      Select a Status
                    </option>
                    <option className="bg-white" value="approved">
                      Approved
                    </option>
                    <option className="bg-white" value="pending">
                      Pending
                    </option>
                  </select>
                </div>

                <div className="flex flex-col justify-start items-start ">
                  <div className="w-full flex justify-center items-center">
                    <label className="w-[30%] text-lg px-2">
                      opening Days :
                    </label>
                    <input
                      className="my-3 w-full text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                      type="text"
                      placeholder={checkedDays}
                      // ref={newOpeningDays}
                      value={checkedDays.join(", ")}
                      required
                    />
                  </div>
                  <fieldset className="grid grid-cols-3 w-[90%] mx-auto">
                    {openingDays.map((oDay) => {
                      return (
                        <label key={oDay} className="px-1 select-none">
                          <input
                            type="checkbox"
                            className="select-none"
                            name={oDay}
                            value={oDay}
                            checked={checkedDays.includes(oDay)}
                            onChange={handleCheckboxChange}
                          />
                          {oDay}
                        </label>
                      );
                    })}
                  </fieldset>
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">Published :</label>
                  <select
                    className="w-[80%] form-select outline-none bg-transparent border-b-2 border-gray-300 "
                    aria-label="Status"
                    name="Status"
                    defaultValue={published}
                    onChange={(e) => {
                      setPublished(e.target.value);
                    }}
                  >
                    <option
                      className="bg-white text-center "
                      disabled
                      selected
                      value
                    >
                      Select a publish state
                    </option>
                    <option className="bg-white" value={1}>
                      Published
                    </option>
                    <option className="bg-white" value={0}>
                      Coming Soon
                    </option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">Address :</label>
                  <Locations
                    onLocation={handlesAddress}
                    defaultAddress={names.address}
                    className={`"mb-4 outline-none text-zinc-500 bg-transparent border-b-2 border-text-zinc-500 cursor-pointer placeholder:text-zinc-500 `}
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">Area :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="numbere"
                    defaultValue={names.area}
                    ref={newArea}
                    required
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-[30%] text-lg px-2">Street :</label>
                  <input
                    className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="numbere"
                    defaultValue={names.street}
                    ref={newStreet}
                    required
                  />
                </div>

                <div className="flex flex-col justify-start items-start ">
                  <div className="flex items-center w-full justify-start ">
                    <label className="w-[30%] text-lg px-2">
                      Free Delivery :
                    </label>
                    <input
                      className="my-3  text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                      type="checkbox"
                      checked={freeDelivery}
                      onChange={() => {
                        setFreeDelivery((prev) => {
                          if (prev == 1) {
                            return 0;
                          } else {
                            return 1;
                          }
                        });
                      }}
                      required
                    />
                  </div>
                  {freeDelivery == 1 && (
                    <div className="flex items-center">
                      <label className="w-[30%] text-lg px-2">Radius :</label>
                      <input
                        className="my-3 w-[70%] text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                        type="text"
                        defaultValue={names.radius ?? null}
                        ref={radius}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <label>Store Image</label>
                  <ImageUpload
                    onSelectImage={handleStoreImage}
                    width={100}
                    height={100}
                    defaultImage={names.image}
                  />
                </div>

                <div className="flex items-center">
                  <label>Store Logo</label>
                  <ImageUpload
                    onSelectImage={handleLogoImage}
                    width={100}
                    height={100}
                    defaultImage={names.logo}
                  />
                </div>
              </div>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="bg-lime-950 px-8 py-3 text-white rounded-lg "
            data-dismiss="modal"
            onClick={saveEdits}
          >
            {isSaving == true ? (
              <div className="w-full flex justify-center">
                <Ring size={20} lineWeight={5} speed={2} color="white" />
              </div>
            ) : (
              `Save`
            )}
          </button>
          <button
            type="button"
            className="bg-zinc-500 px-8 py-3 text-white rounded-lg"
            data-dismiss="modal"
            onClick={() => {
              setIsEditing(false);
            }}
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleting}
        onClose={() => {
          setIsDeleting(false);
        }}
        fullWidth
      >
        <DialogTitle className="flex justify-between border-b-2 border-black ">
          <h4 className="">Delete Store:</h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <div className="flex flex-col justify-start items-start w-full ">
              <p className="text-lg ">
                Are you sure you want to delete this Store ?
              </p>
              <p className="text-xl pt-4">{names.name_en}</p>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="bg-green-700 px-8 py-3 text-white rounded-lg "
            data-dismiss="modal"
          >
            {deleting == true ? (
              <div className="flex justify-center items-center">
                <Ring size={25} lineWeight={5} speed={2} color="white" />
              </div>
            ) : (
              "Yes"
            )}
          </button>
          <button
            type="button"
            className="bg-zinc-500 px-8 py-3 text-white rounded-lg"
            data-dismiss="modal"
            onClick={() => {
              setIsDeleting(false);
            }}
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default StoreAdmin;

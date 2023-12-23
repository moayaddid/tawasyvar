import withLayoutCustomer from "@/components/wrapping components/WrappingCustomerLayout";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { MdCheck, MdClose, MdModeEditOutline } from "react-icons/md";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import Locations from "@/components/Location/Location";
import { NextSeo } from "next-seo";
import Cookies from "js-cookie";

function MyProfile() {
  const router = useRouter();
  const nameRef = useRef();
  const phoneRef = useRef();
  // const addressRef = useRef();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSavingName, setisSavingName] = useState(false);
  const [isSavingPhone, setisSavingPhones] = useState(false);
  const [isSavingAddress, setisSavingAddress] = useState(false);
  const [address, setAddress] = useState();
  const Api = createAxiosInstance(router);
  const {
    data: profile,
    isLoading,
    refetch,
  } = useQuery(`profile`, fetchProfileData, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchProfileData() {
    try {
      return await Api.get(`/api/customer/profile`);
    } catch (error) {}
  }

  const { t } = useTranslation("");

  const handleSaveNameClick = async (e) => {
    e.preventDefault();
    setisSavingName(true);
    try {
      const response = await Api.put(`/api/customer/edit-profile`, {
        name: nameRef.current.value,
      });
      refetch();
      setIsEditingName(false);
      setisSavingName(false);
    } catch (error) {
      setIsEditingName(false);
    }
    setIsEditingName(false);
    setisSavingName(false);
  };
  const handleSavePhoneClick = async (e) => {
    e.preventDefault();
    setisSavingPhones(true);
    try {
      const response = await Api.post(`/api/customer/change-phone-number`, {
        new_phone_number: phoneRef.current.value,
      });
      Cookies.set(`number`, phoneRef.current.value, { expires: 365 * 10 });
      router.push(`/verification`);
      refetch();
      setIsEditingPhone(false);
      setisSavingPhones(false);
    } catch (error) {
      setIsEditingPhone(false);
    }
    setIsEditingPhone(false);
    setisSavingPhones(false);
  };
  const handleSaveAddressClick = async () => {
    setisSavingAddress(true);
    try {
      const response = await Api.put(`/api/customer/edit-profile`, {
        location: address.address,
        longitude: address.lng,
        latitude: address.lat,
      });
      refetch();
      setIsEditingAddress(false);
      setisSavingAddress(false);
    } catch (error) {
      setIsEditingAddress(false);
    }
    setIsEditingAddress(false);
    setisSavingAddress(false);
  };

  function getAddress(data) {
    setAddress(data);
  }

  function Logout() {
    Cookies.remove("AT");
    Cookies.remove("user");
    router.replace(`/login`);
  }

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={400} height={400} />
      </div>
    );
  }

  return (
    <div>
      <NextSeo
        title={t("titles.profile")}
        description={t("descs.profile")}
        canonical="https://tawasyme.coms/MyProfile"
      />
      <h1 className="border-b-2 border-gray-300 py-4 text-2xl text-gray-700 font-medium px-7">
        {/* {`My Profile`} */}
        {t("profile.myprofile")}
      </h1>
      <div>
        <p
          className="flex items-center w-max mx-7 text-xl text-skin-primary cursor-pointer select-none  "
          onClick={() => {
            router.back();
          }}
        >
          <BiArrowBack className=" w-[25px] h-[20px] mr-2 mb-[-5px]" />
          {/* <p>{`Back`}</p> */}
          <p>{t("profile.back")}</p>
        </p>
      </div>
      {profile && (
        <div className="py-7 flex justify-center items-center md:w-full w-[90%] mx-auto">
          <div>
            <form
              onSubmit={handleSaveNameClick}
              className="flex justify-between items-center md:w-[500px] w-auto mb-4"
            >
              <div className="flex">
                <label className="md:text-xl text-base text-gray-700 font-medium pr-2 w-24">
                  {/* {`Name`} : */}
                  {t("profile.name")} :
                </label>
                {isEditingName ? (
                  <input
                    className="border-b-2 placeholder:text-base border-skin-primary outline-none"
                    type="text"
                    placeholder={profile.data.customer.name}
                    ref={nameRef}
                    required
                  />
                ) : (
                  <p className="capitalize text-xl text-gray-500 font-medium">
                    {profile.data.customer.name}
                  </p>
                )}
              </div>
              <div>
                {isEditingName ? (
                  isSavingName == true ? (
                    <Ring size={20} lineWeight={5} speed={2} color="#ff6600" />
                  ) : (
                    // <button onClick={handleSaveNameClick}>Save</button>
                    <div className="flex items-center gap-3">
                      <button type="submit">
                        <MdCheck className="w-[20px] h-[20px] cursor-pointer text-green-600 border-b-2 border-transparent hover:border-green-600 transition-all duration-500 " />
                      </button>
                      <MdClose
                        onClick={() => {
                          setIsEditingName(false);
                        }}
                        className="w-[20px] h-[20px] cursor-pointer text-red-600 border-b-2 border-transparent hover:border-red-600 transition-all duration-500"
                      />
                    </div>
                  )
                ) : (
                  <MdModeEditOutline
                    className="w-[20px] h-[20px] text-gray-500 cursor-pointer border-b-2 border-transparent hover:border-gray-500 transition-all duration-500"
                    onClick={() => {
                      setIsEditingName(true);
                    }}
                  />
                )}
              </div>
            </form>

            <form
              onSubmit={handleSavePhoneClick}
              className="flex justify-between md:w-[500px] w-auto mb-4"
            >
              <div className="flex justify-between items-center">
                <label className="md:text-xl text-base w-max text-gray-700 font-medium pr-2 ">
                  {/* {`Phone`} : */}
                  {t("profile.phone")} :
                </label>
                {isEditingPhone ? (
                  <input
                    className="border-b-2 border-skin-primary outline-none  px-2"
                    type="number"
                    placeholder={profile.data.customer.phone_number}
                    ref={phoneRef}
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    }}
                    required
                    maxLength={10}
                    minLength={10}
                  />
                ) : (
                  <p className="capitalize text-xl text-gray-500 font-medium">
                    {profile.data.customer.phone_number}
                  </p>
                )}
              </div>
              <div>
                {isEditingPhone ? (
                  isSavingPhone == true ? (
                    <Ring size={20} lineWeight={5} speed={2} color="#ff6600" />
                  ) : (
                    <div className="flex items-center gap-3">
                      <button type="submit">
                        <MdCheck className="w-[20px] h-[20px] cursor-pointer text-green-600 border-b-2 border-transparent hover:border-green-600 transition-all duration-500 " />
                      </button>
                      <MdClose
                        onClick={() => {
                          setIsEditingPhone(false);
                        }}
                        className="w-[20px] h-[20px] cursor-pointer text-red-600 border-b-2 border-transparent hover:border-red-600 transition-all duration-500"
                      />
                    </div>
                  )
                ) : (
                  <MdModeEditOutline
                    className="w-[20px] h-[20px] text-gray-500 cursor-pointer border-b-2 border-transparent hover:border-gray-500 transition-all duration-500"
                    onClick={() => {
                      setIsEditingPhone(true);
                    }}
                  />
                )}
              </div>
            </form>

            <div className="flex justify-between md:w-[500px] w-auto mb-4">
              <div className="flex">
                <label className="md:text-xl text-base text-gray-700 font-medium pr-2 w-24">
                  {/* {`Address`} : */}
                  {t("profile.address")} :
                </label>
                {isEditingAddress ? (
                  <Locations
                    onLocation={getAddress}
                    className={
                      "mb-4 outline-none bg-transparent border-b-2 border-gray-500 text-gray-500 w-full cursor-pointer placeholder:text-gray-500 "
                    }
                  />
                ) : (
                  <p className="capitalize text-xl text-gray-500 font-medium">
                    {profile.data.customer.location}
                  </p>
                )}
              </div>
              <div>
                {isEditingAddress ? (
                  isSavingAddress == true ? (
                    <Ring size={20} lineWeight={5} speed={2} color="#ff6600" />
                  ) : (
                    <div className="flex items-center gap-3">
                      <MdCheck
                        onClick={handleSaveAddressClick}
                        className="w-[20px] h-[20px] cursor-pointer text-green-600 border-b-2 border-transparent hover:border-green-600 transition-all duration-500 "
                      />
                      <MdClose
                        onClick={() => {
                          setIsEditingAddress(false);
                        }}
                        className="w-[20px] h-[20px] cursor-pointer text-red-600 border-b-2 border-transparent hover:border-red-600 transition-all duration-500"
                      />
                    </div>
                  )
                ) : (
                  <MdModeEditOutline
                    className="w-[20px] h-[20px] text-gray-500 cursor-pointer border-b-2 border-transparent hover:border-gray-500 transition-all duration-500"
                    onClick={() => {
                      setIsEditingAddress(true);
                    }}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-center w-full my-7">
              <button
                className="border-2 border-skin-primary text-skin-primary hover:bg-skin-primary hover:text-white rounded-full w-full py-2"
                onClick={Logout}
              >
                {/* {`Logout`} */}
                {t("profile.logout")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withLayoutCustomer(MyProfile);

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

import React, { useState, useEffect, useRef } from "react";
import withLayoutAdmin from "@/components/UI/adminLayout";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import BrandAdmin from "@/components/AdminBrands/BrandAdmin";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { Ring } from "@uiball/loaders";
import Variation from "@/components/AdminVariations/Variation";
import Option from "@/components/AdminVariations/Option";

const tableheading = [
  {
    heading: "English Name",
  },
  {
    heading: "Arabic Name",
  },
  {
    heading: "Created At",
  },
  {
    heading: "Updated At",
  },
  {
    heading: "Action",
  },
];

const tableheadingOptions = [
  {
    heading: "Variation Name",
  },
  {
    heading: "English Name",
  },
  {
    heading: "Arabic Name",
  },
  {
    heading: "Action",
  },
];

function AdminVariations() {
  const [openVariation, openchange] = useState(false);
  const [openOption, setOpenOption] = useState(false);
  const router = useRouter();
  const [addingVariation, setAddingVariation] = useState(false);
  const [addingOption, setAddingOption] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState();
  const Api = createAxiosInstance(router);
  const VariationArNameRef = useRef();
  const VariationEnNameRef = useRef();
  const OptionArNameRef = useRef();
  const OptionEnNameRef = useRef();
  const {
    data: variations,
    isLoading: isLoadingVariations,
    refetch: refetchVariations,
  } = useQuery(`variations`, fetchVariations, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // const {
  //   data: options,
  //   isLoading: isLoadingOptions,
  //   refetch: refetchOptions,
  // } = useQuery(`options`, fetchOptions, {
  //   staleTime: 1,
  //   refetchOnMount: true,
  //   refetchOnWindowFocus: false,
  // });

  // async function fetchOptions() {
  //   try {
  //     return await Api.get(`/api/admin/options`);
  //   } catch (error) {}
  // }

  async function fetchVariations() {
    try {
      return await Api.get(`/api/admin/attributes`);
    } catch (error) {}
  }

  const functionopenpopup = async () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };

  //   async function openAddOption () {}

  async function addVariation(e) {
    e.preventDefault();
    setAddingVariation(true);
    try {
      const response = await Api.post(`/api/admin/attribute/create`, {
        name_ar: VariationArNameRef.current.value,
        name_en: VariationEnNameRef.current.value,
      });
      refetchVariations();
      openchange(false);
      setAddingVariation(false);
    } catch (error) {
      setAddingVariation(false);
    }
    setAddingVariation(false);
  }

  async function addOption(e) {
    // console.log(`in add option`);
    e.preventDefault();
    setAddingOption(true);
    // console.log(`sdsdf`)
    // console.log(selectedVariation);
    try {
      const response = await Api.post(`/api/admin/option/create`, {
        attribute_name: selectedVariation,
        value_ar: OptionArNameRef.current.value,
        value_en: OptionEnNameRef.current.value,
      });
      refetchOptions();
      setOpenOption(false);
      setAddingOption(false);
    } catch (error) {
      setAddingOption(false);
    }
    setAddingOption(false);
  }

  if (isLoadingVariations) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={400} height={400} />
      </div>
    );
  }

  return (
    <div className="md:px-6">
      <div className="h-screen">
        <div className="py-5 px-5">
          <div className="flex justify-between space-x-2 ">
            <h1 className="text-3xl p-3">Variations :</h1>
            <div className="flex justify-end items-center space-x-3">
              <div className="w-max flex justify-end ">
                <button
                  onClick={functionopenpopup}
                  className="bg-skin-primary text-white py-1 px-3 rounded-md"
                >
                  Add a Variation
                </button>
              </div>
              <div className="w-max flex justify-end ">
                <button
                  onClick={() => {
                    setOpenOption(true);
                  }}
                  className="bg-skin-primary text-white py-1 px-3 rounded-md"
                >
                  Add an Option
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Variations */}
        {/* <h1 className="text-3xl p-3">Variations :</h1> */}
        {variations && (
          <div className="w-full  overflow-x-auto ">
            {variations.data && variations.data.data.length > 0 ? (
              <table className="w-full overflow-x-auto table-auto">
                <thead className="">
                  <tr className="text-sm font-semibold text-center border-b-2 border-gray-400 uppercase">
                    <th>Id</th>
                    {tableheading.map((index) => (
                      <th className="px-4 " key={index.id}>
                        {index.heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-lg font-normal text-gray-700 text-center">
                  {variations.data.data.map((variation) => {
                    return (
                      <Variation
                        variation={variation}
                        key={variation.id}
                        refetch={() => {
                          refetchVariations();
                          refetchOptions();
                        }}
                      />
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="w-max mx-auto"> There are no Variations. </div>
            )}
          </div>
        )}
        {/* Variation Options */}
        {/* <h1 className="text-3xl p-3 mt-3">Variation Options :</h1>
        {options && (
          <div className="w-full max-h-[40%] overflow-x-auto ">
            {options.data && options.data.data.length > 0 ? (
              <table className="w-full overflow-x-auto table-auto">
                <thead className="">
                  <tr className="text-sm font-semibold text-center border-b-2 border-gray-400 uppercase">
                    <th>Id</th>
                    {tableheadingOptions.map((index) => (
                      <th className="px-4 " key={index.id}>
                        {index.heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-lg font-normal text-gray-700 text-center">
                  {options.data.data.map((option) => {
                    return (
                      <Option
                        option={option}
                        key={option.id}
                        refetch={() => {
                          refetchOptions();
                        }}
                      />
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="w-max mx-auto">
                {" "}
                There are no Variation Options.{" "}
              </div>
            )}
          </div>
        )} */}
      </div>

      <Dialog
        open={openVariation}
        onClose={closepopup}
        fullWidth
        maxWidth="md"
        dir="ltr"
      >
        <DialogTitle className=" border-b-2 border-gray-200">
          <h3 className="py-2 pl-3 text-gray-600">Create New Variation</h3>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} margin={2}>
            <form onSubmit={addVariation}>
              <div className="md:grid md:grid-cols-2 sm:grid-cols-1 items-center">
                <div className="w-full px-4 py-3">
                  <input
                    type="text"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] w-full transition-all duration-700"
                    placeholder="Arabic Variation name"
                    inputMode="text"
                    ref={VariationArNameRef}
                    required
                  />
                </div>
                <div className="w-full px-4 py-3">
                  <input
                    type="text"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] w-full transition-all duration-700"
                    placeholder="English Variation name"
                    inputMode="text"
                    ref={VariationEnNameRef}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-start pt-6">
                <button
                  className="bg-skin-primary rounded-md text-white px-8 py-2"
                  type="submit"
                >
                  {addingVariation == true ? (
                    <div className="w-full flex justify-center">
                      <Ring size={20} speed={2} lineWeight={5} color="white" />
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
        open={openOption}
        onClose={() => {
          setOpenOption(false);
        }}
        fullWidth
        maxWidth="md"
        dir="ltr"
      >
        <DialogTitle className=" border-b-2 border-gray-200">
          <h3 className="py-2 pl-3 text-gray-600">Create New Option</h3>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} margin={2}>
            <form onSubmit={addOption}>
              <div className="md:grid md:grid-cols-2 sm:grid-cols-1 items-center">
                <div className="w-full px-4 py-3">
                  <input
                    type="text"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] w-full transition-all duration-700"
                    placeholder="Arabic Variation name"
                    inputMode="text"
                    ref={OptionArNameRef}
                    required
                  />
                </div>
                <div className="w-full px-4 py-3">
                  <input
                    type="text"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] w-full transition-all duration-700"
                    placeholder="English Variation name"
                    inputMode="text"
                    ref={OptionEnNameRef}
                    required
                  />
                </div>
                <div className="w-full px-4 py-3">
                  <select
                    onChange={(e) => {
                      setSelectedVariation(e.target.value);
                    }}
                    required
                    className="md:w-[400px] w-full  form-select outline-none bg-transparent border-b-2 border-gray-300 "
                    aria-label="Variation"
                    name="variation"
                  >
                    <option selected value disabled>
                      Select a Variation for the new Option
                    </option>
                    {variations &&
                      variations.data.data &&
                      variations.data.data.length > 0 &&
                      variations.data.data.map((variation, i) => {
                        return (
                          <option key={i} value={variation.name_en}>
                            {variation.name_en}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
              <div className="flex justify-start pt-6">
                {addingOption == true ? (
                  <div className="w-full flex justify-center">
                    <Ring size={25} speed={2} lineWeight={5} color="#ff6600" />
                  </div>
                ) : (
                  <button
                    className="bg-skin-primary rounded-md text-white px-8 py-2"
                    type="submit"
                  >
                    Save
                  </button>
                )}
              </div>
            </form>
          </Stack>
        </DialogContent>

        <DialogActions className="grid md:grid-cols-2 grid-cols-1 "></DialogActions>
      </Dialog>
    </div>
  );
}

export default withLayoutAdmin(AdminVariations);

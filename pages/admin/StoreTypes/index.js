import React, { useRef, useState } from "react";
import withLayoutAdmin from "@/components/UI/adminLayout";
import item1 from "../../../public/images/kuala.jpg";
import StoreTypeAdmin from "@/components/AdminStoreType/StoreTypeAdmin";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import ChooseFile from "../../images/choose_file - Copy.png";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { Ring } from "@uiball/loaders";
import { MdArrowForward, MdClose } from "react-icons/md";

const tableheading = [
  {
    heading: "Name Ar",
  },
  {
    heading: "Name En",
  },
  {
    heading: "Desc Ar",
  },
  {
    heading: "Desc En",
  },
  {
    heading: "Sort Order",
  },
  {
    heading: "Image",
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

const storeTypes = [
  {
    id: 1,
    nameAr: "lorem1",
    nameEn: "lorem1",
    sortOrder: "5",
    image: item1,
    created_at: "5/4/2013",
    updated_at: "5/4/2013",
  },
  {
    id: 2,
    nameAr: "lorem2",
    nameEn: "lorem2",
    sortOrder: "25",
    image: item1,
    created_at: "5/4/2013",
    updated_at: "5/4/2013",
  },
  {
    id: 3,
    nameAr: "lorem3",
    nameEn: "lorem3",
    sortOrder: "25",
    image: item1,
    created_at: "5/4/2013",
    updated_at: "5/4/2013",
  },
  {
    id: 4,
    nameAr: "lorem4",
    nameEn: "lorem3",
    sortOrder: "25",
    image: item1,
    created_at: "5/4/2013",
    updated_at: "5/4/2013",
  },
  {
    id: 5,
    nameAr: "lorem5",
    nameEn: "lorem3",
    sortOrder: "25",
    image: item1,
    created_at: "5/4/2013",
    updated_at: "5/4/2013",
  },
];

function StoreType() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [isAdding, setIsAdding] = useState(false);
  const arNameRef = useRef();
  const enNameRef = useRef();
  const sortRef = useRef();
  const descArRef = useRef();
  const descEnRef = useRef();
  const [searchedResults, setSearchedResults] = useState();
  const searchRef = useRef();
  const [inSearch, setInSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [storeTypeImage, setStoreTypeImage] = useState();
  const {
    data: storeTypes,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery(`storeTypes`, fetchStoreTypes, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchStoreTypes() {
    try {
      return await Api.get(`/api/admin/store-types/all`);
    } catch (error) {}
  }

  const [open, openchange] = useState(false);

  const functionopenpopup = async () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };

  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleStoreTypeImage = (data) => {
    setStoreTypeImage(data);
  };

  async function addStoreType(e) {
    e.preventDefault();
    setIsAdding(true);
    try {
      const reposnse = await Api.post(
        `/api/admin/store-type/create`,
        {
          name_ar: arNameRef.current.value,
          name_en: enNameRef.current.value,
          image: storeTypeImage,
          description_ar : descArRef.current.value,
          description_en : descEnRef.current.value,
          sort_order: sortRef.current.value,
        },
        {
          headers: { "Content-Type": `multipart/form-data` },
        }
      );
      refetch();
      setIsAdding(false);
      openchange(false);
    } catch (error) {
      setIsAdding(false);
    }
    setIsAdding(false);
  }

  async function search(e) {
    e.preventDefault();
    setSearching(true);
    try {
      const response = await Api.get(`/api/admin/storeTypes/searchByName`, {
        params: { search: searchRef.current.value },
        noSuccessToast: true,
      });
      const component =
        response.data.data.length < 1 ? (
          <div className="w-max mx-auto">{response.data.message}</div>
        ) : (
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
              {response.data.data &&
                response.data.data.map((customer) => {
                  return (
                    <StoreTypeAdmin
                      names={customer}
                      key={customer.id}
                      refetch={() => {
                        refetch();
                      }}
                    />
                  );
                })}
            </tbody>
          </table>
        );
      setSearchedResults(component);
      setSearching(false);
    } catch (error) {
      setSearching(false);
    }
    setSearching(false);
  }

  if(storeTypes){
    console.log(storeTypes);
  }

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={400} height={400} />
      </div>
    );
  }

  return (
    <div className="md:px-6">
      <div className="h-screen">
        <div className="m-5 p-5">
          <h2 className="text-2xl text-stone-500 pb-5 ">Store Type</h2>
          <div className="flex justify-between items-center">
            <div
              className="w-[80%] flex justify-center items-center gap-2 mx-auto mb-7 "
              dir="ltr"
            >
              <form
                onSubmit={search}
                className="flex bg-gray-100 w-full sm:w-2/5 items-center rounded-lg px-2 border-2 border-transparent focus-within:border-skin-primary transition-all duration-700 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  className="w-full bg-gray-100 outline-none rounded-lg text-sm h-10  "
                  type="text"
                  ref={searchRef}
                  placeholder="Search store types by name"
                  onClick={() => {
                    setInSearch(true);
                  }}
                  required
                />
                <button type="submit">
                  <MdArrowForward
                    // onClick={search}
                    className="hover:border-b-2 border-skin-primary cursor-pointer"
                  />
                </button>
              </form>
              {inSearch == true && (
                <MdClose
                  className="text-red-500 hover:text-red-600 w-[25px] h-[25px] hover:border-b-2 hover:border-red-600 cursor-pointer "
                  onClick={() => {
                    setInSearch(false);
                  }}
                />
              )}
            </div>
            <button
              className="px-3 py-1 bg-skin-primary text-white rounded-lg "
              onClick={functionopenpopup}
            >
              Add new store type
            </button>
          </div>
        </div>

        {inSearch == false && (
          <div className="w-full h-[70%] overflow-x-auto ">
            {storeTypes && storeTypes.data.data.length > 0 ? (
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
                  {storeTypes.data.data.map((storeType) => {
                    return (
                      <StoreTypeAdmin
                        names={storeType}
                        key={storeType.id}
                        refetch={() => {
                          refetch();
                        }}
                      />
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>There are no storetypes . </p>
            )}
          </div>
        )}

        {inSearch == true &&
          (searching == true ? (
            <div className="w-full h-full">
              <TawasyLoader width={300} height={300} />
            </div>
          ) : (
            <div className="w-full min-h-[500px]">
              {searchedResults && searchedResults}
            </div>
          ))}
      </div>

      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="md">
        <DialogTitle className=" border-b-2 border-gray-200">
          <h3 className="py-2 pl-3 text-gray-600">Create New Store Type</h3>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} margin={2}>
            <form onSubmit={addStoreType}>
              <div className="md:grid md:grid-cols-2 sm:grid-cols-1 items-center">
                <div className="w-full px-4 py-3">
                  <input
                    type="text"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] w-full transition-all duration-700"
                    placeholder="Arabic name"
                    inputMode="Arabic name"
                    ref={arNameRef}
                    required
                  />
                </div>

                <div className="w-full px-4 py-3">
                  <input
                    type="text"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] w-full transition-all duration-700"
                    placeholder="English name"
                    inputMode="name en"
                    ref={enNameRef}
                    required
                  />
                </div>

                <div className="w-full px-4 py-3">
                  <input
                    type="number"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500]  w-full transition-all duration-700"
                    placeholder="Sort order"
                    inputMode="sort order"
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    }}
                    ref={sortRef}
                    required
                  />
                </div>

                <div className="w-full px-4 py-3">
                  <textarea
                    type="text"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500]  w-full transition-all duration-700"
                    placeholder="Arabic Store type Description"
                    inputMode="text"
                    ref={descArRef}
                    required
                  />
                </div>

                <div className="w-full px-4 py-3">
                  <textarea
                    type="text"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500]  w-full transition-all duration-700"
                    placeholder="English Store type Description"
                    inputMode="text"
                    ref={descEnRef}
                    required
                  />
                </div>

                <ImageUpload
                  onSelectImage={handleStoreTypeImage}
                  width={100}
                  height={100}
                />
              </div>

              <div className="flex justify-start pt-6">
                <button
                  className="bg-skin-primary rounded-md text-white px-8 py-2"
                  type="submit"
                >
                  {isAdding == true ? (
                    <div className="w-full flex justify-center">
                      <Ring size={20} speed={2} lineWeight={5} color="white" />
                    </div>
                  ) : (
                    `Add Store Type`
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

export default withLayoutAdmin(StoreType);

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

const tableheading = [
  {
    heading: "Name",
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

function Brands() {
  const [open, openchange] = useState(false);
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const Api = createAxiosInstance(router);
  const brandNameRef = useRef();
  const {
    data: brands,
    isLoading,
    refetch,
  } = useQuery(`brands`, fetchBrands, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchBrands() {
    try {
      return await Api.get(`/api/admin/brands`);
    } catch (error) {}
  }

  const functionopenpopup = async () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };

  async function addBrand(e) {
    e.preventDefault();
    setAdding(true);
    try {
      const response = await Api.post(`/api/admin/brand/create`, {
        name: brandNameRef.current.value,
      });
      refetch();
      openchange(false);
      setAdding(false);
    } catch (error) {
      setAdding(false);
    }
    setAdding(false);
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
          <h2 className="text-2xl text-stone-500 pb-5 ">Brands</h2>
          <div className="flex justify-end ">
            <div className="w-[50%] flex justify-end ">
              <button
                onClick={functionopenpopup}
                className="bg-skin-primary text-white py-1 px-3 rounded-md"
              >
                Add Brands
              </button>
            </div>
          </div>
        </div>

        {brands && (
          <div className="w-full h-[70%] overflow-x-auto ">
            {brands.data && brands.data.brands.length > 0 ? (
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
                  {brands.data.brands.map((brand) => {
                    return (
                      <BrandAdmin
                        names={brand}
                        key={brand.id}
                        refetch={() => {
                          refetch();
                        }}
                      />
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="w-max mx-auto"> There are no brands. </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="md">
        <DialogTitle className=" border-b-2 border-gray-200">
          <h3 className="py-2 pl-3 text-gray-600">Create New Brand</h3>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} margin={2}>
            <form onSubmit={addBrand}>
              <div className="md:grid md:grid-cols-2 sm:grid-cols-1 items-center">
                <div className="w-full px-4 py-3">
                  <input
                    type="text"
                    className="outline-none appearance-none border-b-2 border-gray-300 focus:border-[#FD6500] w-full transition-all duration-700"
                    placeholder="Brand name English - arabic"
                    inputMode="Brand name"
                    ref={brandNameRef}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-start pt-6">
                <button
                  className="bg-skin-primary rounded-md text-white px-8 py-2"
                  type="submit"
                >
                  {adding == true ? (
                    <div className="w-full flex justify-center">
                      <Ring size={20} speed={2} lineWeight={5} color="white" />
                    </div>
                  ) : (
                    `Add Brand`
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

export default withLayoutAdmin(Brands);

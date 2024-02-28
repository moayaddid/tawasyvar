import createAxiosInstance from "@/API";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import AdminVendorBrand from "../AdminVendor/AdminVendorBrand";
import { useQuery } from "react-query";
import { Ring } from "@uiball/loaders";

function VendorBrandAddition({ brands, refetchBrands, vendorId , allBrands }) {
  const [selectedBrand, setSelectedBrand] = useState();
  const [addBrand, setAddBrand] = useState(false);
  const [savingBrand, setSavingBrand] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);
//   const {} = useQuery(`Brands` , fetchBrands , {})


  async function saveBrand() {
    setSavingBrand(true);
    try {
      const response = await Api.post(`/api/admin/attach-brand-vendor/${vendorId}`, {
        brand_id : selectedBrand
      });
      refetchBrands();
      setAddBrand(false);
      setSavingBrand(false);
    } catch (error) {
      setSavingBrand(false);
    }
    setSavingBrand(false);
  }

  return (
    <div className="flex flex-wrap justify-start items-center gap-2">
      Brands of this Vendor :
      {brands &&
        brands.map((brand) => {
          return (
            <AdminVendorBrand
              key={brand.id}
              brand={brand}
              vendorId={vendorId}
              refetch={() => refetchBrands()}
            />
          );
        })}
      {addBrand == true && (
        <div className="flex justify-start items-center gap-2">
          <select
            className="md:w-[400px] w-full  form-select outline-none bg-transparent border-b-2 border-gray-300 "
            aria-label="Category"
            name="category"
            onChange={(e) => {
              setSelectedBrand(e.target.value);
            }}
            required
          >
            <option
              className="bg-white text-[#C3C7CE] "
              value
              selected
              disabled
            >
              Select a Brand
            </option>
            {allBrands &&
              allBrands.map((brand, i) => {
                return (
                  <option key={i} value={brand.id}>
                    {brand.name}
                  </option>
                );
              })}
          </select>
          {savingBrand == true ? (
            <Ring size={15} speed={2} lineWeight={5} color="#FF6600" />
          ) : (
            <div className="flex justify-start gap-3">
              <MdAdd
                aria-disabled={!selectedBrand}
                className="text-gray-500 hover:text-green-500 w-[15px] h-[17px] border-b-2 border-transparent hover:border-green-500 transition-all duration-700 cursor-pointer "
                onClick={saveBrand}
              />
              <MdClose
                className="text-gray-500 hover:text-red-500 w-[15px] h-[17px] border-b-2 border-transparent hover:border-red-500 transition-all duration-700 cursor-pointer "
                onClick={() => setAddBrand(false)}
              />
            </div>
          )}
        </div>
      )}
      {addBrand == false && (
        <div
          className="flex justify-center text-white items-center bg-gray-500 hover:bg-green-700 rounded-full cursor-pointer px-3 py-1"
          onClick={() => setAddBrand(true)}
        >
          {/* <div className="text-md text-white text-center flex justify-center items-center "> */}
            Add a brand +
          {/* </div> */}
        </div>
      )}
    </div>
  );
}

export default VendorBrandAddition;

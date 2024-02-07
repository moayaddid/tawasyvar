import createAxiosInstance from "@/API";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import AdminVendorBrand from "../AdminVendor/AdminVendorBrand";
import { useQuery } from "react-query";
import { Ring } from "@uiball/loaders";
import AdminVendorStoreType from "../AdminVendor/AdminVendorStoreType";

function VendorStoreTypeAddition({ storeTypes, refetchStoreTypes, vendorId , allStoreTypes }) {
  const [selectedStoreType, setSelectedStoreType] = useState();
  const [addStoreType, setAddStoreType] = useState(false);
  const [savingStoreType, setSavingStoreType] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);

  async function saveBrand() {
    setSavingStoreType(true);
    try {
      const response = await Api.post(`/api/admin/attach-store-type-vendor/${vendorId}`, {
        store_type_id : selectedStoreType
      });
      refetchStoreTypes();
      setAddStoreType(false);
      setSavingStoreType(false);
    } catch (error) {
        setSavingStoreType(false);
    }
    setSavingStoreType(false);
  }

  return (
    <div className="flex flex-wrap justify-start items-center gap-2">
      StoreTypes of this Vendor :
      {storeTypes &&
        storeTypes.map((storeType , i) => {
          return (
            <AdminVendorStoreType
              key={i}
              storeType={storeType}
              vendorId={vendorId}
              refetch={() => refetchStoreTypes()}
            />
          );
        })}
      {addStoreType == true && (
        <div className="flex justify-start items-center gap-2">
          <select
            className="md:w-[400px] w-full  form-select outline-none bg-transparent border-b-2 border-gray-300 "
            aria-label="Category"
            name="category"
            onChange={(e) => {
              setSelectedStoreType(e.target.value);
            }}
            required
          >
            <option
              className="bg-white text-[#C3C7CE] "
              value
              selected
              disabled
            >
              Select a StoreType
            </option>
            {allStoreTypes &&
              allStoreTypes.map((storeType, i) => {
                return (
                  <option key={i} value={storeType.id}>
                    {storeType.name_en}
                  </option>
                );
              })}
          </select>
          {savingStoreType == true ? (
            <Ring size={15} speed={2} lineWeight={5} color="#FF6600" />
          ) : (
            <div className="flex justify-start gap-3">
              <MdAdd
                aria-disabled={!selectedStoreType}
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
      {addStoreType == false && (
        <div
          className="flex justify-center text-white items-center bg-gray-500 hover:bg-green-700 rounded-full cursor-pointer px-3 py-1"
          onClick={() => setAddStoreType(true)}
        >
          {/* <div className="text-md text-white text-center flex justify-center items-center "> */}
            Add a StoreType +
          {/* </div> */}
        </div>
      )}
    </div>
  );
}

export default VendorStoreTypeAddition;

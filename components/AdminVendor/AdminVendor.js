import { FiEdit } from "react-icons/fi";
import { convertDateStringToDate } from "../AdminOrders/OrderAdmin";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { Ring } from "@uiball/loaders";
import { useRef, useState } from "react";
import createAxiosInstance from "@/API";
import { useRouter } from "next/router";
import TawasyLoader from "../UI/tawasyLoader";
import VendorBrandAddition from "../VendorComponents/vendorBrandAddition";
import { useQuery } from "react-query";
import VendorStoreTypeAddition from "../VendorComponents/vendorStoreTypeAddition";
import AdminNotes from "../AdminComponents/AdminNotes";
import {
  createVendorContacts_endpoint,
  deleteVendorContacts_endpoint,
  editVendorContacts_endpoint,
  getVendorContacts_endpoint,
  getVendorNote_endpoint,
  postVendorNote_endpoint,
} from "@/api/endpoints/endPoints";
import AdminLinks from "../AdminComponents/AdminLinks/AdminLinks";

function AdminVendor({ vendor, refetch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState();
  const [editing, setEditing] = useState();
  const [storetypes, setStoreTypes] = useState();
  const [error, setError] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const nameRef = useRef();
  const companyRef = useRef();
  const numberRef = useRef();
  const cityRef = useRef();
  const locationRef = useRef();

  const {
    data: brandsStoreTypes,
    isLoading,
    refetch: refetchBrandsStoreTypes,
  } = useQuery(`brandsStoreTypes`, fetchBrandsStoreTypes, {
    staleTime: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isEditing,
  });

  async function fetchBrandsStoreTypes() {
    try {
      return await Api.get(`/api/admin/vendor-brands-storetypes/${vendor.id}`);
    } catch (error) {}
  }

  async function editVendor(e) {
    e.preventDefault();
    setEditing(true);
    let editData = {};
    try {
      const addIfDifferent = (fieldValue, fieldName) => {
        const originalValue = vendor[fieldName];
        // console.log(fieldValue);
        if (
          fieldValue !== undefined &&
          fieldValue.trim() !== "" &&
          fieldValue !== originalValue
        ) {
          editData[fieldName] = fieldValue;
        }
      };
      addIfDifferent(nameRef.current.value, "name");
      addIfDifferent(numberRef.current.value, "phone_number");
      addIfDifferent(locationRef.current.value, "location");
      addIfDifferent(cityRef.current.value, "city");
      addIfDifferent(companyRef.current.value, "company_name");
      const response = await Api.put(`/api/admin/vendor-edit/${vendor.id}`, {
        ...editData,
      });
      refetch();
      setIsEditing(false);
    } catch (error) {
      setEditing(false);
    } finally {
      setEditing(false);
    }
  }

  async function deleteVendor() {
    setDeleting(true);
    try {
      const reponse = await Api.delete(`/api/admin/vendor-delete/${vendor.id}`);
      refetch();
      setDeleting(false);
      setIsDeleting(false);
    } catch (error) {
      setDeleting(false);
    }
    setDeleting(false);
  }

  async function openEditor() {
    setIsEditing(true);
    setIsLoading(true);
    try {
      const brands = await Api.get(`/api/admin/brands`);
      setBrands(brands.data.brands);
      const storeTypes = await Api.get(`/api/admin/store-types/all`);
      setStoreTypes(storeTypes.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  return (
    <>
      <tr
        key={vendor.id}
        className="py-10 bg-gray-100 hover:bg-gray-200 font-medium   "
      >
        <td className="px-4 py-4">{vendor.id}</td>
        <td className="px-4 py-4">{vendor.name}</td>
        <td className="px-4 py-4">{vendor.phone_number}</td>
        <td className="px-4 py-4">{vendor.company_name}</td>
        <td className="px-4 py-4">{vendor.city}</td>
        <td className="px-4 py-4">{vendor.location}</td>
        <td className="px-4 py-4  " width={`10%`}>
          {vendor.created_at ? convertDateStringToDate(vendor.created_at) : `-`}
        </td>
        <td className="px-4 py-4" width={`10%`}>
          {convertDateStringToDate(vendor.updated_at)}
        </td>
        <td class="px-4 py-4">
          <div class="flex-col lg:flex-row items-center space-y-2 lg:space-y-0">
            <button
              onClick={openEditor}
              class="items-center px-2 py-2 mx-1 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              <FiEdit />
            </button>
            <button
              class="items-center px-2 py-2 mx-1 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none"
              onClick={() => {
                setIsDeleting(true);
              }}
            >
              <RiDeleteBin6Line />
            </button>
            <AdminNotes
              NotesFor={`${vendor.name} - ${vendor.company_name}`}
              entityId={vendor.id}
              getEndpoint={getVendorNote_endpoint}
              postEndpoint={postVendorNote_endpoint}
              className={`mx-1`}
            />
            <AdminLinks
              editEndPoint={editVendorContacts_endpoint}
              entityId={vendor.id}
              linksFor={vendor.company_name}
              getEndPoint={getVendorContacts_endpoint}
              postEndPoint={createVendorContacts_endpoint}
              resetEndPoint={deleteVendorContacts_endpoint}
            />
          </div>
        </td>
      </tr>

      <Dialog
        open={isEditing}
        onClose={() => {
          setIsEditing(false);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className="flex justify-between border-b-2 border-black">
          <h4 className="text-gray-500 md:pl-6 font-medium">
            Edit Vendor : {vendor.name}
          </h4>
        </DialogTitle>
        <DialogContent>
          {loading == true ? (
            <div className="w-full h-full flex justify-center items-center ">
              <TawasyLoader width={200} height={200} />
            </div>
          ) : (
            <Stack spacing={1} margin={3}>
              <div className="w-full">
                <form
                  className="flex flex-col w-full items-center"
                  onSubmit={editVendor}
                >
                  <div className="flex flex-wrap justify-center items-center w-full">
                    <div className="flex justify-start items-center w-full ">
                      <label className="text-lg px-2">Vendor Name :</label>
                      <input
                        className="my-3 text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                        type="text"
                        defaultValue={vendor.name && vendor.name}
                        placeholder="Vendor Name"
                        ref={nameRef}
                        required
                      />
                    </div>
                    <div className="flex justify-start items-center w-full">
                      <label className="text-lg px-2">
                        Vendor company Name :
                      </label>
                      <input
                        className="my-3 text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                        type="text"
                        placeholder="Vendor Company Name"
                        defaultValue={
                          vendor.company_name && vendor.company_name
                        }
                        ref={companyRef}
                        required
                      />
                    </div>
                    <div className="flex justify-start items-center w-full ">
                      <label className="text-lg px-2">Vendor Number :</label>
                      <input
                        className="my-3 text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                        type="tel"
                        minLength={10}
                        maxLength={10}
                        defaultValue={
                          vendor.phone_number && vendor.phone_number
                        }
                        placeholder="Vendor Number"
                        ref={numberRef}
                        required
                      />
                    </div>
                    <div className="flex justify-start items-center w-full ">
                      <label className="text-lg px-2">Vendor City :</label>
                      <input
                        className="my-3 text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                        type="text"
                        placeholder="Vendor City"
                        defaultValue={vendor.city && vendor.city}
                        ref={cityRef}
                        required
                      />
                    </div>
                    <div className="flex justify-start items-center w-full ">
                      <label className="text-lg px-2">Vendor Location :</label>
                      <input
                        className="my-3 text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                        type="text"
                        placeholder="Vendor Location"
                        defaultValue={vendor.location && vendor.location}
                        ref={locationRef}
                        required
                      />
                    </div>
                  </div>
                  <hr />
                  {/* </form> */}
                  {/* <div className="flex justify-end items-center w-full h-full space-x-3 "  >
                  <button
                    type="submit"
                    className="bg-lime-950 text-center py-3 w-[15%] h-full text-white rounded-lg "
                    data-dismiss="modal"
                    // onClick={editBrand}
                  >
                    {editing == true ? (
                    <div className="w-full flex justify-center">
                      <Ring size={20} lineWeight={4} speed={2} color="white" />
                    </div>
                    ) : (
                       Save
                  )}
                  </button>
                  <button
                    type="button"
                    className="bg-zinc-500 px-8 py-3 text-white text-center rounded-lg"
                    data-dismiss="modal"
                    onClick={() => {
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                </div> */}
                </form>
              </div>
              <div className="flex flex-col justify-start items-start space-y-5 py-3">
                {brandsStoreTypes && brands && (
                  <VendorBrandAddition
                    allBrands={brands}
                    brands={brandsStoreTypes.data.brands}
                    refetchBrands={() => refetchBrandsStoreTypes()}
                    vendorId={vendor.id}
                  />
                )}
                {brandsStoreTypes && storetypes && (
                  <VendorStoreTypeAddition
                    allStoreTypes={storetypes}
                    storeTypes={brandsStoreTypes.data.store_types}
                    refetchStoreTypes={() => refetchBrandsStoreTypes()}
                    vendorId={vendor.id}
                  />
                )}
              </div>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          {editing == true ? (
            <div className="bg-lime-950 px-8 py-3 text-white rounded-lg ">
              <Ring size={25} speed={3} lineWeight={5} color="white" />
            </div>
          ) : (
            <button
              // type="submit"
              onClick={editVendor}
              className="bg-lime-950 px-8 py-3 text-white rounded-lg "
              data-dismiss="modal"
              // onClick={editBrand}
            >
              {/* {editing == true ? (
            <div className="w-full flex justify-center">
              <Ring size={20} lineWeight={4} speed={2} color="white" />
            </div>
             ) : ( */}
              Save
              {/* //  )}  */}
            </button>
          )}
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
          <h4 className="">Delete Vendor:</h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <div className="flex flex-col justify-start items-start w-full ">
              <p className="text-lg ">
                Are you sure you want to delete this Vendor ?
              </p>
              <p className="text-xl pt-4">{vendor.name}</p>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          {deleting == true ? (
            <div className="bg-green-700 px-8 py-3 text-white rounded-lg ">
              <Ring size={25} speed={3} lineWeight={5} color="white" />
            </div>
          ) : (
            <button
              type="button"
              className="bg-green-700 px-8 py-3 text-white rounded-lg "
              data-dismiss="modal"
              onClick={deleteVendor}
            >
              Yes
            </button>
          )}
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

export default AdminVendor;

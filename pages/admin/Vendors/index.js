import createAxiosInstance from "@/API";
import AdminVendor from "@/components/AdminVendor/AdminVendor";
import withLayoutAdmin from "@/components/UI/adminLayout";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useQuery } from "react-query";

const tableheading = [
  {
    heading: "Vendor Name",
  },
  {
    heading: "Number",
  },
  {
    heading: "Company Name",
  },
  {
    heading: "Location",
  },
  {
    heading: "City",
  },
  {
    heading: "Created",
  },
  {
    heading: "Updated   ",
  },
  {
    heading: "Action",
  },
];

const data = [
  {
    id: 1,
    name: `vendor 1`,
    number: `0936467388`,
    company: `Nigga CO.LTD`,
    city: `Damascus`,
    created_at: `-`,
    updated_at: `-`,
  },
];

function Vendors() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [openVendorAdd, setOpenVendorAdd] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const nameRef = useRef();
  const companyNameRef = useRef();
  const numberRef = useRef();
  const cityRef = useRef();
  const locationRef = useRef();
  const {
    data: vendors,
    isLoading,
    refetch,
  } = useQuery(`vendors`, fetchVendors, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
  //   const nameRef = useRef();
  //   const nameRef = useRef();

  async function fetchVendors() {
    try {
      return await Api.get(`/api/admin/vendors`);
    } catch (error) {}
  }

  async function addVendor(e) {
    e.preventDefault();
    // console.log(`adding vendor`);
    setIsAdding(true);
    try {
      const response = await Api.post(`/api/admin/vendor-create`, {
        name: nameRef.current.value,
        phone_number: numberRef.current.value,
        location: locationRef.current.value,
        city: cityRef.current.value,
        company_name: companyNameRef.current.value,
      });
      refetch();
      setIsAdding(false);
      setOpenVendorAdd(false);
    } catch (error) {
      setIsAdding(false);
    }
    setIsAdding(false);
  }

  return (
    <>
      <div className="w-[90%] mx-auto  h-full my-auto ">
        <div className="w-full flex justify-between items-center">
          <p className="text-3xl py-10 "> Vendors Managment :</p>
          <button
            onClick={() => {
              setOpenVendorAdd(true);
            }}
            className="bg-skin-primary rounded-lg px-2 py-1 hover:opacity-80 text-white "
          >
            Add a new Vendor
          </button>
        </div>
        <hr className="pb-5" />
        {isLoading == true ? (
          <div className="w-full h-full flex justify-center items-center">
            <TawasyLoader width={400} height={400} />
          </div>
        ) : (
          <div className="w-full h-[70%] overflow-x-auto ">
            {/* {brands.data && brands.data.brands.length > 0 ? ( */}
            {vendors &&
            vendors.data.vendors &&
            vendors.data.vendors.length > 0 ? (
              <table className="w-full overflow-x-auto table-auto">
                <thead className="">
                  <tr className="text-sm font-semibold text-center border-b-2 border-gray-400 capitalize">
                    <th>Id</th>
                    {tableheading.map((index) => (
                      <th className="px-4 " key={index.id}>
                        {index.heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-lg font-normal text-gray-700 text-center">
                  {vendors &&
                    vendors.data.vendors &&
                    vendors.data.vendors.length > 0 &&
                    vendors.data.vendors.map((vendor, i) => {
                      return (
                        <AdminVendor
                          vendor={vendor}
                          key={i}
                          refetch={() => {
                            refetch();
                          }}
                        />
                      );
                    })}
                </tbody>
              </table>
            ) : (
              <div className="text-lg text-center">There are no vendors</div>
            )}
            {/* ) : (
              <div className="w-max mx-auto"> There are no Vendors. </div>
            )} */}
          </div>
        )}
      </div>

      <Dialog
        open={openVendorAdd}
        onClose={() => {
          setOpenVendorAdd(false);
        }}
        fullWidth
        maxWidth="lg"
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle className="flex justify-between items-center">
          <p className="text-xl">Add a new Vendor:</p>
          <MdClose
            onClick={() => {
              setOpenVendorAdd(false);
            }}
            className="cursor-pointer text-red-500 hover:text-red-600 w-[25px] h-[25px]"
          />
        </DialogTitle>
        <DialogContent>
          <hr className="pb-5" />
          <form
            onSubmit={addVendor}
            className="w-full flex flex-col justify-center items-center"
          >
            <div className="grid grid-cols-2 justify-center gap-6 w-full mx-auto items-center">
              <input
                type="text"
                accept="text"
                ref={nameRef}
                className="outline-none w-[80%] mx-auto placeholder:text-gray-400 border-b-2 border-gray-400 focus:border-skin-primary transition-all duration-500"
                placeholder="Vendor Name"
                required
              />
              <input
                type="text"
                accept="text"
                ref={companyNameRef}
                className="outline-none w-[80%] mx-auto placeholder:text-gray-400 border-b-2 border-gray-400 focus:border-skin-primary transition-all duration-500"
                placeholder="Company Name"
                required
              />
              <input
                type="number"
                accept="number"
                ref={numberRef}
                className="outline-none appearance-none w-[80%] mx-auto placeholder:text-gray-400 border-b-2 border-gray-400 focus:border-skin-primary transition-all duration-500"
                placeholder="number"
                min={0}
                minLength={10}
                maxLength={10}
                required
              />
              <input
                type="text"
                accept="text"
                ref={cityRef}
                className="outline-none w-[80%] mx-auto placeholder:text-gray-400 border-b-2 border-gray-400 focus:border-skin-primary transition-all duration-500"
                placeholder="Vendor City"
                required
              />
              <input
                type="text"
                accept="text"
                ref={locationRef}
                className="outline-none w-[80%] mx-auto placeholder:text-gray-400 border-b-2 border-gray-400 focus:border-skin-primary transition-all duration-500"
                placeholder="Vendor Location"
                required
              />
            </div>
            {isAdding == true ? (
              <div className="w-[10%] mx-auto flex justify-center items-center  mt-8 mb-3 text-white bg-green-500 hover:opacity-80 rounded-lg px-2 py-1">
                <Ring size={25} speed={3} lineWeight={5} color="white" />
              </div>
            ) : (
              <button
                type="submit"
                className="w-[10%] mx-auto  mt-8 mb-3 text-white bg-green-500 hover:opacity-80 rounded-lg px-2 py-1"
              >
                Save
              </button>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default withLayoutAdmin(Vendors);

import createAxiosInstance from "@/API";
import AdminCategoryAttach from "@/components/AdminCategories/adminCategoryAttach";
import withLayoutAdmin from "@/components/UI/adminLayout";
import TawasyLoader from "@/components/UI/tawasyLoader";
import DropDownSearch from "@/components/UI/utilities/DropDownSearch";
import { DialogHeader } from "@material-tailwind/react";
import { Dialog, DialogContent } from "@mui/material";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import { set } from "nprogress";
import { useRef, useState } from "react";
import { FaX } from "react-icons/fa6";
import { useQuery } from "react-query";

function CategoryBrandAttach() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  // const [searchedResults, setSearchedResults] = useState();
  // const searchRef = useRef();
  // const [inSearch, setInSearch] = useState(false);
  // const [searching, setSearching] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [allCategories, setAllCategories] = useState();
  const [allBrands, setAllBrands] = useState();
  const [gettingData, setGettingData] = useState(false);
  const [sortRef , setSortRef] = useState();
  const formRef = useRef();

  const {
    data: categories,
    isLoading,
    refetch,
  } = useQuery(`categoryAttachments`, fetchCategoryAttach, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchCategoryAttach() {
    try {
      return await Api.get(`/api/admin/brand-sort-order`);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setSortRef(value);
    }
  };

  async function openAdding() {
    setAddNew(true);
    setGettingData(true);
    try {
      const categories = await Api.get(`/api/admin/get-categories`);
      setAllCategories(categories.data.categories);
      const brands = await Api.get(`/api/admin/brands`);
      setAllBrands(brands.data.brands);
      setGettingData(false);
    } catch (error) {
      console.log(error);
      setGettingData(false);
    }
  }

  // if(categories){
  //   console.log
  // }

  // async function search(e) {
  //   e.preventDefault();
  //   setSearching(true);
  //   try {
  //     const response = await Api.get(`/api/admin/categories/searchByName`, {
  //       params: { search: searchRef.current.value },
  //       noSuccessToast: true,
  //     });
  //     const component =
  //       response.data.data.length < 1 ? (
  //         <div className="w-max mx-auto">{response.data.message}</div>
  //       ) : (
  //         <table className="w-full overflow-x-auto table-auto">
  //           <thead className="">
  //             <tr className="text-sm font-semibold text-center border-b-2 border-gray-400 uppercase">
  //               <th>Id</th>
  //               {tableheading.map((index) => (
  //                 <th className="px-4" key={index.id}>
  //                   {index.heading}
  //                 </th>
  //               ))}
  //             </tr>
  //           </thead>
  //           <tbody className="text-lg font-normal text-gray-700 text-center">
  //             {response.data.data &&
  //               response.data.data.map((customer) => {
  //                 return (
  //                   <CategoryAdmin
  //                     names={customer}
  //                     key={customer.id}
  //                     refetch={() => {
  //                       refetch();
  //                     }}
  //                   />
  //                 );
  //               })}
  //           </tbody>
  //         </table>
  //       );
  //     setSearchedResults(component);
  //     setSearching(false);
  //   } catch (error) {
  //     setSearching(false);
  //   }
  //   setSearching(false);
  // }

  function closepopup() {
    setAllBrands();
    setSelectedBrand();
    setSelectedCategory();
    setAllCategories();
    setAddNew(false);
  }

  async function addNewCategory(e) {
    e.preventDefault();
    if (
      !formRef.current.reportValidity() ||
      !selectedBrand ||
      !selectedCategory
    ) {
      return;
    }
    setAdding(true);
    try {
      const response = await Api.post(`/api/admin/add-brand-sort-order`, {
        brand_id: selectedBrand,
        category_id: selectedCategory,
        sort_order: sortRef,
      });
      refetch();
      closepopup();
      setAdding(false);
    } catch (error) {
      setAdding(false);
    }
    setAdding(false);
  }

  const tableheading = [
    { heading: "Brand" },
    { heading: "Category" },
    { heading: "Sort Order" },
    { heading: "Edit" },
  ];

  const onlyNumberKey = (e) => {
    const ASCIICode = e.which ? e.which : e.keyCode;
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
      e.preventDefault();
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={400} height={400} />
      </div>
    );
  }

  return (
    <>
      <div className="md:px-6">
        <div className="h-screen">
          <div className="m-5 p-5 flex justify-between items-center ">
            <h2 className="text-2xl text-stone-500 pb-5 ">
              Categories-Brands Attachments
            </h2>
            {/* <div className="flex">
            <div
              className="w-full flex justify-center items-center gap-2 mx-auto mb-7 "
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
                  placeholder="Search categories by name"
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
          </div> */}
            <button
              className="px-3 py-2 text-white bg-skin-primary rounded-lg"
              onClick={openAdding}
            >
              {`Add New Attachment`}
            </button>
          </div>

          {categories && (
            <div className="w-full h-[70%] overflow-x-auto ">
              {categories &&
              categories.data?.data &&
              categories.data?.data?.length > 0 ? (
                <table className="w-full overflow-x-auto table-auto">
                  <thead className="">
                    <tr className="text-sm font-semibold text-center border-b-2 border-gray-400 uppercase">
                      <th>Id</th>
                      {tableheading.map((index) => (
                        <th className="px-4" key={index.heading}>
                          {index.heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-lg font-normal text-gray-700 text-center">
                    {categories.data.data &&
                      categories.data.data.map((category) => {
                        return (
                          <AdminCategoryAttach
                            category={category}
                            key={category.id}
                            refetch={() => {
                              refetch();
                            }}
                          />
                        );
                      })}
                  </tbody>
                </table>
              ) : (
                <p className="text-xl text-center w-full">{`There are no attachments yet.`}</p>
              )}
            </div>
          )}

          {/* {inSearch == true &&
          (searching == true ? (
            <div className="w-full h-full">
              <TawasyLoader width={300} height={300} />
            </div>
          ) : (
            <div className="w-full min-h-[500px]">
              {searchedResults && searchedResults}
            </div>
          ))} */}
        </div>
      </div>

      <Dialog
        open={addNew}
        onClose={closepopup}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            height: "50vh",
            maxHeight: "100vh",
          },
        }}
      >
        <DialogHeader className="flex justify-between items-center">
          <p>{`New Attachment :`}</p>
          <button
            onClick={closepopup}
            className="text-black hover:text-red-500"
          >
            <FaX size={20} />
          </button>
        </DialogHeader>
        <DialogContent>
          {gettingData == true ? (
            <div className="w-full h-full flex justify-center items-center">
              <Ring size={25} speed={3} lineWeight={5} color="#ff6600" />
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={addNewCategory}
              className="w-full h-full flex pb-20 flex-col justify-start items-center space-y-6 "
            >
              <div className="flex w-[60%] mx-auto flex-col space-y-2 justify-start items-start">
                <p className="w-max">{`Brand :`}</p>
                <DropDownSearch
                  data={allBrands}
                  get={`id`}
                  show={`name`}
                  selectItem={(item) => {
                    setSelectedBrand(item.id);
                  }}
                />
              </div>
              <div className="flex w-[60%] mx-auto flex-col space-y-2 justify-start items-start">
                <p>{`Category :`}</p>
                <DropDownSearch
                  data={allCategories}
                  get={`id`}
                  show={`name_en`}
                  selectItem={(item) => {
                    setSelectedCategory(item.id);
                  }}
                />
              </div>
              <div className="flex w-[60%] mx-auto flex-col space-y-2 justify-start items-start">
                <p>{`Sort Order :`}</p>

                <input
                  value={sortRef}
                  inputMode="numeric"
                  pattern="\d{1,4}"
                  onChange={handleSortChange}
                  className="outline-none w-full border-b-2 border-gray-400 focus:border-skin-primary"
                  required
                  onKeyPress={onlyNumberKey}
                  placeholder="Attachment Sort-Order"
                />
              </div>
              {adding == true ? (
                <div className="px-3 w-[30%] py-2 text-white flex justify-center items-center rounded-lg bg-skin-primary">
                  <Ring size={25} speed={3} lineWeight={5} color="white" />
                </div>
              ) : (
                <button
                  className="px-3 w-[30%] py-2 text-white rounded-lg bg-skin-primary"
                  type="submit"
                >
                  {`Submit`}
                </button>
              )}
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default withLayoutAdmin(CategoryBrandAttach);

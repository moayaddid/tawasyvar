import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import AdminSelectableProduct from "./AdminSelectableProduct";
import { convertDate } from "../SellerOrders/sellerOrder";
import { convertDateStringToDate } from "../AdminOrders/OrderAdmin";
import createAxiosInstance from "@/API";
import { useRouter } from "next/router";
import TawasyLoader from "../UI/tawasyLoader";
import { Ring } from "@uiball/loaders";

function AdminVendorProductRequest({ request, refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const [products, setProducts] = useState();
  const [isAcceptingAll, setIsAcceptingAll] = useState(false);
  const [isRejectingAll, setIsRejectingAll] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const router = useRouter();
  const Api = createAxiosInstance(router);

  const handleSelectStatus = (itemId, combId, status) => {
    setSelectedItems((prevSelectedItems) => {
      const existingItemIndex = prevSelectedItems.findIndex((item) => {
        if (item.product_combination_id && combId) {
          return item.product_combination_id === combId;
        } else {
          return item.product_id === itemId;
        }
      });

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevSelectedItems];
        updatedItems[existingItemIndex].action = status;
        return updatedItems;
      } else {
        return [
          ...prevSelectedItems,
          { product_id: itemId, product_combination_id: combId, action : status },
        ];
      }
    });
  };

  // const handleSelectStatus = (itemId, combId, status) => {
  //   setSelectedItems((prevSelectedItems) => {
  //     const existingItemIndex = prevSelectedItems.findIndex((item) => {
  //       if (item.product_combination_id && combId) {
  //         return item.product_combination_id === combId;
  //       } else {
  //         return item.product_id === itemId;
  //       }
  //     });

  //     if (existingItemIndex !== -1) {
  //       // Create a new array with the updated item
  //       const updatedItems = [
  //         ...prevSelectedItems.slice(0, existingItemIndex),
  //         {
  //           product_id: itemId,
  //           product_combination_id: combId,
  //           action: status,
  //         },
  //         ...prevSelectedItems.slice(existingItemIndex + 1),
  //       ];

  //       return updatedItems;
  //     } else {
  //       // Add a new item to the array
  //       return [
  //         ...prevSelectedItems,
  //         {
  //           product_id: itemId,
  //           product_combination_id: combId,
  //           action: status,
  //         },
  //       ];
  //     }
  //   });
  // };

  async function openRequest() {
    setIsOpen(true);
    setIsLoading(true);
    try {
      const response = await Api.get(
        `/api/admin/request-details/${request.id}`
      );
      // console.log(response.data.request_details);
      setProducts(response.data.request_details);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  async function acceptAll() {
    setIsAcceptingAll(true);
    try {
      const response = await Api.post(
        `/api/admin/accept-request/${request.id}`,
        {
          status: "accept",
        }
      );
      refetch();
      setSelectedItems([]);
      setIsAcceptingAll(false);
      setIsOpen(false);
    } catch (error) {
      setIsAcceptingAll(false);
    }
    setIsAcceptingAll(false);
  }

  async function rejectAll() {
    setIsRejectingAll(true);
    try {
      const response = await Api.post(
        `/api/admin/accept-request/${request.id}`,
        {
          status: "decline",
        }
      );
      refetch();
      setSelectedItems([]);
      setIsRejectingAll(false);
      setIsOpen(false);
    } catch (error) {
      setIsRejectingAll(false);
    }
    setIsRejectingAll(false);
  }

  async function sendSelected() {
    setIsSaving(true);
    // const data = Object.values(selectedItems); 
    // let nig = [] ; 
    // const data = selectedItems.map((obj) => {nig.push({...obj})});
    // console.log(nig);
    try {
      const response = await Api.post(
        `/api/admin/accept-products-request/${request.id}`,
        {
          products: selectedItems,
        }
      );
      setIsOpen(false);
      refetch();
      setSelectedItems([]);
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
    }
    setIsSaving(false);
  }

  return (
    <>
      <div
        onClick={openRequest}
        className="bg-gray-100 rounded-md my-1 px-4 cursor-pointer border-2 border-white hover:border-skin-primary transition-all duration-700 "
      >
        <div>
          <div className="flex justify-end">
            <h2 className="bg-skin-primary text-white px-2 py-1 rounded-md mt-[-15px] mr-6">
              {convertDateStringToDate(request.date)}
              {/* 25/12/2023 */}
            </h2>
          </div>
          <div className="pb-5">
            <h3 className="font-medium text-xl flex items-center gap-2 text-gray-500 mb-2">
              <div>Id : </div>
              <div>{request.id}</div>
            </h3>
            <h3 className="font-medium text-xl flex items-center gap-2 text-gray-500 mb-2">
              <div>{`Vendor Name`} : </div>
              <div>{request.vendor}</div>
            </h3>
          </div>
        </div>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedItems([]);
          setProducts([]);
        }}
        fullWidth
        maxWidth="lg"
        disableRestoreFocus
        disableAutoFocus
        disableEnforceFocus
      >
        <DialogTitle className="flex justify-between items-center ">
          <div className="flex flex-col items-start justify-center">
            <div className="text-lg">ID : {request.id}</div>
            <div className="text-lg"> Vendor : {request.vendor} </div>
          </div>
          {products && products.length > 0 && (
            <div className="flex justify-end items-center space-x-4 w-[70%] ">
              {isAcceptingAll == true ? (
                <div className="w-[25%] text-base font-normal flex justify-center items-center px-1 py-1 text-white rounded-lg bg-green-600 hover:opacity-80 transition-all duration-300">
                  <Ring size={30} speed={3} lineWeight={5} color="white" />
                </div>
              ) : (
                <button
                  onClick={acceptAll}
                  className="w-[25%] text-base font-normal px-1 py-1 text-white rounded-lg bg-green-600 hover:opacity-80 transition-all duration-300"
                >
                  Accept All
                </button>
              )}
              {isRejectingAll == true ? (
                <div className="w-[25%] text-base font-normal flex justify-center items-center px-1 py-1 text-white rounded-lg bg-red-600 hover:opacity-80 transition-all duration-300">
                  <Ring size={30} speed={3} lineWeight={5} color="white" />
                </div>
              ) : (
                <button
                  onClick={rejectAll}
                  className="w-[25%] text-base font-normal px-1 py-1 text-white rounded-lg bg-red-600 hover:opacity-80 transition-all duration-300"
                >
                  Reject All
                </button>
              )}
            </div>
          )}
        </DialogTitle>
        {isLoading == true ? (
          <div className="w-full h-full flex justify-center items-center">
            <TawasyLoader width={200} height={200} />
          </div>
        ) : (
          <DialogContent>
            <div className="w-full h-full">
              {products && products.length > 0 ? (
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th> Variation </th>
                      <th> Brand </th>
                      <th> Approve/Deny </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products &&
                      products.length > 0 &&
                      products.map((item, i) => (
                        <AdminSelectableProduct
                          key={i}
                          item={item}
                          onSelectStatus={handleSelectStatus}
                        />
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center">
                  {" "}
                  This Request has no products.{" "}
                </div>
              )}
              {products && products.length > 0 && (
                <div className="w-full flex justify-center items-center pt-4 pb-1">
                  {isSaving == true ? (
                    <div className="w-[20%] mx-auto bg-skin-primary rounded-lg px-2 py-1 flex justify-center items-center transition-all duration-500 text-white">
                      <Ring size={25} speed={3} lineWeight={5} color="white" />
                    </div>
                  ) : (
                    <button
                      disabled={selectedItems?.length < 1}
                      onClick={sendSelected}
                      className="w-[20%] mx-auto disabled:bg-gray-500 disabled:cursor-not-allowed bg-skin-primary rounded-lg px-2 py-1 hover:opacity-80 disabled:opacity-80 transition-all duration-500 text-white"
                    >
                      Save Products
                    </button>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

export default AdminVendorProductRequest;

import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { BiEdit, BiX } from "react-icons/bi";
import { CgCheck } from "react-icons/cg";
import { FcCancel } from "react-icons/fc";
import { toast } from "react-toastify";

function AdminSortingProduct({ product, refetch }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const api = createAxiosInstance(router);
  // const [brandSort, setBrandSort] = useState(product.brand_sort_order ?? "");
  const [productSort, setProductSort] = useState(
    ""
    // product.product_sort_order ?? ""
  );
  const [editing, setEditing] = useState(false);

  function cancelEditing() {
    // setBrandSort(product.brand_sort_order ?? "");
    setProductSort(product.product_sort_order ?? "");
    setEditing(false);
  }

  async function EditSorter(e = null) {
    if(e){
      e.preventDefault();
    }
    if (!productSort) {
      toast.error(`you should at least add a product sort order`);
      return;
    }
    setLoading(true);
    try {
      const response = await api.put(
        `/api/admin/edit-product-sort-order/${product.product_id}`,
        {
          // brand_sort_order: brandSort ?? null,
          product_sort_order: Number(productSort),
        }
      );
      setLoading(false);
      setEditing(false);
      refetch();
    } catch (error) {
      setLoading(false);
    }
  }

  // const handleBrandSortChange = (e) => {
  //   const value = e.target.value;
  //   if (value.length <= 4) {
  //     setBrandSort(value);
  //   }
  // };

  const handleProductSortChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setProductSort(value);
    }
  };

  const onlyNumberKey = (e) => {
    const ASCIICode = e.which ? e.which : e.keyCode;
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
      e.preventDefault();
    }
  };

  return (
    <>
      <tr
        key={product.product_id}
        className={`bg-gray-100 hover:bg-gray-200 font-medium my-4 py-4 border-b border-black  ${
          loading == true && `opacity-75 pointer-events-none`
        } `}
      >
        <td className="px-4 py-4 ">{product.product_id}</td>
        <td>{product.category_name}</td>
        <td className=" px-4">{product.category_sort_order}</td>
        <td className="px-4">{product.brand_name}</td>
        {/* {editing == true ? (
          <td className="px-4">
            <input
              type="number"
              //   minLength={0}
              //   maxLength={5}
              value={brandSort}
              max={9999}
              min={1000}
              pattern="\d{1,4}"
              className="outline-none px-2 w-max"
              onChange={handleBrandSortChange}
            />
          </td>
        ) : ( */}
        <td className="px-4">{product.brand_sort_order}</td>
        {/* )} */}
        <td className="px-4">{product.product_name}</td>
        {editing == true ? (
          <td className="px-4">
            <form onSubmit={EditSorter}>
              <input
                type="number"
                //   minLength={0}
                //   maxLength={6}
                inputMode="numeric"
                pattern="\d{1,4}"
                value={productSort}
                placeholder={product.product_sort_order}
                // max={9999}
                //   min={100000}
                onChange={handleProductSortChange}
                onKeyPress={onlyNumberKey}
                required
                className="outline-none px-2 w-full"
              />
            </form>
          </td>
        ) : (
          <td className="px-4 ">{product.product_sort_order}</td>
        )}
        {editing == true ? (
          <td className="px-4">{`${product.category_sort_order}-${product.brand_sort_order}-${productSort}`}</td>
        ) : (
          <td>{` - `}</td>
        )}
        <td>
          {editing == true ? (
            loading == false ? (
              <div className="flex justify-center items-center space-x-4">
                <button
                  type="submit"
                  onClick={EditSorter}
                  className="items-center px-2 py-2 text-white bg-green-500 rounded-md hover:opacity-80 focus:outline-none"
                >
                  <CgCheck size={20} />
                </button>
                <BiX
                  size={36}
                  onClick={cancelEditing}
                  className="items-center px-2 py-2 text-white bg-red-500 rounded-md hover:opacity-80 focus:outline-none"
                />
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <Ring size={15} color="#ff6600" speed={3} lineWeight={5} />
              </div>
            )
          ) : (
            <div className="flex justify-center items-center">
              <BiEdit
                onClick={() => {
                  setEditing(true);
                }}
                size={30}
                className="items-center px-2 py-2 text-white bg-blue-500 rounded-md hover:opacity-80 focus:outline-none"
              />
            </div>
          )}
        </td>
      </tr>
    </>
  );
}

export default AdminSortingProduct;

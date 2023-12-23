import React, { useState, useEffect } from "react";
import item1 from "../../../../public/images/kuala.jpg";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import Link from "next/link";
import withLayoutAdmin from "@/components/UI/adminLayout";
import AdminPendingProduct from "@/components/AdminProducts/PendingProductAdmin/PendingProduct";
import AdminProduct from "@/components/AdminProducts/productsAdmin";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { useQuery } from "react-query";

const tableheading = [
  {
    heading: "Action",
  },
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
    heading: "Category",
  },
  {
    heading: "Image",
  },
  {
    heading: "Status",
  },
  {
    heading: "Brand",
  },
  {
    heading: "Sku",
  },
  {
    heading: "Ean Code",
  },
  {
    heading: "Sort Order",
  },
  {
    heading: "Created",
  },
  {
    heading: "Updated",
  },
  
];

const products = [
  {
    id: 1,
    nameAr: "lorem1",
    nameEn: "lorem1",
    descAr:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry",
    descEn:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry",
    category: "lorem",
    image: item1,
    status: "lorem",
    brand: "ldjdsjs",
    sku: "37732",
    code: "65444",
    sortOrder: "5",
    Created: "12/3/2022",
    Updated: "12/3/2022",
    instores: "40000",
  },
  {
    id: 2,
    nameAr: "lorem2",
    nameEn: "lorem1",
    descAr:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry",
    descEn:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry",
    category: "lorem",
    image: item1,
    status: "lorem",
    brand: "ldjdsjs",
    sku: "37732",
    code: "65444",
    sortOrder: "5",
    Created: "12/3/2022",
    Updated: "12/3/2022",
  },
  {
    id: 3,
    nameAr: "lorem3",
    nameEn: "lorem1",
    descAr:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry",
    descEn:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry",
    category: "lorem",
    image: item1,
    status: "lorem",
    brand: "ldjdsjs",
    sku: "37732",
    code: "65444",
    sortOrder: "5",
  },
  {
    id: 4,
    nameAr: "lorem4",
    nameEn: "lorem1",
    descAr:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry",
    descEn:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry",
    category: "lorem",
    image: item1,
    status: "lorem",
    brand: "ldjdsjs",
    sku: "37732",
    code: "65444",
    sortOrder: "5",
  },
];

function PendingProductsAdmin() {
  const [tablecontent, settablecontent] = useState([]);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const {
    data: pendingProducts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery("adminPendingProducts", fetchAdminPendingProduct, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchAdminPendingProduct() {
    try {
      return await Api.get(`/api/admin/pending-products`);
    } catch {}
  }

  if (isLoading == true) {
    return (
      <div className="w-full h-full">
        <TawasyLoader width={400} height={400} />
      </div>
    );
  }

  return (
    <div>
      <div className="items-center w-full py-4 mx-auto my-10 bg-white rounded-lg shadow-md px-3">
        <div className="w-full h-full mx-auto">
          <div className="">
            <h2 className="text-2xl text-stone-500 pb-5 ">Pending Product</h2>
          </div>

          {/* <div className="w-full h-full">
              <TawasyLoader width={300} height={300} />
            </div> */}
          {pendingProducts && pendingProducts.data.products.length > 0 ? (
            <div className="mt-6 h-[70%] overflow-x-auto">
              <table className="w-[2000px] overflow-x-auto table-auto">
                <thead className="sticky top-0">
                  <tr className="text-sm font-semibold text-center border-b-2 border-blue-500 uppercase">
                    <th>Id</th>
                    {tableheading.map((index) => (
                      <th className=" px-4 py-4 " key={index.heading}>
                        {index.heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-lg font-normal text-gray-700 text-center">
                  {pendingProducts.data.products.map((names) => {
                    return (
                      <AdminProduct
                        product={names}
                        key={names.id}
                        refetch={() => {
                          refetch();
                        }}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="w-max mx-auto">There are no pending products.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withLayoutAdmin(PendingProductsAdmin);

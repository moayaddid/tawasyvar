import logo from "@/public/images/tawasylogo.png";
import Image from "next/image";

function AdminNewProduct ({product}) {

    return <>
        <tr
        key={product.id}
        className=" bg-gray-100 hover:bg-gray-200 font-medium my-2 py-2 "
      >
        <td className="px-4 my-3 ">{product.id}</td>
        <td className=" px-4  w-[10%] ">{product.name}</td>
        <td className="px-4  h-full w-max ">
          {product.image ? (
            <Image
              src={product.image ? product.image : logo}
              alt={product.name}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "75px", height: "75px" }}
              className="object-center mx-auto "
            />
          ) : (
            `No image`
          )}
        </td>
        {/* <td className=" px-4  ">{product.status}</td>
        <td className="px-4 ">{product.brand && product.brand}</td>
        <td className="px-4 ">{product.sku}</td>
        <td className="px-4 ">{product.ean_code}</td>
        <td
          className={`${
            router.pathname === "/admin/Products/PendingProduct" && `hidden`
          }`}
        >
          {product.sold_quantity}
        </td>
        <td>{product.sort_order}</td>
        <td className="px-4 ">{convertDate(product.created_at)}</td>
        <td className="px-4 ">{convertDate(product.updated_at)}</td>
        <td
          className={` px-4  ${
            router.pathname === "/admin/Products/PendingProduct" && `hidden`
          }`}
        >
          {product.instores}
        </td> */}
      </tr>
    </>

}

export default AdminNewProduct ;
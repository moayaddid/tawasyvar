import React from "react";
import { convertDateStringToDate } from "../AdminOrders/OrderAdmin";


function SellersAdmin({ names }) {

  return (
    <>
      <tr
        key={names.id}
        className="py-10 bg-gray-100 hover:bg-gray-200 font-medium   "
      >
         <td className="px-4 py-4">{names.id}</td>
        <td className="px-4 py-4">{names.name}</td>
        <td className="px-4 py-4">{names.phone_number}</td>
        <td className="px-4 py-4">{names.verify_code}</td>
        <td className="px-4 py-4">{names.city}</td>
        <td className="px-4 py-4">{names.location}</td>
        <td className="px-4 py-4">{names.longitude}</td>
        <td className="px-4 py-4">{names.latitude}</td>
        <td className="px-4 py-4  " width={`10%`} >{convertDateStringToDate(names.created_at)}</td>
        <td className="px-4 py-4" width={`10%`} >{convertDateStringToDate(names.updated_at)}</td>
      </tr>


    </>
  );
}

export default SellersAdmin;

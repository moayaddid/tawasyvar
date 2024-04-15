import React from "react";
import { convertDateStringToDate } from "../AdminOrders/OrderAdmin";
import AdminNotes from "../AdminComponents/AdminNotes";
import {
  getCustomerNote_endpoint,
  postCustomerNote_endpoint,
} from "@/api/endpoints/endPoints";

function CustomersAdmin({ names }) {
  return (
    <>
      <tr
        key={names.id}
        className="py-10 bg-gray-100 hover:bg-gray-200 font-medium   "
      >
        <td className="px-4 py-4">{names.id}</td>
        <td className="p-4">
          <AdminNotes
            entityId={names.id}
            getEndpoint={getCustomerNote_endpoint}
            postEndpoint={postCustomerNote_endpoint}
            NotesFor={names.name}
          />
        </td>
        <td className="px-4 py-4">{names.name}</td>
        <td className="px-4 py-4">{names.phone_number}</td>
        <td className="px-4 py-4">{names.verify_code}</td>
        <td className="px-4 py-4">{names.location}</td>
        <td className="px-4 py-4">{names.longitude}</td>
        <td className="px-4 py-4">{names.latitude}</td>
        <td className="px-4 py-4  " width={`10%`}>
          {convertDateStringToDate(names.created_at)}
        </td>
        <td className="px-4 py-4" width={`10%`}>
          {convertDateStringToDate(names.updated_at)}
        </td>
      </tr>
    </>
  );
}

export default CustomersAdmin;

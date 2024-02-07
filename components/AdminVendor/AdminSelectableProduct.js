import { useEffect, useState } from "react";

const AdminSelectableProduct = ({ item, onSelectStatus }) => {
  const handleStatusChange = (status) => {
    onSelectStatus(item.product_id, item.line_id || null, status);
  };

  const radioGroupName = `status-${item.product_id}-${item.line_id || "null"}`;

  return (
    <tr className="  ">
      <td className="text-center py-5 px-3">{item.name}</td>
      <td className="text-center px-3">
        {item.combination
          ? item.combination?.variations
              ?.map((combo) => combo.option)
              .join(" - ")
          : `-`}
      </td>
      <td className="text-center px-3">{item.brand}</td>
      <td className="text-center px-3 flex justify-center items-center space-x-3">
        <div>
          <input
            type="radio"
            name={radioGroupName}
            value="accept"
            id={`approve - ${item.product_id} - ${item.line_id || `null`}`}
            required
            className="appearance-none peer"
            onChange={() => {
              handleStatusChange("accept");
            }}
          />
          <label
            htmlFor={`approve - ${item.product_id} - ${item.line_id || `null`}`}
            className="flex justify-center cursor-pointer px-2 rounded-lg transition-all duration-300 items-center space-x-1 peer-checked:bg-green-500 border peer-checked:text-white "
          >
            Approved
          </label>
        </div>
        <div>
          <input
            type="radio"
            name={radioGroupName}
            value="decline"
            id={`deny - ${item.product_id} - ${item.line_id || `null`}`}
            className="peer appearance-none"
            onChange={() => handleStatusChange("decline")}
          />
          <label
            htmlFor={`deny - ${item.product_id} - ${item.line_id || `null`}`}
            className="flex justify-center cursor-pointer px-2 rounded-lg transition-all duration-300 items-center space-x-1 peer-checked:bg-red-500 border peer-checked:text-white "
          >
            Denied
          </label>
        </div>
      </td>
    </tr>
  );
};

export default AdminSelectableProduct;

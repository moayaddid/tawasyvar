import React from "react";

const Tables = ({ headings, rows, width }) => {
  return (
    <div
      className={`overflow-x-scroll overflow-y-scroll w-full px-2 border-b-2 border-gray-500 `}
      style={{ maxHeight: "500px" }}
    >
      <table className={`relative mt-5 table-auto ${width}`}>
        <thead className="sticky top-0 bg-white z-50 border-b-4 border-gray-400">
          <tr className="text-sm font-semibold text-center border-b-1 border-gray-500">
            {headings.map((index) => (
              <th className="px-4 py-2" key={index.heading}>
                {index.heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-lg h-fit font-normal text-gray-700 text-center">
          {rows}
        </tbody>
      </table>
    </div>
  );
};

export default Tables;

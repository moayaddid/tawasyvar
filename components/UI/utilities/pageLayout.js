import React, { useState } from "react";
import Search from "./search";
import ButtonComponent from "./buttonComponent";

const PageLayout = ({ children, header, childrenClassName, title }) => {
  return (
    <div className="w-full h-full">
      <div className=" md:w-[90%] w-[95%] mx-auto flex flex-col space-y-7 justify-start  items-center pt-7">
        <div
          className={` w-full flex md:flex-row flex-col md:justify-between justify-start md:space-y-0 space-y-3 items-center`}
        >
          <p className="md:text-3xl text-lg md:w-[30%] w-full md:text-start text-center  ">
            {title}
          </p>
          {header}
        </div>
        <div className={` w-full h-full ${childrenClassName}`}>
          <hr className="py-5" />
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;

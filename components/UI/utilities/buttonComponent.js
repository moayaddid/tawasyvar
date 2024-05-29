import { Ring } from "@uiball/loaders";
import React, { useState } from "react";

const ButtonComponent = ({
  className,
  isLoading,
  onClick,
  title,
  color,
  hex,
  type,
  disabled , 
  loaderClassName ,
  loaderSize
}) => {
  return (
    <>
      {isLoading ? (
        isLoading === false ? (
          <button type={type} className={` cursor-pointer hover:opacity-85 ${className}`} onClick={onClick} disabled = {disabled ?? false}>
            {title}
          </button>
        ) : (
          <div className={`flex justify-center items-center ${className} `}>
            <Ring size={loaderSize ?? 20} lineWeight={5} speed={2} color={color ?? hex ?? `black`} />
          </div>
        )
      ) : (
        <button type={type} className={` cursor-pointer hover:opacity-85 ${className}`} onClick={onClick} disabled = {disabled ?? false}>
          {title}
        </button>
      )}
    </>
  );
};

export default ButtonComponent;

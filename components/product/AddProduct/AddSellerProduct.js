import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import logo from "@/public/images/tawasylogo.png";

function AddProduct({ addproduct }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);

  async function saveProduct() {
    setIsLoading(true);
    try {
      const response = await Api.post(
        `/api/seller/select-product/${addproduct.id}`
      );
    } catch (error) {
      // console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <div
      className="flex flex-col justify-between h-full md:w-full w-[80%] max-h-max gap-4 bg-white shadow mx-2 md:px-3 pt-3 pb-6 border-2 border-slate-200 rounded-lg overscroll-contain "
      key={addproduct.id}
    >
      <div className="flex justify-center ">
        <img
          className="w-[250px] h-[250px] items-center"
          loading="lazy"
          src={addproduct.image ? addproduct.image : logo}
          alt="productPhoto"
        />
      </div>
      <div className="flex justify-center items-center px-1 text-xl text-center shrink-0 ">
        {/* <div className="text-xl text-center "> */}
          {addproduct.name}
          {/* </div> */}
      </div>
      <div className="flex justify-center text-center items-center text-lg text-gray-500 text-ellipsis overflow-hidden w-[90%] h-max mx-auto " 
        title={addproduct.description}
      >
        {addproduct.description}
        {/* asdasd asdjhk basdjkhashdb hsjadbasd jhasjhd asd ajhsd jhas d */}
      </div>
      {/* <div className="row flex flex-col justify-center"> */}
        <div className="flex justify-between items-center md:w-[80%] w-[90%] mx-auto  ">
          <div className="flex flex-wrap gap-2 w-[70%] ">
            {addproduct.category && (
              <div className=" px-2 bg-white border-2 border-skin-primary rounded-2xl text-skin-primary  text-start  flex justify-center items-center ">
                {addproduct.category}
              </div>
            )}
            {addproduct.brand && (
              <div className=" px-2 bg-white border-2 w-max border-skin-primary rounded-2xl text-skin-primary flex justify-center items-center ">
                {addproduct.brand}
              </div>
            )}
            {/* <div className=" px-2 bg-white border-2 w-max border-skin-primary rounded-2xl text-skin-primary flex justify-center items-center ">
                asdasdasdasd asdas d
              </div><div className=" px-2 bg-white border-2 w-max border-skin-primary rounded-2xl text-skin-primary flex justify-center items-center ">
                asdasdasd
              </div><div className=" px-2 bg-white border-2 w-max border-skin-primary rounded-2xl text-skin-primary flex justify-center items-center ">
                asdasd
              </div><div className=" px-2 bg-white border-2 w-max border-skin-primary rounded-2xl text-skin-primary flex justify-center items-center ">
                asd
              </div><div className=" px-2 bg-white border-2 w-max border-skin-primary rounded-2xl text-skin-primary flex justify-center items-center ">
                fasdasdasdasda asd asd 
              </div> */}
          </div>
          {addproduct.message &&
          addproduct.message == "Product found in another store type." ? (
            <div className="text-red-500">
              This Product is not compatible with your store type{" "}
            </div>
          ) : !isLoading ? (
            <AiOutlinePlus
              onClick={saveProduct}
              className="cursor-pointer shadow md:w-[30px] md:h-[30px] bg-skin-primary text-white md:p-[5px] rounded-full w-[30px] h-[25px] md:[px-0] md:[mx-0] px-1 mx-2 "
            />
          ) : (
            <div className="bg-skin-primary p-[5px] rounded-full">
              <Ring size={20} lineWeight={5} speed={2} color="white" />
            </div>
          )}
        </div>
      {/* </div> */}
    </div>
  );
}

export default AddProduct;

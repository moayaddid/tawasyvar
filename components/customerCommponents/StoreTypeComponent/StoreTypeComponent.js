import Link from "next/link";
import image from "../../../public/images/storetype.png";
import Image from "next/image";
import { useRouter } from "next/router";
import ggg from "@/public/images/01.png";
import logo from "@/public/images/tawasylogo.png"
// import image from "../../../public/images/flowers.jpeg";

function StoreTypeComponent({ storeType }) {
  const router = useRouter();
  return (
    <Link href={`/StoreType/${storeType.slug}`}  className=" lg:w-full md:w-[70%] w-full h-max  mx-auto " >
      {/* <h2 className = {`w-[50%] text-center flex items-center px-3 justify-center  z-10 xl:text-[120%] md:text-[98%] sm:text-[80%]  text-[100%] text-skin-primary h-full `} dir={router.locale == 'ar' ? 'rtl' : "ltr"} >
        {storeType.name}
      </h2>
      <Image
        src={storeType.image}
        alt = {`image`}
        width={200}
        height={200}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }} // optional
      /> */}
      <div className="border-2 border-gray-100  hover:scale-[103%] transition-all shadow-xl duration-[333.3ms] flex justify-start rounded-lg space-x-2 "> 
        <Image
          src={storeType.image ? storeType.image : logo }
          alt = {storeType.name}
          width={150}
          height={150}
          className={`object-cover ${router.locale == "ar" ? `rounded-r-lg`: `rounded-l-lg`} overflow-hidden w-[40%] h-auto`}
        />
        <div className="flex text-start flex-col justify-between space-y-2 px-2 h-[85%] my-auto rounded-r-xl w-[90%] " >
          <h3 className="sm:text-xl line-clamp-2 text-ellipsis text-black text-sm " title={storeType.name} >{storeType.name} </h3>
          <p className=" sm:text-base text-gray-600 text-sm " >{storeType.description}</p>
          {/* <p className="group-hover:text-skin-primary md:text-lg font-medium text-sm " >Explore</p> */}
        </div>
       </div>
    </Link>
  );
}

export default StoreTypeComponent;

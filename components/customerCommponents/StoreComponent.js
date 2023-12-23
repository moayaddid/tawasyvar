import Image from "next/image";
import lego from "../../public/images/lego.png";
import image from "../../public/images/burger.jpeg";
import Link from "next/link";
import logo from "@/public/images/tawasylogo.png"

function StoreComponent({store}) {
  return (
    <Link href={`/Stores/${store.slug}`} className=" 2xl:w-[70%] lg:w-[90%] md:w-[70%] sm:w-[80%] w-[90%] cursor-pointer bg-white shadow-xl flex justify-start items-center gap-4 rounded-lg overflow-hidden pr-2 border-2 border-gray-200 hover:scale-105 transition-all duration-500 mx-auto ">
      <div className=" md:w-[100px] w-[100px] md:h-[100px] h-[100px]">
      <Image 
       className=' object-cover select-none pointer-events-none '
        // src={`https://www.befunky.com/images/prismic/e8c80c0a-bc59-4df2-a86e-cc4eabd44285_hero-blur-image-1.jpg?auto=avif,webp&format=jpg&width=900`}
        src={store.logo ? store.logo : logo}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "100%" }} // optional
      />
      </div>
      <div className="w-[60%] h-full flex flex-col justify-center items-start box-border px-2 ">
          <div className=" line-clamp-2 text-start md:text-xl text-lg w-full text-ellipsis select-none " title={store.name} >
            {store.name}
          </div>
        {/* <h5 className="md:line-clamp-2 line-clamp-1 w-full text-gray-500 text-base font-medium m-0 select-none " >
          fasdhjgfsdahgfsdhjgfasdhjkgasfdhjg asd asd asd asd asd asd asd asd asd asd 
        </h5> */}
           {/* <div className="flex sm:flex-row flex-col justify-start items-start w-full sm:gap-2 ">
            <h2 className="">Delivery Fee :</h2>
            <h3 className="text-skin-primary ">
              6000 S.P
            </h3>
          </div> */}
          {/* <div className="flex justify-start items-start w-full gap-2 ">
            <div className="md:text-xl text-md ">Delivery Time :</div>
            <div className="md:text-xl text-md text-skin-primary ">
              ~30 mins
            </div>
          </div>  */}
      </div>
    </Link>
  );
}

export default StoreComponent;

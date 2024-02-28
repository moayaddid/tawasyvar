import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/tawasylogo.png";

function BrandCustomer({brand}) {
  return (
    <Link
      href={`/Brands/${brand.slug}`}
      className="shadow-lg flex flex-col sm:w-fit max-w-[230px] mx-auto border-2 md:min-h-[230px] min-h-[250px] border-gray-200 hover:border-skin-primary transition-all duration-[333ms]  rounded-md "
    >
      <div className="bg-cover overflow-hidden flex justify-center items-center min-w-[230px]  min-h-[170px] max-h-[170px]  ">
        <Image
          src={brand.logo ? brand.logo : logo}
          alt={brand.name}
          className="w-full transform transition duration-1000 object-contain object-center"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "140px", height: "150px" }}
        />
      </div>
      <div className="w-[90%] mx-auto py-3 flex flex-col gap-2 md:h-[100%] h-auto justify-around  ">
        {/* <hr className="bg-skin-primary text-skin-primary` " /> */}
        <div className="w-[90%] h-[1px] bg-skin-primary mx-auto "></div>
        <h2
          className="capitalize md:text-xl text-center text-base text-gray-600 font-medium text-ellipsis line-clamp-2 "
          title={brand.name}
        >
          {brand.name}
        </h2>
      </div>
    </Link>
  );
}

export default BrandCustomer;

import { useTranslation } from "next-i18next";
import Image from "next/image";
import React from "react";
import logo from '@/public/images/tawasylogo.png' ;
import Link from "next/link";

function PublicStoreCard({ store }) {

  return (
    <Link href={`/Stores/${store.slug}`} className="shadow-xl flex flex-col lg:h-[250px] md:h-[200px] h-[175px] ">
      <div className=" overflow-hidden flex justify-center items-center ">
        <Image
          src={store.image ? store.image : logo}
          alt={store.name}
          className="object-contain transform transition duration-1000 "
          width={0}
          height={0}
          style={{ width: "auto", height: "100%" }}
        />
      </div>
      <div className="flex justify-between items-center w-[90%] mx-auto py-3">
        <div>
          <h2>{store.name}</h2>
          <p>{store.location}</p>
        </div>
        {/* <div className=" w-[30%] h-auto p-4 "> */}
          <Image
            src={store.logo ? store.logo : logo}
            alt={store.name}
            className="w-full object-cover rounded-full "
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "75px", height: "75px"}}
          />
        {/* </div> */}
      </div>
    </Link>
  );
}

export default PublicStoreCard;

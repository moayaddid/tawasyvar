import withVendorLayout from "@/components/wrapping components/WrappingVendorLayout";
// import { Accordion, AccordionItem } from "@nextui-org/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import kuala from "@/public/images/kuala.jpg";
import lego from "@/public/images/lego.png";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
} from "@material-tailwind/react";
import { useState } from "react";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import { useQuery } from "react-query";
import TawasyLoader from "@/components/UI/tawasyLoader";
import logo from "@/public/images/tawasylogo.png";
import { useTranslation } from "next-i18next";

export async function getServerSideProps(context) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const customAnimation = {
  mount: { scale: 1 },
  unmount: { scale: 0.97 },
};

function MyFollowers() {
  const [isOpen, setIsOpen] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const { t } = useTranslation("");

  const {
    data: followers,
    isLoading: followersLoading,
    refetch,
  } = useQuery(`vendorFollowers`, fetchVendorFollowers, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchVendorFollowers() {
    try {
      return await Api.get(`/api/vendor/get-followers`);
    } catch (error) {}
  }

  async function openAccordion(storeId) {
    setDetails(null);
    setIsOpen(isOpen == storeId ? 0 : storeId);
    setIsLoading(true);
    try {
      const response = await Api.get(
        `/api/vendor/product-followed-by-store/${storeId}`
      );
      const data = response.data.products;
      setDetails(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  // if (followers) {
  //   console.log(followers.data);
  // }

  return (
    <div className="w-full h-full">
      <p className="text-3xl py-10 px-7 ">{t("v.myFollowers")} :</p>
      <hr className="h-px bg-gray-700 mb-10" />
      {followersLoading == true ? (
        <div className="w-full h-full flex justify-center items-center">
          {" "}
          <TawasyLoader width={300} height={300} />{" "}
        </div>
      ) : (
        <div className="px-7">
          {/* <Accordion showDivider={false} onOpen={({id}) => {console.log(id)}} >
          <AccordionItem
            key={1}
            startContent={<Image src={lego} width={75} height={75} className="object-contain rounded-lg" />}
            title={`Store 1`}
            indicator={({ isOpen }) => (
              <FiChevronDown
                className={`text-black ${
                  isOpen ? `rotate-90` : `rotate-0`
                } transition-all duration-300`}
              />
            )}
            className="text-start text-xl px-4 bg-orange-100 rounded-lg transition-all duration-500 my-1"
            onPress={(e) => {console.log(e)}}

          >
            asdasdasdasjdaskjhdakjshdkajshdkjahsd
          </AccordionItem>
          <AccordionItem
            id="2"
            key={2}
            startContent={<Image src={lego} width={75} height={75} className="object-contain rounded-lg" />}
            title={`Store 2`}
            indicator={({ isOpen }) => (
              <FiChevronDown
                className={`text-black ${
                  isOpen ? `rotate-90` : `rotate-0`
                } transition-all duration-300`}
              />
            )}
            className="text-start text-xl px-4 bg-orange-100 rounded-lg transition-all duration-500 my-1"
            onPress={() => {console.log(` 2 is focused`)}}

          >
            asdasdasdasjdaskjhdakjshdkajshdkjahsd
          </AccordionItem>
          <AccordionItem
            id="3"
            key={3}
            startContent={<Image src={lego} width={75} height={75} className="object-contain rounded-lg" />}
            title={`Store 3`}
            indicator={(object) => 
              { console.log(object.isOpen);
                console.log(object);
                 return <FiChevronDown
                 key={3}
                className={`text-black ${
                  object.isOpen ? `rotate-90` : `rotate-0`
                } transition-all duration-300`}
              />}
            }
            className="text-start text-xl px-4 bg-orange-100 rounded-lg transition-all duration-500 my-1"
            onPress={() => {console.log(` 3 is focused`)}}
          >
            <div className="w-[95%] mx-auto " >
                <ul className="list-disc" >
                  <li key={5}  >
                      asdasdasd
                  </li>
                </ul>
            </div>
          </AccordionItem>
        </Accordion> */}
          {followers &&
          followers.data.stores &&
          followers.data.stores.length > 0 ? (
            followers.data.stores.map((follower) => (
              <Accordion
                id={follower.id}
                key={follower.id}
                open={isOpen === follower.id}
                icon={
                  <FiChevronDown
                    className={`text-black ${
                      isOpen == follower.id ? `rotate-90` : `rotate-0`
                    } transition-all duration-300`}
                  />
                }
                className="px-4 bg-gray-200 bg-opacity-50 rounded-lg transition-all duration-500 my-1"
                animate={customAnimation}
              >
                <AccordionHeader
                  onClick={() => {
                    // setIsOpen(isOpen == 1 ? 0 : 1 );
                    openAccordion(follower.id);
                  }}
                  className="font-normal"
                >
                  <div className="w-full flex justify-start items-center space-x-3 ">
                    <Image
                      src={follower.logo ? follower.logo : logo}
                      width={75}
                      height={75}
                      alt={follower.name}
                      className="object-contain rounded-lg"
                    />
                    <div className="flex flex-col justify-center items-start space-y-2">
                      <p className="text-xl ">{follower.name}</p>
                      <p className="text-sm px-2">
                        {follower.store_type && follower.store_type}
                      </p>
                    </div>
                  </div>
                </AccordionHeader>
                <AccordionBody>
                  {isLoading === true ? (
                    <div className="w-full h-full flex justify-center items-center">
                      <Ring size={30} speed={2} lineWeight={3} color="black" />
                    </div>
                  ) : (
                    details && (
                      <div className="w-full flex flex-col justify-start items-start">
                        {details &&
                          details.map((product , i) => (
                            <div className="w-full" key={i}>
                              <div className="w-[90%] flex justify-around space-x-10 items-center py-2 ">
                                {/* <Image
                                src={product.image ? product.image : logo}
                                width={50}
                                height={50}
                                alt={product.name}
                                className="object-contain rounded-lg"
                              /> */}
                                {/* <div className=" flex flex ">  </div> */}
                                <p className="text-xl">{product.name}</p>
                                <p className="text-xl">
                                  {t("v.brand")} : {product.brand}
                                </p>
                                <p></p>
                              </div>
                              <hr className="bg-gray-300 h-[2px] w-full" />
                            </div>
                          ))}
                      </div>
                    )
                  )}
                </AccordionBody>
              </Accordion>
            ))
          ) : (
            <div className="text-lg text-center">
              {t("v.noFollowers")}
            </div>
          )}
          {/* <Accordion
          id={2}
          open={isOpen === 2}
          icon={
            <FiChevronDown
              className={`text-black ${
                isOpen == 2 ? `rotate-90` : `rotate-0`
              } transition-all duration-300`}
            />
          }
          className="px-4 bg-orange-100 bg-opacity-50 rounded-lg transition-all duration-500 my-1"
          animate={customAnimation}
        >
          <AccordionHeader
            onClick={() => {
              // setIsOpen(isOpen == 1 ? 0 : 1 );
              openAccordion(2);
            }}
            className="font-normal"
          >
            <div className="w-full flex justify-start items-center space-x-3 ">
              <Image
                src={lego}
                width={75}
                height={75}
                className="object-contain rounded-lg"
              />
              <p>Store name 2</p>
            </div>
          </AccordionHeader>
          <AccordionBody>Body</AccordionBody>
        </Accordion> */}
        </div>
      )}
    </div>
  );
}

export default withVendorLayout(MyFollowers);

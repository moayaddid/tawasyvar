import Image from "next/image";
import Variation from "../AdminVariations/Variation";
import { ResponsiveCarousel } from "../CarouselCustomer/carousel";
import kuala from "@/public/images/kuala.jpg";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { set } from "nprogress";
import { MdCheck } from "react-icons/md";
import { Ring } from "@uiball/loaders";
import logo from "@/public/images/tawasylogo.png";
import { useDispatch, useSelector } from "react-redux";
import { vendorActions } from "@/Store/VendorSlice";
import { useTranslation } from "next-i18next";

function VendorProductCombination({ product }) {
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const Api = createAxiosInstance(router);
  const [hex, setHex] = useState(product.hex && product.hex);
  const selectedProducts = useSelector((state) => state.vendor.products);
  const {t} = useTranslation("") ;

  useEffect(() => {
    if (product) {
      if (product.hex) {
        setHex(product.hex);
      }
    }
  }, []);

  let vari = [];
  const variations = product.variations.map((variation) => {
    vari.push(variation.option);
  });
  vari = vari.join(" / ");

  const imagesArray = [];

  if (product.variations && product.variations.length > 0) {
    product.variations.forEach((variation) => {
      if (variation.image) {
        imagesArray.push(variation.image);
      }
    });
  }

  if (imagesArray.length === 0) {
    if (product.image) {
      imagesArray.push(product.image);
    } else {
      imagesArray.push(logo);
    }
  }

  // console.log(product.hex);

  async function selectCombination() {
    // setSelecting(true);
    // try {
    //   const response = await Api.post(
    //     `/api/seller/select-product/${product.id}`,
    //     {
    //       variation: product.line_id,
    //     }
    //   );
    //   setSelecting(false);
    //   setSelected(true);
    // } catch (error) {
    //   setSelecting(false);
    // }
    // setSelecting(false);
    dispatch(vendorActions.selectProduct(product));
  }

  function isSelected() {
    if (selectedProducts) {
      // console.log(selectedProducts);
      return selectedProducts.some((prod) => {
        if (prod.line_id) {
          return prod.line_id === product.line_id;
        } else {
          return prod.id === product.id;
        }
      });
    }
  }

  return (
    <div className="flex w-full justify-between items-center py-3 border-b-2 border-gray-300">
      <p>{product.name}</p>
      <p>{vari}</p>
     { hex && <div
        className={`flex items-center justify-center w-[25px] p-3 h-[25px] rounded-full border border-skin-primary`}
        style={{ backgroundColor: `${hex && hex}` }}
      ></div>}
      <p>Part Number : {product.part_number ?? " - "}</p>
      <div className="max-w-[200px] overflow-x-auto ">
        {imagesArray.map((image, i) => {
          return (
            <Image
              // onError={logo}
              key={i}
              src={image ? image : logo}
              width={50}
              height={50}
              alt={`image`}
              className="px-1"
            />
          );
        })}
      </div>
      {isSelected() == true ? (
        <div
        //   onClick={selectCombination}
          className="px-2 py-1 bg-gray-500 rounded-lg text-white text-center"
        >
          {t("v.selected")}
        </div>
      ) : (
        //   : selecting == true ? (
        //     <div>
        //       <Ring size={2} speed={2} lineWeight={5} color="#ff6600" />
        //     </div>
        //   )
        <button
          onClick={selectCombination}
          className="px-2 py-1 bg-skin-primary rounded-lg text-white text-center hover:opacity-70"
        >
          {t("seller.addProduct.selectProduct")}
        </button>
      )}
    </div>
  );
}

export default VendorProductCombination;

import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import logo from "@/public/images/tawasylogo.png";
import { IoMdGitBranch } from "react-icons/io";
import SellerCombination from "../SellerVariations/SellerCombination";
import TawasyLoader from "../UI/tawasyLoader";

function SellerProduct({ product, refetch }) {
  const [isToggled, setIsToggled] = useState(product.availability);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState(false);
  const [editingPrice, setEditingPrice] = useState(false);
  const [price, setPrice] = useState(product.price);
  const [isAddingCombination, setIsAddingCobination] = useState(false);
  const [loadingVariations, setIsLoadingVariations] = useState(false);
  const newPrice = useRef();
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const storeId = Cookies.get("Sid");
  const [productVariations, setCombinations] = useState();
  const { t } = useTranslation("");

  const nid = [];
  if (product.combination) {
    product?.combination?.variations.map((vari) => {
      nid.push(vari.option);
    });
  }

  const imagesArray = [];

  if (
    product.combination?.variations &&
    product.combination?.variations.length > 0
  ) {
    product.combination?.variations.forEach((variation) => {
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

  async function handleAvailable() {
    setEditingAvailability(true);
    let availability;
    try {
      if (isToggled == true) {
        availability = false;
      } else if (isToggled == false) {
        availability = true;
      }
      if (product.combination != null) {
        const response = await Api.put(
          `api/seller/store/${storeId}/product/${product.id}/availability`,
          {
            availability: availability,
            variation: product.product_combination_id,
          }
        );
      } else {
        const response = await Api.put(
          `api/seller/store/${storeId}/product/${product.id}/availability`,
          {
            availability: availability,
          }
        );
      }
      // console.log(`availability change`);
      // console.log(response);
    } catch (error) {
      // console.log(error);
      setEditingAvailability(false);
      return;
    }
    setIsToggled(availability);
    setIsToggled(!isToggled);
    setEditingAvailability(false);
  }

  async function savePrice() {
    setEditingPrice(true);
    try {
      if (product.combination) {
        const response = await Api.put(
          `api/seller/store/${storeId}/product/${product.id}/price`,
          {
            price: newPrice.current.value,
            variation: product.product_combination_id,
          }
        );
      } else {
        const response = await Api.put(
          `api/seller/store/${storeId}/product/${product.id}/price`,
          {
            price: newPrice.current.value,
          }
        );
      }
      setPrice(newPrice.current.value);
      setIsEditing(false);
    } catch (error) {
      // console.log(error);
    }
    // setIsEditing(false);
    setEditingPrice(false);
  }

  async function deleteProduct() {
    setDeleting(true);
    try {
      if (product.combination) {
        const response = await Api.delete(
          `api/seller/store/${storeId}/product/${product.id}`,
          {
            headers: {},
            data: { variation: product.product_combination_id },
          }
        );
      } else {
        const response = await Api.delete(
          `api/seller/store/${storeId}/product/${product.id}`
        );
      }
      refetch();
      setIsDeleting(false);
      setDeleting(false);
    } catch (error) {
      // setIsDeleting(false);
      setDeleting(false);
      // console.log(error);
    }
  }

  async function openAddVariation() {
    setIsAddingCobination(true);
    setIsLoadingVariations(true);
    try {
      const response = await Api.get(
        `/api/seller/get-product-combination-seller/${storeId}/${product.id}`
      );
      setCombinations(response);
      setIsLoadingVariations(false);
    } catch (error) {
      setIsLoadingVariations(false);
    }
    setIsLoadingVariations(false);
  }

  return (
    <>
      <tr
        key={product.id}
        className="py-10 px-0 bg-gray-100 hover:bg-gray-200 font-medium"
      >
        <td className="px-4 py-4">{product.id}</td>
        <td class="px-4 py-4">
          <div class="flex md:flex-wrap flex-col items-center space-y-3 lg:space-y-1">
            <button
              onClick={() => setIsEditing(true)}
              class="items-center px-2 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              <FiEdit />
            </button>
            <button
              class="items-center px-2 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none"
              onClick={() => {
                setIsDeleting(true);
              }}
            >
              <RiDeleteBin6Line />
            </button>
            {product.combination && (
              <button
                class="items-center px-2 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none"
                onClick={() => {
                  openAddVariation();
                }}
              >
                <IoMdGitBranch />
              </button>
            )}
          </div>
        </td>
        <td className="px-4 py-4">{price}</td>
        <td className="px-4 py-4">
          <Link href={`/Products/${product.slug}`} legacyBehavior>
            <a
              target="_blank"
              className="border-b border-transparent hover:border-gray-400 cursor-pointer"
            >
              {product.name}
            </a>
          </Link>
        </td>
        {/* <td className="px-4 py-4">{product.description}</td> */}
        <td className="px-4 py-4 self-center ">
          <p>{product.combination ? nid.join(" - ") : `-`}</p>
          {product.combination?.hex && (
            <div
              className={`flex items-center justify-center mx-auto w-[25px] p-3 h-[25px] rounded-full border border-skin-primary`}
              style={{
                backgroundColor: `${
                  product.combination?.hex && product.combination?.hex
                }`,
              }}
            ></div>
          )}
        </td>
        <td className="px-4 py-4">
          {product.combination ? product.combination.part_number : `-`}
        </td>
        <td className="px-4 py-4">{product.category}</td>
        <td className="px-4 py-4">
          {imagesArray &&
            imagesArray.length > 0 &&
            imagesArray.map((image, i) => {
              return (
                <Image
                  key={i}
                  src={image}
                  alt="photo"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              );
            })}
        </td>
        <td onClick={handleAvailable} className="  ">
          {editingAvailability ? (
            <div className="w-min h-min mx-auto ">
              <Ring size={15} lineWeight={5} speed={2} color="#ff6600" />
            </div>
          ) : isToggled ? (
            <BsToggleOn
              className="cursor-pointer"
              style={{
                width: "25px",
                height: "35px",
                color: "#ff6600",
                margin: `auto`,
              }}
            />
          ) : (
            <BsToggleOff
              className="cursor-pointer"
              style={{
                width: "25px",
                height: "35px",
                color: "#ff6600",
                margin: `auto`,
              }}
            />
          )}
        </td>
        <td className="px-4 py-4">{product.brand && product.brand.name}</td>
        {/* <td className="px-4 py-4">{product.sold_quantity}</td> */}
      </tr>

      <Dialog
        open={isEditing}
        onClose={() => {
          setIsEditing(false);
        }}
        fullWidth
        dir={router.locale == "ar" ? "rtl" : "ltr"}
      >
        <DialogTitle className="flex justify-between border-b-2 border-black ">
          <h4 className="">
            {t("seller.products.action.edit.editProduct")}: {product.name}
          </h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <p>{t("orders.orderDetails.price")} :</p>
            <input
              className="mb-7 text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
              type="numbere"
              defaultValue={price}
              // placeholder={price}
              ref={newPrice}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="bg-lime-950 px-8 py-3 text-white rounded-lg "
            data-dismiss="modal"
            onClick={savePrice}
          >
            {editingPrice == true ? (
              <div className="flex justify-center items-center">
                <Ring size={25} lineWeight={5} speed={2} color="white" />
              </div>
            ) : (
              t("seller.products.action.edit.save")
            )}
          </button>
          <button
            type="button"
            className="bg-zinc-500 px-8 py-3 text-white rounded-lg"
            data-dismiss="modal"
            onClick={() => {
              setIsEditing(false);
            }}
          >
            {t("seller.products.action.edit.cancel")}
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleting}
        onClose={() => {
          setIsDeleting(false);
        }}
        fullWidth
        dir={router.locale == "ar" ? "rtl" : "ltr"}
      >
        <DialogTitle className="flex justify-between border-b-2 border-black ">
          <h4 className="">
            {t("seller.products.action.delete.deleteProduct")}:
          </h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <div className="flex flex-col justify-start items-start w-full ">
              <p className="text-lg ">
                {t("seller.products.action.delete.areYouSure")}
              </p>
              <p className="text-xl">{product.name}</p>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="bg-green-700 px-8 py-3 text-white rounded-lg "
            data-dismiss="modal"
            onClick={deleteProduct}
          >
            {deleting == true ? (
              <div className="flex justify-center items-center">
                <Ring size={25} lineWeight={5} speed={2} color="white" />
              </div>
            ) : (
              t("seller.products.action.delete.yes")
            )}
          </button>
          <button
            type="button"
            className="bg-zinc-500 px-8 py-3 text-white rounded-lg"
            data-dismiss="modal"
            onClick={() => {
              setIsDeleting(false);
            }}
          >
            {t("seller.products.action.delete.no")}
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isAddingCombination}
        onClose={() => {
          setIsAddingCobination(false);
          setCombinations();
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle className=" border-b-2 border-gray-200">
          <h3 className="py-2 pl-3 text-gray-600">
            {t("seller.products.addCombinations")} : {product.name}
          </h3>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} margin={2}>
            {loadingVariations == true ? (
              <div className="w-full h-full flex justify-center items-center">
                <TawasyLoader width={200} height={200} />
              </div>
            ) : productVariations &&
              productVariations.data.product_combination &&
              productVariations.data.product_combination.length > 0 ? (
              productVariations.data.product_combination.map(
                (combination, index) => {
                  return (
                    <SellerCombination
                      key={index}
                      product={combination.product}
                    />
                  );
                }
              )
            ) : (
              <div className="text-center">{t("noCombinations")}</div>
            )}
          </Stack>
        </DialogContent>

        <DialogActions className="w=full my-3 box-border ">
          <button
            onClick={() => {
              router.push("/seller/products/addProducts?type=allProducts");
              setIsAddingCobination(false);
              setCombinations();
            }}
            className="px-2 py-1 mx-auto bg-green-500 hover:bg-green-600 rounded-lg text-white min-w-[20%] text-center"
          >
            {t("seller.products.action.edit.save")}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SellerProduct;

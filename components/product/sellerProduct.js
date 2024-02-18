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
import { convertMoney } from "../SellerOrders/sellerOrder";

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

  const hasVendor = true;
  // const isFollow = false;
  const [fetchingVendors, setFetchingVendors] = useState(false);
  const [isFetchingProductDetails, setIsFetchingProductDetails] =
    useState(false);
  const [following, setFollowing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [unfollowing, setUnfollowing] = useState(false);
  const [vendors, setVendors] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [follow, setFollow] = useState(false);
  const [savingEdits, setSavingEdits] = useState(false);
  const [secondaryPrice, setSecondaryPrice] = useState(); // the price that would be used for the editing
  const [isFollowing, setIsFollowing] = useState(true); // the seller is following a vendor for this product
  const [isEditingVendorPrice, setISEditingVendorPrice] = useState(false);
  const [finalPrice, setFinalPrice] = useState(null); // the price after the equation
  // const [amount, setAmount] = useState(null); // the amount that would be added to the price or deducted from the price regardless of it being a literal amount or a percentage
  const [isPercentage, setIsPercentage] = useState(true); // true for percentage - false for SYP
  const [increase, setIncrease] = useState(true); // true for increasing - false for decreasing
  const priceRef = useRef(); // the price of the vendor before the seller edit it
  // const [percentageInput, setPercentageInput] = useState(0);
  // const [percentageDecimalInput, setPercentageDecimalInput] = useState(0);
  const percentageRef = useRef();
  const percentageDecimalRef = useRef();
  const amount = useRef();
  // const [amountInput, setAmountInput] = useState("");

  function handlePercentChange(e) {
    percentageRef.current = e.target.value;
    calculateFinalPrice();
  }

  function handlePercentKey(e) {
    const isNumeric = /^[0-9]$/;
    if (!isNumeric.test(e.key)) {
      e.preventDefault();
    }
  }

  function handlePercentDecimalChange(e) {
    percentageDecimalRef.current = e.target.value;
    calculateFinalPrice();
  }

  function handlePercentDecimalKey(e) {
    const isNumeric = /^[0-9]$/;
    if (!isNumeric.test(e.key)) {
      e.preventDefault();
    }
  }

  function handleAmountChange(e) {
    amount.current = e.target.value;
    calculateFinalPrice();
  }

  function handleamountKey(e) {
    const isNumeric = /^[0-9]$/;
    if (!isNumeric.test(e.key)) {
      e.preventDefault();
    }
  }

  const nid = [];
  if (product.combination) {
    product?.combination?.variations.map((vari) => {
      nid.push(vari.option);
    });
  }

  function calculateFinalPrice(e) {
    // e.preventDefault();
    if (increase === `increase` && isPercentage === `amount`) {
      setFinalPrice(
        Math.round(
          Number(Number(priceRef.current.value) + Number(amount.current)) / 50
        ) * 50
      );
      return;
    }
    if (isPercentage === `percentage` && increase === `increase`) {
      setFinalPrice(
        Math.round(
          Number(
            Number(priceRef.current.value) +
              (Number(priceRef.current.value) *
                Number(
                  `${percentageRef.current.valueOf() || 0}.${
                    percentageDecimalRef.current.valueOf() || 0
                  }`
                )) /
                100
          ) / 50
        ) * 50
      );
      return;
    }
    if (isPercentage === `percentage` && increase === `decrease`) {
      setFinalPrice(
        Math.round(
          Number(
            Number(priceRef.current.value) -
              (Number(priceRef.current.value) *
                Number(
                  `${percentageRef.current.valueOf() || 0}.${
                    percentageDecimalRef.current.valueOf() || 0
                  }`
                )) /
                100
          ) / 50
        ) * 50
      );
      return;
    }

    if (isPercentage === `amount` && increase === `decrease`) {
      setFinalPrice(
        Math.round(
          Number(Number(priceRef.current.value) - Number(amount.current)) / 50
        ) * 50
      );
      return;
    }
    setFinalPrice(Number(priceRef.current.value));
    return;
    // }
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

  async function fetchVendors() {
    setFetchingVendors(true);
    try {
      if (product.combination) {
        const response = await Api.get(
          `api/seller/vendor/${product.id}?line_id=${product.product_combination_id}`
        );
        // console.log(`variation vendors`);
        // console.log(response);
        setVendors(response?.data?.vendors);
      } else {
        const response = await Api.get(`api/seller/vendor/${product.id}`);
        // console.log(`vendors`);
        // console.log(response);
        setVendors(response?.data?.vendors);
      }
      setFetchingVendors(false);
    } catch (error) {
      setFetchingVendors(false);
    }
    setFetchingVendors(false);
  }

  function closeEditing() {
    setIsEditing(false);
    setIsPercentage(null);
    setIncrease(null);
    percentageDecimalRef.current = 0;
    percentageRef.current = 0;
    amount.current = 0;
    setFinalPrice(null);
    setSelectedVendor(null);
    setFollow(false);
    setVendors(null);
  }

  async function unFollowVendor() {
    setUnfollowing(true);
    try {
      const response = await Api.post(
        `/api/seller/unfollow-price/${product.vendor[0].vendor_id}`,
        {
          store_product_id: product.store_product_id,
        }
      );
      refetch();
      closeEditing();
      setUnfollowing(false);
    } catch (error) {
      setUnfollowing(false);
    }
    setUnfollowing(false);
  }

  async function followVendor() {
    setFollowing(true);
    try {
      const response = await Api.post(
        `/api/seller/follow-price/${selectedVendor}`,
        {
          store_product_id: product.store_product_id,
        }
      );
      refetch();
      closeEditing();
      setFollowing(false);
    } catch (error) {
      setFollowing(false);
    }
    setFollowing(false);
  }

  async function resetEdits() {
    setIsResetting(true);
    try {
      const response = await Api.put(
        `/api/seller/pause-editing/${product.store_product_id}`
      );
      setIsResetting(false);
      refetch();
      closeEditing();
    } catch (error) {
      setIsResetting(false);
    }
    setIsResetting(false);
  }

  async function saveVendorEdits() {
    calculateFinalPrice();
    setSavingEdits(true);
    try {
      const response = await Api.put(
        `/api/seller/edit-vendor-price/${product.store_product_id}`,
        {
          is_edited: isEditingVendorPrice,
          is_increase: increase == `increase` ? true : false,
          is_percentage: isPercentage == `percentage` ? true : false,
          amount:
            isPercentage === "percentage"
              ? Number(
                  `${percentageRef.current?.valueOf() || 0}.${
                    percentageDecimalRef.current?.valueOf() || 0
                  }`
                )
              : amount.current,
          final_price: finalPrice,
        }
      );
      refetch();
      closeEditing();
      setSavingEdits(false);
    } catch (error) {
      setSavingEdits(false);
    }
    setSavingEdits(false);
  }

  // console.log(selectproduct);
  async function openEdit() {
    setIsEditing(true);
    if (product.is_edited === 1) {
      setIsFetchingProductDetails(true);
      try {
        const response = await Api.get(
          `/api/seller/product-data/${product.store_product_id}`
        );
        // console.log(response.data);
        setPrice(Number(response.data.store_product.price));
        setIsPercentage(
          response.data.store_product.is_percentage === 1
            ? `percentage`
            : `amount`
        );
        setIncrease(
          response.data.store_product.is_increase === 1
            ? `increase`
            : `decrease`
        );
        setISEditingVendorPrice(
          response.data.store_product.is_edited === 1 ? true : false
        );
        setFinalPrice(Number(response.data.store_product.final_price));
        if (response.data.store_product.is_percentage === 1) {
          // percentageRef.current = Number(response.data.store_product.amount);
          let original = Number(response.data.store_product.amount);
          let wholeNumber = Math.floor(original);
          let decimalPart = (original - wholeNumber) * 10;
          decimalPart = Math.floor(decimalPart);
          percentageRef.current = wholeNumber;
          percentageDecimalRef.current = decimalPart;
        } else {
          amount.current = Number(response.data.store_product.amount);
        }
        setIsFetchingProductDetails(false);
      } catch (error) {
        setIsFetchingProductDetails(false);
      }
      setIsFetchingProductDetails(false);
    }
  }

  function findPrice (id) {
    if(vendors){
     vendors.map((v) => {
      if(v.vendor_id == id){
        priceRef.current.value = v.vendor_price ;
      }
     });
    }
  }

  useEffect(() => {
    if (follow == true) {
      fetchVendors();
    } else {
      setSelectedVendor(null);
      if (priceRef) {
        if (priceRef.current && priceRef.current.value) {
          priceRef.current.value = product.price || null;
        }
      }
    }
    if (isEditingVendorPrice == false) {
      setIsPercentage();
      setIncrease();
      percentageDecimalRef.current = 0;
      percentageRef.current = 0;
      amount.current = 0;
      setFinalPrice();
    }
  }, [follow, isEditingVendorPrice]);

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
              onClick={openEdit}
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
        { price && <td className="px-4 py-4">{convertMoney(Number(price))}</td>}
        <td className="px-4 py-4">{product.final_price ? convertMoney(Number(product.final_price)) : `-`}</td>
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
        <td
          className={`px-8 py-4 ${
            product.has_vendor === 1 ? `text-green-500` : `text-red-500`
          }`}
        >
          {product.has_vendor === 1
            ? (router.locale === `en`)
              ? `Yes`
              : `نعم`
            : (router.locale === `en`)
            ? `No`
            : `لا`}
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
                  className="object-contain max-h-[100px] min-h-[100px]"
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
        onClose={
          // setIsEditing(false);
          // setIsPercentage(null);
          // setIncrease(null);
          // percentageDecimalRef.current = 0;
          // percentageRef.current = 0;
          // setSelectedVendor(null);
          // setVendors(null);
          closeEditing
        }
        fullWidth
        maxWidth="lg"
        dir={router.locale == "ar" ? "rtl" : "ltr"}
      >
        <DialogTitle className="flex justify-between border-b-2 border-black ">
          <p className="">
            {t("seller.products.action.edit.editProduct")}: {product.name}
          </p>
        </DialogTitle>
        {isFetchingProductDetails == true ? (
          <DialogContent className="flex justify-center items-center w-full">
            <TawasyLoader width={200} height={200} />
          </DialogContent>
        ) : (
          <DialogContent>
            {product.has_vendor && product.has_vendor == true ? (
              <Stack spacing={1} margin={3}>
                <div className="flex flex-col justify-start items-start space-y-4 w-full">
                  {product.is_following == false && (
                    <p className="text-sm">{t("hasVendors")}</p>
                  )}
                  {product.is_following == false ? (
                    <div className="w-full flex flex-col justify-around items-start space-y-4">
                      <div className=" w-full flex justify-start items-center space-x-4">
                        <label htmlFor="checkbox" className="select-none w-max">
                          <input
                            id="checkbox"
                            className=" outline-none bg-transparent w-[25px] text-start"
                            type="checkbox"
                            checked={follow}
                            onChange={() => setFollow((prev) => !prev)}
                          />
                          {t("followVendor")} :
                        </label>
                        {follow == true && (
                          <div className="w-[60%] flex justify-start items-center space-x-3">
                            <div className="flex justify-start items-center w-max">
                              {fetchingVendors == true ? (
                                <div className="flex justify-center items-center">
                                  <Ring
                                    size={20}
                                    speed={3}
                                    lineWeight={5}
                                    color="#FF6600"
                                  />
                                </div>
                              ) : vendors ? (
                                <div className="flex justify-center items-center space-x-3">
                                  <select
                                    className="bg-transparent"
                                    onChange={(e) => {
                                      setSelectedVendor(e.target.value);
                                      findPrice(e.target.value);
                                      // priceRef.current.value = e.target.value.price
                                    }}
                                    // defaultValue={product.is_edited === 1 && }
                                  >
                                    <option selected value={null} disabled>
                                      {t("selectVendor")}
                                    </option>
                                    {vendors &&
                                      vendors.map((vendor, i) => {
                                        return (
                                          <option
                                            // onClick={() => {
                                            //   priceRef.current.value =
                                            //     vendor.vendor_price;
                                            // }}
                                            key={i}
                                            id={vendor.vendor_id}
                                            value={vendor.vendor_id}
                                          >
                                            {`${vendor.vendor_name} - ${vendor.vendor_price} S.P`}
                                          </option>
                                        );
                                      })}
                                  </select>
                                </div>
                              ) : (
                                <div className="text-xs">
                                  {t("noVendorsFound")}
                                </div>
                              )}
                            </div>
                            {following == true ? (
                              <div className="w-[30%] transition-all duration-500 bg-green-500 text-white hover:opacity-80 flex justify-center items-center rounded-lg text-center px-2 py-1">
                                <Ring
                                  size={25}
                                  speed={3}
                                  lineWeight={5}
                                  color="white"
                                />
                              </div>
                            ) : (
                              <button
                                disabled={follow == true && !selectedVendor}
                                onClick={followVendor}
                                className="w-[30%] transition-all duration-500 bg-green-500 text-white hover:opacity-80 disabled:bg-gray-400 disabled:opacity-80 disabled:cursor-default rounded-lg text-center px-2 py-1"
                              >
                                {t("follow")}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-start items-center space-x-2">
                        <p>{t("orders.orderDetails.price")} :</p>
                        {follow == true ? (
                          <input
                            className=" text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                            type="text"
                            // defaultValue={price}
                            disabled
                            // placeholder={price}
                            ref={priceRef}
                          />
                        ) : (
                          <input
                            className=" text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                            type="text"
                            defaultValue={price}
                            // placeholder={price}
                            ref={newPrice}
                            required
                          />
                        )}
                      </div>
                      <div className="w-full flex justify-end items-center space-x-3">
                        {follow == false &&
                          (editingPrice == true ? (
                            <div className="bg-green-600 flex justify-center items-center w-[20%] px-2 py-3 text-white rounded-lg ">
                              <Ring
                                size={25}
                                lineWeight={5}
                                speed={2}
                                color="white"
                              />
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="bg-green-600 hover:opacity-80 w-[20%] px-2 py-3 text-white rounded-lg "
                              data-dismiss="modal"
                              onClick={savePrice}
                            >
                              {t("seller.products.action.edit.save")}
                            </button>
                          ))}
                        <button
                          type="button"
                          className="bg-zinc-500 hover:opacity-80 w-[20%] text-center px-2 py-3 text-white rounded-lg"
                          data-dismiss="modal"
                          onClick={closeEditing}
                        >
                          {t("seller.products.action.edit.cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col justify-center items-start space-y-4">
                      <div className="w-full flex justify-start items-center space-x-6">
                        <p>
                          {t("followingOf")}
                          {product.vendor &&
                            product.vendor.length > 0 &&
                            product.vendor[0].vendor_name}
                        </p>
                        {unfollowing == true ? (
                          <div className="w-[15%] flex justify-center items-center text-center px-2 py-1 rounded-lg bg-red-500 text-white hover:opacity-80">
                            <Ring
                              size={25}
                              speed={3}
                              lineWeight={5}
                              color="white"
                            />
                          </div>
                        ) : (
                          <button
                            onClick={unFollowVendor}
                            className="w-[15%] text-center px-2 py-1 rounded-lg bg-red-500 text-white hover:opacity-80"
                          >
                            {t("unfollow")}
                          </button>
                        )}
                      </div>
                      <hr />
                      <div className="flex justify-start items-center space-x-4 w-full">
                        <label>
                          <input
                            id="checkbox"
                            className=" outline-none bg-transparent disabled:accent-gray-500 disabled:cursor-default w-[25px] text-start"
                            type="checkbox"
                            checked={isEditingVendorPrice}
                            disabled={product.is_edited === 1}
                            onChange={() =>
                              setISEditingVendorPrice((prev) => !prev)
                            }
                          />
                          {t("editVendorsPrice")} ?
                        </label>
                        {isEditingVendorPrice == true &&
                          product.is_edited === 1 &&
                          (isResetting == true ? (
                            <div className="w-[15%] flex justify-center items-center text-center px-2 py-1 rounded-lg bg-red-500 text-white hover:opacity-80">
                              <Ring
                                size={25}
                                speed={3}
                                lineWeight={5}
                                color="white"
                              />
                            </div>
                          ) : (
                            <button
                              onClick={resetEdits}
                              className="w-[15%] text-center px-2 py-1 rounded-lg bg-red-500 text-white hover:opacity-80"
                            >
                              {t("resetEdits")}
                            </button>
                          ))}
                      </div>
                      <div className="flex justify-start items-center space-x-3">
                        <input
                          className=" text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                          type="text"
                          defaultValue={price}
                          placeholder={`Price`}
                          ref={priceRef}
                          disabled
                          required
                        />
                        {isEditingVendorPrice == true && (
                          <div className="flex justify-start items-center space-x-3">
                            <form
                              // onSubmit={calculateFinalPrice}
                              className="flex justify-start items-center space-x-3"
                            >
                              <select
                                className="bg-transparent border-b border-skin-primary border-opacity-50 pb-1 w-[75px] cursor-pointer "
                                onChange={(e) => {
                                  setIncrease(e.target.value);
                                }}
                                defaultValue={
                                  (product.is_edited && increase) || null
                                }
                                required
                              >
                                <option
                                  selected
                                  disabled
                                  className=""
                                >{` + / - `}</option>
                                <option
                                  className="text-center cursor-pointer"
                                  value={`increase`}
                                >
                                  +
                                </option>
                                <option
                                  className="text-center cursor-pointer"
                                  value={`decrease`}
                                >
                                  -
                                </option>
                              </select>
                              <select
                                className="bg-transparent border-b border-skin-primary transition-all duration-500 disabled:opacity-50 disabled:border-gray-300 disabled:cursor-default border-opacity-50 pb-1 w-[75px] cursor-pointer "
                                onChange={(e) => {
                                  setIsPercentage(e.target.value);
                                }}
                                required
                                defaultValue={
                                  (product.is_edited && isPercentage) || null
                                }
                                disabled={
                                  increase == null || increase == undefined
                                }
                              >
                                <option
                                  selected
                                  disabled
                                  className="flex justify-between items-center  "
                                >
                                  % / SYP
                                </option>
                                <option
                                  className="text-center cursor-pointer "
                                  value={`percentage`}
                                >
                                  %
                                </option>
                                <option
                                  className="text-center cursor-pointer"
                                  value={`amount`}
                                >
                                  SYP
                                </option>
                              </select>
                              {/* {isPercentage === true ? ( */}
                              {/* // percentage input */}
                              {isPercentage == "percentage" ? (
                                <div className="flex justify-start items-center space-x-1">
                                  <input
                                    type="text"
                                    maxLength={2}
                                    onKeyPress={handlePercentKey}
                                    onChange={handlePercentChange}
                                    // ref={percentageRef}
                                    defaultValue={
                                      (product.is_edited &&
                                        percentageRef.current) ||
                                      percentageRef?.current ||
                                      0
                                    }
                                    disabled={
                                      increase == null ||
                                      increase == undefined ||
                                      isPercentage == null ||
                                      isPercentage == undefined
                                    }
                                    required
                                    className="outline-none border-b-2 w-[30px] transition-all duration-500 border-gray-300 focus:border-skin-primary"
                                  />
                                  <p>.</p>
                                  <input
                                    type="text"
                                    maxLength={1}
                                    onKeyPress={handlePercentDecimalKey}
                                    onChange={handlePercentDecimalChange}
                                    // ref={percentageDecimalRef}
                                    // defaultValue={0}
                                    defaultValue={
                                      (product.is_edited &&
                                        percentageDecimalRef.current) ||
                                      percentageDecimalRef?.current ||
                                      0
                                    }
                                    disabled={
                                      increase == null ||
                                      increase == undefined ||
                                      isPercentage == null ||
                                      isPercentage == undefined
                                    }
                                    className="outline-none border-b-2 w-[20px] transition-all duration-500 border-gray-300 focus:border-skin-primary"
                                  />
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  maxLength={7}
                                  disabled={
                                    increase == null ||
                                    increase == undefined ||
                                    isPercentage == null ||
                                    isPercentage == undefined
                                  }
                                  defaultValue={
                                    (product.is_edited && amount.current) ||
                                    amount?.current ||
                                    0
                                  }
                                  // step={null}
                                  onKeyPress={handleamountKey}
                                  onChange={handleAmountChange}
                                  className="outline-none border-b-2 transition-all duration-500 border-gray-300 focus:border-skin-primary"
                                />
                              )}
                            </form>
                            <p>{` = `}</p>
                            <p className="border-b-2 border-gray-300">
                              {t("finalEditedPrice")} :
                              {finalPrice ? convertMoney(finalPrice) : `  \t `}
                              SYP
                            </p>
                          </div>
                        )}
                      </div>
                      {isEditingVendorPrice == true && (
                        <div className="flex justify-center items-center space-x-4 w-full">
                          {savingEdits == true ? (
                            <div className="w-[15%] px-2 py-1 text-center bg-green-500 rounded-lg text-white flex justify-center items-center">
                              <Ring
                                size={20}
                                speed={3}
                                lineWeight={5}
                                color="white"
                              />
                            </div>
                          ) : (
                            <button
                              onClick={saveVendorEdits}
                              className="w-[15%] px-2 py-1 text-center bg-green-500 rounded-lg text-white disabled:bg-gray-400 disabled:opacity-80 hover:opacity-80"
                              disabled={
                                !finalPrice ||
                                !isPercentage ||
                                !increase ||
                                (isPercentage === `amount` &&
                                  !amount.current) ||
                                (isPercentage === `percentage` &&
                                  !percentageRef.current)
                              }
                            >
                              {t("saveEdits")}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Stack>
            ) : (
              <Stack spacing={1} margin={3}>
                <p>{t("orders.orderDetails.price")} :</p>
                <input
                  className="mb-7 text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                  type="text"
                  defaultValue={price}
                  // placeholder={price}
                  ref={newPrice}
                  required
                />
                <div className="w-full flex justify-end items-center space-x-3">
                  {editingPrice == true ? (
                    <div className="bg-green-600 flex justify-center items-center w-[20%] px-2 py-3 text-white rounded-lg ">
                      <Ring size={25} lineWeight={5} speed={2} color="white" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="bg-green-600 hover:opacity-80 w-[20%] px-2 py-3 text-white rounded-lg "
                      data-dismiss="modal"
                      onClick={savePrice}
                    >
                      {t("seller.products.action.edit.save")}
                    </button>
                  )}
                  <button
                    type="button"
                    className="bg-zinc-500 hover:opacity-80 w-[20%] text-center px-2 py-3 text-white rounded-lg"
                    data-dismiss="modal"
                    onClick={() => {
                      setIsEditing(false);
                    }}
                  >
                    {t("seller.products.action.edit.cancel")}
                  </button>
                </div>
              </Stack>
            )}
          </DialogContent>
        )}
        <DialogActions></DialogActions>
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
          <p className="">
            {t("seller.products.action.delete.deleteProduct")}:
          </p>
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
          <p className="py-2 pl-3 text-gray-600">
            {t("seller.products.addCombinations")} : {product.name}
          </p>
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

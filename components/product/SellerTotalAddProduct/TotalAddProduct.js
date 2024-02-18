import React, { useState, useEffect, useRef } from "react";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { TfiSave } from "react-icons/tfi";
import logo from "../../../public/images/tawasylogo.png";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import Link from "next/link";
import { MdCheck, MdClose } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
} from "@mui/material";
import { toast } from "react-toastify";
import { convertMoney } from "@/components/SellerOrders/sellerOrder";
import { useTranslation } from "react-i18next";
import { FaRegCircleCheck } from "react-icons/fa6";

function TotalAddProduct({ selectproduct, refetch }) {
  const [isSaving, setIsSaving] = useState(false);
  const [available, setAvailable] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fetchingVendors, setFetchingVendors] = useState(false);
  const [vendors, setVendors] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [follow, setFollow] = useState(false);
  const priceRef = useRef();
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const { t } = useTranslation();
  const [isDone, setIsDone] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [savingEdited, setSavingEdited] = useState(false);
  const [isEditingVendorPrice, setISEditingVendorPrice] = useState(false);
  const [finalPrice, setFinalPrice] = useState(null); // the price after the equation
  const [isPercentage, setIsPercentage] = useState(null); // true for percentage - false for SYP
  const [increase, setIncrease] = useState(null); // true for increasing - false for decreasing
  const percentageRef = useRef();
  const percentageDecimalRef = useRef();
  const amount = useRef();

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
                  `${percentageRef.current?.valueOf() || 0}.${
                    percentageDecimalRef.current?.valueOf() || 0
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
                  `${percentageRef.current?.valueOf() || 0}.${
                    percentageDecimalRef.current?.valueOf() || 0
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

  async function saveProduct() {
    if (follow == true && !selectedVendor) {
      toast.error(
        `Please select a vendor to follow or unCheck the follow vendor option //\b  الرجاء اختيار سعر الموّرد او الغي الاختيار و اكتب السعر المناسب`,
        { theme: "colored", autoClose: 3000 }
      );
    } else {
      if (follow == true && selectedVendor) {
        setOpenEdit(true);
      } else {
        if (selectproduct.variations && selectproduct.variations.length > 0) {
          setIsSaving(true);
          try {
            const response = await Api.post(
              `/api/seller/add-products-to-store/${selectproduct.product_id}`,
              {
                price: priceRef.current.value,
                availability: available,
                variation: selectproduct.line_id,
                follow_price: follow,
                vendor_id: selectedVendor || null,
              }
            );
            // refetch();
            setIsDone(true);
            setIsSaving(false);
          } catch (error) {
            // console.log(error);
          }
          setIsSaving(false);
        } else {
          setIsSaving(true);
          try {
            const response = await Api.post(
              `/api/seller/add-products-to-store/${selectproduct.product_id}`,
              {
                price: priceRef.current.value,
                availability: available,
                follow_price: follow,
                vendor_id: selectedVendor || null,
              }
            );
            // refetch();
            setIsDone(true);
            setIsSaving(false);
          } catch (error) {
            // console.log(error);
          }
          setIsSaving(false);
        }
      }
    }
  }

  async function saveEditedProduct() {
    calculateFinalPrice();
    setSavingEdited(true);
    // console.log(`in save edoted`);
    if (selectproduct.variations && selectproduct.variations.length > 0) {
      // console.log(`has variation save`);
      // setIsSaving(true);
      try {
        const response = await Api.post(
          `/api/seller/add-products-to-store/${selectproduct.product_id}`,
          {
            price: priceRef.current.value,
            availability: available,
            variation: selectproduct.line_id,
            follow_price: follow,
            vendor_id: selectedVendor || null,
            is_edited: isEditingVendorPrice,
            is_increase: increase == `increase` ? true : false,
            is_percentage: isPercentage == `percentage` ? true : false,
            amount:
              isPercentage === "percentage"
                ? Number(
                    `${percentageRef.current.valueOf() || 0}.${
                      percentageDecimalRef.current.valueOf() || 0
                    }`
                  )
                : amount.current,
            final_price: finalPrice ? finalPrice : priceRef.current.value,
          }
        );
        setOpenEdit(false);
        // refetch();
        setIsDone(true);
        setSavingEdited(false);
      } catch (error) {
        setSavingEdited(false);
      }
      setSavingEdited(false);
    } else {
      // console.log(`none variation save`);
      try {
        // console.log(`in try`);
        const response = await Api.post(
          `/api/seller/add-products-to-store/${selectproduct.product_id}`,
          {
            price: priceRef.current.value,
            availability: available,
            follow_price: follow,
            vendor_id: selectedVendor || null,
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
            final_price: finalPrice ? finalPrice : priceRef.current.value,
          }
        );
        setOpenEdit(false);
        // refetch();
        setIsDone(true);
        setSavingEdited(false);
      } catch (error) {
        console.log(error);
      }
      setSavingEdited(false);
    }
  }

  async function unSelectProduct() {
    if (selectproduct.variations && selectproduct.variations.length > 0) {
      setIsDeleting(true);
      try {
        const response = await Api.post(
          `/api/seller/unselect-product/${selectproduct.product_id}`,
          {
            variation: selectproduct.line_id,
          }
        );
        // refetch();
        setIsDeleted(true);
        setIsDeleting(false);
      } catch (error) {
        setIsDeleting(false);
      }
      setIsDeleting(false);
    } else {
      setIsDeleting(true);
      try {
        const response = await Api.post(
          `/api/seller/unselect-product/${selectproduct.product_id}`
        );
        // refetch();
        setIsDeleted(true);
        setIsDeleting(false);
      } catch (error) {
        setIsDeleting(false);
      }
      setIsDeleting(false);
    }
  }

  async function fetchVendors() {
    setFetchingVendors(true);
    try {
      if (selectproduct.line_id) {
        const response = await Api.get(
          `api/seller/vendor/${selectproduct.product_id}?line_id=${selectproduct.line_id}`
        );
        // console.log(`variation vendors`);
        // console.log(response);
        setVendors(response?.data?.vendors);
      } else {
        const response = await Api.get(
          `api/seller/vendor/${selectproduct.product_id}`
        );
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

  function findPrice (id) {
    if(vendors){
     vendors.map((v) => {
      if(v.vendor_id == id){
        priceRef.current.value = v.vendor_price ;
      }
     });
    }
  }

  // console.log(selectproduct);

  useEffect(() => {
    if (follow == true) {
      fetchVendors();
    } else {
      setSelectedVendor(null);
      if (priceRef) {
        priceRef.current.value = null;
      }
    }
  }, [follow]);

  // const variations = selectproduct.variations && selectproduct.variations.length > 0 && selectproduct.variations.option.join(`-`) ;
  let varis = [];
  const variations =
    selectproduct.variations &&
    selectproduct.variations.length > 0 &&
    selectproduct.variations.map((variant) => {
      varis.push(variant.option);
    });
  varis = varis.join(" / ");

  const imagesArray = [];

  if (selectproduct.variations && selectproduct.variations.length > 0) {
    selectproduct.variations.forEach((variation) => {
      if (variation.image) {
        imagesArray.push(variation.image);
      }
    });
  }

  if (imagesArray.length === 0) {
    if (selectproduct.image) {
      imagesArray.push(selectproduct.image);
    } else {
      imagesArray.push(logo);
    }
  }

  return (
    <>
      <tr
        key={selectproduct.product_id}
        aria-disabled={isDone == true || isDeleted == true}
        className={`even:bg-zinc-150 odd:bg-zinc-50 text-center md:text-base text-sm aria-disabled:pointer-events-none py-1 border-b-2 border-slate-300 aria-disabled:opacity-40 `}
      >
        <td>
          <Link href={`/Products/${selectproduct.slug}`} legacyBehavior>
            <a
              target="_blank"
              className="border-b border-transparent hover:border-gray-400"
            >
              {selectproduct.name}
            </a>
          </Link>
        </td>
        <td className="px-4">
          {selectproduct.variations && selectproduct.variations.length > 0 ? (
            <div className="flex justify-center items-center space-x-3">
              {" "}
              {/* {varis && varis.length > 0 && varis.map((variation) => {
                  return <p className="">{variation}</p>;
                })} */}
              <p>{varis && varis}</p>
            </div>
          ) : (
            <p className="text-base">This product has no variations</p>
          )}
        </td>
        <td>{selectproduct.brand}</td>
        <td>{selectproduct.category}</td>
        <td>
          {available ? (
            <BsToggleOn
              onClick={() => {
                setAvailable(false);
              }}
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
              onClick={() => {
                setAvailable(true);
              }}
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
        <td className="md:px-0 px-3 flex justify-center items-center">
          {imagesArray &&
            imagesArray.length > 0 &&
            imagesArray.map((image, i) => {
              return (
                <img
                  src={image}
                  key={i}
                  width={75}
                  height={75}
                  loading="lazy"
                  alt={selectproduct.name}
                />
              );
            })}
        </td>
        <td className=" px-3 ">
          {selectproduct.has_vendor && selectproduct.has_vendor === 1 ? (
            <div>
              <label
                htmlFor={`${selectproduct.product_id} - ${
                  selectproduct.variations ? varis : `null`
                } - ${selectproduct.name}`}
                className="select-none text-justify"
              >
                <input
                  id={`${selectproduct.product_id} - ${
                    selectproduct.variations ? varis : `null`
                  } - ${selectproduct.name}`}
                  className=" accent-[#ba14fb] outline-none hue-rotate-60 bg-transparent w-[25px] text-start"
                  type="checkbox"
                  checked={follow}
                  onChange={() => setFollow((prev) => !prev)}
                />
                {t("followVendor")}
              </label>
              {follow == true && (
                <div className="py-3">
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
                    <div className="flex justify-center items-center">
                      <select
                        className="bg-transparent"
                        onChange={(e) => {
                          findPrice(e.target.value);
                          setSelectedVendor(e.target.value);
                          // priceRef.current.value = e.target.value.price
                        }}
                      >
                        <option selected value={null} disabled>
                          {t("selectVendor")}
                        </option>
                        {vendors &&
                          vendors.map((vendor, i) => {
                            return (
                              <option
                                // onClick={() => {
                                //   priceRef.current.value = vendor.vendor_price;
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
                    <div className="text-xs">{t("noVendorsFound")}</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            // `This product has no vendor.`
            // t(`noVendors`)
            <p>{t("noVendors")}</p>
          )}
        </td>
        <td className="md:px-0 px-2">
          <input
            className="border-b-2 outline-none bg-transparent disabled:select-none px-2 focus:border-skin-primary transition-all duration-700 md:w-[50%] w-full "
            name="price"
            disabled={follow}
            ref={priceRef}
            placeholder="price"
          />
        </td>
        <td className="">
          {isDone == true ? (
            <div className="flex justify-center items-center">
              <FaRegCircleCheck className="w-[26px] h-[26px] text-green-500 " />
            </div>
          ) : isDeleted == true ? (
            <div className="flex justify-center items-center">
              <RxCrossCircled className="w-[28px] h-[28px] text-red-700 " />
            </div>
          ) : (
            <div className="h-full w-full flex justify-center items-center gap-2">
              {!isDeleting ? (
                <MdClose
                  onClick={unSelectProduct}
                  style={{
                    width: "26px",
                    height: "26px",
                    color: "rgb(171, 5, 5)",
                  }}
                  className="cursor-pointer border-b-2 border-transparent hover:border-[#ab0505] transition-all duration-500"
                />
              ) : (
                <Ring size={20} lineWeight={4} speed={2} color="#ff6600" />
              )}
              {!isSaving ? (
                <MdCheck
                  onClick={saveProduct}
                  style={{ width: "26px", height: "26px", color: "#005500" }}
                  className="cursor-pointer border-b-2 border-transparent hover:border-[#005500] transition-all duration-500"
                />
              ) : (
                <Ring size={20} lineWeight={4} speed={2} color="#ff6600" />
              )}
            </div>
          )}
        </td>
      </tr>

      <Dialog
        open={openEdit}
        maxWidth="lg"
        fullWidth
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle className="border-b border-gray-300">
          {t("editVendorsPrice")} :
        </DialogTitle>
        <DialogContent className="flex flex-col items-start justify-center space-y-4 w-[90%] mx-auto my-4 ">
          <div className="flex justify-start items-center space-x-4 w-full">
            <label>
              <input
                id="checkbox"
                className=" outline-none bg-transparent disabled:accent-gray-500 disabled:cursor-default w-[25px] text-start"
                type="checkbox"
                checked={isEditingVendorPrice}
                // disabled={product.is_edited === 1}
                onChange={() => setISEditingVendorPrice((prev) => !prev)}
              />
              {t("editVendorsPrice")} ?
            </label>
          </div>
          <div className="grid  lg:grid-flow-col grid-flow-row gap-2">
            <input
              className=" text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
              type="text"
              defaultValue={priceRef?.current?.value || 0}
              placeholder={`Price`}
              disabled
              required
            />
            {isEditingVendorPrice == true && (
              <div className="grid lg:grid-flow-col grid-flow-row gap-2">
                <form className="grid gap-2 grid-flow-col">
                  <select
                    className="bg-transparent border-b border-skin-primary border-opacity-50 pb-1 w-[75px] cursor-pointer "
                    onChange={(e) => {
                      setIncrease(e.target.value);
                    }}
                    required
                  >
                    <option selected disabled className="">{` + / - `}</option>
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
                    onChange={async (e) => {
                      setIsPercentage(e.target.value);
                      // calculateFinalPrice();
                      // while (true) {
                      //   if (isPercentage === e.target.value) {
                      //     if (
                      //       increase &&
                      //       (amount.current || percentageRef.current)
                      //     ) {
                      //       calculateFinalPrice();
                      //       break;
                      //     }
                      //   }
                      // }
                    }}
                    required
                    disabled={increase == null || increase == undefined}
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
                  {isPercentage == "percentage" ? (
                    <div className=" grid lg:grid-flow-col grid-flow-row">
                      <input
                        type="text"
                        maxLength={2}
                        onKeyPress={handlePercentKey}
                        onChange={handlePercentChange}
                        defaultValue={percentageRef?.current || 0}
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
                        defaultValue={
                          // (product.is_edited && percentageDecimalRef.current) ||
                          percentageDecimalRef.current || 0
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
                      defaultValue={amount.current || 0}
                      onKeyPress={handleamountKey}
                      onChange={handleAmountChange}
                      className="outline-none border-b-2 transition-all duration-500 border-gray-300 focus:border-skin-primary"
                    />
                  )}
                </form>
                <p className="border-b-2 text-start border-gray-300">
                  = {t("finalEditedPrice")} :
                  {finalPrice ? convertMoney(finalPrice) : `  \t `}
                  SYP
                </p>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions className="w-full flex justify-end items-center space-x-3">
          {savingEdited == true ? (
            <div className="w-[15%] flex justify-center items-center rounded-lg px-2 py-1 text-center text-white bg-green-500 hover:opacity-80">
              <Ring size={25} speed={3} lineWeight={5} color="white" />
            </div>
          ) : (
            <button
              disabled={
                isEditingVendorPrice == true
                  ? !finalPrice ||
                    !isPercentage ||
                    !increase ||
                    (isPercentage === `amount` && !amount.current) ||
                    (isPercentage === `percentage` && !percentageRef.current)
                  : false
              }
              onClick={saveEditedProduct}
              className="w-[15%] rounded-lg px-2 py-1 text-center text-white bg-green-500 hover:opacity-80 disabled:bg-gray-400 disabled:opacity-80"
            >
              {t("saveEdits")}
            </button>
          )}
          {/* <button>

              </button> */}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TotalAddProduct;

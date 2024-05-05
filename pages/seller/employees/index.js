import createAxiosInstance from "@/API";
import SellerEmployee from "@/components/SellerComponents/sellerEmployee";
import TawasyLoader from "@/components/UI/tawasyLoader";
import withLayout from "@/components/wrapping components/WrappingSellerLayout";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Ring } from "@uiball/loaders";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { MdClose } from "react-icons/md";
import { useQuery } from "react-query";

export async function getServerSideProps(context) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

function Employees() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [openAdd, setOpenAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const nameRef = useRef();
  const numberRef = useRef();
  const addressRef = useRef();
  const {t} = useTranslation("");
  const {
    data: employees,
    isLoading,
    refetch,
  } = useQuery("sellerEmployees", fetchSellerEmployees, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchSellerEmployees() {
    try {
      return await Api.get(`/api/seller/get-my-sellers`);
    } catch (error) {}
  }

  function openAddEmployee() {
    setOpenAdd(true);
  }

  function closeAddEmployee() {
    setOpenAdd(false);
  }

  async function submitEmployee(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await Api.post(`/api/seller/create-seller`, {
        name: nameRef.current.value,
        phone_number: numberRef.current.value,
        location: addressRef.current.value ?? null,
      });
      setSubmitting(true);
      refetch();
      closeAddEmployee();
    } catch (error) {
      setSubmitting(false);
    }
    setSubmitting(false);
  }

  const headers = [
    { header: t("seller.employees.name") },
    { header: t("seller.employees.phoneNumber") },
    { header: t("seller.employees.role") },
    // { header: `Address` },
    { header: ` ` },
  ];

  return (
    <>
      <div className="w-[90%] mx-auto h-screen flex flex-col justify-start items-center pt-8 space-y-5">
        <div className="w-full flex justify-between items-start">
          <p className="text-2xl font-medium">{t("seller.employees.myEmployees")} :</p>
          <button
            onClick={openAddEmployee}
            className="bg-skin-primary rounded-lg px-2 py-1 hover:opacity-75 text-white"
          >
            {t("seller.employees.addEmployee")}
          </button>
        </div>
        {isLoading == true ? (
          <div className="flex w-full h-full justify-center items-center">
            <TawasyLoader width={300} height={400} />
          </div>
        ) : employees && employees.data.employees.length > 0 ? (
          <table className=" relative table-auto w-full">
            <thead >
              <tr className="border-b-2 border-gray-400  capitalize" >
                {headers.map((header , i ) => {
                  return <th key={i} >{header.header}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {employees?.data?.employees?.map((employee, i) => {
                return (
                  <SellerEmployee
                    key={i}
                    employee={employee}
                    refetch={() => {
                      refetch();
                    }}
                  />
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="w-full text-center">{t("seller.employees.noEmployees")}</p>
        )}
      </div>

      <Dialog
        open={openAdd}
        onClose={closeAddEmployee}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className="w-full flex justify-between items-center">
          <p>{t("seller.employees.addEmployee")} : </p>
          <MdClose
            onClick={closeAddEmployee}
            className="w-[20px] h-[20px] text-black hover:text-red-500 border-b-2 border-transparent hover:border-red-500 transition-all duration-300"
          />
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={submitEmployee}
            className="w-[90%] mx-auto grid md:grid-cols-2 grid-cols-1 gap-3"
          >
            <div className="w-full flex flex-col justify-start items-start space-y-2">
              <label htmlFor="name">{t("seller.employees.eName")} :</label>
              <input
                type="text"
                ref={nameRef}
                placeholder={t("seller.employees.eName")}
                className="border-b-2 w-full outline-none border-zinc-500 text-black focus:border-skin-primary transition-all duration-300 ease-in-out px-1 "
                required
              />
            </div>
            <div className="w-full flex flex-col justify-start items-start space-y-2">
              <label htmlFor="name">{t("seller.employees.eNumber")} :</label>
              <input
                type="text"
                pattern="09[0-9]+"
                maxLength={10}
                ref={numberRef}
                placeholder={t("seller.employees.eNumber")}
                className="border-b-2 w-full text-black outline-none border-zinc-500 focus:border-skin-primary transition-all duration-300 ease-in-out px-1 "
                required
              />
            </div>
            <div className="w-full flex flex-col justify-start items-start space-y-2">
              <label htmlFor="name">{t("seller.employees.eAddress")} :</label>
              <input
                type="text"
                ref={addressRef}
                placeholder={t("seller.employees.eAddress")}
                className="border-b-2 w-full text-black outline-none border-zinc-500 focus:border-skin-primary transition-all duration-300 ease-in-out px-1 "
              />
            </div>
            <div></div>
            {submitting == true ? (
              <div className="bg-skin-primary md:w-[50%] w-[70%] text-white rounded-lg px-2 flex justify-center items-center py-1">
                <Ring size={20} speed={3} lineWeight={5} color="white" />
              </div>
            ) : (
              <button
                type="submit"
                className="bg-skin-primary md:w-[50%] w-[70%] text-white rounded-lg text-center px-2 py-1"
              >
                {t("seller.employees.submit")}
              </button>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default withLayout(Employees);

import createAxiosInstance from "@/API";
import AdminVendorProductRequest from "@/components/AdminVendor/AdminVendorProductRequest";
import withLayoutAdmin from "@/components/UI/adminLayout";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";

function VendorsProductRequests() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const {
    data: productsRequests,
    isLoading,
    refetch,
  } = useQuery(`ProductRequests`, fetchVendorsProductRequests, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchVendorsProductRequests() {
    return await Api.get(`/api/admin/vendors-requests`);
  }

  return (
    <div className="w-[90%] mx-auto  h-full my-auto ">
      <div className="w-full flex justify-start items-center">
        <p className="text-3xl py-10 "> Vendors Products Requests :</p>
      </div>
      <hr className="pb-5" />
      {isLoading == true ? (
        <div className="w-full h-full flex justify-center items-center">
          <TawasyLoader width={400} height={400} />
        </div>
      ) : (
        <div className="w-full h-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-5">
          {productsRequests &&
          productsRequests.data.requests &&
          productsRequests.data.requests.length > 0 ? (
            productsRequests.data.requests.map((request, i) => {
              return (
                <AdminVendorProductRequest
                  key={i}
                  request={request}
                  refetch={() => refetch()}
                />
              );
            })
          ) : (
            <div className="text-lg text-center">
              There are no Products Requests
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default withLayoutAdmin(VendorsProductRequests);

import createAxiosInstance from "@/API";
import AdminPromotion from "@/components/AdminComponents/AdminPromotion";
import withLayoutAdmin from "@/components/UI/adminLayout";
import TawasyLoader from "@/components/UI/tawasyLoader";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

function Promotions() {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const {
    data: promos,
    isLoading,
    refetch,
  } = useQuery("allPromosAdmin", fetchAllPromos, {
    staleTime: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  async function fetchAllPromos() {
    try {
      return await Api.get(`/api/admin/promotion-requests`);
    } catch (error) {}
  }

  return (
    <div className="w-[90%] mx-auto">
      <div className="py-5 ">
        <p className="text-3xl">Promotions</p>
      </div>
      <hr />
      {isLoading == true ? (
        <div className="w-full flex justify-center items-center">
          <TawasyLoader width={300} height={300} />
        </div>
      ) : (
        promos &&
        promos.data.requests &&
        (promos.data.requests.length > 0 ? (
          <div className="py-5 w-full grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 ">
            {promos.data.requests.map((promo, i) => {
              return (
                <AdminPromotion
                  key={i}
                  promo={promo}
                  refetch={() => {
                    refetch();
                  }}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-lg w-full py-5">
            You have no promotions.
          </p>
        ))
      )}
    </div>
  );
}

export default withLayoutAdmin(Promotions);

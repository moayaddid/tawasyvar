import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { MdCheck } from "react-icons/md";

function Combination({ combination, productId , refetch = null }) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selected, setSelected] = useState(false);
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const partNumberRef = useRef();
  async function SelectVariation(variation) {
    // console.log(variation);
    // console.log(productId);
    setIsSelecting(true);
    try {
      const response = await Api.post(
        `/api/admin/add-combinations/${productId}`,
        { variations: [...variation], part_number: partNumberRef.current.value }
      );
      setIsSelecting(false);
      refetch();
      setSelected(true);
    } catch (error) {
      setIsSelecting(false);
    }
    setIsSelecting(false);
  }

  return (
    <div className="flex justify-start items-center space-x-4 px-2 py-2 border-b border-gray-200">
      {Object.entries(combination).map(([key, value]) => {
        return (
          <div
            key={key}
            className="flex justify-start w-full select-none items-start "
          >
            {!key.startsWith("id") ? (
              !key.endsWith("Id") && (
                <div key={key} className="text-start">{`${key}: ${value}`}</div>
              )
            ) : selected == true ? (
              <div className="justify-self-end">
                <MdCheck className="text-green-500  w-[25px] h-[25px] " />
              </div>
            ) : isSelecting == true ? (
              <div className="justify-self-end">
                <Ring size={20} speed={2} lineWeight={5} color="#ff6600" />
              </div>
            ) : (
              <div className="flex justify-start w-full items-center space-x-4 ">
                <input
                  type="text"
                  ref={partNumberRef}
                  placeholder="Part Number"
                  maxLength={30}
                  className="outline-none w-[50%] border-b border-transparent transition-all duration-500 focus:border-skin-primary"
                />
                <button
                  onClick={() => {
                    //   console.log(value);
                    SelectVariation(value);
                  }}
                  className="justify-self-end text-white px-2 py-1 bg-skin-primary rounded-lg hover:opacity-80"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
export default Combination;

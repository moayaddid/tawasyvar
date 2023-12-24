import createAxiosInstance from "@/API";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

function AdminProductVariation({ variant, deleteV, options, productId }) {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [option, setOption] = useState();
  const router = useRouter();
  const Api = createAxiosInstance(router);

  async function deleteVariation() {
    setLoading(true);
    // try {
    // await deleteV(variant.id);
    try {
      const response = await Api.delete(
        `/api/admin/delete-variation/product/${productId}/variation/${variant.id}`
      );
      deleteV();
    } catch (error) {}
    // } catch (error) {
    //   setLoading(false);
    // }
    setLoading(false);
  }

//   console.log(variant.attribute_id);

  async function editOption() {
    const nig = JSON.parse(option);
    if (nig == null || nig == undefined || nig.value == variant.option) {
      toast.error(
        "Please provide a different option than the old in order to change it ",
        { theme: "colored" }
      );
    } else {
      setLoading(true);
      try {
        const response = Api.put(
          `/api/admin/update-variation/product/${productId}/variation/${variant.id}`,
          {
            attribute_id: nig.att_id,
            option_id: nig.id,
          }
        );
        setEditing(false);
        deleteV();
      } catch (error) {
        setLoading(false);
      }
    }
    setLoading(false);
  }

  //   console.log(variant.option);

  return (
    <div
      //   key={index}
      className="flex w-full justify-start space-x-4 items-center py-1 border-b border-gray-300"
    >
      <p>{variant.attribute} :</p>
      {editing == true ? (
        <select
          onChange={(e) => {
            setOption(e.target.value);
          }}
          className="px-2 py-1 w-max mx-auto rounded-md h-max my-auto "
        >
          {options.map((option) => {
            return (
              <option
                key={option.id}
                selected={variant.option == option.value_en}
                value={JSON.stringify({id : option.id , att_id : option.attribute_id , value : option.value_en})}
              >
                {option.value_en}
              </option>
            );
          })}
        </select>
      ) : (
        <p>{variant.option}</p>
      )}
      {editing == false ? (
        <button
          onClick={() => {
            setEditing(true);
          }}
          disabled={loading}
          className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:opacity-70"
        >
          Edit Option
        </button>
      ) : (
        <button
          onClick={editOption}
          className="px-2 py-1 bg-green-500 text-white rounded-lg hover:opacity-70"
        >
          Confirm
        </button>
      )}
      {editing == true && (
        <button
          onClick={() => {
            setEditing(false);
          }}
          className="px-2 py-1 bg-red-500 text-white rounded-lg hover:opacity-70"
        >
          Cancel
        </button>
      )}
      {editing == false && (
        <button
          onClick={deleteVariation}
          disabled={loading == true}
          className={`px-2 py-1 bg-red-500 text-center hover:opacity-80 rounded-lg text-white ${
            loading == true ? `opacity-70` : `opacity-100`
          } transition-all duration-300 `}
        >
          Delete Variation
        </button>
      )}
      {loading == true && (
        <div>
          <Ring size={20} speed={2} lineWeight={5} color="#ff6600" />
        </div>
      )}
    </div>
  );
}

export default AdminProductVariation;

import createAxiosInstance from "@/API";
import { Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { FiEdit } from "react-icons/fi";

function AdminCategoryAttach({ category, refetch }) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [isEditing, setIsEditing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [sortRef, setSortRef] = useState();
  const formRef = useRef();

  async function editAttachment(e) {
    e.preventDefault();
    if (!formRef.current.reportValidity()) {
      return;
    }
    if (
      sortRef &&
      sortRef !== category.sort_order
    ) {
      setEditing(true);
      try {
        const response = await Api.put(
          `/api/admin/edit-brand-sort-order/${category.id}`,
          {
            sort_order: sortRef,
          }
        );
        refetch();
        setIsEditing(false);
        setEditing(false);
      } catch (error) {
        setEditing(false);
      }
    } else {
      return;
    }
    setEditing(false);
  }

  const onlyNumberKey = (e) => {
    const ASCIICode = e.which ? e.which : e.keyCode;
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
      e.preventDefault();
    }
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setSortRef(value);
    }
  };

  return (
    <>
      <tr
        key={category.id}
        className="py-10 bg-gray-100 hover:bg-gray-200 font-medium   "
      >
        <td className="px-4 py-4">{category.id}</td>
        <td className="px-4 py-4">{category.brand}</td>
        <td className="px-4 py-4">{category.category}</td>
        <td className="px-4 py-4">{category.sort_order}</td>
        <td class="px-4 py-4">
          <div class="flex-col lg:flex-row items-center space-y-2 lg:space-y-0">
            <button
              onClick={() => setIsEditing(true)}
              class="items-center px-2 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              <FiEdit />
            </button>
          </div>
        </td>
      </tr>

      <Dialog
        open={isEditing}
        onClose={() => {
          setIsEditing(false);
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle className="flex justify-between border-b-2 border-black">
          <h4 className="text-gray-500 md:pl-6 font-medium">
            {`Edit attachment : ${category.brand} - ${category.category}`}
          </h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <form ref={formRef} onSubmit={editAttachment}>
              <div className="flex flex-wrap justify-start items-start ">
                <p className="mx-3">{` Brand : ${category.brand}`}</p>
                <p className="mx-3">{` Category : ${category.category}`}</p>
                <div className="flex items-center mx-3">
                  <label className="w-[30%] flex-grow text-lg px-2">
                    Sort Order :
                  </label>
                  <input
                    className="text-black placeholder:text-zinc-500 pl-2 outline-none border-b-2 focus:border-skin-primary transition-all duration-700"
                    type="number"
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    }}
                    onKeyPress={onlyNumberKey}
                    defaultValue={category.sort_order}
                    value={sortRef}
                    inputMode="numeric"
                    pattern="\d{1,4}"
                    onChange={handleSortChange}
                    placeholder={category.sort_order}
                  />
                </div>
              </div>
              <div className="w-full flex justify-center items-center gap-5 mx-auto pt-5 ">
                {editing == false ? (
                  <button
                    type="submit"
                    className="bg-skin-primary w-[20%] px-8 py-3 text-white rounded-lg "
                  >
                    {`Save`}
                  </button>
                ) : (
                  <div className="bg-skin-primary w-[20%] px-8 py-3 text-white rounded-lg flex justify-center">
                    <Ring size={20} speed={2} lineWeight={5} color="white" />
                  </div>
                )}
                <button
                  type="button"
                  className="bg-zinc-500 px-8 py-3 w-[20%] text-white rounded-lg"
                  data-dismiss="modal"
                  onClick={() => {
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminCategoryAttach;

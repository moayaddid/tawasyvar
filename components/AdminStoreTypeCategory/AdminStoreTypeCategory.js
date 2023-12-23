import createAxiosInstance from "@/API";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdClose } from "react-icons/md";

function Category({storeTypeId , category , refetch}) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [isDetaching, setIsDetaching] = useState(false);
  const [deleting , setDeleting] = useState(false);

  async function detachCategory () {
    setDeleting(true);
    try{
      const response = await Api.post(`/api/admin/store-types/${storeTypeId}/categories/detach` , {
        category_id : category.id
      });
    refetch();
    setIsDetaching(false);
    setDeleting(false);
    }catch(error){
    setDeleting(false);
    }
    setDeleting(false);
  }

  return (
    <>
      <div className="flex justify-between items-center border-2 border-skin-primary rounded-full px-2 gap-2">
        <div className="text-md text-gray-500 text-center flex justify-center items-center ">
          {category.name_en}
        </div>
        <div
          className="text-gray-500 hover:text-red-500 text-md cursor-pointer "
          onClick={() => setIsDetaching(true)}
        >
            X
        </div>
      </div>

      <Dialog
        open={isDetaching}
        onClose={() => {
          setIsDetaching(false);
        }}
        fullWidth
      >
        <DialogTitle className="flex justify-between border-b-2 border-black ">
          <h4 className="">Remove category:</h4>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} margin={3}>
            <div className="flex flex-col justify-start items-start w-full ">
              <p className="text-lg ">
                {`Are you sure you want to remove this category ?`}
              </p>
              <p className="text-xl pt-4">{category.name_en}</p>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="bg-green-700 px-8 py-3 text-white rounded-lg "
            data-dismiss="modal"
            onClick={detachCategory}
          >
            {deleting == true ? (
              <div className="flex justify-center items-center">
                <Ring size={25} lineWeight={5} speed={2} color="white" />
              </div>
            ) : (
            "Yes"
            )}
            {/* Yes */}
          </button>
          <button
            type="button"
            className="bg-zinc-500 px-8 py-3 text-white rounded-lg"
            data-dismiss="modal"
            onClick={() => {
              setIsDetaching(false);
            }}
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Category;

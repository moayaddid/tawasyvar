import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { MdClose } from "react-icons/md";
import { GoLink } from "react-icons/go";
import TawasyLoader from "../../UI/tawasyLoader";
import { useRouter } from "next/router";
import createAxiosInstance from "@/API";
import { useState } from "react";
import LinkCreation from "./LinkCreation";
import Links from "./Links";
import {
  deleteSellerContacts_endpoint,
  editSellerContacts_endpoint,
} from "@/api/endpoints/endPoints";

function AdminLinks({
  linksFor,
  className,
  editEndPoint,
  resetEndPoint,
  getEndPoint,
  postEndPoint,
  entityId,
}) {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [linksOpen, setLinksOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [links, setLinks] = useState();

  async function fetchLinks() {
    try {
      setIsLoading(true);
      const response = await Api.get(`${getEndPoint}/${entityId}`);
      if (response.data) {
        setLinks(response.data);
      } else {
        setLinks();
      }
      setIsLoading(false);
    } catch (error) {
      setLinksOpen(false);
    }
    setIsLoading(false);
  }

  async function openNotes() {
    setLinksOpen(true);
    await fetchLinks();
  }

  function closeLinks() {
    setLinksOpen(false);
    setLinks();
  }

  return (
    <>
      <button
        onClick={openNotes}
        className={`items-center text-white px-2 py-2 bg-violet-600 rounded-md hover:opacity-75 focus:outline-none ${className}`}
      >
        <GoLink />
      </button>

      <Dialog
        open={linksOpen}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        onClose={closeLinks}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <p> links of : {linksFor}</p>
          <MdClose
            onClick={closeLinks}
            className="text-black cursor-pointer w-[20px] h-[20px] hover:text-red-500 border-b-2 border-transparent hover:border-red-500 transition-all duration-300"
          />
        </DialogTitle>
        <DialogContent className="flex justify-center items-center">
          {isLoading == true ? (
            <TawasyLoader width={300} height={300} />
          ) : links && links?.contact ? (
            <Links
              editEndPoint={editEndPoint}
              resetEndPoint={resetEndPoint}
              entityId={entityId}
              links={links.contact}
              linksFor={linksFor}
              refetch={() => {
                fetchLinks();
              }}
            />
          ) : (
            <div className="w-full flex flex-col justify-center items-center space-y-3">
              <p className="w-full text-center">
                {linksFor} has No Link Info .
              </p>
              <LinkCreation
                entityId={entityId}
                linksFor={linksFor}
                postEndPoint={postEndPoint}
                refetchLinks={() => {
                  fetchLinks();
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminLinks;

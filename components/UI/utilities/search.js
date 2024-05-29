import React from "react";
import ButtonComponent from "./buttonComponent";
import { useState } from "react";
import { useRouter } from "next/router";
import { MdClose } from "react-icons/md";
import CloseButton from "./CloseButton";
import axios from "axios";
import createAxiosInstance from "@/API";

const Search = ({ end_point, header, searchResults , setSearching }) => {
  const router = useRouter();
  const Api = createAxiosInstance(router);
  const [insearch, setInSearch] = useState(false);
  const [searching, seatSearching] = useState(false);
  const [searchQuery, setsearchQuery] = useState("");

  async function search(e) {
    e.preventDefault();
    try {
      const ff = await Api.post(end_point, {
        [header]: searchQuery,
      });
      searchResults(ff.data);
    } catch (error) {
      console.log(error);
    }
  }

// const Search = ({ searching, handleInputChange, value }) => {
  return (
    <>
      <form
        onSubmit={search}
        className=" w-full flex justify-start items-center space-x-1"
      >
        <input
          type="text"
          value={searchQuery}
          onClick={() => {
            setInSearch(true);
            setSearching(true);
          }}
          onChange={(e) => {
            setsearchQuery(e.target.value);
          }}
          required
          className="border-2 outline-none py-1 w-full px-2"
        />
        {/* <ButtonComponent
          type={`submit`}
          className={`bg-gray-800 px-4 py-1 text-white`}
          isLoading={searching}
          title={`Search`}
          color={`white`}
        /> */}
        <CloseButton
          className={`${insearch == true ? `opacity-100` : `opacity-0 cursor-default pointer-events-none `} transition-all duration-300 ease-in-out `}
          onClick={() => {
            setInSearch(false);
            setSearching(false);
          }}
        />
      </form>
    </>
  );
};

export default Search;

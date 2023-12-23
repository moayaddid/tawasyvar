import React from "react";
import { GiVibratingSmartphone } from "react-icons/gi";
import { MdEmail } from "react-icons/md";
import { BsFacebook, BsTelephonePlusFill } from "react-icons/bs";
import Link from "next/link";

function Form() {
  return (
    <div className="md:flex md:justify-center md:items-center">
      <div className="mx-4">
        <ul className="text-white flex flex-col justify-center w-[350px]  ">
          <li className="md:text-2xl text-lg my-3 flex text-center ">
            <GiVibratingSmartphone className="w-[30px] h-[30px] mr-2  " />
            <span> +963987000888</span>
          </li>
          <li className="md:text-2xl text-lg my-3 flex text-center ">
            <MdEmail className="w-[30px] h-[30px] mr-2 " />
            <span>sales@tawasyme.com</span>
          </li>
          <li className="md:text-2xl text-lg my-3 flex text-center ">
            <BsTelephonePlusFill className="w-[30px] h-[30px] mr-2 " />
            <span> + 11 4635247</span>
          </li>
          <li className="md:text-2xl text-lg my-3 flex text-center">
            <Link className="flex" href="https://www.facebook.com/tawasyshop/">
              <BsFacebook className="w-[30px] h-[30px] mr-2 " />
              <span>Tawasy Shopping</span>
            </Link>
          </li>
        </ul>
      </div>
      {/* <div className="bg-transparent py-8 px-4 md:w-[550px]">
        <h1 className="text-center font-medium text-xl text-white pb-8">
          Have a question?
        </h1>
        <form>
          <div className="flex">
            <div className="w-[100%] mr-4">
              <input
                type="text"
                name="name"
                className="form-control formInput w-[100%] py-1 text-gray-600 pl-2 outline-none"
                placeholder="Name"
              />
            </div>
            <div className="w-[100%]">
              <input
                type="email"
                name="email"
                className="form-control formInput w-[100%] py-1 text-gray-600 pl-2 outline-none"
                placeholder="Email address"
              />
            </div>
          </div>

          <div className="w-[100%] mr-4 my-6">
            <input
              type="text"
              name="subject"
              className="form-control formInput w-[100%] py-1 text-gray-600 pl-2 outline-none"
              placeholder="Subject"
            />
          </div>

          <div className="w-[100%] row formRow">
            <div className="col">
              <textarea
                rows={3}
                name="message"
                className="form-control formInput w-[100%] py-1 text-gray-600 pl-2 outline-none"
                placeholder="Message"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button
              className="bg-skin-primary text-white rounded-md hover:bg-white hover:text-skin-primary px-6 py-2 my-4"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div> */}
    </div>
  );
}
export default Form;

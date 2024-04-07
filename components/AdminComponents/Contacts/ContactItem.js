const { Tooltip } = require("@nextui-org/react");
import { toast } from "react-toastify";


function ContactItem({ contact }) {
  function copyText(e) {
    // console.log(e.target.innerText);
    navigator.clipboard.writeText(e.target.innerText);
    toast.warn("Copied to clipboard" , {autoClose : 1000 , hideProgressBar : true , theme : "dark"})
  }

  return (
    // <Tooltip
    //   showArrow={true}
    //   color="primary"
    //   placement="right"
    //   content={
    //     <div className="flex flex-col bg-white rounded-lg  justify-start items-start pl-2 pr-5 group text-gray-500 hover:text-skin-primary">
    //       <p className="text-xl">{contact.name}</p>
    //       <p
    //         className="text-lg hover:underline cursor-pointer  "
    //         onClick={(e) => {
    //           copyText(e);
    //         }}
    //         id="number"
    //       >
    //         {contact.number}
    //       </p>
    //     </div>
    //   }
    // >
    <div className="w-[23%] m-1 flex flex-col justify-center items-center rounded-full cursor-pointer border-2 border-black ">
      <p className="text-lg">{contact.name}</p>
      <p
        className="text-base hover:underline cursor-pointer text-skin-primary  "
        onClick={(e) => {
          copyText(e);
        }}
        id="number"
      >
        {contact.number}
      </p>
    </div>
    // {/* </Tooltip> */}
  );
}

export default ContactItem;

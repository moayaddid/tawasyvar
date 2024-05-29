import { MdClose } from "react-icons/md";

function CloseButton({ onClick, className }) {
  return (
    <MdClose
      onClick={onClick}
      className={`text-black cursor-pointer hover:text-red-500  transition-all w-[30px] h-[30px] duration-300 ${
        className ?? ``
      }`}
    />
  );
}

export default CloseButton;

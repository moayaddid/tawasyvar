import { convertMoney } from "../SellerOrders/sellerOrder";
import { FaExclamation } from "react-icons/fa6";

function DashboardCard(props) {
  return (
    <div className={`md:w-[500px] w-[100%] md:my-3 md:mr-6 md:py-0 py-2`}>
      <div
        className={` shadow-lg px-5 py-5 text-black flex justify-between border-2 items-center rounded-lg  ${props.color}`}
      >
        <div w-full >
          <div className=" flex justify-start items-center w-full ">
            <div className="card-title text-xl text-white py-1 select-none ">
              {props.name}
            </div>
          </div>
          <div
            className="card-text md:text-5xl text-3xl self-start text-white select-none "
            title={convertMoney(props.value)}
          >
            {convertMoney(props.value)}
          </div>
        </div>
        {/* <FaExclamation className="text-white text-5xl md:block hidden " /> */}
      </div>
    </div>
  );
}

export default DashboardCard;

import Footer from "../FooterCustomer/Footer";
import Navbar from "../NavbarCustomer/navbar";

function CustomerLayout(props) {
  return (
    <div className="w-full h-screen flex flex-col justify-between shrink-0 ">
      <Navbar />
      <div className="lg:pt-[80px] md:pt-[60px] sm:pt-[50px] pt-[40px]">{props.children}</div>
      <div className="bottom-0" >
        <Footer />
      </div>
    </div>
  );
}

export default CustomerLayout;

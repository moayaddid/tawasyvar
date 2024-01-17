import React from "react";
import VendorSidebar from "../sidebars/VendorSideBar";
// import Sidebar from "../sidebars/SellerSideBar";

const withVendorLayout = (WrappedComponent) => {
  const WithLayout = (props) => (
    <div style={{ display: "flex" }} dir="ltr" >
      <div className="w-[20%] h-full" style={{ zIndex: 1 }}>
        {/* <Sidebar /> */}
        <VendorSidebar/>
      </div>
      <div className="w-[80%] h-full" style={{ zIndex: 0 }}>
        <WrappedComponent {...props} />
      </div>
    </div>
  );

  // Set display name
  WithLayout.displayName = `withVendorLayout(${getDisplayName(WrappedComponent)})`;

  return WithLayout;
};

// Helper function to get the display name of a component
const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

export default withVendorLayout;

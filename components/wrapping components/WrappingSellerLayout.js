import React from "react";
import Sidebar from "../sidebars/SellerSideBar";
import { useRouter } from "next/router";
import SellerGuard from "../Guards/sellerGuard";

const withLayout = (WrappedComponent) => {
  const WithLayout = (props) => {
    const router = useRouter();
    return (
      <SellerGuard style={{ display: "flex" }} >
        <div className="w-[20%] h-full" style={{ zIndex: 1 }} dir="ltr">
          <Sidebar />
        </div>
        <div className="w-[80%] h-full" style={{ zIndex: 0 }} >
          <WrappedComponent {...props} />
        </div>
      </SellerGuard>
    );
  };

  // Set display name
  WithLayout.displayName = `withLayout(${getDisplayName(WrappedComponent)})`;

  return WithLayout;
};

// Helper function to get the display name of a component
const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

export default withLayout;

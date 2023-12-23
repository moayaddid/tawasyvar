import React from "react";
import Navbar from "../NavbarCustomer/navbar";
import Footer from "../FooterCustomer/Footer";
import CustomerLayout from "../UI/customerLayout";

const withLayoutCustomer = (WrappedComponent) => {
  const WithLayoutCustomer = (props) => (
    <CustomerLayout>
      <WrappedComponent {...props} />
    </CustomerLayout>
  );

  // Add a display name to the HOC for better debugging messages
  WithLayoutCustomer.displayName = `withLayoutCustomer(${getDisplayName(WrappedComponent)})`;

  return WithLayoutCustomer;
};

// Helper function to get the display name of a component
const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default withLayoutCustomer;

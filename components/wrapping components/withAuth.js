import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Ring } from "@uiball/loaders";
import TawasyLoader from "../UI/tawasyLoader";
import Cookies from "js-cookie";

const withAuth = (WrappedComponent) => {
  const WithAuthComponent = (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuthentication = () => {
        const token = Cookies.get('AT');
        const authenticated = token !== undefined;
        if (!authenticated) {
          setIsAuthenticated(false);
          router.push('/Login');
        } else {
          setIsAuthenticated(true);
        }
      };
      checkAuthentication();
    }, [isAuthenticated]);

    return isAuthenticated ? (
      <WrappedComponent {...props} />
    ) : (
      <div className="w-full h-screen ">
        {/* <Ring size={40} lineWeight={5} speed={2} color="#ff6600" /> */}
        <TawasyLoader />
      </div>
    );
  };

  // Provide a displayName for your HOC
  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
};

export default withAuth;

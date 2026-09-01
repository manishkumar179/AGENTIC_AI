import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "./useAuth";

const AuthBootstrap = () => {
  const { me } = useAuth();

  const bootstrappedRef = useRef(false);

  useEffect(() => {
    if (!bootstrappedRef.current) {
      bootstrappedRef.current = true;
      me();
    }
  }, [me]);

  return <Outlet />;
};

export default AuthBootstrap; 
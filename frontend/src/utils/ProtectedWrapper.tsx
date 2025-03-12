import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { ProtectedWrapperProps } from "./types";
import Spinner from "../components/Spinner";
import { decryptData, isEncryptedResponse } from "./CryptoService";

const ProtectedWrapper: React.FC<ProtectedWrapperProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const url = `${import.meta.env.VITE_ROOT_URL}/auth/verify`;
    const checkAuth = async () => {
      try {
        const response = await axios.get(url, {
          withCredentials: true,
        });
        if (isEncryptedResponse(response.data)) {
          const user = await decryptData(response.data);
          console.log(user);
          setIsAuthenticated(!!user);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedWrapper;

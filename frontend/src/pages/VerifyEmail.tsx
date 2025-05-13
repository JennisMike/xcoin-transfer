import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios, { isAxiosError } from "axios";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_ROOT_URL}/auth/verify-email?token=${token}`
        );
        setStatus("success");
        setMessage(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        if (isAxiosError(error)) {
          setStatus("error");
          setMessage(
            error.response?.data?.error ||
              "Failed to verify email. Please try again."
          );
        }
      }
    };

    verifyEmail();
  }, [location.search, navigate, setStatus, setMessage]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              Verifying your email...
            </h2>
            <p>Please wait a moment.</p>
          </>
        )}
        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Email Verified!
            </h2>
            <p>{message}</p>
            <p className="text-sm mt-4 text-gray-600">
              Redirecting to login page...
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Verification Failed
            </h2>
            <p>{message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

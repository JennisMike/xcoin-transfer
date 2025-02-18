import { ArrowLeft, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl mx-auto">
        {/* Animated Icon */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 animate-ping opacity-75">
            <DollarSign className="mx-auto h-24 w-24 text-blue-500 opacity-20" />
          </div>
          <DollarSign className="mx-auto h-24 w-24 text-blue-600" />
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Oops! It seems like the exchange rate for this page isn't available.
          Let's get you back to a working marketplace.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return to Home
          </button>

          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            <button
              type="button"
              onClick={() => navigate("/buy")}
              className="hover:text-blue-600"
            >
              Buy XCoin
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => navigate("/convert")}
              className="hover:text-blue-600"
            >
              Convert Currency
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => navigate("/support")}
              className="hover:text-blue-600"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

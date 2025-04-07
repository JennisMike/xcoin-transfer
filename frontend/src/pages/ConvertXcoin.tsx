import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import axios from "axios";

// I added this to handle drag n drop of QR code image but later didn't use it.
// import { useDropzone } from "react";

type Conversion = {
  id: number;
  date: string;
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  status: string;
};

const rates = {
  xcoin: {
    rmb: 5.42,
    fcfa: 467.52,
    usd: 0.74,
  },
};

function ConvertXcoinPage() {
  // Wallet holds only XCoin, so fromCurrency is fixed.
  const fromCurrency = "xcoin";
  const [amount, setAmount] = useState("");
  const [toCurrency, setToCurrency] = useState<"rmb" | "fcfa" | "usd">("rmb");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [recentConversions, setRecentConversions] = useState<Conversion[]>([
    {
      id: 1,
      date: "2025-02-15",
      fromAmount: 50,
      fromCurrency: "XCoin",
      toAmount: 350,
      toCurrency: "RMB",
      status: "Completed",
    },
    {
      id: 2,
      date: "2025-02-12",
      fromAmount: 75,
      fromCurrency: "XCoin",
      toAmount: 41250,
      toCurrency: "FCFA",
      status: "Completed",
    },
    {
      id: 3,
      date: "2025-02-08",
      fromAmount: 200,
      fromCurrency: "XCoin",
      toAmount: 1400,
      toCurrency: "RMB",
      status: "Completed",
    },
  ]);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  // Calculate conversion whenever input or destination changes
  useEffect(() => {
    if (amount && toCurrency) {
      const amountNum = parseFloat(amount);
      if (!isNaN(amountNum)) {
        const convertedValue = amountNum * rates[fromCurrency][toCurrency];
        setConvertedAmount(convertedValue);
      }
    } else {
      setConvertedAmount(0);
    }
  }, [amount, toCurrency, fromCurrency]);

  const handleToCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(e.target.value as "rmb" | "fcfa" | "usd");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseFloat(value) < 0 && value !== "") return;
    setAmount(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const destCurrency = (
      form.elements.namedItem("destCurrency") as HTMLInputElement
    ).value;

    if (destCurrency == "FCFA") {
      const url = import.meta.env.VITE_ROOT_URL;
      try {
        // API call with conversion details in the request body.
        const response = await axios.post(
          `${url}/transaction/request`,
          {
            amount: parseFloat(amount),
            fromCurrency: "XCoin",
            toCurrency: toCurrency,
            convertedAmount: convertedAmount,
          },
          { withCredentials: true }
        );
        if (import.meta.env.DEV) {
          console.log("API Response:", response.data);
        }

        // Assuming the API returns a status field, you can use it.
        const newConversion: Conversion = {
          id: recentConversions.length + 1,
          date: new Date().toISOString().split("T")[0],
          fromAmount: parseFloat(amount),
          fromCurrency: "XCoin",
          toAmount: convertedAmount,
          toCurrency: getCurrencyName(toCurrency),
          status: response.data.status || "Completed",
        };
        setRecentConversions([newConversion, ...recentConversions]);
        setShowConfirmation(true);
      } catch (error) {
        console.error("Conversion failed", error);
        // Optionally, set an error state here to display an error message.
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getCurrencyName = (code: string): string => {
    switch (code) {
      case "xcoin":
        return "XCoin";
      case "rmb":
        return "RMB";
      case "fcfa":
        return "FCFA";
      case "usd":
        return "USD";
      default:
        return code.toUpperCase();
    }
  };

  const getCurrencySymbol = (code: string): string => {
    switch (code) {
      case "xcoin":
        return "X";
      case "rmb":
        return "¥";
      case "fcfa":
        return "CFA";
      case "usd":
        return "$";
      default:
        return "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(reader.result as string);
        setIsImageUploaded(true);
        console.log(e);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 f">
        {/* Header */}

        {/* Conversion Form */}
        <div className="flex flex-row">
          <div className="max-w-2xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 text-center">
                Convert XCoin
              </h1>
            </header>
            {showConfirmation ? (
              <div className="bg-green-100 text-green-800 p-6 rounded-lg text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Conversion Successful!
                </h2>
                <p className="text-xl mb-4">
                  {parseFloat(amount).toFixed(2)} XCoin ={" "}
                  <span className="font-semibold">
                    {convertedAmount.toFixed(2)} {getCurrencyName(toCurrency)}
                  </span>
                </p>
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setAmount("");
                    setConvertedAmount(0);
                  }}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
                >
                  Make Another Conversion
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg space-y-6 max-w-2xl mx-auto"
              >
                {/* Fixed "From" field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <div className="flex items-center">
                    <div className="w-20 px-4 py-3 border border-gray-300 rounded-md bg-gray-100 text-center font-semibold">
                      XCoin
                    </div>
                    <div className="relative flex-1 ml-4">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {getCurrencySymbol("xcoin")}
                      </span>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={handleAmountChange}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* Destination Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <div className="flex items-center">
                    <select
                      title="destCurrency"
                      value={toCurrency}
                      onChange={handleToCurrencyChange}
                      className="min-w-20 px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 "
                    >
                      <option value="rmb">RMB</option>
                      <option value="fcfa">FCFA</option>
                      <option value="usd" disabled>
                        USD
                      </option>
                    </select>
                    <div className="relative flex-1 ml-4">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {getCurrencySymbol(toCurrency)}
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={
                          convertedAmount ? convertedAmount.toFixed(2) : ""
                        }
                        className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                {/* Show if Destination currency is FCFA */}
                {toCurrency === "fcfa" && (
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Mobile Money Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Enter your mobile number"
                      pattern="\d{9,}"
                      title="Number should be at least 9 digits"
                      minLength={9}
                      maxLength={9}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                )}

                {/* Show if Destination currency is RMB */}
                {toCurrency === "rmb" && (
                  <div>
                    <label
                      htmlFor="qrCode"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Upload your QR Code
                    </label>
                    <div
                      className={`border-2 ${
                        isImageUploaded
                          ? "max-w-sm max-h-40 overflow-y-auto border-blue-500"
                          : "border-dashed border-gray-300"
                      } rounded-lg p-6 text-center shadow-inset-blue`}
                    >
                      {imageUrl ? (
                        <img src={imageUrl} alt="QR Code" className="mx-auto" />
                      ) : (
                        <div></div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-4"
                      />
                      <p className="text-left mt-4 text-sm text-gray-600">
                        Upload your Alipay or WeChat receiving QR Code
                      </p>
                    </div>
                  </div>
                )}

                {/* Rate Information */}
                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                  <p>
                    <span className="font-medium">Current Rate:</span> 1 XCoin ={" "}
                    {rates.xcoin[toCurrency].toFixed(2)}{" "}
                    {getCurrencyName(toCurrency)}
                  </p>
                  <p className="mt-1 text-xs">
                    *Rates updated: Today at 08:30 UTC
                  </p>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading || amount === ""}
                    className={`w-full px-6 py-3 rounded-md font-medium ${
                      isLoading || amount === ""
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {isLoading ? "Processing..." : "Convert Now"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Info Panel*/}
          <div className="space-y-6 ml-6">
            {/* Recent Conversions */}
            <div className="max-w-lg mx-auto mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Recent Conversions
              </h2>
              <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-gray-600 text-sm">
                        Date
                      </th>
                      <th className="p-3 text-left text-gray-600 text-sm">
                        From
                      </th>
                      <th className="p-3 text-left text-gray-600 text-sm">
                        To
                      </th>
                      <th className="p-3 text-left text-gray-600 text-sm">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentConversions.map((conversion) => (
                      <tr key={conversion.id} className="border-b">
                        <td className="p-3 text-sm">{conversion.date}</td>
                        <td className="p-3 text-sm">
                          {conversion.fromAmount.toFixed(2)}{" "}
                          {conversion.fromCurrency}
                        </td>
                        <td className="p-3 text-sm">
                          {conversion.toAmount.toFixed(2)}{" "}
                          {conversion.toCurrency}
                        </td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            {conversion.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Help Box */}
            <div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
                <h3 className="text-lg font-medium mb-3"> Need Help?</h3>
                <p className="mb-4">
                  Our support team is available 24/7 to assist you with your
                  XCoin purchases.
                </p>
                <a
                  href="/#ContactSection"
                  className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ConvertXcoinPage;

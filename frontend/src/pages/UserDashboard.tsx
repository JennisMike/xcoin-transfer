import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

function UserDashboard() {
  const [rmbValue, setRmbValue] = useState(0);
  const [amount, setAmount] = useState("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const xcoin = parseFloat(e.target.value);

    if (!isNaN(xcoin)) {
      setAmount(e.target.value);
      setRmbValue(xcoin * 7);
    } else {
      setAmount("");
      setRmbValue(0);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 max-sm:p-3 max-sm:mt-6">
      <Sidebar />
      <main className="flex-1 p-6 max-w-screen-lg mx-auto">
        {/* Header */}
        <DashboardHeader />

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Wallet Balance Card */}
          <div className="bg-linear-0 from-[#3B82F6] to-[#1D4ED8] text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-medium">Wallet Balance</h3>
            <div className="text-4xl font-bold mt-2">1000 XCoin</div>
          </div>

          {/* Currency Conversion Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex flex-row justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">
                Convert XCoin to:
              </h3>
              <select
                title="destCurrency"
                name="dest-currency"
                id="destCurrency"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CFA">FCFA</option>
                <option value="RMB">RMB</option>
              </select>
            </div>

            <form className="space-y-4">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount in XCoin
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="Enter amount"
                value={amount}
                onChange={handleAmountChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-gray-700">
                Equivalent in RMB: <strong>{rmbValue}</strong>
              </p>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium w-full shadow-md"
              >
                Convert Now
              </button>
            </form>
          </div>

          {/* Buy XCoin Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Buy XCoin
            </h3>
            <form className="space-y-4">
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium text-gray-700"
              >
                Payment Method
              </label>
              <select
                name="method"
                id="paymentMethod"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="momo">MTN Momo</option>
                <option value="bankTransfer">Bank Transfer</option>
              </select>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium w-full shadow-md"
              >
                Buy Now
              </button>
            </form>
          </div>

          {/* Transaction History Table */}
          <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto col-span-1 md:col-span-2 w-[150%] max-sm:w-full">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Transaction History
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left text-gray-700">Date</th>
                  <th className="p-3 text-left text-gray-700">
                    Amount (XCoin)
                  </th>
                  <th className="p-3 text-left text-gray-700">Amount (RMB)</th>
                  <th className="p-3 text-left text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">2025-02-10</td>
                  <td className="p-3">500</td>
                  <td className="p-3">3500</td>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">2025-02-12</td>
                  <td className="p-3">300</td>
                  <td className="p-3">2100</td>
                  <td className="p-3">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                      Pending
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;

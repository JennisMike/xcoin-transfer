import { useState, useEffect, FormEvent } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import { Card, Subscription, Transaction } from "../utils/types";
import axios from "axios";
import WalletBalanceCard from "../components/WalletBalanceCard";
import getToken from "../utils/GetCampayToken";
import getPaymentLink from "../utils/GetPaymentLink";

function UserDashboard() {
  // For the wallet conversion functionality
  const [rmbValue, setRmbValue] = useState(0);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[] | null>();
  const [cardDetails, setCardDetails] = useState<Card>({
    balance: 0,
    subscriptionType: "standard",
    rate: 10.5,
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const url = `${import.meta.env.VITE_ROOT_URL}/transactions`;
        const response = await axios.get(url, { withCredentials: true });
        console.log(response.data);
        setTransactions(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchSubscription = async () => {
      const url = `${import.meta.env.VITE_ROOT_URL}/subscriptions`;
      try {
        const response = await axios.get(url, { withCredentials: true });
        console.log(response.data);
        setCardDetails(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSubscription();
  }, []);

  const handleBuyXcoin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Access form data
    const form = event.currentTarget; // Get the current form element

    // Example: Assuming you have an input with id="amount"
    const accountType = (form.elements.namedItem("method") as HTMLInputElement)
      .value;

    // Log or use the amount value
    if (accountType.toLowerCase().includes("MOMO".toLowerCase())) {
      console.log("MTN MoMo selected");
      await getToken();
      const link = await getPaymentLink(
        10,
        "XAF",
        "Buy XCoin",
        `${import.meta.env.BASE_URL}dashboard`
      );
      window.location.href = link;
    } else if (accountType.toLowerCase().includes("Alipay".toLowerCase())) {
      console.log("Alipay/WeChat selected");
    } else {
      console.log("Bank Transfer selected");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const xcoin = parseFloat(e.target.value);
    if (!isNaN(xcoin)) {
      setAmount(e.target.value);
      setRmbValue(xcoin * cardDetails.rate);
    } else {
      setAmount("");
      setRmbValue(0);
    }
  };

  // Subscription state fetched from the backend
  // For a free "standard" plan, we no longer use a trial period.
  const [subscription, setSubscription] = useState<Subscription | null>({
    type: "standard",
    trialEnd: null, // not needed for a free plan
  });

  // we compare the current time with trialEnd.
  const [isExpired, setIsExpired] = useState(false);

  const changeCurrency = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent page reload

    if (!amount || parseInt(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const url = `${import.meta.env.VITE_ROOT_URL}/convert`;

      const response = await axios.post(url, amount, { withCredentials: true });

      if (response.status >= 300) {
        throw new Error("Conversion failed. Please try again.");
      }

      const data = await response.data;
      setRmbValue(data.convertedAmount); // Assuming API returns { convertedAmount: 100 }
    } catch (error) {
      console.error("Error converting currency:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Fetch subscription data from the backend
  useEffect(() => {
    async function fetchSubscription() {
      try {
        const url = `${import.meta.env.VITE_ROOT_URL}/subscriptions`;
        const response = await axios.get(url, { withCredentials: true });
        if (response.status >= 300) {
          throw new Error("Failed to fetch subscription");
        }
        const data: { type: string; trialEnd?: string } = response.data;
        setSubscription({
          type: data.type,
          trialEnd: data.trialEnd ? new Date(data.trialEnd) : null,
        });
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
    }
    fetchSubscription();
  }, []);

  // For non-standard plans, check if the subscription (or trial period) is expired.
  useEffect(() => {
    if (subscription?.type !== "standard" && subscription?.trialEnd) {
      const now = new Date();
      setIsExpired(now > subscription.trialEnd);
    } else {
      // "Standard" is free and does not expire.
      setIsExpired(false);
    }
  }, [subscription]);

  // Dummy handler for payment/upgrade action
  const handleUpgrade = () => {
    // TODO: Integrate with your payment gateway or upgrade flow here.
    alert("Redirecting to payment/upgrade flow...");
  };

  return (
    <div className="flex h-screen bg-gray-50 max-sm:p-3 max-sm:mt-6">
      <Sidebar />
      <main className="flex-1 p-6 max-w-screen-lg mx-auto">
        {/* Header */}
        <DashboardHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Wallet Balance Card */}
          <WalletBalanceCard
            balance={cardDetails.balance}
            subscriptionType={cardDetails.subscriptionType}
            isExpired={isExpired}
          />

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

            <form className="space-y-4" onSubmit={changeCurrency}>
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
            <form className="space-y-4" onSubmit={handleBuyXcoin}>
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
                <option value="momo">MTN MoMo</option>
                <option value="wechat">Alipay/WeChat</option>
                <option value="bankTransfer" disabled>
                  Bank Transfer
                </option>
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
                  <th className="p-3 text-left text-gray-700">Amount</th>
                  <th className="p-3 text-left text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions?.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{transaction.date}</td>
                    <td className="p-3">{transaction.amount}</td>
                    <td className="p-3">{transaction.targetAmount}</td>
                    <td className="p-3">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subscription/Upgrade Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Subscription Options
            </h3>
            <div className="space-y-4">
              <label
                htmlFor="subscriptionType"
                className="block text-sm font-medium text-gray-700"
              >
                Select Card Type
              </label>
              <select
                id="subscriptionType"
                value={subscription?.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  setSubscription({
                    ...subscription,
                    type: newType,
                    // For non-standard plans, set a trial period; standard remains free.
                    trialEnd:
                      newType === "standard"
                        ? null
                        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="standard">Standard (Free)</option>
                <option value="premium">Premium</option>
                <option disabled value="business">
                  Business
                </option>
              </select>

              {subscription?.type === "standard" ? (
                <div>
                  <p className="text-green-600">
                    Enjoy your {subscription.type} plan!
                  </p>
                  {/* <button
                    type="button"
                    onClick={handleUpgrade}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium w-full shadow-md mt-2"
                  >
                    Upgrade Now
                  </button> */}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleUpgrade}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium w-full shadow-md"
                >
                  Upgrade Now
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;

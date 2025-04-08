import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { ConvertXcoinModalProps } from "@/utils/types";

const ConvertXcoinModal: React.FC<ConvertXcoinModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  destinationCurrency,
  amount,
}) => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmAmount, setConfirmAmount] = useState(amount);

  // Update confirmAmount when prop changes
  useEffect(() => {
    setConfirmAmount(amount);
  }, [amount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (destinationCurrency === "fcfa") {
      if (!phone || phone.trim() === "") {
        alert("Please enter a valid phone number");
        return;
      }

      onConfirm({
        phone,
        amount: confirmAmount,
      });
    } else {
      // RMB
      if (!username || username.trim() === "") {
        alert("Please enter an Alipay/WeChat username");
        return;
      }

      onConfirm({
        username,
        amount: confirmAmount,
      });
    }

    // Reset form fields
    setUsername("");
    setPhone("");
  };

  // Reset fields when modal closes
  useEffect(() => {
    if (!isOpen) {
      setUsername("");
      setPhone("");
    }
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Convert XCoin to {destinationCurrency}
                </DialogTitle>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="confirmAmount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Amount (XCoin)
                    </label>
                    <input
                      type="number"
                      id="confirmAmount"
                      value={confirmAmount}
                      onChange={(e) => setConfirmAmount(Number(e.target.value))}
                      required
                      min={1}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                    />
                  </div>

                  {/* Show different fields based on destination currency */}
                  {destinationCurrency === "fcfa" ? (
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="Enter recipient's phone number"
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Enter the MTN mobile number to receive the funds
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Alipay/WeChat Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter Alipay/WeChat username"
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Enter your Alipay or WeChat username to receive the
                        funds
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Confirm Conversion
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConvertXcoinModal;

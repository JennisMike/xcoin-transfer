import React from "react";
import { WalletProps } from "@/utils/types";
import { subscriptionStyles } from "@/utils/data";

const WalletBalanceCard: React.FC<WalletProps> = ({
  balance,
  subscriptionType,
  isExpired,
}) => {
  // Define styles based on subscription type

  const { bg, badgeBg, badgeText } = subscriptionStyles[subscriptionType];

  return (
    <div className={`bg-linear-0 ${bg} text-white p-6 rounded-xl shadow-lg`}>
      {/* Subscription Badge */}
      <div
        className={`px-3 py-1 ${badgeBg} text-white text-sm font-bold rounded-full w-fit`}
      >
        {badgeText}
      </div>

      {/* Wallet Balance */}
      <h3 className="text-lg font-medium mt-2">Wallet Balance</h3>
      <div className="text-4xl font-bold mt-2">{balance} XCoin</div>

      {/* Expiry Message */}
      {subscriptionType !== "standard" && isExpired && (
        <p className="mt-4 text-yellow-300">
          Your trial has ended. Please upgrade or pay to continue enjoying your
          wallet features.
        </p>
      )}
    </div>
  );
};

export default WalletBalanceCard;

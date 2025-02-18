import { Link } from "react-router-dom";
import { Home, ShoppingCart, Repeat, History, LogOut } from "lucide-react";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#323131] text-white flex flex-col p-5">
      {/* Logo / Brand Name */}
      <div className="text-xl font-bold mb-8 text-center">Xcoin Wallet</div>

      {/* Navigation Links */}
      <ul className="space-y-4 flex-1">
        <li>
          <Link
            to="/home"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <Home size={20} />
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/buy-xcoin"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <ShoppingCart size={20} />
            Buy Xcoin
          </Link>
        </li>
        <li>
          <Link
            to="/convert-xcoin"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <Repeat size={20} />
            Convert Xcoin
          </Link>
        </li>
        <li>
          <Link
            to="/transaction-history"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <History size={20} />
            Transaction History
          </Link>
        </li>
      </ul>

      {/* Logout Button */}
      <button className="flex items-center gap-3 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-200">
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
}

export default Sidebar;

import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import DefaultProfile from "../assets/profile.png";
import { ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleDropdown = (): void => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = (): void => {
    console.log("Logout clicked");
  };

  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-semibold text-gray-800">Welcome, User</h1>
      <div className="relative" ref={dropdownRef}>
        <div className="flex flex-row justify-center items-center">
          <button
            type="button"
            onClick={() => {
              navigate("/profile");
            }}
            className="flex items-center focus:outline-none cursor-pointer"
          >
            <div className="cursor-pointer">
              <Avatar className="cursor-pointer">
                <AvatarImage src={DefaultProfile} alt="User Avatar" />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
            </div>
          </button>
          <ChevronDown onClick={toggleDropdown} />
        </div>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50 cursor-pointer">
            <a
              href="/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>
            <a
              href="/settings"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Settings
            </a>
            <div className="flex flex-row text-white hover:bg-red-700 bg-red-500 cursor-pointer justify-center items-center rounded-sm">
              <LogOut className="pl-1" />
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

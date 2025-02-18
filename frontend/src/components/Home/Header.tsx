import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <div>
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-indigo-600">
                XCoin Transfer
              </span>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-indigo-600 transition-colors"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="hidden md:inline-flex text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Header;

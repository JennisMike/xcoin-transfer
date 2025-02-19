// routes.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/Landing";
// import About from "./About";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import BuyXcoinPage from "./pages/BuyXcoin";
import ConvertXcoinPage from "./pages/ConvertXcoin";
import TransactionHistoryPage from "./pages/TransactionHistory";
import ProfilePage from "./pages/UserProfile";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/buy-xcoin" element={<BuyXcoinPage />} />
      <Route path="/convert-xcoin" element={<ConvertXcoinPage />} />
      <Route path="/transaction-history" element={<TransactionHistoryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

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
import ProtectedWrapper from "./utils/ProtectedWrapper";
import Spinner from "./components/Spinner";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedWrapper>
            <UserDashboard />
          </ProtectedWrapper>
        }
      />
      <Route
        path="/buy-xcoin"
        element={
          <ProtectedWrapper>
            <BuyXcoinPage />
          </ProtectedWrapper>
        }
      />
      <Route
        path="/convert-xcoin"
        element={
          <ProtectedWrapper>
            <ConvertXcoinPage />
          </ProtectedWrapper>
        }
      />
      <Route
        path="/transaction-history"
        element={
          <ProtectedWrapper>
            <TransactionHistoryPage />
          </ProtectedWrapper>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedWrapper>
            <ProfilePage />
          </ProtectedWrapper>
        }
      />
      <Route path="/spinner" element={<Spinner />}></Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

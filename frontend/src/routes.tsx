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
import PaymentProcessing from "./pages/PaymentProcessing";
// import AdminDashboard from "./pages/Admin/DashboardTest1";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import TransactionDetail from "./pages/Admin/TransactionDetail";
import DashboardTest from "./pages/Admin/DashboardTest";
import CheckEmailPage from "./pages/CheckEmail";
import VerifyEmail from "./pages/VerifyEmail";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/check-email" element={<CheckEmailPage />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
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
      <Route
        path="/payment"
        element={
          <ProtectedWrapper>
            <PaymentProcessing />
          </ProtectedWrapper>
        }
      />
      <Route path="/admin">
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedWrapper isAdmin>
              <AdminDashboard />
            </ProtectedWrapper>
          }
        />
        <Route
          path="/admin/transaction/:id"
          element={
            <ProtectedWrapper isAdmin>
              <TransactionDetail />
            </ProtectedWrapper>
          }
        />
        <Route
          path="/admin/test"
          element={
            <ProtectedWrapper isAdmin>
              <DashboardTest />
            </ProtectedWrapper>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

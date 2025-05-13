import { motion } from "framer-motion";
import { MailIcon } from "lucide-react"; // or any email icon you prefer
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import axios from "axios";

export default function CheckEmailPage() {
  const openEmailApp = () => {
    // Try to open user's default email app (works best on mobile)
    window.location.href = "mailto:";
  };
  const resendEmail = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ROOT_URL}/auth/resend-verification-email`,
        {},
        { withCredentials: true }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error resending email:", error);
      alert("Failed to resend verification email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-10 rounded-2xl shadow-xl text-center space-y-6"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex justify-center"
        >
          <MailIcon className="h-16 w-16 text-blue-600" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-800">Check your email!</h1>
        <p className="text-gray-600">
          We&apos;ve sent a verification link to your email address. <br />
          Please open your inbox and follow the instructions.
        </p>

        <div className="space-y-2">
          <Button variant="default" size="lg" onClick={openEmailApp}>
            Open Email App
          </Button>
          <div>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={resendEmail}
            >
              Resend Email
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

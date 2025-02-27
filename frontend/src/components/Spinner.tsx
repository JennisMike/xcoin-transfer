import React from "react";
import { motion } from "framer-motion";

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default Spinner;

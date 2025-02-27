import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const FloatingWhatsapp = ({ phone }: { phone: string }) => {
  return (
    <motion.a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-green-600"
      initial={{ y: 10 }}
      animate={{ y: [10, -10, 10] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.1 }}
    >
      <FaWhatsapp />
    </motion.a>
  );
};

export default FloatingWhatsapp;

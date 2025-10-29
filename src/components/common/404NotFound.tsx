import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center  bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/20 p-4">

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/images/logo.svg"
          alt="background logo"
          className="w-[600px] opacity-[0.03] dark:opacity-[0.05]"
        />
      </div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md"
      >
        <div className="text-8xl font-extrabold text-primary mb-4">404</div>
        <h1 className="text-3xl font-bold mb-2">Oops! Page not found</h1>
        <p className="text-muted-foreground mb-6">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-secondary cursor-pointer text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-primary text-primary-foreground cursor-pointer px-4 py-2 rounded-md hover:bg-primary/90 transition"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;

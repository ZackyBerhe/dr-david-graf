"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Signature from "./components/Signature";
import ThreeCard from "./components/CardModel";

export default function Home() {
  const [showSignature, setShowSignature] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSignature(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center bg-[#000100] overflow-hidden">
      <Image
        src="/Background.png"
        alt="Background Image"
        fill
        className="object-contain"
        priority
      />
      <div className="absolute items-center justify-center h-28 w-28 -top-[42vh] left-20">
        <Signature />
      </div>

      <AnimatePresence mode="wait">
        {showSignature ? (
          <motion.div
            key="signature"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-[#000100]"
          >
            <Signature />
          </motion.div>
        ) : (
          <>
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="z-50"
            >
              <ThreeCard />{" "}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

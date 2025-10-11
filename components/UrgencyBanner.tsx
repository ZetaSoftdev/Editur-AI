"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

const UrgencyBanner = () => {
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // 3 hours
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white text-black p-4 shadow-2xl"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-2xl">⏰</span>
          <div>
            <p className="font-bold text-lg">
              Limited Time: 70% OFF expires in {formatTime(timeLeft)}
            </p>
            <p className="text-sm opacity-90">
              Don't miss out on saving $1,896/year • Only 47 spots left!
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <button className="bg-[#FFD700] hover:bg-[#F59E0B] text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-xl">
              🚀 Claim Offer Now
            </button>
          </Link>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-black/70 hover:text-black text-2xl"
          >
            ×
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UrgencyBanner;
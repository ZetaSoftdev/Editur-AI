"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

const PricingSection = () => {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours
  
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

  return (
    <section className="text-white py-20 px-4 sm:px-12 text-center">
      {/* FOMO Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-4 rounded-2xl max-w-4xl mx-auto mb-12"
      >
        <h2 className="text-2xl sm:text-4xl font-bold mb-2">🔥 FLASH SALE ENDING SOON!</h2>
        <p className="text-lg sm:text-xl">
          70% OFF + 3 Months FREE - Only <span className="font-bold animate-pulse">{formatTime(timeLeft)}</span> left!
        </p>
        <p className="text-sm mt-2 opacity-90">⚠️ Only 47 spots remaining at this price</p>
      </motion.div>

      {/* Main Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-3xl sm:text-6xl font-bold mb-6"
      >
        <span className="text-[#FFD700]">Choose Your</span><br />
        <span className="text-[#8B5CF6]">Money-Making Machine</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="text-xl text-gray-300 max-w-3xl mx-auto mb-16"
      >
        Join 127,000+ creators making <span className="text-[#FFD700] font-bold">$10K+/month</span> with our AI video editor
      </motion.p>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* Starter Plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gray-800/50 border border-gray-600 rounded-2xl p-8 relative"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Starter</h3>
          <div className="mb-6">
            <div className="text-4xl font-bold text-white">$19</div>
            <div className="text-gray-400">/month</div>
            <div className="text-sm text-gray-500 line-through">$97/month</div>
          </div>
          
          <ul className="text-left space-y-3 mb-8">
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> 50 AI-generated videos/month</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Auto captions & subtitles</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> 5 social platforms</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Basic AI voiceovers</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Email support</li>
          </ul>
          
          <Link href="/dashboard">
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300">
              Start Free Trial
            </button>
          </Link>
        </motion.div>

        {/* Pro Plan - Most Popular */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gradient-to-br from-[#8B5CF6]/30 to-[#7C3AED]/30 border-2 border-[#8B5CF6] rounded-2xl p-8 relative transform scale-105"
        >
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#FFD700] to-[#F59E0B] text-black px-6 py-2 rounded-full text-sm font-bold">
            🔥 MOST POPULAR
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4 mt-4">Pro Creator</h3>
          <div className="mb-6">
            <div className="text-5xl font-bold text-[#FFD700]">$39</div>
            <div className="text-gray-300">/month</div>
            <div className="text-sm text-gray-500 line-through">$197/month</div>
            <div className="text-green-400 text-sm font-semibold">Save $1,896/year!</div>
          </div>
          
          <ul className="text-left space-y-3 mb-8">
            <li className="flex items-center"><span className="text-[#FFD700] mr-2">✓</span> 500 AI-generated videos/month</li>
            <li className="flex items-center"><span className="text-[#FFD700] mr-2">✓</span> Advanced AI editing features</li>
            <li className="flex items-center"><span className="text-[#FFD700] mr-2">✓</span> 15+ social platforms</li>
            <li className="flex items-center"><span className="text-[#FFD700] mr-2">✓</span> Premium AI voiceovers</li>
            <li className="flex items-center"><span className="text-[#FFD700] mr-2">✓</span> Auto-translation (30+ languages)</li>
            <li className="flex items-center"><span className="text-[#FFD700] mr-2">✓</span> Priority support</li>
            <li className="flex items-center"><span className="text-[#FFD700] mr-2">✓</span> Custom branding</li>
          </ul>
          
          <Link href="/dashboard">
            <button className="w-full bg-gradient-to-r from-[#FFD700] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#D97706] text-black font-bold py-4 px-6 rounded-full text-lg transform transition-all duration-300 hover:scale-105 shadow-xl">
              🚀 Start Making Money Now
            </button>
          </Link>
          
          <p className="text-xs text-gray-400 mt-3">⚡ Most creators see ROI in first week</p>
        </motion.div>

        {/* Enterprise Plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="bg-gray-800/50 border border-gray-600 rounded-2xl p-8 relative"
        >
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold">
            💎 ENTERPRISE
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4 mt-4">Agency</h3>
          <div className="mb-6">
            <div className="text-4xl font-bold text-white">$99</div>
            <div className="text-gray-400">/month</div>
            <div className="text-sm text-gray-500 line-through">$497/month</div>
          </div>
          
          <ul className="text-left space-y-3 mb-8">
            <li className="flex items-center"><span className="text-purple-400 mr-2">✓</span> Unlimited AI videos</li>
            <li className="flex items-center"><span className="text-purple-400 mr-2">✓</span> White-label solution</li>
            <li className="flex items-center"><span className="text-purple-400 mr-2">✓</span> All platforms + API access</li>
            <li className="flex items-center"><span className="text-purple-400 mr-2">✓</span> Custom AI models</li>
            <li className="flex items-center"><span className="text-purple-400 mr-2">✓</span> 24/7 dedicated support</li>
            <li className="flex items-center"><span className="text-purple-400 mr-2">✓</span> Team collaboration</li>
          </ul>
          
          <Link href="/dashboard">
            <button className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold py-3 px-6 rounded-full transition-all duration-300">
              Contact Sales
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Money Back Guarantee */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="mt-16 bg-gradient-to-r from-green-600/20 to-green-500/20 border border-green-500/30 rounded-2xl p-8 max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl mr-3">🛡️</span>
          <h3 className="text-2xl font-bold text-green-400">14-Day Money-Back Guarantee</h3>
        </div>
        <p className="text-gray-200 text-lg">
          Not making money within 14 days? Get a <span className="text-green-400 font-bold">full refund</span>. 
          No questions asked. We're that confident you'll love it.
        </p>
        <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-300">
          <span className="flex items-center"><span className="text-green-400 mr-1">✓</span> No contracts</span>
          <span className="flex items-center"><span className="text-green-400 mr-1">✓</span> Cancel anytime</span>
          <span className="flex items-center"><span className="text-green-400 mr-1">✓</span> Keep all videos</span>
          <span className="flex items-center"><span className="text-green-400 mr-1">✓</span> No hidden fees</span>
        </div>
      </motion.div>

      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="mt-16"
      >
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="text-center">
            <div className="text-xl font-bold text-[#FFD700]">127,439+</div>
            <div className="text-xs text-gray-400">Happy Creators</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#FFD700]">$50M+</div>
            <div className="text-xs text-gray-400">Revenue Generated</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#FFD700]">4.9⭐</div>
            <div className="text-xs text-gray-400">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#FFD700]">2.5M+</div>
            <div className="text-xs text-gray-400">Videos Created</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default PricingSection;
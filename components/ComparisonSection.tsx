"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLogoContext } from "@/context/LogoContext";

const beforeItems = [
  { text: "Hours to days spent editing long videos", cost: "$0", pain: "20+ hours weekly" },
  { text: "Requires dedicated video editors", cost: "$3000+/month", pain: "Expensive team" },
  { text: "Manual scripting, voiceovers, and image sourcing", cost: "$500+/week", pain: "Creative burnout" },
  { text: "Spend hours on manual captioning and formatting", cost: "$200+/week", pain: "Tedious work" },
  { text: "Manual translation needed for each language", cost: "$100+/video", pain: "Limited reach" },
  { text: "Manual uploading to each platform", cost: "$300+/week", pain: "Time consuming" },
];

const afterItems = [
  { text: "Generate auto-edited videos in minutes", benefit: "20x faster", value: "Save 20+ hours" },
  { text: "AI will work 24/7 for you", benefit: "$19/month", value: "99% cost reduction" },
  { text: "AI-generated stories, voiceovers, and images", benefit: "Unlimited content", value: "Never run out" },
  { text: "Auto-captions with 20+ styles and multi-language", benefit: "1-click magic", value: "Global reach" },
  { text: "Auto-translate captions into 30+ languages", benefit: "Instant global", value: "10x audience" },
  { text: "Schedule and publish on all platforms automatically", benefit: "Set & forget", value: "24/7 posting" },
];

const ComparisonSection = () => {
  const { branding } = useLogoContext();
  return (
    <section className="text-white py-20 px-4 sm:px-12 text-center">
      {/* Heading */}
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl sm:text-6xl font-bold mb-8"
      >
        <span className="text-white">The Old Way vs </span><span className="text-[#8B5CF6]">The Smart Way</span>
      </motion.h2>

      {/* Subheading */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="mt-4 text-xl text-gray-300 max-w-4xl mx-auto mb-12"
      >
        The old way costs you <span className="text-gray-400 font-bold">$4,000+/month</span> and <span className="text-gray-400 font-bold">80+ hours</span>. 
        With <span className="text-[#8B5CF6] font-bold">{branding.siteName}</span>, get <span className="text-white font-bold">10x better results</span> for <span className="text-white font-bold">99% less cost</span>.
      </motion.p>

      {/* Cost Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="bg-gradient-to-r from-red-900/40 to-red-800/40 border border-red-500/50 rounded-xl p-6 max-w-2xl mx-auto mb-16"
      >
        <h3 className="text-2xl font-bold text-red-300 mb-4">What You're Currently Spending</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-red-200">$4,100</div>
            <div className="text-sm text-red-300">Monthly Costs</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-200">83 hrs</div>
            <div className="text-sm text-red-300">Time Wasted</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-red-800/30 rounded-lg">
          <p className="text-red-200 text-sm">
            That's <span className="font-bold">$49,200/year</span> + <span className="font-bold">996 hours</span> you could invest elsewhere
          </p>
        </div>
      </motion.div>

      {/* Comparison Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-stretch">
        {/* Without EditurAI */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="relative flex"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-500/30 w-full flex flex-col relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white px-6 py-2 rounded-full text-sm font-bold z-20">
              OLD WAY
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-300 mb-6 mt-4">Without {branding.siteName}</h3>
            
            <div className="space-y-4 flex-1">
              {beforeItems.map((item, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-500/20 hover:border-gray-500/40 transition-colors min-h-[80px]"
                >
                  <span className="text-gray-400 text-2xl flex-shrink-0">✖</span>
                  <div className="flex-grow flex flex-col justify-center h-full">
                    <p className="text-gray-200 text-sm mb-2">{item.text}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-semibold">{item.cost}</span>
                      <span className="text-gray-500">{item.pain}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-600/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-300">Total: $4,100/month</div>
              <div className="text-sm text-gray-400">+ 83 hours of your time</div>
            </div>
          </div>
        </motion.div>

        {/* With EditurAI */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative z-10"
        >
          <div className="bg-gradient-to-br from-[#8B5CF6]/20 to-[#7C3AED]/20 p-8 rounded-2xl shadow-2xl border-2 border-[#8B5CF6]/50 h-full flex flex-col relative overflow-visible">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white px-6 py-2 rounded-full text-sm font-bold z-30">
              NEW WAY
            </div>
            
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 to-transparent animate-pulse"></div>
            
            <h3 className="text-2xl font-semibold text-[#8B5CF6] mb-6 mt-4 relative z-10">With {branding.siteName}</h3>
            
            <div className="space-y-4 relative z-10 flex-grow">
              {afterItems.map((item, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg border border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60 hover:bg-[#8B5CF6]/10 transition-all duration-300 hover:scale-105 min-h-[80px]"
                >
                  <span className="text-[#8B5CF6] text-2xl flex-shrink-0">✓</span>
                  <div className="flex-grow flex flex-col justify-center h-full">
                    <p className="text-gray-200 text-sm mb-2">{item.text}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#8B5CF6] font-semibold">{item.benefit}</span>
                      <span className="text-gray-300">{item.value}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-[#8B5CF6]/30 to-[#7C3AED]/30 rounded-lg text-center relative z-10">
              <div className="text-2xl font-bold text-white">Total: $19/month</div>
              <div className="text-sm text-gray-300">+ 2 hours saved weekly</div>
              <div className="text-xs text-gray-300 mt-1">That's 99.5% savings!</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ROI Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="mt-16 bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-500/50 rounded-xl p-8 max-w-4xl mx-auto"
      >
        <h3 className="text-3xl font-bold text-green-300 mb-6">Your ROI in First Month</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-200">$4,081</div>
            <div className="text-sm text-green-300">Money Saved</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-200">81 hrs</div>
            <div className="text-sm text-green-300">Time Saved</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-200">21,474%</div>
            <div className="text-sm text-green-300">ROI</div>
          </div>
        </div>
        
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
        >
          <Link href="/dashboard">
            <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-4 px-8 rounded-lg text-lg transform transition-all duration-300 hover:scale-105 shadow-xl">
              Get 21,474% ROI Now
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Final CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="mt-16 text-center"
      >
        <p className="text-xl text-gray-300 mb-6">
          Stop throwing money away. <span className="text-[#8B5CF6] font-bold">Start your 3-month free trial</span> and see the difference.
        </p>
        <Link href="/dashboard">
          <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-2 border-[#8B5CF6] font-bold py-5 px-10 rounded-full text-xl shadow-2xl transform transition-all duration-300 hover:scale-105">
            Save $49,200/Year - Start Free Trial
          </button>
        </Link>
      </motion.div>
    </section>
  );
};

export default ComparisonSection;

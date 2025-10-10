"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Alex Thompson",
    role: "YouTuber",
    avatar: "/azeeem.jpg",
    followers: "2.1M",
    revenue: "$18,400/month",
    quote: "EditurAI turned my 1-hour editing process into 60 seconds. I've 10x'd my content output!",
    platform: "YouTube",
    verified: true
  },
  {
    name: "Maria Garcia",
    role: "TikTok Creator", 
    avatar: "/hasnain.jpeg",
    followers: "850K",
    revenue: "$12,300/month",
    quote: "From 0 to 850K followers in 6 months. This AI is pure magic for viral content!",
    platform: "TikTok",
    verified: true
  },
  {
    name: "James Wilson",
    role: "Business Coach",
    avatar: "/azeem.png", 
    followers: "445K",
    revenue: "$25,600/month",
    quote: "ROI was instant. Saved $3000/month on editors and tripled my content production.",
    platform: "Instagram",
    verified: true
  },
  {
    name: "Sophie Chen",
    role: "Fitness Influencer",
    avatar: "/azeeem.jpg",
    followers: "1.3M",
    revenue: "$22,100/month", 
    quote: "I create 50+ videos per week now. My engagement rates have never been higher!",
    platform: "Instagram",
    verified: true
  },
  {
    name: "David Rodriguez",
    role: "Tech Reviewer",
    avatar: "/hasnain.jpeg",
    followers: "680K",
    revenue: "$15,800/month",
    quote: "The AI understands exactly what goes viral. My videos hit the algorithm every time.",
    platform: "YouTube",
    verified: true
  }
];

const TestimonialsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="text-white py-20 px-4 sm:px-12 text-center bg-gradient-to-r from-gray-900/50 to-gray-800/50">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl sm:text-5xl font-bold mb-16"
      >
        <span className="text-[#FFD700]">Real Creators,</span>{" "}
        <span className="text-[#8B5CF6]">Real Results</span>
      </motion.h2>

      <div className="max-w-4xl mx-auto">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-[#8B5CF6]/20 to-[#7C3AED]/20 border border-[#8B5CF6]/30 rounded-3xl p-8 sm:p-12"
        >
          {/* Platform Badge */}
          <div className="flex justify-center mb-6">
            <span className="bg-[#FFD700] text-black px-4 py-2 rounded-full text-sm font-bold">
              🔥 {currentTestimonial.platform} Creator
            </span>
          </div>

          {/* Quote */}
          <blockquote className="text-xl sm:text-2xl text-gray-200 italic leading-relaxed mb-8">
            "{currentTestimonial.quote}"
          </blockquote>

          {/* Creator Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-4">
              <Image
                src={currentTestimonial.avatar}
                width={60}
                height={60}
                className="rounded-full border-3 border-[#8B5CF6]"
                alt={currentTestimonial.name}
              />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-white">
                    {currentTestimonial.name}
                  </h4>
                  {currentTestimonial.verified && (
                    <span className="text-blue-400 text-lg">✓</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{currentTestimonial.role}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-[#FFD700]">
                  {currentTestimonial.followers}
                </div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#FFD700]">
                  {currentTestimonial.revenue}
                </div>
                <div className="text-xs text-gray-400">Monthly Revenue</div>
              </div>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center mt-6">
            <div className="flex text-[#FFD700] text-xl">
              ⭐⭐⭐⭐⭐
            </div>
          </div>
        </motion.div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-[#8B5CF6] scale-125"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>

        {/* Social Proof Numbers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-[#FFD700]">99.2%</div>
            <div className="text-gray-400 text-sm">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#FFD700]">3.2M+</div>
            <div className="text-gray-400 text-sm">Total Followers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#FFD700]">$847K</div>
            <div className="text-gray-400 text-sm">Avg Monthly Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#FFD700]">72hrs</div>
            <div className="text-gray-400 text-sm">To First Viral</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
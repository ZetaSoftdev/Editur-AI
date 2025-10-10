"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const features = [
  "Making $1,000s/mo from shorts",
  "Making more views, subscribers, etc",
  "With little to no extra effort",
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Lifestyle Creator",
    avatar: "/azeeem.jpg",
    revenue: "$12,400/month",
    quote: "I went from 500 to 50K followers in 3 months. EditurAI creates content while I sleep!",
    verified: true
  },
  {
    name: "Marcus Johnson",
    role: "Business Coach",
    avatar: "/hasnain.jpeg",
    revenue: "$8,900/month",
    quote: "This AI does what my $4000/month editor used to do. ROI is insane!",
    verified: true
  },
  {
    name: "Emma Rodriguez",
    role: "Fitness Influencer",
    avatar: "/azeem.png",
    revenue: "$15,200/month",
    quote: "From 2 hours of editing to 2 minutes. Now I create 50+ videos per week effortlessly.",
    verified: true
  }
];

const CreatorsSection = () => {
  return (
    <section className="text-white py-20 px-4 sm:px-12 text-center">
      {/* Heading */}
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl sm:text-6xl font-bold mb-4"
      >
        Here's the thing: <br />
        <span className="text-[#FFD700]">these creators are making</span>
        <span className="text-[#8B5CF6]"> serious money</span>
      </motion.h2>

      {/* Subheading */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="mt-4 text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto"
      >
        While you're manually editing for hours, they're making <span className="text-[#FFD700] font-bold">$10K+/month</span> on autopilot
      </motion.p>

      {/* Features */}
      <div className="flex flex-wrap justify-center gap-6 mt-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#8B5CF6]/20 to-[#7C3AED]/20 border border-[#8B5CF6]/30 rounded-full text-base sm:text-lg text-gray-200 hover:scale-105 transition-transform duration-300"
          >
            <span className="text-green-400 text-xl">✅</span> {feature}
          </motion.div>
        ))}
      </div>

      {/* Real Creator Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
            className="bg-gray-800/50 border border-[#8B5CF6]/30 rounded-xl p-6 hover:border-[#8B5CF6]/50 transition-all duration-300 hover:transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <Image 
                src={testimonial.avatar} 
                width={50} 
                height={50} 
                className="rounded-full border-2 border-[#8B5CF6]" 
                alt={testimonial.name} 
              />
              <div className="ml-3 text-left">
                <div className="flex items-center">
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  {testimonial.verified && <span className="ml-2 text-blue-400">✓</span>}
                </div>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-2xl font-bold text-[#FFD700] mb-2">{testimonial.revenue}</div>
              <div className="flex text-[#FFD700] mb-3">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
            
            <p className="text-gray-200 text-sm leading-relaxed italic">
              "{testimonial.quote}"
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Social Proof Numbers */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto"
      >
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-bold text-[#FFD700]">127K+</div>
          <div className="text-gray-400 text-sm mt-1">Happy Creators</div>
        </div>
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-bold text-[#FFD700]">2.5M+</div>
          <div className="text-gray-400 text-sm mt-1">Videos Created</div>
        </div>
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-bold text-[#FFD700]">$50M+</div>
          <div className="text-gray-400 text-sm mt-1">Revenue Generated</div>
        </div>
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-bold text-[#FFD700]">4.9★</div>
          <div className="text-gray-400 text-sm mt-1">Average Rating</div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="mt-12"
      >
        <Link href="/dashboard">
          <button className="bg-gradient-to-r from-[#FFD700] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#D97706] text-black font-bold py-4 px-8 rounded-full text-lg transform transition-all duration-300 hover:scale-105 shadow-xl">
            🚀 Join 127K+ Successful Creators
          </button>
        </Link>
      </motion.div>
      
      {/* Demo Video */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="mt-20 flex justify-center"
      >
        <div className="relative max-w-5xl w-full">
          <video
            src="/edituranimate.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full rounded-3xl shadow-2xl border-4 border-[#8B5CF6]/30"
          ></video>
          <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-bounce">
            🔥 LIVE DEMO
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CreatorsSection;

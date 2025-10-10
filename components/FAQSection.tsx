"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "How quickly can I start making money?",
    answer: "Most creators see their first viral video within 72 hours and start monetizing within the first week. Our AI identifies trending patterns and optimizes your content for maximum reach immediately."
  },
  {
    question: "Do I need any technical skills?",
    answer: "Zero technical skills required! Just paste a YouTube link or upload your video, and our AI handles everything - editing, captions, thumbnails, and posting to all platforms. It's literally point-and-click."
  },
  {
    question: "What if I don't have content to start with?",
    answer: "No problem! Our AI can create faceless videos, generate stories, add voiceovers, and source background footage. You can build a profitable channel without ever showing your face or recording anything."
  },
  {
    question: "How is this different from hiring a video editor?",
    answer: "A good video editor costs $3,000-5,000/month, takes days to deliver, and works only 8 hours/day. Our AI works 24/7, costs $19/month, and delivers professional results in 60 seconds. Plus, it never gets sick or takes vacation!"
  },
  {
    question: "Can I really make $10K+/month like your testimonials?",
    answer: "Our creators average $8,400/month, with top performers making $25K+. Results depend on consistency and niche, but our AI maximizes your chances by creating content proven to go viral based on millions of data points."
  },
  {
    question: "What if I'm not satisfied?",
    answer: "We offer a 14-day money-back guarantee, no questions asked. Plus, you keep all the videos created during your trial. We're confident you'll love the results, but your satisfaction is guaranteed."
  },
  {
    question: "How many videos can I create?",
    answer: "Starter plan: 50 videos/month. Pro plan: 500 videos/month. Agency plan: Unlimited. Most creators find the Pro plan perfect for scaling to $10K+/month income levels."
  },
  {
    question: "Will my videos look generic or robotic?",
    answer: "Absolutely not! Our AI creates unique content by analyzing millions of viral videos. Each video is customized to your brand, style, and audience. Viewers can't tell it's AI-generated - that's the magic!"
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="text-white py-20 px-4 sm:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            <span className="text-[#FFD700]">Questions?</span>{" "}
            <span className="text-[#8B5CF6]">We've Got Answers</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about making money with AI-generated videos
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                <span className={`text-[#8B5CF6] text-2xl transform transition-transform duration-200 flex-shrink-0 ${
                  openIndex === index ? 'rotate-45' : ''
                }`}>
                  +
                </span>
              </button>
              
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-5"
                >
                  <p className="text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-[#8B5CF6]/20 to-[#7C3AED]/20 border border-[#8B5CF6]/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions? 
            </h3>
            <p className="text-gray-300 mb-6">
              Start your free trial and get answers from our success team
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <button className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105">
                  🚀 Start Free Trial
                </button>
              </Link>
              <a 
                href="mailto:support@editurai.com" 
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300"
              >
                💬 Contact Support
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
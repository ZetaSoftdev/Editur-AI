"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLogoContext } from "@/context/LogoContext";

const words = ["TikTok", "Instagram", "Reels", "Shorts"];
const typingSpeed = 100;
const deleteSpeed = 50;
const delayBetweenWords = 1000;

const Hero = () => {
    const [text, setText] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [letterIndex, setLetterIndex] = useState(0);
    const { branding } = useLogoContext();

    useEffect(() => {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            if (letterIndex > 0) {
                setTimeout(() => {
                    setText(currentWord.substring(0, letterIndex - 1));
                    setLetterIndex(letterIndex - 1);
                }, deleteSpeed);
            } else {
                setIsDeleting(false);
                setWordIndex((prev) => (prev + 1) % words.length);
            }
        } else {
            if (letterIndex < currentWord.length) {
                setTimeout(() => {
                    setText(currentWord.substring(0, letterIndex + 1));
                    setLetterIndex(letterIndex + 1);
                }, typingSpeed);
            } else {
                setTimeout(() => setIsDeleting(true), delayBetweenWords);
            }
        }
    }, [text, isDeleting, wordIndex]);

    return (
        <section className="relative min-h-screen text-white px-4 sm:px-6 py-8 sm:py-12">
            {/* Auto Badge */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="flex justify-center mb-8 sm:mb-12"
            >
                <img src="/auto.svg" alt="Automatically with AI" className="h-6 sm:h-8" />
            </motion.div>

            {/* Two Column Layout */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                
                {/* Left Column - Content */}
                <div className="space-y-6 sm:space-y-8">
                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                    >
                        <span className="text-[#FFD700]">Create Engaging Clips</span>
                        <br />
                        <span className="text-white">From Your Videos</span>
                        <br />
                        <span className="text-white">Turn 1 Long Video Into </span>
                        <span className="text-white">
                            10+ Viral {text}
                            <motion.span
                                className="inline-block w-[3px] h-[30px] lg:h-[50px] bg-white ml-2"
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                            />
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="space-y-4"
                    >
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#FFD700]">
                            In Under 60 Seconds ⚡
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-lg">
                            Our AI does what a <span className="text-[#FFD700] font-semibold">$3,000/month video editor</span> does for{" "}
                            <span className="text-white font-semibold">just $19/month</span> - while you sleep
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="grid grid-cols-3 gap-4 lg:gap-6"
                    >
                        <div className="text-center">
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#FFD700]">$10K+</div>
                            <div className="text-xs sm:text-sm text-gray-400">Extra Revenue</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#FFD700]">20+ Hours</div>
                            <div className="text-xs sm:text-sm text-gray-400">Saved Weekly</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#FFD700]">500%</div>
                            <div className="text-xs sm:text-sm text-gray-400">More Content</div>
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="space-y-4"
                    >
                        <Link href="/dashboard">
                            <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-3 px-6 lg:py-4 lg:px-8 rounded-lg text-base lg:text-lg transition-all duration-300 hover:scale-105 shadow-lg">
                                🚀 Start Creating Now
                            </button>
                        </Link>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-400">
                            <span className="flex items-center"><span className="text-green-400 mr-2">✓</span> No Credit Card Required</span>
                            <span className="flex items-center"><span className="text-green-400 mr-2">✓</span> Cancel Anytime</span>
                        </div>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1.0 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
                    >
                        <div className="flex -space-x-2">
                            <Image src="/azeeem.jpg" width={32} height={32} className="rounded-full border-2 border-[#8B5CF6]" alt="Creator 1" />
                            <Image src="/hasnain.jpeg" width={32} height={32} className="rounded-full border-2 border-[#8B5CF6]" alt="Creator 2" />
                            <Image src="/azeem.png" width={32} height={32} className="rounded-full border-2 border-[#8B5CF6]" alt="Creator 3" />
                        </div>
                        <div>
                            <div className="flex text-[#FFD700] text-sm">
                                ⭐⭐⭐⭐⭐ <span className="text-white ml-2 font-semibold">4.9/5</span>
                            </div>
                            <p className="text-gray-400 text-sm">Trusted by <span className="font-semibold text-white">127,439+</span> creators worldwide</p>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Video */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="relative"
                >
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                        <video
                            src="/edituranimate.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-auto"
                        ></video>
                        
                        {/* Subtle overlay for better text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                    </div>
                    
                    {/* Video Caption */}
                    <p className="text-center text-gray-400 mt-4 text-sm">
                        👆 See how creators make $10K+/month with our AI
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

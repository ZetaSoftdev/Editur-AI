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
        <section className="relative min-h-screen text-white px-6 py-12">
            {/* Auto Badge */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="flex justify-center mb-12"
            >
                <img src="/auto.svg" alt="Automatically with AI" className="h-8" />
            </motion.div>

            {/* Two Column Layout */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Left Column - Content */}
                <div className="space-y-8">
                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
                    >
                        <span className="text-[#FFD700]">Stop Wasting 20+ Hours</span>
                        <br />
                        <span className="text-white">Per Week Editing</span>
                        <br />
                        <span className="text-white">Turn 1 Long Video Into </span>
                        <span className="text-white">
                            10+ Viral {text}
                            <motion.span
                                className="inline-block w-[4px] h-[40px] lg:h-[60px] bg-white ml-2"
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
                        <h2 className="text-2xl sm:text-3xl font-semibold text-[#FFD700]">
                            In Under 60 Seconds ⚡
                        </h2>
                        <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                            Our AI does what a <span className="text-[#FFD700] font-semibold">$3,000/month video editor</span> does for{" "}
                            <span className="text-white font-semibold">just $19/month</span> - while you sleep
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="grid grid-cols-3 gap-6"
                    >
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-[#FFD700]">$10K+</div>
                            <div className="text-sm text-gray-400">Extra Monthly Revenue</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-[#FFD700]">20+ Hours</div>
                            <div className="text-sm text-gray-400">Saved Per Week</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-[#FFD700]">500%</div>
                            <div className="text-sm text-gray-400">More Content Output</div>
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
                            <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:scale-105 shadow-lg">
                                🚀 Start Creating Viral Content NOW
                            </button>
                        </Link>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <span className="flex items-center"><span className="text-green-400 mr-2">✓</span> No Credit Card Required</span>
                            <span className="flex items-center"><span className="text-green-400 mr-2">✓</span> Cancel Anytime</span>
                        </div>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1.0 }}
                        className="flex items-center space-x-4"
                    >
                        <div className="flex -space-x-3">
                            <Image src="/azeeem.jpg" width={40} height={40} className="rounded-full border-2 border-[#8B5CF6]" alt="Creator 1" />
                            <Image src="/hasnain.jpeg" width={40} height={40} className="rounded-full border-2 border-[#8B5CF6]" alt="Creator 2" />
                            <Image src="/azeem.png" width={40} height={40} className="rounded-full border-2 border-[#8B5CF6]" alt="Creator 3" />
                        </div>
                        <div>
                            <div className="flex text-[#FFD700] text-sm">
                                ⭐⭐⭐⭐⭐ <span className="text-white ml-2 font-semibold">4.9/5</span>
                            </div>
                            <p className="text-gray-400 text-sm">Trusted by <span className="font-semibold text-white">127,439+</span> creators making $1M+</p>
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
                        👆 Watch how creators are making $10K+/month with our AI
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

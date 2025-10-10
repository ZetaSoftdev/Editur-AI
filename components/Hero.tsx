"use client";
// Force cache bust for Railway deployment
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
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
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

    // Countdown timer
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
        <section className="relative flex flex-col items-center min-h-screen text-center text-white px-6">
            {/* FOMO Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-4xl mx-auto mb-6"
            >
                <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-full text-center shadow-lg">
                    <p className="text-sm sm:text-base font-semibold">
                        🔥 <span className="animate-pulse">LIMITED TIME:</span> Get 70% OFF + 3 Month FREE Trial - Expires in {formatTime(timeLeft)}
                    </p>
                </div>
            </motion.div>

            {/* Auto Badge */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="mt-4 max-w-2xl text-left ml-0 md:ml-[-250px] sm:ml-[-250px]"
            >
                <img src="/auto.svg" alt="" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative text-[28px] sm:text-[42px] md:text-[48px] font-bold leading-tight max-w-4xl mt-6"
            >
                <span className="text-[#FFD700]">Stop Wasting 20+ Hours</span> Per Week Editing{" "}
                <span className="block">Turn 1 Long Video Into <span className="text-[#8B5CF6]">10+ Viral {text}</span></span>
                <motion.span
                    className="inline-block w-[7px] h-[26px] sm:h-[30px] md:h-[48px] bg-white ml-1"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                />
                <span className="block text-[24px] sm:text-[32px] md:text-[36px] mt-4 text-[#FFD700]">In Under 60 Seconds ⚡</span>
            </motion.h1>

            {/* Value Proposition */}
            <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="mt-6 text-xl sm:text-2xl font-medium text-gray-200 max-w-3xl leading-relaxed"
            >
                Our AI does what a <span className="text-[#FFD700] font-bold">$3,000/month video editor</span> does for{" "}
                <span className="text-[#8B5CF6] font-bold">just $19/month</span> - while you sleep 💤
            </motion.p>

            {/* Results Stats */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full"
            >
                <div className="bg-gray-800/50 p-4 rounded-lg border border-[#8B5CF6]/30">
                    <div className="text-2xl sm:text-3xl font-bold text-[#FFD700]">$10K+</div>
                    <div className="text-sm text-gray-300">Extra Monthly Revenue</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-[#8B5CF6]/30">
                    <div className="text-2xl sm:text-3xl font-bold text-[#FFD700]">20+ Hours</div>
                    <div className="text-sm text-gray-300">Saved Per Week</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-[#8B5CF6]/30">
                    <div className="text-2xl sm:text-3xl font-bold text-[#FFD700]">500%</div>
                    <div className="text-sm text-gray-300">More Content Output</div>
                </div>
            </motion.div>

            {/* Primary CTA Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="mt-10 flex flex-col items-center space-y-4"
            >
                <Link href="/dashboard" className="group">
                    <button className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold py-5 px-10 rounded-full text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-[#8B5CF6]/50 animate-pulse">
                        🚀 Start Creating Viral Content NOW
                        <span className="block text-sm font-normal mt-1">3 Month FREE Trial + 70% OFF</span>
                    </button>
                </Link>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center"><span className="text-green-400 mr-1">✓</span> No Credit Card Required</span>
                    <span className="flex items-center"><span className="text-green-400 mr-1">✓</span> Cancel Anytime</span>
                    <span className="flex items-center"><span className="text-green-400 mr-1">✓</span> 14-Day Money Back</span>
                </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.0 }}
                className="mt-8 flex flex-col items-center"
            >
                <div className="flex gap-2 items-center">
                    <div className="flex -space-x-3">
                        <Image src="/azeeem.jpg" width={45} height={45} className="rounded-full border-2 border-[#8B5CF6]" alt="Creator 1" />
                        <Image src="/hasnain.jpeg" width={45} height={45} className="rounded-full border-2 border-[#8B5CF6]" alt="Creator 2" />
                        <Image src="/azeem.png" width={45} height={45} className="rounded-full border-2 border-[#8B5CF6]" alt="Creator 3" />
                    </div>
                    <div className="flex flex-col text-left">
                        <div className="flex text-[#FFD700] text-lg">
                            ⭐⭐⭐⭐⭐ <span className="text-white ml-2 font-semibold">4.9/5</span>
                        </div>
                        <p className="text-gray-300 text-sm">Trusted by <span className="font-bold text-[#FFD700]">127,439+</span> creators making $1M+</p>
                    </div>
                </div>
            </motion.div>

            {/* Video Demo */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="mt-12 w-full max-w-6xl"
            >
                <div className="relative">
                    <video
                        src="/edituranimate.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full rounded-3xl shadow-2xl border-4 border-[#8B5CF6]/30"
                    ></video>
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-[#8B5CF6]/80 hover:bg-[#8B5CF6] transition-colors duration-300 rounded-full p-6 cursor-pointer pointer-events-auto">
                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 5v10l8-5-8-5z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <p className="text-center text-gray-400 mt-4 text-sm">👆 Watch how creators are making $10K+/month with our AI</p>
            </motion.div>

            {/* Scarcity Elements */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="mt-12 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-xl p-6 max-w-2xl w-full text-center"
            >
                <div className="flex items-center justify-center space-x-2 mb-3">
                    <span className="animate-pulse text-red-400 text-2xl">⚠️</span>
                    <h3 className="text-xl font-bold text-red-400">ALMOST SOLD OUT</h3>
                    <span className="animate-pulse text-red-400 text-2xl">⚠️</span>
                </div>
                <p className="text-gray-200 mb-4">
                    Only <span className="text-[#FFD700] font-bold text-lg">47 spots left</span> at this special price.
                    <br />Over 1,200 creators joined in the last 24 hours!
                </p>
                <Link href="/dashboard">
                    <button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-4 px-8 rounded-full transform transition-all duration-300 hover:scale-105">
                        🔥 CLAIM YOUR SPOT NOW
                    </button>
                </Link>
            </motion.div>
        </section>
    );
};

export default Hero;

"use client";

import React, { useState } from 'react';
// 1. Added 'Variants' to the import list
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { MessageSquare, Zap, Edit, Heart, ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';

// Define the shape of our User object
type UserProps = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null;

export default function LandingUI({ user }: { user: UserProps }) {
  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 z-0 cyber-mesh-background" />
      <div className="relative z-10">
        <FloatingNavbar user={user} />
        <main className="px-4 md:px-8">
          <HeroSection user={user} />
          <FeaturesGrid />
        </main>
        <Footer />
      </div>
    </div>
  );
}

// ---------------------------------
// 1. Permanently Visible Navbar
// ---------------------------------
const FloatingNavbar = ({ user }: { user: UserProps }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = ["Features", "Pricing", "About", "Contact"];
  
  return (
    <motion.nav
      initial={{ y: -150, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[95vw] md:w-full max-w-5xl bg-black/60 backdrop-blur-xl border border-white/20 rounded-full shadow-lg z-50"
    >
      <div className="flex items-center justify-between px-8 py-3">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-3">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}>
            <Zap className="text-indigo-400" size={24} />
          </motion.div>
          <span className="text-xl font-bold text-white tracking-tight">Social-Sync</span>
        </div>
        
        {/* Right Section: Navigation and CTA */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
          
          {/* DYNAMIC AUTH SECTION */}
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-white/20">
              <Link href={`/user/${user.id}`}>
                {user.image ? (
                  <img 
                    src={user.image} 
                    alt={user.name || "Profile"} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/50 hover:scale-105 hover:border-indigo-400 transition-all shadow-lg shadow-indigo-500/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white border-2 border-indigo-500/50 hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20">
                    {user.name?.charAt(0) || "U"}
                  </div>
                )}
              </Link>
              <Link href="/feed">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(99, 102, 241, 1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-500/20 border border-indigo-500/50 text-white text-sm font-bold py-2 px-5 rounded-full hover:bg-indigo-500 transition-all duration-300"
                >
                  Feed &rarr;
                </motion.button>
              </Link>
            </div>
          ) : (
            <Link href="/auth/signin">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/5 border border-white/20 text-white text-sm font-bold py-2 px-6 rounded-full transition-all duration-300"
              >
                Sign In
              </motion.button>
            </Link>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-4 pb-4 flex flex-col gap-4 overflow-hidden"
          >
            {navItems.map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 block text-center">{item}</a>
            ))}
            
            <div className="h-px w-full bg-white/10 my-2"></div>
            
            <Link href={user ? "/feed" : "/auth/signin"} className="w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-indigo-500/20 border border-indigo-500/50 text-white text-sm font-semibold py-2 px-4 rounded-full transition-all duration-300"
              >
                {user ? "Go to Feed" : "Sign In"}
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// ---------------------------------
// 2. Hero Section
// ---------------------------------
const HeroSection = ({ user }: { user: UserProps }) => {
  // 2. Added : Variants here
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };
  
  // 3. Added : Variants here
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };
  
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center text-center lg:text-left pt-20 pb-16"
    >
      <div className="max-w-3xl lg:max-w-md xl:max-w-xl flex-shrink-0">
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4">
          Connect in the <span className="text-indigo-400">Future</span>. Today.
        </motion.h1>
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 font-semibold">Social-Sync</span> is the next-generation platform for seamless, real-time social interaction across the digital universe.
        </motion.p>
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          
          <Link href={user ? "/feed" : "/auth/signin"}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px 10px rgba(99, 102, 241, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-500 text-white font-bold py-3 px-8 rounded-full shadow-lg glowing-cta-button transition-all duration-300"
            >
              {user ? "Enter Feed" : "Join Alpha"} <ChevronRight className="inline -mr-1" />
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300"
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>
      <motion.div variants={itemVariants} className="w-full lg:w-1/2 mt-12 lg:mt-0 flex items-center justify-center">
        <FuturisticSVG />
      </motion.div>
    </motion.section>
  );
};


// Features Grid
const FeaturesGrid = () => {
  const features = [
    {
      icon: <MessageSquare size={32} className="text-indigo-400" />,
      title: "Real-time Feed",
      description: "Experience a dynamic, instantly-updating feed that keeps you connected with zero latency.",
    },
    {
      icon: <Heart size={32} className="text-rose-400" />,
      title: "Emoji Reactions",
      description: "Engage with content using a wide array of futuristic, animated emoji reactions. ❤️✨🚀",
    },
    {
      icon: <Edit size={32} className="text-teal-400" />,
      title: "Full CRUD",
      description: "Enjoy complete control over your content with robust create, read, update, and delete capabilities.",
    },
  ];
  
  // 4. Added : Variants here
  const containerVariants: Variants = { 
    hidden: {}, 
    visible: { transition: { staggerChildren: 0.3 } } 
  };
  
  // 5. Added : Variants here
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };
  
  return (
    <section className="py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Core Features</h2>
        <p className="text-lg text-gray-400 mt-2">Everything you need to redefine your social world.</p>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ scale: 1.05, y: -10, boxShadow: "0 0 40px rgba(129, 140, 248, 0.4)", borderColor: "rgba(167, 139, 250, 0.6)" }}
            className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center flex flex-col items-center cursor-pointer"
            style={{ perspective: '1000px' }}
          >
            <motion.div className="mb-6 bg-indigo-500/10 p-4 rounded-full glowing-border" style={{ transformStyle: 'preserve-3d' }}>
              {feature.icon}
            </motion.div>
            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

// Inline SVG Graphic
const FuturisticSVG = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
      className="w-full max-w-lg h-auto"
    >
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(129, 140, 248, 1)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(167, 139, 250, 1)', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.g filter="url(#glow)" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
          <motion.path
            d="M 200, 50 C 282.8, 50, 350, 117.2, 350, 200 C 350, 282.8, 282.8, 350, 200, 350 C 117.2, 350, 50, 282.8, 50, 200 C 50, 117.2, 117.2, 50, 200, 50 Z"
            fill="none" stroke="url(#grad1)" strokeWidth="3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.path
            d="M 100, 100 L 300, 300 M 100, 300 L 300, 100"
            fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
          />
          <motion.circle cx="200" cy="200" r="120" stroke="rgba(167, 139, 250, 0.3)" strokeWidth="1" fill="none"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1.5, delay: 0.8, type: 'spring' }}
          />
          <motion.circle cx="200" cy="200" r="80" stroke="rgba(129, 140, 248, 0.5)" strokeWidth="1.5" fill="none"
            initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: -90 }} transition={{ duration: 1.5, delay: 1, type: 'spring' }}
          />
        </motion.g>
      </svg>
    </motion.div>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="text-center py-8 border-t border-white/10 mt-16">
      <p className="text-gray-500">&copy; {new Date().getFullYear()} Social-Sync. All rights reserved.</p>
    </footer>
  );
}
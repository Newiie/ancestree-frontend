"use client"

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from 'framer-motion';
import { useRef } from "react";

export default function Home() {
  // Define individual refs for each section
  const searchRef = useRef(null);
  const recordsRef = useRef(null);
  const familyTreeRef = useRef(null);
  const signupRef = useRef(null);
  const welcomeRef = useRef(null);

  // Track if each section is in view
  const isSearchInView = useInView(searchRef, { once: true,  });
  const isRecordsInView = useInView(recordsRef, { once: true });
  const isFamilyTreeInView = useInView(familyTreeRef, { once: true });
  const isSignupInView = useInView(signupRef, { once: true });
  const isWelcomeInView = useInView(welcomeRef, { once: true });

  return (
    <div className="landing-page | relative snap-y snap-mandatory h-screen overflow-y-scroll">
        
      <div className="snap-start bg-[#CBDCBF] h-[101vh]">
        <div className="relative rounded-[3px]">
          <video className="absolute top-0 left-0 h-screen w-full object-cover" autoPlay loop muted>
            <source src="/videos/backgroundHome.mp4" type="video/mp4" />
          </video>

          <motion.div 
            ref={welcomeRef}
            initial={{ opacity: 0, y: 50 }}
            animate={isWelcomeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="relative z-10 flex flex-col items-center gap-[1rem] justify-center h-screen text-white px-4 text-center"
          >
            <h1 className="text-[2rem] md:text-[3rem] lg:text-[4rem] font-semibold">Welcome to AncesTREE</h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isWelcomeInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-sm md:text-lg lg:text-xl max-w-[600px] text-center"
            >
              Unraveling Ancestral Lineages through Geographical History
            </motion.p>
            <motion.div
            initial={{ opacity: 0 }}
            animate={isWelcomeInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            >
              <Link href="/register" className="py-[0.5rem] px-[1rem] text-[0.8rem] md:text-[0.9rem] rounded-[3px] bg-primary hover:text-primary hover:bg-hover transition-colors duration-200">
                GET STARTED
              </Link>
            </motion.div>
          </motion.div>

          <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        </div>
      </div>

      {/* Search Family Section */}
      <div className="relative snap-start h-[101vh] overflow-x-hidden" ref={searchRef}>
        <video className="h-full w-full object-cover object-left-top md:object-center" autoPlay loop muted>
          <source src="/videos/1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-10 flex justify-center md:justify-end">
          <motion.div
            
            initial={{ opacity: 0, y: 0, x: 400 }}
            animate={isSearchInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 0, x: 400 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="w-full md:w-1/2 flex flex-col items-center justify-center text-center md:text-right px-4 md:ml-auto"
          >
            <h1 className="text-[2rem] md:text-[3rem] lg:text-[5rem] text-black font-semibold bg-white/50 md:bg-white/0 w-full">Search Family</h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isSearchInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5, duration: 3 }}
              className="text-sm md:text-xl lg:text-2xl text-black max-w-[600px] bg-white/50 md:bg-white/0 w-full"
            >
              Discover your roots and explore your family history through our comprehensive search tools.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* View Records Section */}
      <div className="relative snap-start h-[101vh] overflow-x-hidden" ref={recordsRef}>
        <video className="h-full w-full object-cover" autoPlay loop muted>
          <source src="/videos/2.mp4" type="video/mp4" />
        </video>
        <motion.div
          
          initial={{ opacity: 0, x: -400 }}
          animate={isRecordsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -400 }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute inset-0 z-10 w-full md:w-1/2 flex flex-col items-center justify-center text-center md:text-left px-4 md:pl-8"
        >
          <h1 className="text-[2rem] md:text-[3rem] lg:text-[5rem] text-black font-semibold bg-white/50 md:bg-white/0 w-full">View Records</h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isRecordsInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5, duration: 3 }}
            className="text-sm md:text-xl lg:text-2xl text-black max-w-[600px] bg-white/50 md:bg-white/0 w-full"
          >
            Find valuable documents that can guide you in tracing your family history and exploring your ancestral roots.
          </motion.p>
        </motion.div>
      </div>

      {/* Create Family Tree Section */}
      <div className="relative snap-start h-[102vh] overflow-x-hidden" ref={familyTreeRef}>
        <video className="h-full w-full object-cover object-left-top md:object-center" autoPlay loop muted>
          <source src="/videos/3.mp4" type="video/mp4" />
        </video>
        <motion.div
          
          initial={{ opacity: 0, x: 400 }}
          animate={isFamilyTreeInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 400 }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute inset-0 b z-10 w-full md:w-1/2 flex flex-col items-center justify-center text-center md:text-right px-4 md:ml-auto"
        >
          <h1 className="text-[2rem] bg-white/50 md:bg-white/0 w-full md:text-[3rem] lg:text-[5rem] text-black font-semibold">Create Family Tree</h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isFamilyTreeInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5, duration: 3 }}
            className="text-sm md:text-xl lg:text-2xl text-black max-w-[600px] bg-white/50 md:bg-white/0 w-full"
          >
            Explore your family tree and discover your ancestors.
          </motion.p>
        </motion.div>
      </div>

      {/* Signup Section */}
      <div className="relative snap-start h-[101vh]" ref={signupRef}>
        <video className="h-full w-full object-cover" autoPlay loop muted>
          <source src="/videos/4.mp4" type="video/mp4" />
        </video>
        <motion.div
          
          initial={{ opacity: 0, y: -200 }}
          animate={isSignupInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -300 }}
          transition={{delay: 0.9, duration: 3, ease: "easeInOut" }}
          className="absolute inset-0 z-10 w-full flex flex-col items-center justify-center text-center px-4"
        >
          <h1 className="text-[2rem] md:text-[3rem] lg:text-[5rem] leading-tight text-black font-semibold">
            Sign up for a FREE <span className="text-primary">ANCESTREE</span> account
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isSignupInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 3 }}
            className="text-sm md:text-xl lg:text-2xl pb-[1rem] text-black max-w-[600px]"
          >
            Join us and begin your ancestral journey today!
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing Neural Skin Scan...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 0.8; // Approx 4-5 seconds to reach 95%
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 30) {
      setStatusText("Initializing Neural Skin Scan...");
    } else if (progress < 60) {
      setStatusText("Detecting Dermatological Markers...");
    } else {
      setStatusText("Synthesizing Personalized Routine...");
    }
  }, [progress]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] w-full overflow-hidden bg-black/5 rounded-3xl p-8">
      {/* Background Pulse Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-purple-50/50 z-0"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Scanning Line Effect */}
      <motion.div
        className="absolute w-full h-1 bg-gradient-to-r from-transparent via-pink-400/50 to-transparent z-10 blur-sm"
        animate={{
          top: ["0%", "100%", "0%"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Central Scanning Element */}
      <div className="relative z-20 mb-12">
        {/* Outer Ring */}
        <motion.div
          className="w-32 h-32 rounded-full border-2 border-pink-200 border-t-pink-500 border-r-pink-500"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear", // Smooth continuous spin
          }}
        />
        
        {/* Inner Static Circle */}
        <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center">
           {/* Custom Sparkle/Leaf SVG */}
           <motion.svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
           >
             <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="#EC4899" fillOpacity="0.8"/>
           </motion.svg>
        </div>
      </div>

      {/* Text & Progress */}
      <div className="relative z-20 w-full max-w-xs space-y-4">
        <motion.p 
          className="text-center text-sm font-medium text-gray-600 tracking-wide uppercase"
          key={statusText}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {statusText}
        </motion.p>
        
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-pink-400 to-purple-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 font-mono">
          <span>Processing Data</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

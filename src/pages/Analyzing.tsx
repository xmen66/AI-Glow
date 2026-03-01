import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { analyzeSkin } from '../services/gemini';
import { RefreshCw, AlertTriangle } from 'lucide-react';

const Analyzing = () => {
  const navigate = useNavigate();
  const { capturedImage, setAnalysisResult } = useApp();
  
  // 1. State Machine: idle | scanning | error | success
  const [status, setStatus] = useState<'idle' | 'scanning' | 'error' | 'success'>('scanning');
  const [statusText, setStatusText] = useState("Initializing Neural Skin Scan...");
  const [progress, setProgress] = useState(0);

  // 2. Progress Animation Logic
  useEffect(() => {
    if (status !== 'scanning') return;

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
  }, [status]);

  // 3. Dynamic Text Updates based on Progress
  useEffect(() => {
    if (status !== 'scanning') return;

    if (progress < 30) {
      setStatusText("Scanning Texture...");
    } else if (progress < 60) {
      setStatusText("Mapping Pores...");
    } else {
      setStatusText("Generating Routine...");
    }
  }, [progress, status]);

  // 4. Analysis Logic
  const startAnalysis = async () => {
    setStatus('scanning');
    setProgress(0);

    // If no image, redirect back to camera
    if (!capturedImage) {
      navigate('/camera-scan');
      return;
    }

    try {
      // Minimum wait time to show the full animation (3.5s)
      const minWait = new Promise(resolve => setTimeout(resolve, 3500));
      
      // Actual Analysis
      const analysisPromise = analyzeSkin(capturedImage);

      // Wait for both
      const [result] = await Promise.all([analysisPromise, minWait]);
      
      // Check for error object from service
      if (!result || 'error' in result) {
        setStatus('error');
        return;
      }

      // Success
      setAnalysisResult(result);
      setStatus('success');
      navigate('/results');

    } catch (err) {
      // Global catch - safeguard against unexpected errors
      setStatus('error');
    }
  };

  useEffect(() => {
    startAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return (
    <AnimatePresence mode="wait">
      {status === 'error' ? (
        <motion.div 
          key="error-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center max-w-md mx-auto w-full"
          role="alert"
          aria-live="assertive"
        >
          <div className="bg-amber-50 p-6 rounded-full mb-6 animate-pulse">
              <AlertTriangle className="w-12 h-12 text-amber-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
            Analysis Interrupted
          </h2>
          
          <p className="text-gray-500 mb-8 leading-relaxed text-sm max-w-xs mx-auto">
            We encountered a temporary connection issue while processing your scan. Please try again.
          </p>

          <button
            onClick={startAnalysis}
            className="w-full bg-gray-900 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3 group"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Retry Scan
          </button>
        </motion.div>
      ) : (
        <motion.div 
          key="scanning-state"
          className="flex flex-col items-center justify-center min-h-[80vh] w-full px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          role="status"
          aria-live="polite"
        >
          <div className="relative flex flex-col items-center justify-center min-h-[60vh] w-full overflow-hidden bg-black/5 rounded-3xl p-8">
            {/* Background Pulse Effect */}
            <motion.div
              key="bg-pulse"
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
              key="scan-line"
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
                key="spin-ring"
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
                  key="logo-pulse"
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
                  key="progress-bar"
                  layoutId="progress-bar" 
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-400 font-mono">
                <span>Processing Data</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Analyzing;

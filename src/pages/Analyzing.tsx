import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { analyzeSkin } from '../services/gemini';
import { Loader } from '../components/Loader';
import { AlertCircle } from 'lucide-react';

const Analyzing = () => {
  const navigate = useNavigate();
  const { capturedImage, setAnalysisResult } = useApp();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const process = async () => {
      // If no image, redirect back to camera
      if (!capturedImage) {
        navigate('/camera-scan');
        return;
      }

      try {
        // Minimum wait time to show the cool animation (e.g., 3 seconds)
        const minWait = new Promise(resolve => setTimeout(resolve, 3500));
        
        // Actual Analysis
        const analysisPromise = analyzeSkin(capturedImage);

        // Wait for both
        const [result] = await Promise.all([analysisPromise, minWait]);
        
        if (mounted) {
            setAnalysisResult(result);
            navigate('/results');
        }
      } catch (err: any) {
        if (mounted) {
            console.error(err);
            setError(err.message || "Analysis failed. Please try again.");
        }
      }
    };

    process();

    return () => {
        mounted = false;
    };
  }, [capturedImage, navigate, setAnalysisResult]);

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-full p-6 text-center max-w-md mx-auto"
      >
        <div className="bg-red-50 p-6 rounded-full mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Failed</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
        <button
          onClick={() => navigate('/camera-scan')}
          className="w-full bg-gray-900 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[80vh] w-full px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Loader />
    </motion.div>
  );
};

export default Analyzing;

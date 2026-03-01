import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-pink-50 to-white px-6 py-12">
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-8 shadow-lg"
        >
          <Sparkles className="text-pink-500 w-12 h-12" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Hi, I'm your AI Skincare Assistant
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-lg max-w-xs"
        >
          I'm here to help you understand your skin and get better skincare results.
        </motion.p>
      </div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={() => navigate('/permissions')}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        Get Started
        <ArrowRight size={20} />
      </motion.button>
    </div>
  );
};

export default Welcome;

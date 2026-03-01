import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lightbulb, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScanInstructions = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const instructions = [
    {
      icon: <Lightbulb className="w-12 h-12 text-yellow-500" />,
      title: "Good Lighting",
      description: "Find an area with good, natural lighting. Avoid shadows on your face."
    },
    {
      icon: <User className="w-12 h-12 text-blue-500" />,
      title: "Face Straight",
      description: "Keep your head straight and look directly into the camera."
    },
    {
      icon: <Sparkles className="w-12 h-12 text-pink-500" />,
      title: "Remove Makeup",
      description: "For the best results, remove makeup and accessories like glasses."
    }
  ];

  const handleNext = () => {
    if (step < instructions.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/camera-scan');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-6">
      <div className="flex-1 flex flex-col justify-center items-center">
        <AnimatePresence mode='wait'>
          <motion.div
            key={step}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center max-w-xs"
            role="tabpanel"
            aria-labelledby={`step-${step}-title`}
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
              {instructions[step].icon}
            </div>
            
            <h2 id={`step-${step}-title`} className="text-2xl font-bold mb-4">{instructions[step].title}</h2>
            <p className="text-gray-600 mb-8 text-lg">
              {instructions[step].description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2 mt-8" role="tablist">
          {instructions.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-pink-500' : 'w-2 bg-pink-200'}`}
              role="tab"
              aria-selected={i === step}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        {step === instructions.length - 1 ? "Start Scan" : "Next Step"}
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default ScanInstructions;

import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { RoutineStep } from '../types';

const Routine = () => {
  const navigate = useNavigate();
  const { analysisResult } = useApp();

  if (!analysisResult) {
    navigate('/');
    return null;
  }

  const { routine } = analysisResult;

  return (
    <div className="flex flex-col h-full bg-pink-50 overflow-y-auto pb-20">
      <div className="bg-white p-6 rounded-b-3xl shadow-sm mb-6 sticky top-0 z-10">
        <h1 className="text-2xl font-bold mb-2">Your Routine</h1>
        <p className="text-gray-500">
          Personalized step-by-step guide for your skin.
        </p>
      </div>

      <div className="px-6 space-y-6">
        {routine.map((step: RoutineStep, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="flex gap-4 relative"
          >
            {/* Timeline Line */}
            {index !== routine.length - 1 && (
              <div className="absolute left-6 top-14 bottom-[-24px] w-0.5 bg-pink-200" />
            )}
            
            <div className="flex-shrink-0 relative z-10">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold border-4 border-white shadow-sm">
                {index + 1}
              </div>
            </div>

            <div className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-pink-100">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold tracking-wider text-pink-500 uppercase">
                  {step.step}
                </span>
                <Clock size={14} className="text-gray-400" />
              </div>
              
              <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                {step.description}
              </p>
              
              <div className="bg-pink-50 p-3 rounded-xl">
                <span className="text-xs font-semibold text-pink-800 block mb-1">
                  Key Ingredients:
                </span>
                <p className="text-xs text-pink-700">
                  {step.ingredients}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="px-6 mt-8 mb-8">
        <button
          onClick={() => navigate('/chat')}
          className="w-full bg-white border-2 border-pink-500 text-pink-600 font-semibold py-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all hover:bg-pink-50 active:scale-95"
        >
          Ask about products
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Routine;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight, CheckCircle, Droplets, Sun, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Concern, Strength } from '../types';

const Results = () => {
  const navigate = useNavigate();
  const { analysisResult } = useApp();
  const [activeTab, setActiveTab] = useState('concerns');

  if (!analysisResult) {
    // This should be handled by a useEffect, but returning null prevents rendering.
    // However, calling navigate during render is bad practice.
    // We will rely on the useEffect below.
  }

  useEffect(() => {
    if (!analysisResult) {
      navigate('/', { replace: true });
    }
  }, [analysisResult, navigate]);

  if (!analysisResult) return null;

  const { skinType, sensitivity, concerns, strengths, mainGoal } = analysisResult;

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-pink-50 overflow-y-auto pb-20">
      {/* Header Summary */}
      <div className="bg-white p-6 rounded-b-3xl shadow-sm mb-6">
        <h1 className="text-2xl font-bold mb-2">Skin Analysis</h1>
        <p className="text-gray-500 mb-6">Based on your AI scan</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-pink-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <Droplets className="text-blue-500 mb-2" />
            <span className="text-sm text-gray-500">Skin Type</span>
            <span className="font-semibold text-gray-900">{skinType}</span>
          </div>
          <div className="bg-pink-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <Activity className="text-pink-500 mb-2" />
            <span className="text-sm text-gray-500">Sensitivity</span>
            <span className="font-semibold text-gray-900">{sensitivity}</span>
          </div>
        </div>
      </div>

      <div className="px-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Your Skin Profile</h2>
        
        {/* Toggle */}
        <div className="flex bg-white p-1 rounded-xl mb-4 shadow-sm">
          <button 
            onClick={() => setActiveTab('concerns')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'concerns' ? 'bg-pink-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Concerns
          </button>
          <button 
            onClick={() => setActiveTab('strengths')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'strengths' ? 'bg-pink-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Strengths
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === 'concerns' ? (
            concerns.map((concern: Concern, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-5 rounded-2xl shadow-sm border border-pink-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{concern.area}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(concern.severity)}`}>
                    {concern.severity} Priority
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{concern.issue}</p>
              </motion.div>
            ))
          ) : (
            strengths.map((strength: Strength, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-5 rounded-2xl shadow-sm border border-green-100 flex items-start gap-4"
              >
                <div className="bg-green-100 p-2 rounded-full mt-1">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{strength.title}</h3>
                  <p className="text-gray-600 text-sm">{strength.description}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      
      <div className="px-6 pb-8 mt-auto">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100 mb-6">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Sun className="text-blue-500" size={18} />
                Recommended Goal
            </h3>
            <p className="text-gray-600 text-sm mb-3">
                Based on your analysis, we recommend focusing on:
            </p>
            <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-xl font-medium text-center">
                {mainGoal}
            </div>
        </div>

        <button
          onClick={() => navigate('/routine')}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          Generate Routine
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Results;

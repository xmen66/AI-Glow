import { useState, useEffect, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import Permissions from './pages/Permissions';
import ScanInstructions from './pages/ScanInstructions';
import CameraScan from './pages/CameraScan';
import Analyzing from './pages/Analyzing';
import Results from './pages/Results';
import Routine from './pages/Routine';
import Chat from './pages/Chat';
import { cn } from './lib/utils';

// Step mapping to numeric values for progress tracking
const STEPS: Record<string, number> = {
  '/': 1,
  '/permissions': 2,
  '/scan-instructions': 3,
  '/camera-scan': 4,
  '/analyzing': 5,
  '/results': 6,
  '/routine': 7,
  '/chat': 8,
};

const StepContainer = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  useEffect(() => {
    const nextStep = STEPS[location.pathname] || 1;
    if (nextStep > currentStep) {
      setDirection('forward');
    } else if (nextStep < currentStep) {
      setDirection('backward');
    }
    setCurrentStep(nextStep);
    // Optional: Log step for debugging
    // console.log(`Step: ${nextStep} (${location.pathname})`);
  }, [location.pathname]);

  return (
    <div 
      className={cn(
        "step-container w-full h-full transition-all duration-300", 
        `step-${currentStep}`
      )}
      data-step={currentStep}
      data-direction={direction}
    >
      {children}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <StepContainer>
          <Layout>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/permissions" element={<Permissions />} />
              <Route path="/scan-instructions" element={<ScanInstructions />} />
              <Route path="/camera-scan" element={<CameraScan />} />
              <Route path="/analyzing" element={<Analyzing />} />
              <Route path="/results" element={<Results />} />
              <Route path="/routine" element={<Routine />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </StepContainer>
      </Router>
    </AppProvider>
  );
}

export default App;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Camera, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const Permissions = () => {
  const navigate = useNavigate();
  const { setHasCameraPermission, setHasNotificationPermission } = useApp();
  const [step, setStep] = useState(0);

  const handleNotification = (allow: boolean) => {
    setHasNotificationPermission(allow);
    setStep(1);
  };

  const handleCamera = (allow: boolean) => {
    setHasCameraPermission(allow);
    if (allow) {
      setStep(2);
    } else {
      // Must allow camera for app to work
      alert("Camera access is required to scan your skin.");
    }
  };

  const handlePrivacy = (allow: boolean) => {
    if (allow) {
      navigate('/scan-instructions');
    } else {
        alert("Privacy consent is required to process your photos.");
    }
  };

  const variants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
  };

  return (
    <div className="flex flex-col h-full bg-white p-6 overflow-hidden">
      <div className="flex-1 flex flex-col justify-center items-center">
        <AnimatePresence mode='wait'>
          {step === 0 && (
            <motion.div
              key="notifications"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col items-center text-center w-full"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Bell className="text-blue-500 w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Stay Consistent</h2>
              <p className="text-gray-600 mb-8">
                Allow notifications so you don't forget your skincare rituals.
              </p>
              <div className="w-full space-y-3">
                <button
                  onClick={() => handleNotification(true)}
                  className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
                >
                  Allow Notifications
                </button>
                <button
                  onClick={() => handleNotification(false)}
                  className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                  Not Now
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="camera"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col items-center text-center w-full"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Camera className="text-green-500 w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Camera Access</h2>
              <p className="text-gray-600 mb-8">
                Allow access to camera and photo gallery to scan your skin.
              </p>
              <div className="w-full space-y-3">
                <button
                  onClick={() => handleCamera(true)}
                  className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition"
                >
                  Allow Camera Access
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="privacy"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col items-center text-center w-full"
            >
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Lock className="text-purple-500 w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Privacy First</h2>
              <p className="text-gray-600 mb-8">
                Your photos are processed privately and securely. We prioritize your data privacy.
              </p>
              <div className="w-full space-y-3">
                <button
                  onClick={() => handlePrivacy(true)}
                  className="w-full bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition"
                >
                  Agree & Continue
                </button>
                <button
                  onClick={() => handlePrivacy(false)}
                  className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                  Decline
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Permissions;

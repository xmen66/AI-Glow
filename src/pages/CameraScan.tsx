import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, X, CameraOff, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CameraScan = () => {
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();
  const { setCapturedImage } = useApp();
  const [hasCameraError, setHasCameraError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      navigate('/analyzing');
    }
  }, [webcamRef, setCapturedImage, navigate]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCapturedImage(base64String);
        navigate('/analyzing');
      };
      reader.readAsDataURL(file);
    }
  };

  const videoConstraints = {
    width: 720,
    height: 1280,
    facingMode: "user"
  };

  return (
    <div className="relative h-full bg-black overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-4 z-30 flex justify-between items-center text-white">
        <button onClick={() => navigate(-1)} className="p-2 bg-black/20 rounded-full backdrop-blur-md hover:bg-black/40 transition">
          <X size={24} />
        </button>
        <div className="bg-black/40 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-md">
          {hasCameraError ? "Camera Unavailable" : "Good Lighting"}
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-gray-900">
        {!hasCameraError ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="absolute min-w-full min-h-full object-cover"
              onUserMediaError={() => setHasCameraError(true)}
            />
            
            {/* Face Oval Overlay */}
            <div className="relative z-10 w-64 h-80 border-2 border-white/50 rounded-[50%] shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] pointer-events-none">
              <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-[50%] animate-pulse"></div>
            </div>
            
            <div className="absolute bottom-32 z-20 text-white text-center w-full px-6 pointer-events-none">
              <p className="text-lg font-medium drop-shadow-md">
                Align your face within the frame
              </p>
            </div>
          </>
        ) : (
          <div 
            className="flex flex-col items-center justify-center p-6 text-center text-white z-20"
            role="alertdialog"
            aria-labelledby="camera-error-title"
            aria-describedby="camera-error-desc"
            aria-modal="true"
          >
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <CameraOff size={40} className="text-gray-400" />
            </div>
            <h2 id="camera-error-title" className="text-xl font-bold mb-2">Camera Access Denied</h2>
            <p id="camera-error-desc" className="text-gray-400 mb-8 max-w-xs">
              We couldn't access your camera. Please check your permissions or upload a photo instead.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-xl flex items-center gap-2 transition-all active:scale-95"
            >
              <Upload size={20} />
              Upload Photo
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      {!hasCameraError && (
        <div className="h-28 bg-black z-30 flex items-center justify-center gap-8 pb-4">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition"
            title="Upload Photo"
          >
            <Upload size={24} />
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload}
            />
          </button>
          
          <button 
            onClick={capture}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent relative group"
          >
            <div className="w-16 h-16 rounded-full bg-white group-active:scale-90 transition-transform"></div>
          </button>
          
          <button 
            onClick={() => setHasCameraError(false)} // Try to retry camera
            className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition"
            title="Retry Camera"
          >
            <RefreshCw size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraScan;

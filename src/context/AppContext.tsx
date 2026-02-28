import { createContext, useContext, useState, ReactNode } from 'react';
import { SkinAnalysisResult } from '../types';

interface AppContextType {
  hasCameraPermission: boolean;
  setHasCameraPermission: (value: boolean) => void;
  hasNotificationPermission: boolean;
  setHasNotificationPermission: (value: boolean) => void;
  capturedImage: string | null;
  setCapturedImage: (image: string | null) => void;
  analysisResult: SkinAnalysisResult | null;
  setAnalysisResult: (result: SkinAnalysisResult | null) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResult | null>(null);
  const [userName, setUserName] = useState("User");

  return (
    <AppContext.Provider
      value={{
        hasCameraPermission,
        setHasCameraPermission,
        hasNotificationPermission,
        setHasNotificationPermission,
        capturedImage,
        setCapturedImage,
        analysisResult,
        setAnalysisResult,
        userName,
        setUserName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

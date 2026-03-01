import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const showHeader = location.pathname !== '/' && location.pathname !== '/permissions' && location.pathname !== '/camera-scan';
  const showBack = location.pathname !== '/' && location.pathname !== '/results' && location.pathname !== '/permissions' && location.pathname !== '/camera-scan';

  return (
    <div className="min-h-screen bg-pink-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
        {showHeader && (
          <header className="h-16 flex items-center justify-between px-4 border-b border-pink-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            {showBack ? (
              <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-pink-50 text-pink-900 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
            ) : (
              <div className="w-10" /> 
            )}
            
            <h1 className="text-lg font-semibold text-pink-900 flex items-center gap-2">
              <Sparkles className="text-pink-500" size={18} />
              GlowAI
            </h1>

            <button 
              onClick={() => navigate('/chat')}
              className="p-2 rounded-full hover:bg-pink-50 text-pink-900 transition-colors"
            >
              <User size={24} />
            </button>
          </header>
        )}
        
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

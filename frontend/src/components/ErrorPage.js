import React, { useState } from 'react';

const ErrorPage = ({ 
  errorCode = '500', 
  errorMessage = 'Something went wrong'
}) => {
  const getErrorColor = (code) => {
    const numCode = parseInt(code);
    if (numCode === 404) return { primary: '#8b5cf6', secondary: '#a855f7', glow: '139, 92, 246' }; // Purple
    if (numCode >= 500) return { primary: '#ef4444', secondary: '#f87171', glow: '239, 68, 68' }; // Red
    if (numCode >= 400) return { primary: '#f59e0b', secondary: '#fbbf24', glow: '245, 158, 11' }; // Orange
    return { primary: '#ef4444', secondary: '#f87171', glow: '239, 68, 68' }; // Default red
  };

  const colors = getErrorColor(errorCode);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
      </div>

      {/* Glowing orb background */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse-slow"
        style={{ 
          background: `radial-gradient(circle, rgba(${colors.glow}, 0.3) 0%, rgba(${colors.glow}, 0.1) 50%, transparent 100%)`
        }}
      ></div>

      <div className="text-center max-w-md w-full relative z-10">
        {/* Main error display */}
        <div className="relative mb-8">
          {/* Glowing ring */}
          <div 
            className="absolute inset-0 w-48 h-48 mx-auto rounded-full opacity-20 animate-ping-slow"
            style={{ 
              boxShadow: `0 0 60px rgba(${colors.glow}, 0.4), inset 0 0 60px rgba(${colors.glow}, 0.1)`,
              border: `2px solid rgba(${colors.glow}, 0.3)`
            }}
          ></div>
          
          {/* Error code with glow */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            <div 
              className="text-8xl font-bold tracking-wider animate-float"
              style={{ 
                color: colors.primary,
                textShadow: `0 0 30px rgba(${colors.glow}, 0.5), 0 0 60px rgba(${colors.glow}, 0.3), 0 0 90px rgba(${colors.glow}, 0.1)`,
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.1))'
              }}
            >
              {errorCode}
            </div>
          </div>
        </div>

        {/* Error message with subtle glow */}
        <h1 
          className="text-2xl font-light text-gray-200 mb-12 leading-relaxed animate-fade-in-up tracking-wide"
          style={{ 
            textShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
          }}
        >
          {errorMessage}
        </h1>

        {/* Animated dots */}
        <div className="flex justify-center space-x-3">
          <div 
            className="w-2 h-2 rounded-full animate-bounce-1"
            style={{ backgroundColor: colors.primary, boxShadow: `0 0 10px rgba(${colors.glow}, 0.5)` }}
          ></div>
          <div 
            className="w-2 h-2 rounded-full animate-bounce-2"
            style={{ backgroundColor: colors.secondary, boxShadow: `0 0 10px rgba(${colors.glow}, 0.5)` }}
          ></div>
          <div 
            className="w-2 h-2 rounded-full animate-bounce-3"
            style={{ backgroundColor: colors.primary, boxShadow: `0 0 10px rgba(${colors.glow}, 0.5)` }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fadeInUp {
          0% { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes pingSlow {
          0% { 
            transform: scale(1); 
            opacity: 0.3; 
          }
          50% { 
            transform: scale(1.05); 
            opacity: 0.1; 
          }
          100% { 
            transform: scale(1); 
            opacity: 0.3; 
          }
        }

        @keyframes pulseSlow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }

        @keyframes particleFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-20px) translateX(10px); 
            opacity: 0.5;
          }
          50% { 
            transform: translateY(-10px) translateX(-5px); 
            opacity: 0.4;
          }
          75% { 
            transform: translateY(-30px) translateX(15px); 
            opacity: 0.6;
          }
        }

        @keyframes bounce1 {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
          60% { transform: translateY(-4px); }
        }

        @keyframes bounce2 {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
          60% { transform: translateY(-4px); }
        }

        @keyframes bounce3 {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
          60% { transform: translateY(-4px); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out 0.5s both;
        }

        .animate-ping-slow {
          animation: pingSlow 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }

        .animate-bounce-1 {
          animation: bounce1 2s infinite;
          animation-delay: 0s;
        }

        .animate-bounce-2 {
          animation: bounce2 2s infinite;
          animation-delay: 0.2s;
        }

        .animate-bounce-3 {
          animation: bounce3 2s infinite;
          animation-delay: 0.4s;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: particleFloat 8s ease-in-out infinite;
        }

        .particle-1 { top: 20%; left: 10%; animation-delay: 0s; }
        .particle-2 { top: 60%; left: 80%; animation-delay: 1s; }
        .particle-3 { top: 30%; left: 70%; animation-delay: 2s; }
        .particle-4 { top: 80%; left: 20%; animation-delay: 3s; }
        .particle-5 { top: 15%; left: 60%; animation-delay: 4s; }
        .particle-6 { top: 70%; left: 40%; animation-delay: 5s; }
      `}</style>
    </div>
  );
};

// Demo component to showcase different error types
const ErrorDemo = () => {
  const [currentError, setCurrentError] = useState({
    code: '404',
    message: 'Page Not Found'
  });

  const errorExamples = [
    { code: '404', message: 'Page Not Found' },
    { code: '500', message: 'Server Error' },
    { code: '403', message: 'Access Denied' },
    { code: '401', message: 'Authentication Required' },
    { code: 'NETWORK', message: 'Connection Failed' }
  ];

  return (
    <div className="relative">
      {/* Error Type Selector */}
      <div className="fixed top-4 right-4 z-50 bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50">
        <h3 className="text-white text-sm font-medium mb-3">Try Different Errors:</h3>
        <div className="space-y-2">
          {errorExamples.map((error, index) => (
            <button
              key={index}
              onClick={() => setCurrentError(error)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-300 ${
                currentError.code === error.code 
                  ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-300 shadow-lg' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              {error.code} - {error.message}
            </button>
          ))}
        </div>
      </div>

      {/* Aesthetic Error Component */}
      <ErrorPage 
        errorCode={currentError.code}
        errorMessage={currentError.message}
      />
    </div>
  );
};

export default ErrorDemo;
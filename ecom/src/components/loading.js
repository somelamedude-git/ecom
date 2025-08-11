import React from "react";

const ConcentricSquaresLoader = () => {
  return (
    <div className="loader-container">
      <div className="loader-background">
        {/* Animated background grid */}
        <div className="grid-overlay"></div>

        {/* Diagonal moving lines */}
        <div className="diagonal-overlay"></div>

        {/* Floating particles */}
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`particle ${
                i % 3 === 0
                  ? "particle-yellow"
                  : i % 3 === 1
                  ? "particle-gray-light"
                  : "particle-gray-dark"
              }`}
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.4 + 0.2,
                animationDuration: `${3 + Math.random() * 6}s`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Pulsing corner squares */}
        <div className="corner-square corner-top-left"></div>
        <div className="corner-square corner-top-right"></div>
        <div className="corner-square corner-bottom-left"></div>
        <div className="corner-square corner-bottom-right"></div>

        {/* Radial gradient overlay */}
        <div className="radial-overlay"></div>

        {/* Concentric spinning squares */}
        <div className="squares-container">
          <div className="square square-1"></div>
          <div className="square square-2"></div>
          <div className="square square-3"></div>
          <div className="square square-4"></div>
          <div className="square square-5"></div>
          <div className="center-dot"></div>
        </div>

        {/* Loading text */}
        <div className="loading-text">Loading...</div>
      </div>

      <style jsx>{`
        .loader-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 50;
        }

        .loader-background {
          min-height: 100vh;
          background-color: #000000;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.25;
          background-image: 
            linear-gradient(rgba(55, 65, 81, 0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(55, 65, 81, 0.6) 1px, transparent 1px);
          background-size: 30px 30px;
          animation: gridMove 15s linear infinite;
        }

        .diagonal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.15;
          background-image: 
            linear-gradient(45deg, transparent 30%, rgba(251, 191, 36, 0.1) 50%, transparent 70%),
            linear-gradient(-45deg, transparent 30%, rgba(156, 163, 175, 0.1) 50%, transparent 70%);
          background-size: 200px 200px;
          animation: diagonalMove 25s linear infinite;
        }

        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          animation: float ease-in-out infinite;
        }

        .particle-yellow {
          background-color: #fbbf24;
        }

        .particle-gray-light {
          background-color: #9ca3af;
        }

        .particle-gray-dark {
          background-color: #6b7280;
        }

        .corner-square {
          position: absolute;
          border: 1px solid;
        }

        .corner-top-left {
          top: 2.5rem;
          left: 2.5rem;
          width: 1rem;
          height: 1rem;
          border-color: #4b5563;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          opacity: 0.3;
          transform: rotate(45deg);
        }

        .corner-top-right {
          top: 4rem;
          right: 3rem;
          width: 0.75rem;
          height: 0.75rem;
          border-color: #fbbf24;
          opacity: 0.4;
          animation: spin 8s linear infinite;
        }

        .corner-bottom-left {
          bottom: 5rem;
          left: 4rem;
          width: 1.25rem;
          height: 1.25rem;
          border-color: #6b7280;
          opacity: 0.25;
          animation: spin 12s linear infinite reverse;
        }

        .corner-bottom-right {
          bottom: 3rem;
          right: 2.5rem;
          width: 0.5rem;
          height: 0.5rem;
          background-color: #fbbf24;
          opacity: 0.3;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .radial-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at center,
            transparent 0%,
            rgba(0, 0, 0, 0.1) 50%,
            rgba(0, 0, 0, 0.3) 100%
          );
        }

        .squares-container {
          position: relative;
          width: 8rem;
          height: 8rem;
        }

        .square {
          position: absolute;
          border: 2px solid;
          border-radius: 0.125rem;
        }

        .square-1 {
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-color: #4b5563;
          animation: spin 5s linear infinite;
        }

        .square-2 {
          top: 0.5rem;
          left: 0.5rem;
          right: 0.5rem;
          bottom: 0.5rem;
          border-color: #6b7280;
          animation: spin 4.2s linear infinite reverse;
        }

        .square-3 {
          top: 1rem;
          left: 1rem;
          right: 1rem;
          bottom: 1rem;
          border-color: #9ca3af;
          animation: spin 3.5s linear infinite;
        }

        .square-4 {
          top: 1.5rem;
          left: 1.5rem;
          right: 1.5rem;
          bottom: 1.5rem;
          border-color: #d1d5db;
          animation: spin 2.8s linear infinite reverse;
        }

        .square-5 {
          top: 2rem;
          left: 2rem;
          right: 2rem;
          bottom: 2rem;
          border-color: #fbbf24;
          animation: spin 2.2s linear infinite;
        }

        .center-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0.5rem;
          height: 0.5rem;
          background-color: #fbbf24;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .loading-text {
          position: absolute;
          margin-top: 12rem;
          color: #9ca3af;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(40px, 40px);
          }
        }

        @keyframes diagonalMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) scale(1.1);
            opacity: 0.4;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default ConcentricSquaresLoader;
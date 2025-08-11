import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundOrbs: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(253, 224, 71, 0.08) 0%, rgba(251, 191, 36, 0.04) 100%)',
    filter: 'blur(80px)',
    animation: 'float 8s ease-in-out infinite'
  },
  formContainer: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '48px',
    border: '1px solid rgba(55, 65, 81, 0.5)',
    width: '100%',
    maxWidth: '400px',
    position: 'relative',
    zIndex: 2,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#9ca3af',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginBottom: '32px',
    transition: 'all 0.3s ease',
    padding: '8px 12px',
    borderRadius: '8px'
  },
  logo: {
    textAlign: 'center',
    marginBottom: '32px',
    position: 'relative'
  },
  logoText: {
    fontSize: '36px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: '0 0 30px rgba(253, 224, 71, 0.3)',
    letterSpacing: '2px'
  },
  logoGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '150px',
    height: '40px',
    background: 'linear-gradient(135deg, rgba(253, 224, 71, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)',
    borderRadius: '50%',
    filter: 'blur(20px)',
    zIndex: -1
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '32px',
    opacity: '0.9'
  },
  formDiv: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#d1d5db',
    marginBottom: '8px',
    transition: 'color 0.3s ease'
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    zIndex: 2,
    color: '#6b7280',
    transition: 'color 0.3s ease'
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    border: '1px solid rgba(55, 65, 81, 0.5)',
    borderRadius: '12px',
    padding: '14px 16px 14px 48px',
    color: '#ffffff',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  },
  eyeButton: {
    position: 'absolute',
    right: '16px',
    background: 'none',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'color 0.3s ease'
  },
  submitButton: {
    width: '100%',
    background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
    color: '#000000',
    padding: '14px',
    borderRadius: '12px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '16px',
    fontSize: '16px',
    position: 'relative',
    overflow: 'hidden'
  },
  submitButtonGlow: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    transition: 'left 0.6s ease'
  },
  switchText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: '24px',
    fontSize: '15px'
  },
  switchLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: '500',
    background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  loadingDot: {
    display: 'inline-block',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: '#000000',
    margin: '0 2px',
    opacity: '0.4',
    animation: 'loadingPulse 1.4s infinite ease-in-out'
  }
};

const FloatingOrbs = () => {
  return (
    <div style={styles.backgroundOrbs}>
      {/* More pronounced main orbs */}
      <div style={{
        ...styles.orb,
        width: '450px',
        height: '450px',
        top: '-120px',
        left: '-120px',
        background: 'radial-gradient(circle, rgba(253, 224, 71, 0.15) 0%, rgba(251, 191, 36, 0.08) 50%, transparent 70%)',
        filter: 'blur(60px)',
        animationDelay: '0s'
      }} />
      <div style={{
        ...styles.orb,
        width: '350px',
        height: '350px',
        top: '25%',
        right: '-100px',
        background: 'radial-gradient(circle, rgba(251, 191, 36, 0.18) 0%, rgba(253, 224, 71, 0.06) 50%, transparent 70%)',
        filter: 'blur(50px)',
        animationDelay: '3s'
      }} />
      <div style={{
        ...styles.orb,
        width: '300px',
        height: '300px',
        bottom: '-80px',
        left: '15%',
        background: 'radial-gradient(circle, rgba(253, 224, 71, 0.12) 0%, rgba(251, 191, 36, 0.05) 50%, transparent 70%)',
        filter: 'blur(55px)',
        animationDelay: '6s'
      }} />
      
      {/* Multiple animated geometric circles with hover effects */}
      <div style={{
        position: 'absolute',
        top: '18%',
        right: '12%',
        width: '80px',
        height: '80px',
        border: '1.5px solid rgba(253, 224, 71, 0.3)',
        borderRadius: '50%',
        animation: 'spin 20s linear infinite',
        boxShadow: '0 0 15px rgba(253, 224, 71, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        pointerEvents: 'auto'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.3) rotate(180deg)';
        e.target.style.borderColor = 'rgba(253, 224, 71, 0.8)';
        e.target.style.boxShadow = '0 0 30px rgba(253, 224, 71, 0.4)';
        e.target.style.animationPlayState = 'paused';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1) rotate(0deg)';
        e.target.style.borderColor = 'rgba(253, 224, 71, 0.3)';
        e.target.style.boxShadow = '0 0 15px rgba(253, 224, 71, 0.1)';
        e.target.style.animationPlayState = 'running';
      }}
      />
      
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '8%',
        width: '60px',
        height: '60px',
        border: '1px solid rgba(251, 191, 36, 0.4)',
        borderRadius: '50%',
        animation: 'spinReverse 15s linear infinite',
        boxShadow: '0 0 12px rgba(251, 191, 36, 0.08)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        pointerEvents: 'auto'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.4) translateY(-20px)';
        e.target.style.borderColor = 'rgba(251, 191, 36, 0.9)';
        e.target.style.boxShadow = '0 0 25px rgba(251, 191, 36, 0.3)';
        e.target.style.animationPlayState = 'paused';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1) translateY(0px)';
        e.target.style.borderColor = 'rgba(251, 191, 36, 0.4)';
        e.target.style.boxShadow = '0 0 12px rgba(251, 191, 36, 0.08)';
        e.target.style.animationPlayState = 'running';
      }}
      />
      
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '15%',
        width: '40px',
        height: '40px',
        border: '1px solid rgba(253, 224, 71, 0.25)',
        borderRadius: '50%',
        animation: 'floatSpin 12s ease-in-out infinite',
        boxShadow: '0 0 8px rgba(253, 224, 71, 0.06)',
        cursor: 'pointer',
        transition: 'all 0.4s ease',
        pointerEvents: 'auto'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(2) rotate(360deg)';
        e.target.style.borderColor = 'rgba(253, 224, 71, 0.7)';
        e.target.style.boxShadow = '0 0 20px rgba(253, 224, 71, 0.2)';
        e.target.style.animationPlayState = 'paused';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1) rotate(0deg)';
        e.target.style.borderColor = 'rgba(253, 224, 71, 0.25)';
        e.target.style.boxShadow = '0 0 8px rgba(253, 224, 71, 0.06)';
        e.target.style.animationPlayState = 'running';
      }}
      />
      
      <div style={{
        position: 'absolute',
        bottom: '25%',
        right: '20%',
        width: '50px',
        height: '50px',
        border: '1px solid rgba(251, 191, 36, 0.35)',
        borderRadius: '50%',
        animation: 'pulse 8s ease-in-out infinite',
        boxShadow: '0 0 10px rgba(251, 191, 36, 0.07)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        pointerEvents: 'auto'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.6) translateX(-30px) rotate(720deg)';
        e.target.style.borderColor = 'rgba(251, 191, 36, 0.9)';
        e.target.style.boxShadow = '0 0 35px rgba(251, 191, 36, 0.4)';
        e.target.style.animationPlayState = 'paused';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1) translateX(0px) rotate(0deg)';
        e.target.style.borderColor = 'rgba(251, 191, 36, 0.35)';
        e.target.style.boxShadow = '0 0 10px rgba(251, 191, 36, 0.07)';
        e.target.style.animationPlayState = 'running';
      }}
      />
      
      <div style={{
        position: 'absolute',
        top: '8%',
        left: '35%',
        width: '30px',
        height: '30px',
        border: '1px solid rgba(253, 224, 71, 0.2)',
        borderRadius: '50%',
        animation: 'drift 18s ease-in-out infinite',
        boxShadow: '0 0 6px rgba(253, 224, 71, 0.05)',
        cursor: 'pointer',
        transition: 'all 0.5s ease',
        pointerEvents: 'auto'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.8) translateY(40px) rotate(-180deg)';
        e.target.style.borderColor = 'rgba(253, 224, 71, 0.8)';
        e.target.style.boxShadow = '0 0 25px rgba(253, 224, 71, 0.3)';
        e.target.style.animationPlayState = 'paused';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1) translateY(0px) rotate(0deg)';
        e.target.style.borderColor = 'rgba(253, 224, 71, 0.2)';
        e.target.style.boxShadow = '0 0 6px rgba(253, 224, 71, 0.05)';
        e.target.style.animationPlayState = 'running';
      }}
      />
      
      {/* More visible dots */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '85%',
        width: '4px',
        height: '4px',
        backgroundColor: 'rgba(253, 224, 71, 0.6)',
        borderRadius: '50%',
        boxShadow: '0 0 12px rgba(253, 224, 71, 0.4)',
        animation: 'twinkle 3s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        top: '70%',
        left: '8%',
        width: '3px',
        height: '3px',
        backgroundColor: 'rgba(251, 191, 36, 0.7)',
        borderRadius: '50%',
        boxShadow: '0 0 10px rgba(251, 191, 36, 0.3)',
        animation: 'twinkle 2s ease-in-out infinite 1s'
      }} />
      
      {/* Subtle gradient line */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '-10%',
        width: '300px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(253, 224, 71, 0.1) 50%, transparent)',
        transform: 'rotate(45deg)',
        animation: 'fadeInOut 4s ease-in-out infinite'
      }} />
    </div>
  );
};

function LoginPage({ tolanding, onLogin, tosignup, onGoogleLogin, sellerKind }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  useEffect(() => {
    // Add keyframes for animations
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      @keyframes loadingPulse {
        0%, 80%, 100% { opacity: 0.4; }
        40% { opacity: 1; }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes spinReverse {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
      }
      @keyframes floatSpin {
        0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
        25% { transform: translateY(-15px) rotate(90deg) scale(1.1); }
        50% { transform: translateY(-10px) rotate(180deg) scale(0.95); }
        75% { transform: translateY(-20px) rotate(270deg) scale(1.05); }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.3; }
        50% { transform: scale(1.2); opacity: 0.6; }
      }
      @keyframes drift {
        0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
        25% { transform: translateX(20px) translateY(-10px) rotate(45deg); }
        50% { transform: translateX(10px) translateY(-25px) rotate(90deg); }
        75% { transform: translateX(-15px) translateY(-15px) rotate(135deg); }
      }
      @keyframes twinkle {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.6; }
      }
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; }
        50% { opacity: 0.3; }
      }
      .loading-dot:nth-child(1) { animation-delay: 0s; }
      .loading-dot:nth-child(2) { animation-delay: 0.2s; }
      .loading-dot:nth-child(3) { animation-delay: 0.4s; }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (formData.email && formData.password) {
      setIsLoading(true);
      // Simulate loading for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLogin(formData);
      setIsLoading(false);
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div style={styles.container}>
      <FloatingOrbs />
      
      <div style={styles.formContainer}>
        <button 
          onClick={tolanding}
          style={{
            ...styles.backButton,
            backgroundColor: focusedField === 'back' ? 'rgba(253, 224, 71, 0.1)' : 'transparent'
          }}
          onMouseEnter={(e) => {
            setFocusedField('back');
            e.target.style.background = 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)';
            e.target.style.webkitBackgroundClip = 'text';
            e.target.style.webkitTextFillColor = 'transparent';
            e.target.style.backgroundClip = 'text';
          }}
          onMouseLeave={(e) => {
            setFocusedField('');
            e.target.style.background = 'none';
            e.target.style.webkitBackgroundClip = 'initial';
            e.target.style.webkitTextFillColor = 'initial';
            e.target.style.backgroundClip = 'initial';
            e.target.style.color = '#9ca3af';
          }}
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        <div style={styles.logo}>
          <div style={styles.logoGlow} />
          <div style={styles.logoText}>CLIQUE</div>
        </div>

        <h1 style={styles.title}>Welcome Back</h1>

        <div style={styles.formDiv}>
          <div style={styles.formGroup}>
            <label 
              htmlFor="email" 
              style={{
                ...styles.label,
                color: focusedField === 'email' ? 'hsl(45, 100%, 85%)' : '#d1d5db'
              }}
            >
              Email
            </label>
            <div style={styles.inputContainer}>
              <Mail 
                size={18} 
                style={{
                  ...styles.inputIcon,
                  color: focusedField === 'email' ? 'hsl(45, 100%, 85%)' : '#6b7280'
                }}
              />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                required
                style={{
                  ...styles.input,
                  borderColor: focusedField === 'email' ? 'hsl(45, 100%, 85%)' : 'rgba(55, 65, 81, 0.5)',
                  boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(253, 224, 71, 0.1)' : 'none'
                }}
                placeholder="your.email@example.com"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label 
              htmlFor="password" 
              style={{
                ...styles.label,
                color: focusedField === 'password' ? 'hsl(45, 100%, 85%)' : '#d1d5db'
              }}
            >
              Password
            </label>
            <div style={styles.inputContainer}>
              <Lock 
                size={18} 
                style={{
                  ...styles.inputIcon,
                  color: focusedField === 'password' ? 'hsl(45, 100%, 85%)' : '#6b7280'
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                required
                style={{
                  ...styles.input,
                  paddingRight: '48px',
                  borderColor: focusedField === 'password' ? 'hsl(45, 100%, 85%)' : 'rgba(55, 65, 81, 0.5)',
                  boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(253, 224, 71, 0.1)' : 'none'
                }}
                placeholder="Your password"
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  ...styles.eyeButton,
                  color: showPassword ? 'hsl(45, 100%, 85%)' : '#6b7280'
                }}
                onMouseEnter={(e) => e.target.style.color = 'hsl(45, 100%, 85%)'}
                onMouseLeave={(e) => e.target.style.color = showPassword ? 'hsl(45, 100%, 85%)' : '#6b7280'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              ...styles.submitButton,
              opacity: isLoading ? 0.8 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 25px -5px rgba(253, 224, 71, 0.4)';
                const glow = e.target.querySelector('.submit-glow');
                if (glow) glow.style.left = '100%';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = 'none';
                const glow = e.target.querySelector('.submit-glow');
                if (glow) glow.style.left = '-100%';
              }
            }}
          >
            <div className="submit-glow" style={styles.submitButtonGlow} />
            {isLoading ? (
              <>
                Signing In
                <span className="loading-dot" style={styles.loadingDot} />
                <span className="loading-dot" style={styles.loadingDot} />
                <span className="loading-dot" style={styles.loadingDot} />
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        <div style={styles.switchText}>
          Don't have an account?{' '}
          <span 
            onClick={tosignup}
            style={styles.switchLink}
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.8';
              e.target.style.textShadow = '0 0 8px rgba(253, 224, 71, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1';
              e.target.style.textShadow = 'none';
            }}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
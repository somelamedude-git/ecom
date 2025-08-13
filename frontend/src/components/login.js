import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Add this import
import '../styles/login.css';

const FloatingOrbs = () => {
  return (
    <div className="background-orbs">
      {/* Main orbs */}
      <div className="orb main-orb-1" />
      <div className="orb main-orb-2" />
      <div className="orb main-orb-3" />
      
      {/* Interactive geometric circles */}
      <div className="geometric-circle geometric-circle-1" />
      <div className="geometric-circle geometric-circle-2" />
      <div className="geometric-circle geometric-circle-3" />
      <div className="geometric-circle geometric-circle-4" />
      <div className="geometric-circle geometric-circle-5" />
      
      {/* Twinkling dots */}
      <div className="twinkle-dot twinkle-dot-1" />
      <div className="twinkle-dot twinkle-dot-2" />
      
      {/* Gradient line */}
      <div className="gradient-line" />
    </div>
  );
};

const SetPasswordModal = ({ isOpen, onClose, userEmail }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setIsSuccess(false);
      setIsLoading(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        'http://localhost:3000/user/reset-password',
        { new_password: newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          timeout: 10000,
        }
      );

      if (response.status === 200 && response.data.success) {
        setIsLoading(false);
        setIsSuccess(true);

        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setNewPassword('');
          setConfirmPassword('');
          setError('');
        }, 3000);
      } else {
        setIsLoading(false);
        setError(response.data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);

      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.response) {
        const errorMessage = err.response.data?.message || 'Server error. Please try again later.';
        setError(errorMessage);
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Set New Password</h2>
          <button 
            onClick={onClose}
            className="close-button"
          >
            <X size={20} />
          </button>
        </div>

        <p className="modal-description">
          Please enter your new password below.
        </p>

        <div className="form-group">
          <label 
            htmlFor="new-password" 
            className={`label ${focusedField === 'new-password' ? 'focused' : ''}`}
          >
            New Password
          </label>
          <div className="input-container">
            <Lock 
              size={18} 
              className={`input-icon ${focusedField === 'new-password' ? 'focused' : ''}`}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || isSuccess}
              className="input password"
              placeholder="Enter new password"
              onFocus={() => setFocusedField('new-password')}
              onBlur={() => setFocusedField('')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`eye-button ${showPassword ? 'active' : ''}`}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label 
            htmlFor="confirm-password" 
            className={`label ${focusedField === 'confirm-password' ? 'focused' : ''}`}
          >
            Confirm Password
          </label>
          <div className="input-container">
            <Lock 
              size={18} 
              className={`input-icon ${focusedField === 'confirm-password' ? 'focused' : ''}`}
            />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || isSuccess}
              className="input password"
              placeholder="Confirm new password"
              onFocus={() => setFocusedField('confirm-password')}
              onBlur={() => setFocusedField('')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`eye-button ${showConfirmPassword ? 'active' : ''}`}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || isSuccess}
          className="submit-button"
          style={{ marginTop: '24px' }}
        >
          <div className="submit-button-glow" />
          {isLoading ? (
            <>
              Setting Password
              <span className="loading-dot" />
              <span className="loading-dot" />
              <span className="loading-dot" />
            </>
          ) : isSuccess ? (
            'Password Updated!'
          ) : (
            'Set Password'
          )}
        </button>

        {isSuccess && (
          <div className="success-message">
            Your password has been successfully updated. You can now sign in with your new password.
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

const ForgotPasswordModal = ({ isOpen, onClose, onEmailSent }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setError('');
      setIsSuccess(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3000/user/send-forgot-mail', {
        email: email
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      if (response.status === 200 && response.data.success) {
        setIsLoading(false);
        setIsSuccess(true);
        
        onEmailSent(email);
        
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setEmail('');
          setError('');
        }, 4000);
      } else {
        setIsLoading(false);
        setError(response.data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.response) {
        const errorMessage = err.response.data?.message || 'Server error. Please try again later.';
        setError(errorMessage);
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Reset Password</h2>
          <button 
            onClick={onClose}
            className="close-button"
          >
            <X size={20} />
          </button>
        </div>

        <p className="modal-description">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <div className="form-group">
          <label 
            htmlFor="reset-email" 
            className={`label ${focusedField === 'reset-email' ? 'focused' : ''}`}
          >
            Email Address
          </label>
          <div className="input-container">
            <Mail 
              size={18} 
              className={`input-icon ${focusedField === 'reset-email' ? 'focused' : ''}`}
            />
            <input
              type="email"
              id="reset-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || isSuccess}
              className="input"
              placeholder="your.email@example.com"
              onFocus={() => setFocusedField('reset-email')}
              onBlur={() => setFocusedField('')}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || isSuccess}
          className="submit-button"
          style={{ marginTop: '24px' }}
        >
          <div className="submit-button-glow" />
          {isLoading ? (
            <>
              Sending Reset Link
              <span className="loading-dot" />
              <span className="loading-dot" />
              <span className="loading-dot" />
            </>
          ) : isSuccess ? (
            'Reset Link Sent!'
          ) : (
            'Send Reset Link'
          )}
        </button>

        {isSuccess && (
          <div className="success-message">
            A password reset link has been sent to your email address. Please check your inbox and follow the instructions.
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState(''); // Add error state
  
  const navigate = useNavigate(); // Add navigation hook

  // Check for password reset link click status
  useEffect(() => {
    let interval;
    
    if (resetEmail) {
      interval = setInterval(async () => {
        try {
          const response = await axios.get('http://localhost:3000/user/returnPasswordLinkClickedStat', {
            withCredentials: true,
            timeout: 5000,
          });

          if (response.data.success && response.data.clickStatus === true) { 
            setShowSetPassword(true);
            clearInterval(interval);
            setResetEmail(''); 
          }
        } catch (error) {
          console.error('Error checking link click status:', error);
        }
      }, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [resetEmail]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/user/login', {
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        timeout: 10000,
      });

      if (response.status === 200 && response.data.success) {
        const { userKind, userId, email } = response.data;
        
        // Store user data in localStorage or context if needed
        localStorage.setItem('userKind', userKind);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userEmail', email);
        
        // Route based on user type
        if (userKind === 'Admin') {
          navigate('/admin/portal');
        } else {
          navigate('/'); // Landing page for Buyer/Seller
        }
        
        // Call the original onLogin if it's still needed for parent component state
        if (onLogin) {
          onLogin(formData);
        }
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.response) {
        const errorMessage = err.response.data?.message || 'Invalid credentials. Please try again.';
        setError(errorMessage);
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleEmailSent = (email) => {
    setResetEmail(email);
  };

  const handleSetPasswordClose = () => {
    setShowSetPassword(false);
    setResetEmail('');
  };

  return (
    <div className="login-container">
      <FloatingOrbs />
      
      <div className="form-container">
        <button 
          onClick={tolanding}
          className="back-button"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        <div className="logo">
          <div className="logo-glow" />
          <div className="logo-text">CLIQUE</div>
        </div>

        <h1 className="title">Welcome Back</h1>

        <div className="form-div">
          <div className="form-group">
            <label 
              htmlFor="email" 
              className={`label ${focusedField === 'email' ? 'focused' : ''}`}
            >
              Email
            </label>
            <div className="input-container">
              <Mail 
                size={18} 
                className={`input-icon ${focusedField === 'email' ? 'focused' : ''}`}
              />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                required
                className="input"
                placeholder="your.email@example.com"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
              />
            </div>
          </div>

          <div className="form-group">
            <label 
              htmlFor="password" 
              className={`label ${focusedField === 'password' ? 'focused' : ''}`}
            >
              Password
            </label>
            <div className="input-container">
              <Lock 
                size={18} 
                className={`input-icon ${focusedField === 'password' ? 'focused' : ''}`}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                required
                className="input password"
                placeholder="Your password"
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`eye-button ${showPassword ? 'active' : ''}`}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message" style={{ marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="submit-button"
          >
            <div className="submit-button-glow" />
            {isLoading ? (
              <>
                Signing In
                <span className="loading-dot" />
                <span className="loading-dot" />
                <span className="loading-dot" />
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        <div className="forgot-password">
          <span 
            onClick={() => setShowForgotPassword(true)}
            className="forgot-password-link"
          >
            Forgot your password?
          </span>
        </div>

        <div className="switch-text">
          Don't have an account?{' '}
          <span 
            onClick={tosignup}
            className="switch-link"
          >
            Sign up
          </span>
        </div>
      </div>

      <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)}
        onEmailSent={handleEmailSent}
      />

      <SetPasswordModal 
        isOpen={showSetPassword} 
        onClose={handleSetPasswordClose}
        userEmail={resetEmail}
      />
    </div>
  );
}

export default LoginPage;
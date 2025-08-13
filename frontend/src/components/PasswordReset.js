import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/PasswordReset.css';

const FloatingOrbs = () => {
  return (
    <div className="background-orbs">
      <div className="orb main-orb-1" />
      <div className="orb main-orb-2" />
      <div className="orb main-orb-3" />
      
      <div className="geometric-circle geometric-circle-1" />
      <div className="geometric-circle geometric-circle-2" />
      <div className="geometric-circle geometric-circle-3" />
      
      <div className="twinkle-dot twinkle-dot-1" />
      <div className="twinkle-dot twinkle-dot-2" />
      
      <div className="gradient-line" />
    </div>
  );
};

function PasswordReset() {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  useEffect(() => {
    // Verify token when component mounts
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`/api/verify-reset-token/${token}`);
      if (response.data.valid) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        setError('This password reset link is invalid or has expired.');
      }
    } catch (err) {
      setTokenValid(false);
      setError('This password reset link is invalid or has expired.');
    }
  };

  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    setPasswordStrength({ score, feedback });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }

    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.newPassword) {
      setError('Please enter a new password');
      return false;
    }

    if (!formData.confirmPassword) {
      setError('Please confirm your password');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (passwordStrength.score < 3) {
      setError('Password is too weak. Please follow the requirements.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/reset-password', {
        token: token,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        setIsSuccess(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
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

  const getStrengthColor = () => {
    if (passwordStrength.score < 2) return '#ef4444';
    if (passwordStrength.score < 4) return '#f59e0b';
    return '#10b981';
  };

  const getStrengthText = () => {
    if (passwordStrength.score < 2) return 'Weak';
    if (passwordStrength.score < 4) return 'Medium';
    return 'Strong';
  };

  if (tokenValid === null) {
    return (
      <div className="password-reset-container">
        <FloatingOrbs />
        <div className="form-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="password-reset-container">
        <FloatingOrbs />
        <div className="form-container">
          <div className="error-state">
            <h2>Invalid Reset Link</h2>
            <p>{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="submit-button"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="password-reset-container">
        <FloatingOrbs />
        <div className="form-container">
          <div className="success-state">
            <CheckCircle size={64} className="success-icon" />
            <h2>Password Reset Successful!</h2>
            <p>Your password has been updated successfully.</p>
            <p>Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="password-reset-container">
      <FloatingOrbs />
      
      <div className="form-container">
        <button 
          onClick={() => navigate('/login')}
          className="back-button"
        >
          <ArrowLeft size={20} />
          <span>Back to Login</span>
        </button>

        <div className="logo">
          <div className="logo-glow" />
          <div className="logo-text">CLIQUE</div>
        </div>

        <h1 className="title">Create New Password</h1>
        <p className="subtitle">Please enter your new password below</p>

        <div className="form-div">
          <div className="form-group">
            <label 
              htmlFor="newPassword" 
              className={`label ${focusedField === 'newPassword' ? 'focused' : ''}`}
            >
              New Password
            </label>
            <div className="input-container">
              <Lock 
                size={18} 
                className={`input-icon ${focusedField === 'newPassword' ? 'focused' : ''}`}
              />
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                required
                className="input password"
                placeholder="Enter new password"
                onFocus={() => setFocusedField('newPassword')}
                onBlur={() => setFocusedField('')}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className={`eye-button ${showNewPassword ? 'active' : ''}`}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {formData.newPassword && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ 
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      backgroundColor: getStrengthColor()
                    }}
                  />
                </div>
                <div className="strength-text" style={{ color: getStrengthColor() }}>
                  {getStrengthText()}
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <div className="password-requirements">
                    <p>Password must include:</p>
                    <ul>
                      {passwordStrength.feedback.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label 
              htmlFor="confirmPassword" 
              className={`label ${focusedField === 'confirmPassword' ? 'focused' : ''}`}
            >
              Confirm New Password
            </label>
            <div className="input-container">
              <Lock 
                size={18} 
                className={`input-icon ${focusedField === 'confirmPassword' ? 'focused' : ''}`}
              />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                required
                className="input password"
                placeholder="Confirm new password"
                onFocus={() => setFocusedField('confirmPassword')}
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
            
            {formData.confirmPassword && formData.newPassword && (
              <div className={`password-match ${
                formData.newPassword === formData.confirmPassword ? 'match' : 'no-match'
              }`}>
                {formData.newPassword === formData.confirmPassword ? 
                  '✓ Passwords match' : 
                  '✗ Passwords do not match'
                }
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="submit-button"
          >
            <div className="submit-button-glow" />
            {isLoading ? (
              <>
                Updating Password
                <span className="loading-dot" />
                <span className="loading-dot" />
                <span className="loading-dot" />
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default PasswordReset;
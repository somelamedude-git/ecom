import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px'
  },
  formContainer: {
    backgroundColor: '#111827',
    borderRadius: '12px',
    padding: '48px',
    border: '1px solid #374151',
    width: '100%',
    maxWidth: '800px'
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
    transition: 'all 0.3s ease'
  },
  logo: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  logoText: {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '32px'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
    color: '#9ca3af'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#374151'
  },
  dividerText: {
    padding: '0 16px',
    fontSize: '14px',
    fontWeight: '500'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  formSections: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '32px'
    }
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: '8px',
    paddingBottom: '8px',
    borderBottom: '1px solid #374151'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#d1d5db',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '16px',
    transition: 'border-color 0.3s ease'
  },
  submitButton: {
    width: '100%',
    background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
    color: '#000000',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '16px',
    gridColumn: '1 / -1'
  },
  switchText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: '24px'
  },
  switchLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: '500',
    background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    cursor: 'pointer'
  }
};

function SignupPage({ tolanding, onSignUp, tologin, alertText}) {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age:'',
    kind:'',
    username:'',
    phone_number: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (formData.firstName && formData.lastName && formData.email && formData.password) {
      onSignUp(formData);
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <button 
          onClick={tolanding}
          style={styles.backButton}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)';
            e.target.style.webkitBackgroundClip = 'text';
            e.target.style.webkitTextFillColor = 'transparent';
            e.target.style.backgroundClip = 'text';
          }}
          onMouseLeave={(e) => {
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
          <div style={styles.logoText}>CLIQUE</div>
        </div>

        <h1 style={styles.title}>Create Account</h1>
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>OR</span>
          <div style={styles.dividerLine}></div>
        </div>

        <div style={styles.form}>
          <div style={styles.formSections}>
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Personal Information</h3>
              
              <div style={styles.formGroup}>
                <label htmlFor="firstName" style={styles.label}>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  required
                  style={styles.input}
                  placeholder="First name"
                  onFocus={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                  onBlur={(e) => e.target.style.borderColor = '#374151'}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="lastName" style={styles.label}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  required
                  style={styles.input}
                  placeholder="Last name"
                  onFocus={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                  onBlur={(e) => e.target.style.borderColor = '#374151'}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="age" style={styles.label}>Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  required
                  style={styles.input}
                  placeholder="Your age"
                  min="13"
                  max="120"
                  onFocus={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                  onBlur={(e) => e.target.style.borderColor = '#374151'}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="phone_number" style={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  required
                  style={styles.input}
                  placeholder="+1 (555) 123-4567"
                  onFocus={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                  onBlur={(e) => e.target.style.borderColor = '#374151'}
                />
              </div>
            </div>

            {/* Right Side - Account Details */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Account Details</h3>
              
              <div style={styles.formGroup}>
                <label htmlFor="username" style={styles.label}>Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  required
                  style={styles.input}
                  placeholder="Choose a username"
                  onFocus={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                  onBlur={(e) => e.target.style.borderColor = '#374151'}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="accountType" style={styles.label}>Sign up as</label>
                <select
                  id="accountType"
                  name="kind"
                  value={formData.kind}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  style={{ ...styles.input, backgroundColor: '#1f2937' }}
                  required
                  onFocus={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                  onBlur={(e) => e.target.style.borderColor = '#374151'}
                >
                  <option value="" disabled hidden>
                    Select account type
                  </option>
                  <option value="Buyer">Buyer</option>
                  <option value="Seller">Seller</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  required
                  style={styles.input}
                  placeholder="your.email@example.com"
                  onFocus={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                  onBlur={(e) => e.target.style.borderColor = '#374151'}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  required
                  style={styles.input}
                  placeholder="Create a password"
                  onFocus={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                  onBlur={(e) => e.target.style.borderColor = '#374151'}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="confirmPassword" style={styles.label}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  required
                  style={styles.input}
                  placeholder="Confirm your password"
                  onFocus={(e) => e.target.style.borderColor = 'hsl(45, 100%, 85%)'}
                  onBlur={(e) => e.target.style.borderColor = '#374151'}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            style={styles.submitButton}
            onClick={handleSubmit}
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.9';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Create Account
          </button>
        </div>

        <div style={styles.switchText}>
          Already have an account?{' '}
          <span 
            onClick={tologin}
            style={styles.switchLink}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Sign in
          </span>

         { alertText && <p style={{ color: 'red', marginTop: '1rem' }}>{alertText}</p> }
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
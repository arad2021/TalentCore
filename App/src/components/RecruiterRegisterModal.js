import React, { useState } from 'react';
import { recruiterAPI } from '../services/apiService';

const RecruiterRegisterModal = ({ isOpen, onClose, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    company: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || 
        !formData.phoneNumber.trim() || !formData.email.trim() || !formData.company.trim()) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const result = await recruiterAPI.register(formData);
      
      if (result.success) {
        // Registration successful - now get the recruiter ID by signing in
        const signInResult = await recruiterAPI.signIn(formData.email);
        if (signInResult.success) {
          onRegisterSuccess('recruiter', formData.email, signInResult.userId);
        } else {
          // If sign in fails, still call success but without userId
          onRegisterSuccess('recruiter', formData.email, null);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      company: ''
    });
    setError('');
    onClose();
  };

  const isFormValid = formData.firstName.trim() && formData.lastName.trim() && 
                     formData.phoneNumber.trim() && formData.email.trim() && formData.company.trim();

  return (
    <div className="modal-overlay" onClick={handleBack}>
      <div className="modal-content register-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create Recruiter Account</h2>
          <button className="modal-close" onClick={handleBack}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          <p className="modal-description">
            Fill in your details to create a new recruiter account
          </p>
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  <i className="fas fa-user"></i>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your first name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  <i className="fas fa-user"></i>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your last name"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                <i className="fas fa-phone"></i>
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your phone number"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <i className="fas fa-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your email address"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="company" className="form-label">
                <i className="fas fa-building"></i>
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your company name"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleBack}
                disabled={isLoading}
              >
                <i className="fas fa-arrow-left"></i>
                Back
              </button>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus"></i>
                    Create Account
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="modal-footer">
          <p className="modal-help">
            <i className="fas fa-info-circle"></i>
            Already have an account? 
            <button 
              className="link-button" 
              onClick={handleBack}
              style={{ marginLeft: '5px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecruiterRegisterModal;

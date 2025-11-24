import React, { useState } from 'react';
import { isValidEmail, isValidPhone, formatPhone } from '../utils/stringUtils';
import { toast } from './ToastContainer';

const PersonalInfoSection = ({ 
  fullName, 
  email, 
  phone,
  facebookUrl,
  linkedinUrl,
  onSavePersonalInfo 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: fullName,
    email: email,
    phone: phone,
    facebookUrl: facebookUrl || '',
    linkedinUrl: linkedinUrl || ''
  });

  const togglePersonalInfoEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFormData({
        fullName: fullName,
        email: email,
        phone: phone,
        facebookUrl: facebookUrl || '',
        linkedinUrl: linkedinUrl || ''
      });
      setErrors({});
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName || !formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (9-12 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }
    
    // Format phone before saving
    const formattedData = {
      ...formData,
      phone: formatPhone(formData.phone)
    };
    
    onSavePersonalInfo(formattedData);
    setIsEditing(false);
    toast.success('Personal information updated successfully');
  };

  const handleCancel = () => {
    setFormData({
      fullName: fullName,
      email: email,
      phone: phone,
      facebookUrl: facebookUrl || '',
      linkedinUrl: linkedinUrl || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h3 className="section-title">Personal Information</h3>
        <button className="edit-btn" onClick={togglePersonalInfoEdit}>
          <i className="fas fa-edit"></i> Edit
        </button>
      </div>
      {!isEditing ? (
        <div id="personalInfoDisplay">
          <div className="info-item">
            <div className="info-label">Full Name:</div>
            <div className="info-value" id="fullNameValue">{fullName || 'Not specified'}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Email:</div>
            <div className="info-value" id="emailValue">{email || 'Not specified'}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Phone:</div>
            <div className="info-value" id="phoneValue">{phone || 'Not specified'}</div>
          </div>
          {linkedinUrl && (
            <div className="info-item">
              <div className="info-label">LinkedIn:</div>
              <div className="info-value">
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-url-link">
                  {linkedinUrl}
                </a>
              </div>
            </div>
          )}
          {facebookUrl && (
            <div className="info-item">
              <div className="info-label">Facebook:</div>
              <div className="info-value">
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="social-url-link">
                  {facebookUrl}
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div id="personalInfoEdit">
          <div className={`form-group ${errors.fullName ? 'error' : ''}`}>
            <label className="form-label">Full Name:</label>
            <input 
              type="text" 
              className={`form-input ${errors.fullName ? 'error' : ''}`}
              id="fullNameInput" 
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter full name"
              required
            />
            {errors.fullName && (
              <div className="form-error show">
                <i className="fas fa-exclamation-circle"></i>
                {errors.fullName}
              </div>
            )}
          </div>
          <div className={`form-group ${errors.email ? 'error' : ''}`}>
            <label className="form-label">Email:</label>
            <input 
              type="email" 
              className={`form-input ${errors.email ? 'error' : ''}`}
              id="emailInput" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email"
              required
            />
            {errors.email && (
              <div className="form-error show">
                <i className="fas fa-exclamation-circle"></i>
                {errors.email}
              </div>
            )}
          </div>
          <div className={`form-group ${errors.phone ? 'error' : ''}`}>
            <label className="form-label">Phone:</label>
            <input 
              type="tel" 
              className={`form-input ${errors.phone ? 'error' : ''}`}
              id="phoneInput" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number (e.g., 050-123-4567)"
              required
            />
            {errors.phone && (
              <div className="form-error show">
                <i className="fas fa-exclamation-circle"></i>
                {errors.phone}
              </div>
            )}
          </div>
          <div className={`form-group ${errors.linkedinUrl ? 'error' : ''}`}>
            <label className="form-label">LinkedIn URL (optional):</label>
            <input 
              type="url" 
              className={`form-input ${errors.linkedinUrl ? 'error' : ''}`}
              id="linkedinInput" 
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/your-profile"
            />
            {errors.linkedinUrl && (
              <div className="form-error show">
                <i className="fas fa-exclamation-circle"></i>
                {errors.linkedinUrl}
              </div>
            )}
          </div>
          <div className={`form-group ${errors.facebookUrl ? 'error' : ''}`}>
            <label className="form-label">Facebook URL (optional):</label>
            <input 
              type="url" 
              className={`form-input ${errors.facebookUrl ? 'error' : ''}`}
              id="facebookInput" 
              name="facebookUrl"
              value={formData.facebookUrl}
              onChange={handleInputChange}
              placeholder="https://facebook.com/your-profile"
            />
            {errors.facebookUrl && (
              <div className="form-error show">
                <i className="fas fa-exclamation-circle"></i>
                {errors.facebookUrl}
              </div>
            )}
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
            <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoSection;

import React, { useState, forwardRef, useImperativeHandle } from 'react';

const RecruiterPersonalInfoSection = forwardRef(({ 
  personalInfo, 
  onSavePersonalInfo 
}, ref) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    fullName: personalInfo.name || '',
    email: personalInfo.email || '',
    phone: personalInfo.phone || '',
    company: personalInfo.title || ''
  });

  const handleToggleEdit = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setEditData({
        fullName: personalInfo.name || '',
        email: personalInfo.email || '',
        phone: personalInfo.phone || '',
        company: personalInfo.title || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    const updatedInfo = {
      name: editData.fullName,
      email: editData.email,
      phone: editData.phone,
      title: editData.company
    };

    onSavePersonalInfo(updatedInfo);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditData({
      fullName: personalInfo.name || '',
      email: personalInfo.email || '',
      phone: personalInfo.phone || '',
      company: personalInfo.title || ''
    });
  };

  useImperativeHandle(ref, () => ({
    toggleEdit: handleToggleEdit,
    openEdit: () => {
      if (!isEditMode) {
        handleToggleEdit();
      }
    }
  }));

  return (
    <div className="section-card">
      <div className="section-header">
        <h3 className="section-title">Personal Information</h3>
        <button className="edit-btn" onClick={handleToggleEdit}>
          <i className="fas fa-edit"></i> Edit
        </button>
      </div>
      
      {!isEditMode ? (
        <div id="personalInfoDisplay">
          <div className="info-item">
            <div className="info-label">Full Name:</div>
            <div className="info-value" id="fullNameValue">{personalInfo.name}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Email:</div>
            <div className="info-value" id="emailValue">{personalInfo.email}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Phone:</div>
            <div className="info-value" id="phoneValue">{personalInfo.phone}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Company:</div>
            <div className="info-value" id="companyValue">{personalInfo.title}</div>
          </div>
        </div>
      ) : (
        <div id="personalInfoEdit">
          <div className="form-group">
            <label className="form-label">Full Name:</label>
            <input 
              type="text" 
              className="form-input" 
              id="fullNameInput" 
              name="fullName"
              placeholder="Enter full name"
              value={editData.fullName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input 
              type="email" 
              className="form-input" 
              id="emailInput" 
              name="email"
              placeholder="Enter email"
              value={editData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone:</label>
            <input 
              type="tel" 
              className="form-input" 
              id="phoneInput" 
              name="phone"
              placeholder="Enter phone number"
              value={editData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Company:</label>
            <input 
              type="text" 
              className="form-input" 
              id="companyInput" 
              name="company"
              placeholder="Enter company name"
              value={editData.company}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default RecruiterPersonalInfoSection;

import React, { useState } from 'react';

const RecruiterProfileCard = ({ 
  profileData, 
  onAvatarUpload, 
  onRefreshProfile,
  onSavePersonalInfo,
  onEditPersonalInfoClick,
  profilePictureUrl
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    firstName: (profileData.name || '').trim().split(' ').slice(0, -1).join(' ') || (profileData.name || '').trim().split(' ')[0] || '',
    lastName: (profileData.name || '').trim().split(' ').slice(-1)[0] || '',
    email: profileData.email || '',
    phone: profileData.phone || '',
    company: profileData.title || ''
  });

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    document.getElementById('avatarFileInput').click();
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Simple confirmation question
      if (window.confirm('Do you confirm these changes?')) {
        onAvatarUpload(file);
      } else {
        // If user cancelled, reset the input so they can select again
        e.target.value = '';
      }
    }
  };

  const toggleEdit = () => {
    if (!isEditing) {
      const name = (profileData.name || '').trim();
      const parts = name.split(' ').filter(Boolean);
      const first = parts.length > 1 ? parts.slice(0, -1).join(' ') : (parts[0] || '');
      const last = parts.length > 1 ? parts.slice(-1)[0] : '';
      setEditedInfo({
        firstName: first,
        lastName: last,
        email: profileData.email || '',
        phone: profileData.phone || '',
        company: profileData.title || ''
      });
    }
    setIsEditing(prev => !prev);
  };

  const handleFieldChange = (field, value) => {
    setEditedInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const mergedName = `${(editedInfo.firstName || '').trim()} ${(editedInfo.lastName || '').trim()}`.trim();
    const updatedInfo = {
      name: mergedName,
      email: editedInfo.email,
      phone: editedInfo.phone,
      title: editedInfo.company
    };
    if (onSavePersonalInfo) {
      onSavePersonalInfo(updatedInfo);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    const name = (profileData.name || '').trim();
    const parts = name.split(' ').filter(Boolean);
    const first = parts.length > 1 ? parts.slice(0, -1).join(' ') : (parts[0] || '');
    const last = parts.length > 1 ? parts.slice(-1)[0] : '';
    setEditedInfo({
      firstName: first,
      lastName: last,
      email: profileData.email || '',
      phone: profileData.phone || '',
      company: profileData.title || ''
    });
  };

  return (
    <div className="profile-card" id="profile-card" role="main" aria-label="User profile">
      <div className="profile-header">
        <div 
          className="profile-avatar" 
          id="profileAvatar" 
          onClick={handleAvatarClick} 
          role="button" 
          aria-label="Click to upload profile photo" 
          tabIndex="0"
        >
          {profilePictureUrl ? (
            <img src={profilePictureUrl} alt="Profile" />
          ) : (
            <i className="fas fa-user" id="avatarIcon" aria-hidden="true"></i>
          )}
          <div className="avatar-upload-overlay" aria-hidden="true">
            <div>Click to upload photo</div>
          </div>
        </div>
        <input 
          type="file" 
          id="avatarFileInput" 
          className="file-input" 
          accept="image/*" 
          onChange={handleAvatarChange} 
          aria-label="Upload profile photo"
        />
      </div>
      <div className="profile-info">
        {/* Name and company moved closer to the image */}
        <div className="name-block" style={{ width: '100%', marginTop: 8, marginBottom: 8 }}>
          <h2 style={{ margin: 0 }}>{(profileData.name || '').trim() || 'Recruiter'}</h2>
          {(profileData.company || profileData.title) && (
            <div className="company-line" style={{ color: 'rgba(0,0,0,0.7)', marginTop: 2 }}>
              {profileData.company || profileData.title}
            </div>
          )}
        </div>
        <div className="profile-actions" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            type="button" 
            className="edit-btn" 
            aria-label="Edit personal information"
            title="Edit personal information"
            onClick={onEditPersonalInfoClick || toggleEdit}
          >
            <i className="fas fa-edit" style={{ marginRight: 6 }}></i>
            Edit Personal Information
          </button>
          <div 
            className="active-jobs-badge" 
            role="status" 
            aria-live="polite"
            title="Active jobs count"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 9999,
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: '#fff',
              fontWeight: 700,
              boxShadow: '0 6px 14px rgba(34,197,94,0.35)'
            }}
          >
            <i className="fas fa-briefcase" aria-hidden="true" style={{ opacity: 0.95 }}></i>
            <span>Active Jobs: {profileData.jobs.filter(job => job.status === 'Active').length}</span>
          </div>
        </div>


        {isEditing && (
          <div className="inline-edit-panel" style={{ width: '100%', margin: '12px 0 8px 0' }}>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="pi-firstname">First Name</label>
                <input id="pi-firstname" className="form-input" type="text" value={editedInfo.firstName} onChange={(e) => handleFieldChange('firstName', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pi-lastname">Last Name</label>
                <input id="pi-lastname" className="form-input" type="text" value={editedInfo.lastName} onChange={(e) => handleFieldChange('lastName', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pi-email">Email</label>
                <input id="pi-email" className="form-input" type="email" value={editedInfo.email} onChange={(e) => handleFieldChange('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pi-phone">Phone</label>
                <input id="pi-phone" className="form-input" type="tel" value={editedInfo.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pi-company">Company</label>
                <input id="pi-company" className="form-input" type="text" value={editedInfo.company} onChange={(e) => handleFieldChange('company', e.target.value)} />
              </div>
            </div>
            <div className="form-actions" style={{ justifyContent: 'flex-start', gap: 8 }}>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
              <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        )}
        <div className="profile-summary-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', whiteSpace: 'nowrap', width: '100%' }}>
          {/* Personal details intentionally hidden from display */}
          <div className="personal-info" role="region" aria-label="Personal information" style={{ flex: '1 1 auto', minWidth: 0 }}></div>
          {/* Active jobs moved to top-right badge */}
          <div className="profile-stats right-aligned" role="region" aria-label="Profile statistics" style={{ display: 'none' }}></div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfileCard;

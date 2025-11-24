import React from 'react';

const ProfileCard = ({ 
  profileName, 
  profileTitle,
  onAvatarUpload,
  profilePictureUrl,
  facebookUrl,
  linkedinUrl
}) => {

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
        <h2 className="profile-name" id="profileName">{profileName || 'Your Name'}</h2>
        {(facebookUrl || linkedinUrl) && (
          <div className="profile-social-links">
            {linkedinUrl && (
              <a 
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link linkedin-link"
                aria-label="LinkedIn Profile"
                title="LinkedIn Profile"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            )}
            {facebookUrl && (
              <a 
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link facebook-link"
                aria-label="Facebook Profile"
                title="Facebook Profile"
              >
                <i className="fab fa-facebook"></i>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;

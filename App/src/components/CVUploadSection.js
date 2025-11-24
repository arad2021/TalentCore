import React, { useState, useEffect } from 'react';
import { candidateAPI } from '../services/apiService';

const CVUploadSection = ({ candidateId, onCvStatusChange }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [hasCV, setHasCV] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

  // Check if candidate has CV on component mount
  useEffect(() => {
    if (candidateId) {
      checkCVStatus();
    }
  }, [candidateId]);

  const checkCVStatus = async () => {
    try {
      const result = await candidateAPI.hasCV(candidateId);
      if (result.success) {
        setHasCV(result.hasCV);
        if (onCvStatusChange) {
          onCvStatusChange(result.hasCV);
        }
      }
    } catch (error) {
      console.error('Error checking CV status:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        showMessage('Please select a PDF or Word document only', 'error');
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        showMessage('File size must be less than 10MB', 'error');
        return;
      }
      
      setSelectedFile(file);
      showMessage('File selected successfully', 'success');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showMessage('Please select a file first', 'error');
      return;
    }

    setUploading(true);
    try {
      const result = await candidateAPI.uploadCV(candidateId, selectedFile);
      
      if (result.success) {
        showMessage('CV uploaded successfully! Analyzing CV and refreshing page...', 'success');
        setSelectedFile(null);
        setHasCV(true);
        if (onCvStatusChange) {
          onCvStatusChange(true);
        }
        // Reset file input
        const fileInput = document.getElementById('cv-file-input');
        if (fileInput) {
          fileInput.value = '';
        }
        // Wait a bit for backend to finish analyzing CV, then refresh the page
        setTimeout(() => {
          window.location.reload();
        }, 2000); // 2 seconds delay to allow CV analysis to complete
      } else {
        showMessage(result.message || 'Failed to upload CV', 'error');
        setUploading(false);
      }
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('Failed to upload CV', 'error');
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const result = await candidateAPI.downloadCV(candidateId);
      
      if (result.success) {
        // Create download link
        const url = window.URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cv.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showMessage('CV downloaded successfully', 'success');
      } else {
        showMessage('Failed to download CV', 'error');
      }
    } catch (error) {
      console.error('Download error:', error);
      showMessage('Failed to download CV', 'error');
    }
  };

  const handleView = async () => {
    try {
      const result = await candidateAPI.viewCV(candidateId);
      
      if (result.success) {
        // Open CV in new tab
        const url = window.URL.createObjectURL(result.blob);
        window.open(url, '_blank');
        showMessage('CV opened in new tab', 'success');
      } else {
        showMessage('Failed to view CV', 'error');
      }
    } catch (error) {
      console.error('View error:', error);
      showMessage('Failed to view CV', 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your CV?')) {
      return;
    }

    try {
      const result = await candidateAPI.deleteCV(candidateId);
      
      if (result.success) {
        showMessage('CV deleted successfully', 'success');
        setHasCV(false);
        if (onCvStatusChange) {
          onCvStatusChange(false);
        }
      } else {
        showMessage(result.message || 'Failed to delete CV', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showMessage('Failed to delete CV', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  return (
    <div className="section-card cv-upload-section">
      <div className="section-header">
        <h3 className="section-title">CV Management</h3>
        <div className="cv-status">
          {hasCV ? (
            <span className="status-badge status-uploaded">
              <i className="fas fa-check-circle"></i> CV Uploaded
            </span>
          ) : (
            <span className="status-badge status-none">
              <i className="fas fa-exclamation-circle"></i> No CV
            </span>
          )}
        </div>
      </div>

      <div className="cv-upload-content">
        {message && (
          <div className={`message ${messageType}`}>
            <i className={`fas ${messageType === 'success' ? 'fa-check-circle' : 
                          messageType === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
            {message}
          </div>
        )}

        {!hasCV ? (
          <div className="upload-area">
            <div className="file-input-wrapper">
              <input
                type="file"
                id="cv-file-input"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="file-input"
              />
              <label htmlFor="cv-file-input" className="file-input-label">
                <i className="fas fa-cloud-upload-alt"></i>
                <span>Choose PDF or Word File</span>
                <small>Maximum size: 10MB</small>
              </label>
            </div>
            
            {selectedFile && (
              <div className="selected-file">
                <i className={selectedFile.type === 'application/pdf' ? 'fas fa-file-pdf' : 'fas fa-file-word'}></i>
                <span>{selectedFile.name}</span>
                <span className="file-size">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}

            <button
              className="btn btn-primary upload-btn"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Uploading...
                </>
              ) : (
                <>
                  <i className="fas fa-upload"></i> Upload CV
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="cv-actions">
            <div className="cv-info">
              <i className="fas fa-file-alt"></i>
              <span>CV is uploaded and ready</span>
            </div>
            
            <div className="action-buttons">
              <button
                className="btn btn-secondary"
                onClick={handleView}
                title="View CV in browser"
              >
                <i className="fas fa-eye"></i> View
              </button>
              
              <button
                className="btn btn-secondary"
                onClick={handleDownload}
                title="Download CV"
              >
                <i className="fas fa-download"></i> Download
              </button>
              
              <button
                className="btn btn-outline"
                onClick={handleDelete}
                title="Delete CV"
              >
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        )}

        <div className="cv-requirements">
          <h4>Requirements:</h4>
          <ul>
            <li><i className="fas fa-check"></i> PDF or Word format</li>
            <li><i className="fas fa-check"></i> Maximum size: 10MB</li>
            <li><i className="fas fa-check"></i> One CV per candidate</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CVUploadSection;

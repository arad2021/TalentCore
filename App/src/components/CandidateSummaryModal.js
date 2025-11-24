import React from 'react';
import ReactDOM from 'react-dom';
import '../modal.css';

const CandidateSummaryModal = ({ candidate, summaryData, onClose }) => {
  if (!candidate || !summaryData) return null;

  const candidateName = candidate.firstName && candidate.lastName 
    ? `${candidate.firstName} ${candidate.lastName}` 
    : candidate.firstName || candidate.lastName || 'Unknown Candidate';

  return ReactDOM.createPortal(
    <div className="job-modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="job-modal-content" style={{maxWidth: 800, width: 'min(90%, 800px)'}} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title" style={{fontSize: '1.8rem', fontWeight: 800}}>
            <i className="fas fa-user-circle" style={{marginRight: '10px', color: '#667eea'}}></i>
            Candidate Summary: {candidateName}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div style={{marginBottom: '24px', padding: '16px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px', borderLeft: '4px solid #667eea'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
              <i className="fas fa-star" style={{color: '#ffc107', fontSize: '1.5rem'}}></i>
              <span style={{fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)'}}>
                {summaryData.score}%
              </span>
              <span style={{fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500}}>
                Compatibility Score
              </span>
            </div>
          </div>

          <div className="job-description" style={{marginTop: 16, marginBottom: 24}}>
            <strong style={{display: 'block', marginBottom: '12px', fontSize: '1.1rem', color: 'var(--text-primary)'}}>
              <i className="fas fa-file-alt" style={{marginRight: '8px', color: '#6f42c1'}}></i>
              Summary
            </strong>
            <p style={{marginTop: 8, lineHeight: '1.8', fontSize: '1rem', color: 'var(--text-secondary)'}}>
              {summaryData.summary || 'No summary available.'}
            </p>
          </div>

          {summaryData.matchedSkills && summaryData.matchedSkills.length > 0 && (
            <div className="job-technical-skills" style={{marginTop: 24, marginBottom: 24}}>
              <strong style={{display: 'block', marginBottom: '12px', fontSize: '1.1rem', color: 'var(--text-primary)'}}>
                <i className="fas fa-check-circle" style={{marginRight: '8px', color: '#28a745'}}></i>
                Matched Skills
              </strong>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 8}}>
                {summaryData.matchedSkills.map((skill, index) => (
                  <span 
                    key={index}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '16px',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      background: 'rgba(40, 167, 69, 0.2)',
                      color: '#28a745',
                      border: '1px solid rgba(40, 167, 69, 0.3)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {summaryData.missingSkills && summaryData.missingSkills.length > 0 && (
            <div className="job-technical-skills" style={{marginTop: 24, marginBottom: 24}}>
              <strong style={{display: 'block', marginBottom: '12px', fontSize: '1.1rem', color: 'var(--text-primary)'}}>
                <i className="fas fa-times-circle" style={{marginRight: '8px', color: '#dc3545'}}></i>
                Missing Skills
              </strong>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 8}}>
                {summaryData.missingSkills.map((skill, index) => (
                  <span 
                    key={index}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '16px',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      background: 'rgba(220, 53, 69, 0.2)',
                      color: '#dc3545',
                      border: '1px solid rgba(220, 53, 69, 0.3)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer" style={{padding: '16px', borderTop: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'flex-end'}}>
          <button className="btn btn-primary" onClick={onClose} style={{padding: '10px 24px'}}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CandidateSummaryModal;


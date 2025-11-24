import React, { useState } from 'react';
import CandidateSummaryModal from './CandidateSummaryModal';

const RecruiterJobOffersSection = ({ jobOffers, geminiCandidates, onRefreshOffers, onViewOffer, onEditOffer, onDeleteOffer, title, onFindCandidates, onSendJobOffer, onViewCandidateProfile, onSkipCandidate, isLoading = false }) => {
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [skippingCandidates, setSkippingCandidates] = useState(new Set());
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'pending';
      case 'Accepted':
        return 'accepted';
      case 'Declined':
        return 'declined';
      case 'Expired':
        return 'expired';
      default:
        return 'pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return 'fas fa-clock';
      case 'Accepted':
        return 'fas fa-check-circle';
      case 'Declined':
        return 'fas fa-times-circle';
      case 'Expired':
        return 'fas fa-exclamation-triangle';
      default:
        return 'fas fa-clock';
    }
  };

  const getProgressWidth = (status) => {
    switch (status) {
      case 'Pending':
        return '25%';
      case 'Accepted':
        return '100%';
      case 'Declined':
        return '0%';
      case 'Expired':
        return '0%';
      default:
        return '25%';
    }
  };

  const getProgressText = (status) => {
    switch (status) {
      case 'Pending':
        return 'Offer sent - awaiting candidate response';
      case 'Accepted':
        return 'Offer accepted - congratulations!';
      case 'Declined':
        return 'Offer declined by candidate';
      case 'Expired':
        return 'Offer expired';
      default:
        return 'Offer sent - awaiting candidate response';
    }
  };

  const handleAction = (action, offerId) => {
    switch (action) {
      case 'view':
        onViewOffer(offerId);
        break;
      case 'edit':
        onEditOffer(offerId);
        break;
      case 'delete':
        onDeleteOffer(offerId);
        break;
      default:
        break;
    }
  };

  return (
    <div className="section-card recruiter-job-offers-section job-offers-section">
      <div className="section-header">
        <h3 className="section-title">
          {title || 'Candidates'}
        </h3>
        {onFindCandidates && (
          <button 
            className="find-candidates-btn" 
            onClick={onFindCandidates}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Searching...
              </>
            ) : (
              <>
                <i className="fas fa-search"></i> Find Candidates
              </>
            )}
          </button>
        )}
      </div>
      <div className="offers-list" id="recruiterOffersList">
        {geminiCandidates && geminiCandidates.length > 0 ? (
          geminiCandidates.map((item, index) => {
            const candidate = item.candidate;
            const candidateName = candidate.firstName && candidate.lastName 
              ? `${candidate.firstName} ${candidate.lastName}` 
              : candidate.firstName || candidate.lastName || 'Unknown Candidate';
            const candidateId = candidate.id;
            const isSkipping = skippingCandidates.has(candidateId);
            
            const handleSkip = () => {
              if (onSkipCandidate) {
                setSkippingCandidates(prev => new Set(prev).add(candidateId));
                // Wait for animation to complete before removing
                setTimeout(() => {
                  onSkipCandidate(candidateId);
                  setSkippingCandidates(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(candidateId);
                    return newSet;
                  });
                }, 400); // Match animation duration
              }
            };
            
            return (
              <div 
                key={index} 
                className={`offer-item candidate-item ${isSkipping ? 'skipping' : ''}`}
              >
                <div className="offer-header">
                  <div className="offer-title-section">
                    <h4 
                      className="offer-title candidate-name-clickable"
                      onClick={() => onViewCandidateProfile && onViewCandidateProfile(candidateId)}
                      title="Click to view candidate profile"
                      style={{ cursor: onViewCandidateProfile ? 'pointer' : 'default' }}
                    >
                      {candidateName}
                    </h4>
                    <div 
                      className="candidate-score"
                      style={{
                        background: `linear-gradient(to right, #4caf50 ${item.score}%, #f1f3f5 ${item.score}%)`,
                        borderRadius: '6px',
                        padding: '4px 8px'
                      }}
                    >
                      <i className="fas fa-star"></i>
                      <span className="score-value">{item.score}%</span>
                      <span className="score-label">Match Score</span>
                    </div>
                  </div>
                  <div className="candidate-header-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedSummary({ candidate, summaryData: item })}
                      title="View summary"
                    >
                      <i className="fas fa-info-circle"></i> Summary
                    </button>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => onSendJobOffer && onSendJobOffer(candidateId)}
                      title="Send job offer to candidate"
                    >
                      <i className="fas fa-paper-plane"></i> Send Offer
                    </button>
                  </div>
                </div>
                <div className="candidate-footer-actions">
                  <button 
                    className="btn btn-skip btn-sm"
                    onClick={handleSkip}
                    title="Skip this candidate"
                    disabled={isSkipping}
                  >
                    <i className="fas fa-arrow-right"></i> Skip
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <i className="fas fa-search"></i>
            <p>No candidates found. Click "Find Candidates" to search for matching candidates.</p>
          </div>
        )}
      </div>

      {selectedSummary && (
        <CandidateSummaryModal
          candidate={selectedSummary.candidate}
          summaryData={selectedSummary.summaryData}
          onClose={() => setSelectedSummary(null)}
        />
      )}
    </div>
  );
};

export default RecruiterJobOffersSection;

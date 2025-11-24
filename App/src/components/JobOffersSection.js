import React from 'react';

const JobOffersSection = ({ jobOffers, onRefreshOffers, onAcceptOffer, onDeclineOffer, onViewOffer }) => {
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
      case 'PENDING':
        return 'status-applied';
      case 'Accepted':
      case 'ACCEPTED':
        return 'status-interview';
      case 'Declined':
      case 'DENIED':
        return 'status-rejected';
      default:
        return 'status-applied';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
      case 'PENDING':
        return 'fas fa-clock';
      case 'Accepted':
      case 'ACCEPTED':
        return 'fas fa-check-circle';
      case 'Declined':
      case 'DENIED':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-clock';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      if (typeof dateString === 'string' && dateString.includes(',')) {
        return dateString;
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date not available';
      }
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Date not available';
    }
  };

  return (
    <div className="section-card job-offers-section">
      <div className="section-header">
        <h3 className="section-title">
          Job Offers
        </h3>
      </div>
      <div className="offers-list" id="offersList">
        {!jobOffers || jobOffers.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-gift"></i>
            <p>No job offers yet. Keep your profile updated to attract recruiters!</p>
          </div>
        ) : (
          jobOffers.map((offer, index) => {
            const isPending = offer.status === 'Pending' || offer.status === 'PENDING';
            
            return (
              <div key={offer.id || index} className="application-item">
                <div className="application-header">
                  <h4 className="application-title">{offer.title || `Job #${offer.jobId}`}</h4>
                  <span className="application-company">{offer.company || 'Company not specified'}</span>
                </div>
                
                <div className="application-details">
                  {offer.recruiterName && (
                    <div className="application-meta">
                      <i className="fas fa-user-tie"></i>
                      <span>From: {offer.recruiterName}</span>
                    </div>
                  )}
                  {offer.location && (
                    <div className="application-meta">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{offer.location}</span>
                    </div>
                  )}
                  {offer.jobType && (
                    <div className="application-meta">
                      <i className="fas fa-briefcase"></i>
                      <span>{offer.jobType}</span>
                    </div>
                  )}
                  
                </div>

                {offer.description && (
                  <div className="application-description">
                    <p>{offer.description.length > 200 
                      ? `${offer.description.substring(0, 200)}...` 
                      : offer.description}</p>
                  </div>
                )}

                <div className="application-actions">
                  {isPending && (
                    <>
                      <button 
                        className="btn btn-success compact" 
                        onClick={() => onAcceptOffer && onAcceptOffer(offer.id)}
                        title="Accept this job offer"
                      >
                        <i className="fas fa-check"></i> Accept
                      </button>
                      <button 
                        className="btn btn-danger compact" 
                        onClick={() => onDeclineOffer && onDeclineOffer(offer.id)}
                        title="Decline this job offer"
                      >
                        <i className="fas fa-times"></i> Decline
                      </button>
                      {offer.jobId && (
                        <button 
                          className="btn btn-secondary compact" 
                          onClick={() => onViewOffer && onViewOffer(offer.jobId)}
                          title="View job details"
                        >
                          <i className="fas fa-eye"></i> View Details
                        </button>
                      )}
                    </>
                  )}
                  {!isPending && (
                    <div className="offer-status-message">
                      {offer.status === 'Accepted' || offer.status === 'ACCEPTED' ? (
                        <span className="status-success">
                          <i className="fas fa-check-circle"></i> You have accepted this offer
                        </span>
                      ) : (
                        <span className="status-rejected">
                          <i className="fas fa-times-circle"></i> You have declined this offer
                        </span>
                      )}
                    </div>
                  )}
                  
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JobOffersSection;

import React, { useState, useMemo } from 'react';
import { toast } from './ToastContainer';

const ApplicationsSection = ({ 
  applications, 
  onRefreshApplications, 
  onViewApplication, 
  onWithdrawApplication, 
  onPrepareForInterview, 
  onApplyAgain, 
  onActionStatus, 
  onViewCandidateProfile, 
  title, 
  recruiterMode 
}) => {
  // Filter and sort state
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'status', 'company'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const itemsPerPage = 10;

  // Remove console.log
  const handleViewCandidateClick = (candidateId) => {
    onViewCandidateProfile && onViewCandidateProfile(candidateId);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Applied':
      case 'PENDING':
        return 'status-applied';
      case 'Interview Scheduled':
      case 'ACCEPTED':
        return 'status-interview';
      case 'Not Selected':
      case 'DENIED':
        return 'status-rejected';
      default:
        return 'status-applied';
    }
  };

  const getProgressWidth = (status) => {
    switch (status) {
      case 'Applied':
      case 'PENDING':
        return '25%';
      case 'Interview Scheduled':
      case 'ACCEPTED':
        return '60%';
      case 'Not Selected':
      case 'DENIED':
        return '100%';
      default:
        return '25%';
    }
  };

  const getProgressText = (status) => {
    switch (status) {
      case 'Applied':
      case 'PENDING':
        return 'Application Review';
      case 'Interview Scheduled':
      case 'ACCEPTED':
        return 'Interview Process';
      case 'Not Selected':
      case 'DENIED':
        return 'Process Complete';
      default:
        return 'Application Review';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied':
      case 'PENDING':
        return 'fas fa-paper-plane';
      case 'Interview Scheduled':
      case 'ACCEPTED':
        return 'fas fa-comments';
      case 'Not Selected':
      case 'DENIED':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-paper-plane';
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      // If it's already a formatted string, return it
      if (typeof dateString === 'string' && dateString.includes(',')) {
        return dateString;
      }
      
      // Try to parse as date
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

  // Filter and sort applications
  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => {
        const status = (app.status || '').toUpperCase();
        if (statusFilter === 'pending') {
          return status === 'APPLIED' || status === 'PENDING';
        }
        if (statusFilter === 'accepted') {
          return status === 'INTERVIEW SCHEDULED' || status === 'ACCEPTED';
        }
        if (statusFilter === 'rejected') {
          return status === 'NOT SELECTED' || status === 'DENIED';
        }
        return true;
      });
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          // Try to parse dates for comparison
          const aDate = a.date ? new Date(a.date).getTime() : 0;
          const bDate = b.date ? new Date(b.date).getTime() : 0;
          return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
        case 'status':
          aValue = (a.status || '').toLowerCase();
          bValue = (b.status || '').toLowerCase();
          break;
        case 'company':
          aValue = (a.company || '').toLowerCase();
          bValue = (b.company || '').toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filtered;
  }, [applications, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedApplications.length / itemsPerPage);
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedApplications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedApplications, currentPage]);

  // Reset to page 1 when filter/sort changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sortBy, sortOrder]);

  const handleAction = (action, appId) => {
    switch (action) {
      case 'view':
        onViewApplication(appId);
        break;
      case 'accept':
        onActionStatus && onActionStatus(appId, 'ACCEPTED');
        break;
      case 'deny':
        onActionStatus && onActionStatus(appId, 'DENIED');
        break;
      case 'withdraw':
        onWithdrawApplication(appId);
        break;
      default:
        break;
    }
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  return (
    <div className="section-card applications-section">
      <div className="section-header">
        <h3 className="section-title">{title || 'My Job Applications'}</h3>
      </div>

      <div className="applications-list" id="applicationsList">
        {applications.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-briefcase"></i>
            <p>No job applications yet. Start applying to jobs to see them here!</p>
          </div>
        ) : filteredAndSortedApplications.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-filter"></i>
            <p>No applications match the selected filter.</p>
            <button 
              className="btn btn-secondary" 
              onClick={() => setStatusFilter('all')}
            >
              Clear Filter
            </button>
          </div>
        ) : (
          <>
            {paginatedApplications.map((application, index) => (
              <div key={application.id || index} className="application-item">
                <div className="application-header">
                  {recruiterMode ? (
                    <h4 
                      className="application-title candidate-name-clickable"
                      onClick={() => handleViewCandidateClick(application.candidateId)}
                      title="Click to view candidate profile"
                    >
                      {application.title}
                    </h4>
                  ) : (
                    <h4 className="application-title">{application.title}</h4>
                  )}
                  <span className="application-company">{application.company}</span>
                </div>
                {/* Status moved to actions row on the right */}

                {/* Notes/Feedback Section */}
                {application.notes && (
                  <div className="application-notes">
                    <div className="notes-header">
                      <i className="fas fa-sticky-note"></i>
                      <strong>Recruiter Notes:</strong>
                    </div>
                    <div className="notes-content">
                      {application.notes}
                    </div>
                  </div>
                )}

                {application.feedback && (
                  <div className="application-feedback">
                    <div className="feedback-header">
                      <i className="fas fa-comment-alt"></i>
                      <strong>Feedback:</strong>
                    </div>
                    <div className="feedback-content">
                      {application.feedback}
                    </div>
                  </div>
                )}

                <div className="application-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!recruiterMode && (
                    <button 
                      className="btn btn-success compact" 
                      onClick={() => handleAction('view', application.id)}
                    >
                      <i className="fas fa-eye"></i> View Details
                    </button>
                  )}
                  {!recruiterMode && (application.status === 'Applied' || application.status === 'PENDING') && (
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleAction('withdraw', application.id)}
                    >
                      <i className="fas fa-times"></i> Withdraw
                    </button>
                  )}
                  {recruiterMode && (
                    <>
                      {(() => {
                        const status = (application.status || '').toUpperCase();
                        const activeAction = status === 'ACCEPTED' ? 'accept' : status === 'DENIED' ? 'deny' : null;
                        const acceptClass = `btn ${activeAction === 'accept' ? 'btn-primary' : 'btn-ghost'}`;
                        const denyClass = `btn ${activeAction === 'deny' ? 'btn-primary' : 'btn-ghost'}`;
                        return (
                          <>
                            <button 
                              className={acceptClass}
                              onClick={() => handleAction('accept', application.id)}
                            >
                              <i className="fas fa-check"></i> Accept
                            </button>
                            <button 
                              className={denyClass}
                              onClick={() => handleAction('deny', application.id)}
                            >
                              <i className="fas fa-times"></i> Deny
                            </button>
                          </>
                        );
                      })()}
                    </>
                  )}
                  <div className={`application-status ${getStatusClass(application.status)}`} style={{ marginLeft: 'auto' }}>
                    <i className={getStatusIcon(application.status)}></i>
                    {application.status}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i> Previous
                </button>
                <span className="pagination-info">Page {currentPage} of {totalPages}</span>
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationsSection;

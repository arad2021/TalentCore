import React, { useState, useEffect, useRef } from 'react';
import RecruiterHeader from './RecruiterHeader';
import RecruiterProfileCard from './RecruiterProfileCard';
import JobsManagementSection from './JobsManagementSection';
// Personal info section removed
import CreateJobPage from './CreateJobPage';
import EditJobPage from './EditJobPage';
import JobPortal from './JobPortal';
import { recruiterAPI } from '../services/apiService';
import '../index.css';
import '../recruiter.css';

const RecruiterPortal = ({ onLogout, onOpenJobs, onGoToHome, onCreateJob, recruiterId }) => {
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    company: '',
    jobs: []
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentRecruiterId, setCurrentRecruiterId] = useState(null);
  const isLoadingRef = useRef(false);

  // State for profile picture
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [hasProfilePicture, setHasProfilePicture] = useState(false);

  // Auto-save functionality
  const [autoSaveStatus, setAutoSaveStatus] = useState('');

  // State for create job page
  const [showCreateJobPage, setShowCreateJobPage] = useState(() => {
    // Check if user was on create job page before refresh
    return localStorage.getItem('isOnCreateJobPage') === 'true';
  });

  // State for edit job page
  const [showEditJobPage, setShowEditJobPage] = useState(() => {
    // Check if user was on edit job page before refresh
    return localStorage.getItem('isOnEditJobPage') === 'true';
  });
  const [editingJobId, setEditingJobId] = useState(() => {
    return localStorage.getItem('editingJobId') || null;
  });

  // State for job portal page
  const [showJobPortal, setShowJobPortal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Handle browser back/forward button
  useEffect(() => {
    const handlePopState = (event) => {
      // If we have state data from history, restore the sub-page state
      if (event.state && event.state.subPage) {
        if (event.state.subPage === 'editJob' && event.state.editingJobId) {
          setShowEditJobPage(true);
          setEditingJobId(event.state.editingJobId);
          localStorage.setItem('isOnEditJobPage', 'true');
          localStorage.setItem('editingJobId', event.state.editingJobId);
        } else if (event.state.subPage === 'jobPortal' && event.state.selectedJob) {
          setShowJobPortal(true);
          setSelectedJob(event.state.selectedJob);
          localStorage.setItem('isOnJobPortal', 'true');
          localStorage.setItem('selectedJobId', event.state.selectedJob.id);
        } else if (event.state.subPage === 'createJob') {
          setShowCreateJobPage(true);
          localStorage.setItem('isOnCreateJobPage', 'true');
        }
      } else {
        // If we're on a sub-page and going back, close it
        if (showEditJobPage) {
          setShowEditJobPage(false);
          setEditingJobId(null);
          localStorage.removeItem('isOnEditJobPage');
          localStorage.removeItem('editingJobId');
        } else if (showJobPortal) {
          setShowJobPortal(false);
          setSelectedJob(null);
          localStorage.removeItem('isOnJobPortal');
          localStorage.removeItem('selectedJobId');
        } else if (showCreateJobPage) {
          setShowCreateJobPage(false);
          localStorage.removeItem('isOnCreateJobPage');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Prevent multiple simultaneous loads
    if (isLoadingRef.current) {
      console.log('Already loading, skipping duplicate load request');
      return;
    }

    // Load recruiter data from database
    const loadRecruiterData = async () => {
      try {
        isLoadingRef.current = true;
        setIsLoading(true);
        setError(null);

        // Get recruiter ID from props or localStorage
        console.log('RecruiterPortal - recruiterId prop:', recruiterId);
        console.log('RecruiterPortal - localStorage recruiterId:', localStorage.getItem('recruiterId'));
        console.log('RecruiterPortal - localStorage userId:', localStorage.getItem('userId'));
        
        const savedRecruiterId = recruiterId || localStorage.getItem('recruiterId') || localStorage.getItem('userId');
        if (!savedRecruiterId) {
          // If no recruiter ID found, show error
          console.log('No recruiter ID found');
          setError('No recruiter ID found. Please log in again.');
          setIsLoading(false);
          return;
        }

        // Only load data if we haven't loaded it for this recruiter ID yet
        if (currentRecruiterId === savedRecruiterId && profileData.name && profileData.name.trim() !== '') {
          console.log('Data already loaded for this recruiter ID, skipping reload');
          setIsLoading(false);
          return;
        }

        // Additional protection: check if we're already loading the same data
        if (currentRecruiterId === savedRecruiterId) {
          console.log('Already loading data for this recruiter ID, skipping duplicate request');
          return;
        }

        console.log('Loading data for recruiter ID:', savedRecruiterId);
        setCurrentRecruiterId(savedRecruiterId);

        // Load recruiter details
        const detailsResult = await recruiterAPI.getDetails(savedRecruiterId);
        if (!detailsResult.success) {
          throw new Error(detailsResult.message || 'Failed to load recruiter details');
        }

        const recruiterData = detailsResult.data;
        if (!recruiterData) {
          throw new Error('Recruiter data not found');
        }

        // Load recruiter jobs
        const jobsResult = await recruiterAPI.getMyJobs(savedRecruiterId);
        let jobs = [];
        if (jobsResult.success && jobsResult.data) {
          // Load applications count for each job
          const jobsWithApplications = await Promise.all(
            jobsResult.data.map(async (job) => {
              let applicationsCount = 0;
              try {
                const applicationsResult = await recruiterAPI.getJobApplications(job.jobId);
                if (applicationsResult.success && Array.isArray(applicationsResult.data)) {
                  applicationsCount = applicationsResult.data.length;
                }
              } catch (error) {
                console.error(`Error loading applications for job ${job.jobId}:`, error);
              }
              
              return {
                id: job.jobId,
                title: job.title,
                company: job.company,
                description: job.description,
                status: job.status,
                applications: applicationsCount,
                technicalSkills: job.technicalSkills || '',
                // Include ticket data for JobPortal
                ticket: job.ticket ? {
                  city: job.ticket.city || '',
                  experience: job.ticket.experience || '',
                  remote: job.ticket.remote || '',
                  jobType: job.ticket.jobType || '',
                  field: job.ticket.field || '',
                  degree: job.ticket.degree || ''
                } : null
              };
            })
          );
          jobs = jobsWithApplications;
        }

        // Update profile data with real database data
        setProfileData(prev => ({
          ...prev,
          name: recruiterData.fullName || `${recruiterData.firstName || ''} ${recruiterData.lastName || ''}`.trim(),
          title: recruiterData.company || '',
          email: recruiterData.email || '',
          phone: recruiterData.phoneNumber || '',
          company: recruiterData.company || '',
          jobs: jobs
        }));

        // Load profile picture
        await loadProfilePicture(savedRecruiterId);

        // Restore JobPortal state after jobs are ready
        try {
          const wasOnJobPortal = localStorage.getItem('isOnJobPortal') === 'true';
          const savedJobId = localStorage.getItem('selectedJobId');
          if (wasOnJobPortal && savedJobId) {
            const jobIdNum = parseInt(savedJobId);
            const jobToOpen = jobs.find(j => j.id === jobIdNum);
            if (jobToOpen) {
              setSelectedJob(jobToOpen);
              setShowJobPortal(true);
            }
          }
        } catch (e) {
          console.warn('Error restoring JobPortal state:', e);
        }

      } catch (error) {
        console.error('Failed to load recruiter data:', error);
        setError(error.message);
        // Reset loading state on error
        isLoadingRef.current = false;
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    };

    loadRecruiterData();
  }, [recruiterId]); // Remove currentRecruiterId from dependencies to prevent infinite loop

  // Clean up create job page state when component unmounts
  useEffect(() => {
    return () => {
      // Only clean up if we're actually leaving the portal
      if (!showCreateJobPage) {
        localStorage.removeItem('isOnCreateJobPage');
      }
      if (!showEditJobPage) {
        localStorage.removeItem('isOnEditJobPage');
        localStorage.removeItem('editingJobId');
      }
    };
  }, []); // Remove dependencies to prevent unnecessary re-runs

  // Auto-save function (disabled for now - will implement when backend supports updates)
  const autoSave = () => {
    // TODO: Implement database save when backend supports recruiter updates
    setAutoSaveStatus('saved');
    setTimeout(() => setAutoSaveStatus(''), 2000);
  };

  // Debounced auto-save (disabled for now)
  // useEffect(() => {
  //   const timeoutId = setTimeout(autoSave, 2000);
  //   return () => clearTimeout(timeoutId);
  // }, [profileData]);

  // Event handlers
  const handleRefreshProfile = async () => {
    console.log('Refreshing profile...');
    setAutoSaveStatus('saving');
    
    try {
      if (!recruiterId) {
        throw new Error('No recruiter ID available');
      }

      // Reload recruiter details
      const detailsResult = await recruiterAPI.getDetails(recruiterId);
      if (!detailsResult.success) {
        throw new Error(detailsResult.message || 'Failed to load recruiter details');
      }

      const recruiterData = detailsResult.data;
      if (!recruiterData) {
        throw new Error('Recruiter data not found');
      }

      // Reload recruiter jobs with applications count
      const jobsResult = await recruiterAPI.getMyJobs(recruiterId);
      let jobs = [];
      if (jobsResult.success && jobsResult.data) {
        // Load applications count for each job
        const jobsWithApplications = await Promise.all(
          jobsResult.data.map(async (job) => {
            let applicationsCount = 0;
            try {
              const applicationsResult = await recruiterAPI.getJobApplications(job.jobId);
              if (applicationsResult.success && Array.isArray(applicationsResult.data)) {
                applicationsCount = applicationsResult.data.length;
              }
            } catch (error) {
              console.error(`Error loading applications for job ${job.jobId}:`, error);
            }
            
            return {
              id: job.jobId,
              title: job.title,
              company: job.company,
              description: job.description,
              status: job.status,
              applications: applicationsCount,
              technicalSkills: job.technicalSkills || '',
              // Include ticket data for JobPortal
              ticket: job.ticket ? {
                city: job.ticket.city || '',
                experience: job.ticket.experience || '',
                remote: job.ticket.remote || '',
                jobType: job.ticket.jobType || '',
                field: job.ticket.field || '',
                degree: job.ticket.degree || ''
              } : null
            };
          })
        );
        jobs = jobsWithApplications;
      }

      // Update profile data
      setProfileData(prev => ({
        ...prev,
        name: recruiterData.fullName || `${recruiterData.firstName || ''} ${recruiterData.lastName || ''}`.trim(),
        title: recruiterData.company || '',
        email: recruiterData.email || '',
        phone: recruiterData.phoneNumber || '',
        company: recruiterData.company || '',
        jobs: jobs
      }));

      // Reload profile picture
      await loadProfilePicture(recruiterId);

      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      setError(error.message);
      setAutoSaveStatus('');
    }
  };


  const handleLogout = () => {
    onLogout();
  };

  const loadProfilePicture = async (recruiterId) => {
    try {
      const result = await recruiterAPI.hasProfilePicture(recruiterId);
      if (result.success && result.hasProfilePicture) {
        const url = recruiterAPI.getProfilePictureUrl(recruiterId);
        // Add timestamp to prevent caching issues
        setProfilePictureUrl(url + '?t=' + Date.now());
        setHasProfilePicture(true);
      } else {
        setProfilePictureUrl(null);
        setHasProfilePicture(false);
      }
    } catch (error) {
      console.error('Error loading profile picture:', error);
      setProfilePictureUrl(null);
      setHasProfilePicture(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      const id = recruiterId || localStorage.getItem('recruiterId') || localStorage.getItem('userId');
      if (!id) {
        console.error('No recruiter ID available');
        setAutoSaveStatus('error');
        return;
      }

      const result = await recruiterAPI.uploadProfilePicture(id, file);
      
      if (result.success) {
        // Refresh profile picture
        await loadProfilePicture(id);
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(''), 2000);
      } else {
        console.error('Failed to upload profile picture:', result.message);
        setAutoSaveStatus('error');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setAutoSaveStatus('error');
    }
  };

  const handleAddJob = async (jobData) => {
    try {
      setAutoSaveStatus('saving');
      
      // Create job via API
      const result = await recruiterAPI.createJob(jobData);
      
      if (result.success) {
        // Refresh jobs list from server
        const jobsResult = await recruiterAPI.getMyJobs(recruiterId);
        if (jobsResult.success && jobsResult.data) {
          const jobs = jobsResult.data.map(job => ({
            id: job.jobId,
            title: job.title,
            company: job.company,
            description: job.description,
            status: job.status,
            applications: 0
          }));
          
          setProfileData(prev => ({
            ...prev,
            jobs: jobs
          }));
        }
        
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(''), 2000);
      } else {
        setError(result.message || 'Failed to create job');
        setAutoSaveStatus('');
      }
    } catch (error) {
      console.error('Failed to create job:', error);
      setError('Failed to create job');
      setAutoSaveStatus('');
    }
  };

  // Handle successful job creation from CreateJobPage
  const handleJobCreated = () => {
    setShowCreateJobPage(false);
    localStorage.removeItem('isOnCreateJobPage');
  };

  const handleEditJob = (jobId) => {
    console.log('Editing job:', jobId);
    // Set localStorage flags for persistence
    localStorage.setItem('isOnEditJobPage', 'true');
    localStorage.setItem('editingJobId', jobId);
    setEditingJobId(jobId);
    setShowEditJobPage(true);
    
    // Save state to history for forward button support
    const historyState = {
      subPage: 'editJob',
      editingJobId: jobId
    };
    window.history.pushState(historyState, '', window.location.href);
  };

  const handleOpenJobPortal = (job) => {
    setSelectedJob(job);
    setShowJobPortal(true);
    // Persist state for refresh
    try {
      localStorage.setItem('isOnJobPortal', 'true');
      if (job && job.id !== undefined && job.id !== null) {
        localStorage.setItem('selectedJobId', String(job.id));
      }
    } catch (e) {}
    
    // Save state to history for forward button support
    const historyState = {
      subPage: 'jobPortal',
      selectedJob: job
    };
    window.history.pushState(historyState, '', window.location.href);
  };

  const handleCloseJobPortal = () => {
    setShowJobPortal(false);
    setSelectedJob(null);
    try {
      localStorage.removeItem('isOnJobPortal');
      localStorage.removeItem('selectedJobId');
    } catch (e) {}
  };

  const handleBackToPortal = async () => {
    setShowJobPortal(false);
    setSelectedJob(null);
    try {
      localStorage.removeItem('isOnJobPortal');
      localStorage.removeItem('selectedJobId');
    } catch (e) {}
    
    // Refresh applications count when returning to portal
    await handleRefreshProfile();
  };

  const handleDeleteJob = async (jobId) => {
    try {
      setAutoSaveStatus('saving');
      
      const result = await recruiterAPI.deleteJob(jobId);
      
      if (result.success) {
        // Refresh jobs list from server
        try {
          const jobsResult = await recruiterAPI.getMyJobs(recruiterId);
          if (jobsResult.success && jobsResult.data) {
            const jobs = jobsResult.data.map(job => ({
              id: job.jobId,
              title: job.title,
              company: job.company,
              description: job.description,
              status: job.status,
              applications: 0
            }));
            
            setProfileData(prev => ({
              ...prev,
              jobs: jobs
            }));
          }
        } catch (refreshError) {
          console.error('Error refreshing jobs after deletion:', refreshError);
          // Don't show error to user, just log it
        }
        
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(''), 2000);
      } else {
        setError(result.message || 'Failed to delete job');
        setAutoSaveStatus('');
      }
      
      // Always close pages and return to RecruiterPortal after delete attempt
      setShowEditJobPage(false);
      setShowJobPortal(false);
      setSelectedJob(null);
      setEditingJobId(null);
      
      // Clean up localStorage
      try {
        localStorage.removeItem('isOnEditJobPage');
        localStorage.removeItem('editingJobId');
        localStorage.removeItem('isOnJobPortal');
        localStorage.removeItem('selectedJobId');
      } catch (e) {}
    } catch (error) {
      console.error('Failed to delete job:', error);
      setError('Failed to delete job');
      setAutoSaveStatus('');
    }
  };

  const handleJobUpdated = async () => {
    // Store the job ID before clearing it
    const jobIdToUpdate = editingJobId;
    
    setShowEditJobPage(false);
    setEditingJobId(null);
    localStorage.removeItem('isOnEditJobPage');
    localStorage.removeItem('editingJobId');
    
    // Refresh jobs list from server
    try {
      const jobsResult = await recruiterAPI.getMyJobs(recruiterId);
      if (jobsResult.success && jobsResult.data) {
        const jobs = jobsResult.data.map(job => ({
          id: job.jobId,
          title: job.title,
          company: job.company,
          description: job.description,
          status: job.status,
          applications: 0, // Will be loaded separately if needed
          technicalSkills: job.technicalSkills || '',
          // Include ticket data for JobPortal
          ticket: job.ticket ? {
            city: job.ticket.city || '',
            experience: job.ticket.experience || '',
            remote: job.ticket.remote || '',
            jobType: job.ticket.jobType || '',
            field: job.ticket.field || '',
            degree: job.ticket.degree || ''
          } : null
        }));
        
        setProfileData(prev => ({
          ...prev,
          jobs: jobs
        }));

        // Find the updated job and open JobPortal with it
        const updatedJob = jobs.find(job => job.id === parseInt(jobIdToUpdate));
        if (updatedJob) {
          setSelectedJob(updatedJob);
          setShowJobPortal(true);
        }
      }
    } catch (error) {
      console.error('Failed to refresh jobs after update:', error);
    }
  };

  const handleToggleJobStatus = (jobId) => {
    setProfileData(prev => ({
      ...prev,
      jobs: prev.jobs.map(job => 
        job.id === jobId 
          ? { ...job, status: job.status === 'Active' ? 'Closed' : 'Active' }
          : job
      )
    }));
    
    setAutoSaveStatus('saved');
    setTimeout(() => setAutoSaveStatus(''), 2000);
  };

  const handleViewCandidates = (jobTitle) => {
    console.log('Viewing candidates for:', jobTitle);
    alert(`View candidates functionality for: ${jobTitle}`);
  };

  const handleSavePersonalInfo = async (updatedInfo) => {
    try {
      setAutoSaveStatus('saving');
      const id = recruiterId || localStorage.getItem('recruiterId') || localStorage.getItem('userId');
      if (!id) throw new Error('No recruiter ID available');

      // Map from card fields to backend DTO
      const parts = (updatedInfo.name || '').trim().split(' ').filter(Boolean);
      const payload = {
        firstName: parts.length > 1 ? parts.slice(0, -1).join(' ') : (parts[0] || ''),
        lastName: parts.length > 1 ? parts.slice(-1)[0] : '',
        email: updatedInfo.email || '',
        phoneNumber: updatedInfo.phone || '',
        company: updatedInfo.title || updatedInfo.company || ''
      };

      const resp = await recruiterAPI.updatePersonalInfo(id, payload);
      if (!resp.success) throw new Error(resp.message || 'Update failed');

      setProfileData(prev => ({
        ...prev,
        ...updatedInfo
      }));
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    } catch (e) {
      console.error('Failed to save recruiter personal info:', e);
      setAutoSaveStatus('');
    }
  };


  // Create job page handlers
  const handleCreateJob = () => {
    console.log('handleCreateJob called');
    // Use the new function from App.js that updates URL
    if (onCreateJob) {
      onCreateJob();
    } else {
      // Fallback to old behavior
      localStorage.setItem('isOnCreateJobPage', 'true');
      setShowCreateJobPage(true);
      console.log('showCreateJobPage set to true');
    }
  };

  const handleBackFromCreateJob = () => {
    setShowCreateJobPage(false);
    localStorage.removeItem('isOnCreateJobPage');
  };

  const handleBackFromEditJob = () => {
    setShowEditJobPage(false);
    setEditingJobId(null);
    localStorage.removeItem('isOnEditJobPage');
    localStorage.removeItem('editingJobId');
  };

  // Show create job page
  if (showCreateJobPage) {
    // Ensure we have a valid recruiterId
    const validRecruiterId = recruiterId || localStorage.getItem('recruiterId') || localStorage.getItem('userId');
    
    return (
      <CreateJobPage
        onBack={handleBackFromCreateJob}
        onJobCreated={handleJobCreated}
        recruiterId={validRecruiterId}
      />
    );
  }

  // Show edit job page
  if (showEditJobPage) {
    return (
      <EditJobPage
        onBack={handleBackFromEditJob}
        onJobUpdated={handleJobUpdated}
        recruiterId={recruiterId}
        jobId={editingJobId}
        onDeleteJob={handleDeleteJob}
      />
    );
  }

  // Show job portal page
  if (showJobPortal) {
    return (
      <JobPortal
        job={selectedJob}
        onClose={handleCloseJobPortal}
        recruiterId={recruiterId}
        onEditJob={handleEditJob}
        onBackToPortal={handleBackToPortal}
        onDeleteJob={handleDeleteJob}
      />
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading recruiter data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => onGoToHome()}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recruiter-portal">
      <RecruiterHeader 
        onRefreshProfile={handleRefreshProfile}
        onLogout={handleLogout}
        onOpenJobs={onOpenJobs}
        onGoToHome={onGoToHome}
        recruiterName={profileData.name}
      />

      <div className="container">
        <RecruiterProfileCard 
          profileData={profileData}
          onAvatarUpload={handleAvatarUpload}
          onRefreshProfile={handleRefreshProfile}
          onSavePersonalInfo={handleSavePersonalInfo}
          profilePictureUrl={profilePictureUrl}
        />

        <div className="main-content" id="main-content">
          <JobsManagementSection 
            jobs={profileData.jobs}
            onAddJob={handleAddJob}
            onEditJob={handleEditJob}
            onToggleJobStatus={handleToggleJobStatus}
            onViewCandidates={handleViewCandidates}
            recruiterId={recruiterId}
            onCreateJob={handleCreateJob}
            onOpenJobPortal={handleOpenJobPortal}
          />

          {/* Personal info section removed per request */}
        </div>
      </div>

      {/* Auto-save Indicator */}
      {autoSaveStatus && (
        <div className={`auto-save-indicator show ${autoSaveStatus}`}>
          <i className="fas fa-save"></i>
          <span>
            {autoSaveStatus === 'saving' && 'Auto-saving...'}
            {autoSaveStatus === 'saved' && 'Changes saved'}
          </span>
        </div>
      )}
    </div>
  );
};

export default RecruiterPortal;

import React, { useState, useEffect } from 'react';
import Header from './Header';
import ProfileCard from './ProfileCard';
import ProjectsSection from './ProjectsSection';
import ApplicationsSection from './ApplicationsSection';
import JobDetailsModal from './JobDetailsModal';
import JobOffersSection from './JobOffersSection';
import PersonalInfoSection from './PersonalInfoSection';
import CandidateTicketSection from './CandidateTicketSection';
import CVUploadSection from './CVUploadSection';
import { candidateAPI, jobsAPI, recruiterAPI } from '../services/apiService';
import { parseCommaSeparated } from '../utils/stringUtils';
import { toast } from './ToastContainer';

const UserPortal = ({ onOpenJobs, onLogout, onGoToHome, userId }) => {

  // State for profile data
  const [profileData, setProfileData] = useState({
    name: '',
    title: ''
  });



  // State for projects
  const [projects, setProjects] = useState([]);

  // State for applications
  const [applications, setApplications] = useState([]);

  // State for job offers
  const [jobOffers, setJobOffers] = useState([]);

  // State for viewing job details
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Handle browser back/forward button
  useEffect(() => {
    const handlePopState = (event) => {
      // If we have state data from history, restore the modal state
      if (event.state && event.state.subPage === 'jobModal' && event.state.selectedJob) {
        setIsJobModalOpen(true);
        setSelectedJob(event.state.selectedJob);
      } else {
        // If job modal is open and going back, close it
        if (isJobModalOpen) {
          setIsJobModalOpen(false);
          setSelectedJob(null);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // State for personal info
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    facebookUrl: '',
    linkedinUrl: ''
  });

  // State for candidate ticket
  const [ticketData, setTicketData] = useState({
    location: '',
    experience: '',
    remoteWork: '',
    jobType: '',
    field: '',
    degree: ''
  });

  // State for CV
  const [currentCvFile, setCurrentCvFile] = useState('No CV file');
  const [hasCV, setHasCV] = useState(false);

  // State for profile picture
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [hasProfilePicture, setHasProfilePicture] = useState(false);

  // Auto-save indicator state
  const [autoSaveIndicator, setAutoSaveIndicator] = useState({
    show: false,
    status: 'saving' // saving, saved, error
  });

  // Auto-save function
  const showAutoSave = (status = 'saving') => {
    setAutoSaveIndicator({ show: true, status });
    setTimeout(() => {
      setAutoSaveIndicator({ show: false, status: 'saved' });
    }, 2000);
  };

  // Event handlers
  const handleRefreshProfile = () => {
    showAutoSave('saving');
    // TODO: Implement profile refresh API call
  };

  const handleOpenJobs = (withTicketData = false) => {
    if (withTicketData) {
      onOpenJobs(ticketData);
    } else {
      onOpenJobs(null); // No ticket data for regular job list
    }
  };

  const handleLogout = () => {
    onLogout();
  };



  const handleCvStatusChange = (hasCVStatus) => {
    setHasCV(hasCVStatus);
    if (hasCVStatus) {
      setCurrentCvFile('CV uploaded');
    } else {
      setCurrentCvFile('No CV file');
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      const id = userId || localStorage.getItem('userId');
      if (!id) {
        toast.error('No user ID available');
        showAutoSave('error');
        return;
      }

      const result = await candidateAPI.uploadProfilePicture(id, file);
      
      if (result.success) {
        // Refresh profile picture
        await loadProfilePicture(id);
        showAutoSave('saved');
        toast.success('Profile picture uploaded successfully');
      } else {
        toast.error(result.message || 'Failed to upload profile picture');
        showAutoSave('error');
      }
    } catch (error) {
      toast.error('Error uploading profile picture');
      showAutoSave('error');
    }
  };

  const loadProfilePicture = async (candidateId) => {
    try {
      const result = await candidateAPI.hasProfilePicture(candidateId);
      if (result.success && result.hasProfilePicture) {
        const url = candidateAPI.getProfilePictureUrl(candidateId);
        // Add timestamp to prevent caching issues
        setProfilePictureUrl(url + '?t=' + Date.now());
        setHasProfilePicture(true);
      } else {
        setProfilePictureUrl(null);
        setHasProfilePicture(false);
      }
    } catch (error) {
      setProfilePictureUrl(null);
      setHasProfilePicture(false);
    }
  };



  const handleAddProject = async (project) => {
    try {
      const id = userId || localStorage.getItem('userId');
      if (!id) return;

      // Convert technical skills array to comma-separated string for API
      const technicalSkillsString = project.technicalSkills ? project.technicalSkills.join(', ') : '';
      
      const result = await candidateAPI.addGitHubProject(id, project.projectName, project.githubLink, technicalSkillsString);
      if (result.success) {
        setProjects(prev => [...prev, project]);
        showAutoSave('saved');
      } else {
        toast.error(result.message || 'Failed to add project');
        showAutoSave('error');
      }
    } catch (error) {
      toast.error('Error adding project');
      showAutoSave('error');
    }
  };

  const handleEditProject = async (oldProjectName, updatedProject) => {
    try {
      const id = userId || localStorage.getItem('userId');
      if (!id) return;

      // Convert technical skills array to comma-separated string for API
      const technicalSkillsString = updatedProject.technicalSkills ? updatedProject.technicalSkills.join(', ') : '';
      
      const result = await candidateAPI.updateProject(id, oldProjectName, updatedProject.projectName, updatedProject.githubLink, technicalSkillsString);
      if (result.success) {
        setProjects(prev => prev.map(project => 
          project.projectName === oldProjectName ? updatedProject : project
        ));
        showAutoSave('saved');
      } else {
        toast.error(result.message || 'Failed to update project');
        showAutoSave('error');
      }
    } catch (error) {
      toast.error('Error updating project');
      showAutoSave('error');
    }
  };

  const handleDeleteProject = async (projectName) => {
    try {
      const id = userId || localStorage.getItem('userId');
      if (!id) return;

      const result = await candidateAPI.deleteProject(id, projectName);
      if (result.success) {
        setProjects(prev => prev.filter(project => project.projectName !== projectName));
        showAutoSave('saved');
      } else {
        toast.error(result.message || 'Failed to delete project');
        showAutoSave('error');
      }
    } catch (error) {
      toast.error('Error deleting project');
      showAutoSave('error');
    }
  };

  const handleRefreshApplications = async () => {
    try {
      const id = userId || localStorage.getItem('userId');
      if (!id) return;
      // Fetch applications for the candidate
      const result = await candidateAPI.getMyApplications(id);

      // In parallel, try to fetch all jobs to enrich with title/company
      let jobIdToInfo = {};
      try {
        const jobsResp = await jobsAPI.getAllJobs();
        if (jobsResp.success && Array.isArray(jobsResp.data)) {
          jobsResp.data.forEach(j => {
            const key = Number(j.jobId ?? j.id);
            jobIdToInfo[key] = {
              title: j.title || '',
              company: j.company || ''
            };
          });
        }
      } catch (_) { /* non-fatal - fallback to ID */ }

      if (result.success && Array.isArray(result.data)) {
        const mapped = result.data.map(a => {
          const key = Number(a.jobId);
          const info = jobIdToInfo[key] || {};
          return {
            id: a.jobApplicationId || a.id,
            jobId: a.jobId,
            title: info.title || `Job #${a.jobId}`,
            company: info.company || '',
            status: a.status === 'PENDING' ? 'Applied' : a.status,
            date: a.appliedAt || a.date || a.createdAt || '',
            notes: a.notes || null,
            feedback: a.feedback || null
          };
        });
        setApplications(mapped);
      }
      showAutoSave('saved');
    } catch (e) {
      showAutoSave('error');
    }
  };

  const handleViewApplication = async (appId) => {
    const app = applications.find(a => a.id === appId);
    if (!app || !app.jobId) return;
    try {
      const jobsResp = await jobsAPI.getAllJobs();
      if (jobsResp.success && Array.isArray(jobsResp.data)) {
        const job = jobsResp.data.find(j => Number(j.jobId ?? j.id) === Number(app.jobId));
        if (job) {
          setSelectedJob(job);
          setIsJobModalOpen(true);
          
          // Save state to history for forward button support
          const historyState = {
            subPage: 'jobModal',
            selectedJob: job
          };
          window.history.pushState(historyState, '', window.location.href);
          return;
        }
      }
      // Fallback: open modal with minimal info so user still sees something
      const fallbackJob = {
        id: app.jobId,
        title: app.title,
        company: '',
        description: 'Details unavailable. Please refresh jobs and try again.',
        ticket: {}
      };
      setSelectedJob(fallbackJob);
      setIsJobModalOpen(true);
      
      // Save state to history for forward button support
      const historyState = {
        subPage: 'jobModal',
        selectedJob: fallbackJob
      };
      window.history.pushState(historyState, '', window.location.href);
    } catch (e) {}
  };

  const handleWithdrawApplication = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }
    
    try {
      // Call the API to withdraw the application
      const result = await candidateAPI.withdrawApplication(appId);
      
      if (result.success) {
        // Remove from local state only if API call succeeded
        setApplications(prev => prev.filter(app => app.id !== appId));
        showAutoSave('saved');
        toast.success('Application withdrawn successfully');
      } else {
        toast.error(result.message || 'Failed to withdraw application');
        showAutoSave('error');
      }
    } catch (error) {
      toast.error('Error withdrawing application');
      showAutoSave('error');
    }
  };

  const handlePrepareForInterview = (appId) => {
    // TODO: Implement interview preparation feature
    toast.info('Interview preparation feature coming soon');
  };

  const handleApplyAgain = (appId) => {
    // TODO: Implement apply again feature
    toast.info('Apply again feature coming soon');
  };

  // Job Offers handlers
  const handleRefreshOffers = async () => {
    try {
      const id = userId || localStorage.getItem('userId');
      if (!id) return;
      
      const result = await candidateAPI.getJobOffers(id);
      if (result.success && Array.isArray(result.data)) {
        // Enrich job offers with job and recruiter details
        const enrichedOffers = await Promise.all(
          result.data.map(async (offer) => {
            // Get job details
            let jobTitle = `Job #${offer.jobId}`;
            let jobCompany = '';
            let jobDescription = '';
            let jobLocation = '';
            let recruiterName = 'Recruiter';
            
            let jobTypeDisplay = 'Not specified';
            try {
              // Fetch all jobs to find the job details
              const jobsResp = await jobsAPI.getAllJobs();
              if (jobsResp.success && Array.isArray(jobsResp.data)) {
                const job = jobsResp.data.find(j => Number(j.jobId ?? j.id) === Number(offer.jobId));
                if (job) {
                  jobTitle = job.title || jobTitle;
                  jobCompany = job.company || '';
                  jobDescription = job.description || '';
                  jobLocation = job.ticket?.city || job.city || '';
                  
                  // Get job type for display
                  const jobType = job.ticket?.jobType || job.jobType || '';
                  jobTypeDisplay = Array.isArray(jobType) 
                    ? jobType.join(', ') 
                    : (typeof jobType === 'string' ? jobType.split(',').map(j => j.trim()).filter(j => j).join(', ') : 'Not specified');
                  
                  // Get recruiter details
                  if (job.recruiterId) {
                    try {
                      const recruiterResp = await recruiterAPI.getDetails(job.recruiterId);
                      if (recruiterResp.success && recruiterResp.data) {
                        const recruiter = recruiterResp.data;
                        recruiterName = recruiter.firstName && recruiter.lastName
                          ? `${recruiter.firstName} ${recruiter.lastName}`
                          : recruiter.firstName || recruiter.lastName || recruiterName;
                      }
                    } catch (e) {
                      // Ignore errors, use default name
                    }
                  }
                }
              }
            } catch (e) {
              // Ignore errors, use defaults
            }
            
            return {
              id: offer.jobOfferId,
              jobId: offer.jobId,
              title: jobTitle,
              company: jobCompany,
              description: jobDescription,
              location: jobLocation,
              recruiterName: recruiterName,
              status: offer.status === 'PENDING' ? 'Pending' : offer.status === 'ACCEPTED' ? 'Accepted' : offer.status === 'DENIED' ? 'Declined' : offer.status || 'Pending',
              offerDate: new Date().toLocaleDateString(),
              jobType: jobTypeDisplay,
              salary: 'Not specified', // JobOffer model doesn't have salary field
              requirements: '', // Can be extracted from job description if needed
              recruiterMessage: null // JobOffer model doesn't have recruiter message field
            };
          })
        );
        setJobOffers(enrichedOffers);
      }
    } catch (error) {
      console.error('Error refreshing job offers:', error);
      toast.error('Failed to load job offers');
    }
  };

  const handleAcceptOffer = async (offerId) => {
    if (!window.confirm('Are you sure you want to accept this job offer?')) {
      return;
    }
    
    try {
      const result = await candidateAPI.updateJobOfferStatus(offerId, 'ACCEPTED');
      if (result.success) {
        setJobOffers(prev => prev.map(offer => 
          offer.id === offerId ? { ...offer, status: 'Accepted' } : offer
        ));
        showAutoSave('saved');
        toast.success('Job offer accepted successfully');
      } else {
        toast.error(result.message || 'Failed to accept job offer');
        showAutoSave('error');
      }
    } catch (error) {
      console.error('Error accepting job offer:', error);
      toast.error('Error accepting job offer');
      showAutoSave('error');
    }
  };

  const handleDeclineOffer = async (offerId) => {
    if (!window.confirm('Are you sure you want to decline this job offer?')) {
      return;
    }
    
    try {
      const result = await candidateAPI.updateJobOfferStatus(offerId, 'DENIED');
      if (result.success) {
        setJobOffers(prev => prev.map(offer => 
          offer.id === offerId ? { ...offer, status: 'Declined' } : offer
        ));
        showAutoSave('saved');
        toast.success('Job offer declined');
      } else {
        toast.error(result.message || 'Failed to decline job offer');
        showAutoSave('error');
      }
    } catch (error) {
      console.error('Error declining job offer:', error);
      toast.error('Error declining job offer');
      showAutoSave('error');
    }
  };

  const handleViewOffer = async (jobId) => {
    if (!jobId) return;
    try {
      const jobsResp = await jobsAPI.getAllJobs();
      if (jobsResp.success && Array.isArray(jobsResp.data)) {
        const job = jobsResp.data.find(j => Number(j.jobId ?? j.id) === Number(jobId));
        if (job) {
          setSelectedJob(job);
          setIsJobModalOpen(true);
          
          // Save state to history for forward button support
          const historyState = {
            subPage: 'jobModal',
            selectedJob: job
          };
          window.history.pushState(historyState, '', window.location.href);
          return;
        }
      }
      toast.error('Job details not found');
    } catch (e) {
      toast.error('Error loading job details');
    }
  };

  const handleSavePersonalInfo = async (data) => {
    try {
      const id = userId || localStorage.getItem('userId');
      if (!id) {
        toast.error('No user ID available');
        showAutoSave('error');
        return;
      }

      // Prepare data for API call
      const personalInfoData = {
        firstName: data.fullName.split(' ')[0] || '',
        lastName: data.fullName.split(' ').slice(1).join(' ') || '',
        phoneNumber: data.phone,
        email: data.email,
        facebookUrl: data.facebookUrl || '',
        linkedinUrl: data.linkedinUrl || ''
      };
      
      const result = await candidateAPI.updatePersonalInfo(id, personalInfoData);
      
      if (result.success) {
        setPersonalInfo(data);
        showAutoSave('saved');
      } else {
        toast.error(result.message || 'Failed to update personal info');
        showAutoSave('error');
      }
    } catch (error) {
      toast.error('Error updating personal info');
      showAutoSave('error');
    }
  };

  const handleSaveTicket = async (data) => {
    if (!userId) {
      toast.error('No user ID available');
      showAutoSave('error');
      return;
    }

    try {
      // Convert frontend data format to backend format
      const ticketData = {
        city: data.city,
        experience: "",
        remote: data.remoteWork,
        jobType: data.jobType,
        field: "",
        degree: data.degree
      };

      const result = await candidateAPI.updateTicket(userId, ticketData);
      
      if (result.success) {
        setTicketData(data);
        // Update profile title with new field
        setProfileData(prev => ({
          ...prev,
          title: data.field || 'Software Developer'
        }));
        showAutoSave('saved');
      } else {
        toast.error(result.message || 'Failed to update job preferences');
        showAutoSave('error');
      }
    } catch (error) {
      toast.error('Error updating job preferences');
      showAutoSave('error');
    }
  };


  // Load candidate data when userId changes
  useEffect(() => {
    if (userId) {
      loadCandidateData(userId);
      loadProfilePicture(userId);
      // Also load applications list for this candidate
      handleRefreshApplications();
      // Load job offers for this candidate
      handleRefreshOffers();
    }
  }, [userId]);

  // Load candidate data from backend
  const loadCandidateData = async (candidateId) => {
    try {
      const result = await candidateAPI.getDetails(candidateId);
      if (result.success && result.data) {
        const candidate = result.data;
        
        // Update profile data
        const newTitle = candidate.ticket?.field || 'Software Developer';
        setProfileData(prev => ({
          ...prev,
          name: candidate.firstName + ' ' + candidate.lastName,
          title: newTitle // Use field from ticket, then default
        }));

        // Update personal info
        setPersonalInfo({
          fullName: candidate.firstName + ' ' + candidate.lastName,
          email: candidate.email,
          phone: candidate.phoneNumber,
          city: candidate.ticket?.city || '',
          facebookUrl: candidate.facebookUrl || '',
          linkedinUrl: candidate.linkedinUrl || ''
        });

        // Update ticket data
        if (candidate.ticket) {
          // Use utility function to parse comma-separated strings
          setTicketData({
            city: parseCommaSeparated(candidate.ticket.city),
            experience: candidate.ticket.experience || 'No Experience',
            remoteWork: parseCommaSeparated(candidate.ticket.remote),
            jobType: parseCommaSeparated(candidate.ticket.jobType),
            field: parseCommaSeparated(candidate.ticket.field),
            degree: candidate.ticket.degree || ''
          });
        }

        // Update other data if available
        if (candidate.projects && candidate.projects.getAllGitHubProjects) {
          const githubProjects = candidate.projects.getAllGitHubProjects();
          const projectsArray = Object.entries(githubProjects).map(([projectName, githubLink]) => ({
            projectName,
            githubLink
          }));
          setProjects(projectsArray);
        } else if (candidate.projects && Array.isArray(candidate.projects)) {
          // Handle direct array of projects with new fields (backend uses "resources" for technologies)
          const projectsArray = candidate.projects.map(project => ({
            projectName: project.projectName,
            githubLink: project.githubLink,
            technicalSkills: parseCommaSeparated(project.resources)
          }));
          setProjects(projectsArray);
        }

      }
    } catch (error) {
      toast.error('Failed to load candidate data');
    }
  };


  return (
    <div className="user-portal">
      <Header 
        onRefreshProfile={handleRefreshProfile}
        onOpenJobs={handleOpenJobs}
        onLogout={handleLogout}
        onGoToHome={onGoToHome}
      />
      
      <div className="container">

        <div className="main-content" id="main-content">
          <ProfileCard 
            profileName={profileData.name}
            profileTitle={profileData.title}
            onAvatarUpload={handleAvatarUpload}
            profilePictureUrl={profilePictureUrl}
            facebookUrl={personalInfo.facebookUrl}
            linkedinUrl={personalInfo.linkedinUrl}
          />

          <div className="info-sections-row">
            <PersonalInfoSection 
              fullName={personalInfo.fullName}
              email={personalInfo.email}
              phone={personalInfo.phone}
              facebookUrl={personalInfo.facebookUrl}
              linkedinUrl={personalInfo.linkedinUrl}
              onSavePersonalInfo={handleSavePersonalInfo}
            />

            <CandidateTicketSection 
              ticketData={ticketData}
              onSaveTicket={handleSaveTicket}
            />
          </div>

          <div className="info-sections-row">
            <CVUploadSection 
              candidateId={userId}
              onCvStatusChange={handleCvStatusChange}
            />

            <ProjectsSection 
              projects={projects}
              onAddProject={handleAddProject}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
            />
          </div>

          <div className="info-sections-row">
            <ApplicationsSection 
              applications={applications}
              onViewApplication={handleViewApplication}
              onWithdrawApplication={handleWithdrawApplication}
              onPrepareForInterview={handlePrepareForInterview}
              onApplyAgain={handleApplyAgain}
            />

            <JobOffersSection 
              jobOffers={jobOffers}
              onAcceptOffer={handleAcceptOffer}
              onDeclineOffer={handleDeclineOffer}
              onViewOffer={handleViewOffer}
            />
          </div>

          {isJobModalOpen && selectedJob && (
            <JobDetailsModal 
              job={selectedJob}
              onClose={() => { setIsJobModalOpen(false); setSelectedJob(null); }}
            />
          )}
        </div>
      </div>

    </div>
  );
};

export default UserPortal;




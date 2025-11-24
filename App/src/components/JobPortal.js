import React, { useState, useEffect } from 'react';
import { recruiterAPI, candidateAPI } from '../services/apiService';
import RecruiterJobOffersSection from './RecruiterJobOffersSection';
import ApplicationsSection from './ApplicationsSection';
import CandidateProfileView from './CandidateProfileView';
import { toast } from './ToastContainer';
import '../index.css';
import '../recruiter.css';

const JobPortal = ({ job, onClose, recruiterId, onEditJob, onBackToPortal, onDeleteJob }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [jobData, setJobData] = useState({
    title: job?.title || '',
    description: job?.description || '',
    company: job?.company || '',
    status: job?.status || 'Active',
    applications: job?.applications || 0,
    technicalSkills: job?.technicalSkills || '',
    ticket: {
      city: job?.ticket?.city || job?.city || '',
      experience: job?.ticket?.experience || job?.experience || '',
      remote: job?.ticket?.remote || job?.remote || 'On-Site',
      jobType: job?.ticket?.jobType || job?.jobType ? (
        typeof (job?.ticket?.jobType || job?.jobType) === 'string' 
          ? (job?.ticket?.jobType || job?.jobType).split(',').map(j => j.trim()).filter(j => j)
          : (job?.ticket?.jobType || job?.jobType)
      ) : [],
      field: job?.ticket?.field || job?.field ? (
        typeof (job?.ticket?.field || job?.field) === 'string' 
          ? (job?.ticket?.field || job?.field).split(',').map(f => f.trim()).filter(f => f)
          : (job?.ticket?.field || job?.field)
      ) : [],
      degree: job?.ticket?.degree || ''
    }
  });

  const [errors, setErrors] = useState({});
  const [applications, setApplications] = useState([]);
  const [jobOffers, setJobOffers] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [geminiCandidates, setGeminiCandidates] = useState([]);

  // Israeli cities list for job portal
  const israeliCities = [
    'Tel Aviv-Yafo',
    'Jerusalem',
    'Haifa',
    'Rishon LeZion',
    'Petah Tikva',
    'Ashdod',
    'Netanya',
    'Beer Sheva',
    'Holon',
    'Ramat Gan',
    'Ashkelon',
    'Rehovot',
    'Herzliya',
    'Kfar Saba',
    'Bat Yam',
    'Ramat HaSharon',
    'Lod',
    'Ness Ziona',
    'Eilat',
    'Nahariya',
    'Acre',
    'Tiberias',
    'Nazareth',
    'Umm al-Fahm',
    'Rahat',
    'Sderot',
    'Dimona',
    'Kiryat Gat',
    'Kiryat Shmona',
    'Ma\'alot-Tarshiha',
    'Ofakim',
    'Arad',
    'Karmiel',
    'Tayibe',
    'Kiryat Bialik',
    'Kiryat Motzkin',
    'Kiryat Yam',
    'Kiryat Ata',
    'Kiryat Tivon',
    'Yokneam Illit',
    'Migdal HaEmek',
    'Nesher',
    'Tirat Carmel',
    'Yokneam',
    'Ma\'ale Adumim',
    'Ma\'alot',
    'Kiryat Malakhi',
    'Kiryat Ono',
    'Givatayim',
    'Rosh HaAyin',
    'Modi\'in',
    'Yavne',
    'Or Yehuda',
    'Kfar Yona',
    'Tira',
    'Kafr Qasim',
    'Qalansawe',
    'Ar\'ara',
    'Kafr Manda',
    'Kafr Kanna',
    'Iksal',
    'Baqa al-Gharbiyye',
    'Jisr az-Zarqa',
    'Fureidis',
    'Mazkeret Batya',
    'Gedera',
    'Ra\'anana',
    'Hod HaSharon',
    'Even Yehuda',
    'Tzur Yigal',
    'Kadima-Zoran',
    'Tel Mond',
    'Kfar Hess',
    'Beit Dagan',
    'Gan Yavne',
    'Kfar Menahem',
    'Kfar Bilu',
    'Kfar Malal'
  ];

  const experienceLevels = [
    'No Experience', '1-2 years', '2-3 years', '4-5 years', '6+ years'
  ];

  const fields = [
    'Software Development', 'Data Science', 'Cybersecurity', 'DevOps', 'UI/UX Design',
    'Product Management', 'Marketing', 'Sales', 'Finance', 'Human Resources',
    'Operations', 'Customer Success', 'Business Development', 'Content Creation',
    'Graphic Design', 'Digital Marketing', 'Project Management', 'Quality Assurance',
    'System Administration', 'Network Engineering', 'Mobile Development', 'Web Development',
    'Game Development', 'Artificial Intelligence', 'Machine Learning', 'Cloud Computing',
    'Database Administration', 'Technical Writing', 'Research & Development', 'Consulting'
  ];

  useEffect(() => {
    if (job) {
      setJobData({
        title: job.title || '',
        description: job.description || '',
        company: job.company || '',
        status: job.status || 'Active',
        applications: job.applications || 0,
        technicalSkills: job.technicalSkills || '',
        ticket: {
          city: job.ticket?.city || job.city || '',
          experience: job.ticket?.experience || job.experience || '',
          remote: job.ticket?.remote || job.remote || 'On-Site',
          jobType: job.ticket?.jobType || job.jobType ? (
            typeof (job.ticket?.jobType || job.jobType) === 'string' 
              ? (job.ticket?.jobType || job.jobType).split(',').map(j => j.trim()).filter(j => j)
              : (job.ticket?.jobType || job.jobType)
          ) : [],
          field: job.ticket?.field || job.field ? (
            typeof (job.ticket?.field || job.field) === 'string' 
              ? (job.ticket?.field || job.field).split(',').map(f => f.trim()).filter(f => f)
              : (job.ticket?.field || job.field)
          ) : [],
          degree: job.ticket?.degree || ''
        }
      });
      
      // Load saved candidates when job changes
      if (job && job.id) {
        try {
          const storageKey = `geminiCandidates_${job.id}`;
          const savedCandidates = localStorage.getItem(storageKey);
          if (savedCandidates && savedCandidates.trim() !== '') {
            try {
              const parsedCandidates = JSON.parse(savedCandidates);
              if (Array.isArray(parsedCandidates)) {
                // Even if array is empty, set it to maintain state
                setGeminiCandidates(parsedCandidates);
                if (parsedCandidates.length > 0) {
                  console.log('✓ Loaded candidates from localStorage for job:', job.id, 'Count:', parsedCandidates.length);
                }
              } else {
                console.warn('Saved candidates is not an array, clearing localStorage');
                localStorage.removeItem(storageKey);
                setGeminiCandidates([]);
              }
            } catch (parseError) {
              console.error('Failed to parse saved candidates:', parseError, 'Data:', savedCandidates.substring(0, 100));
              localStorage.removeItem(storageKey);
              setGeminiCandidates([]);
            }
          } else {
            // No saved candidates, ensure state is empty
            setGeminiCandidates([]);
          }
        } catch (e) {
          console.error('Failed to load candidates from localStorage:', e);
          setGeminiCandidates([]);
        }
      } else {
        // No job or job.id, clear candidates
        setGeminiCandidates([]);
      }
    }
  }, [job]);

  const handleEditJob = () => {
    if (onEditJob) {
      onEditJob(job.id);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setIsLoading(true);
      const newStatus = jobData.status === 'Active' ? 'Closed' : 'Active';
      
      const result = await recruiterAPI.toggleJobStatus(job.id, newStatus);
      
      if (result.success) {
        setJobData(prev => ({ ...prev, status: newStatus }));
        toast.success(`Job ${newStatus.toLowerCase()} successfully!`);
      } else {
        toast.error(result.message || 'Failed to update job status');
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('An error occurred while updating job status');
    } finally {
      setIsLoading(false);
    }
  };

  const renderOverviewTab = () => (
    <div className="job-portal-overview">
      <div className="job-header-section">
        <div className="job-title-section">
          <h1 className="job-main-title">{jobData.title}</h1>
          <p className="job-company-name">{jobData.company}</p>
          <div className="job-status-badge">
            <span className={`status-indicator ${jobData.status.toLowerCase()}`}>
              {jobData.status}
            </span>
          </div>
        </div>
        <div className="job-actions">
          <button 
            className="action-btn primary"
            onClick={handleEditJob}
          >
            <i className="fas fa-edit"></i>
            Edit Job
          </button>
          <button 
            className={`action-btn ${jobData.status === 'Active' ? 'danger' : 'success'}`}
            onClick={handleToggleStatus}
            disabled={isLoading}
          >
            <i className={`fas fa-${jobData.status === 'Active' ? 'pause' : 'play'}`}></i>
            {jobData.status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      <div className="job-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-tag"></i>
          </div>
          <div className="stat-content">
            <h3>
              {jobData.ticket.field ? (
                typeof jobData.ticket.field === 'string' ? (
                  jobData.ticket.field.split(',').map(f => f.trim()).filter(f => f).length > 0 ? (
                    <ul className="field-list" style={{margin: 0, paddingLeft: 20, listStyle: 'disc'}}>
                      {jobData.ticket.field.split(',').map(f => f.trim()).filter(f => f).map((field, index) => (
                        <li key={index}>{field}</li>
                      ))}
                    </ul>
                  ) : 'Not specified'
                ) : (
                  jobData.ticket.field.length > 0 ? (
                    <ul className="field-list" style={{margin: 0, paddingLeft: 20, listStyle: 'disc'}}>
                      {jobData.ticket.field.map((field, index) => (
                        <li key={index}>{field}</li>
                      ))}
                    </ul>
                  ) : 'Not specified'
                )
              ) : 'Not specified'}
            </h3>
            <p>Field</p>
          </div>
        </div>
      </div>

      <div className="job-details-section">
        <div className="detail-group">
          <h3>Job Description</h3>
          <div className="description-content">
            {jobData.description}
          </div>
        </div>

        <div className="detail-group">
          <h3>Requirements</h3>
          <div className="requirements-grid">
            <div className="requirement-item">
              <i className="fas fa-graduation-cap"></i>
              <span>Experience: {jobData.ticket.experience}</span>
            </div>
            <div className="requirement-item">
              <i className="fas fa-home"></i>
              <span>Remote: {jobData.ticket.remote}</span>
            </div>
            <div className="requirement-item">
              <i className="fas fa-clock"></i>
              <span>Type: {Array.isArray(jobData.ticket.jobType) 
                ? jobData.ticket.jobType.join(', ') 
                : (typeof jobData.ticket.jobType === 'string' 
                  ? jobData.ticket.jobType.split(',').map(j => j.trim()).filter(j => j).join(', ')
                  : jobData.ticket.jobType || 'Not specified')}
              </span>
            </div>
            <div className="requirement-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>City: {jobData.ticket.city}</span>
            </div>
            <div className="requirement-item">
              <i className="fas fa-certificate"></i>
              <span>Degree: {jobData.ticket.degree || 'Not specified'}</span>
            </div>
            
          </div>
        </div>

        {jobData.technicalSkills && jobData.technicalSkills.length > 0 && (
          <div className="detail-group">
            <h3>Required Technical Skills</h3>
            <div className="technical-skills-display">
              {(typeof jobData.technicalSkills === 'string' 
                ? jobData.technicalSkills.split(', ').filter(skill => skill.trim() !== '')
                : jobData.technicalSkills
              ).map((skill, index) => (
                <div key={index} className="technical-skill-item">
                  <i className="fas fa-check-circle"></i>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const handleRefreshApplications = async () => {
    if (!job?.id) return;
    try {
      const result = await recruiterAPI.getJobApplications(job.id);
      if (result.success && Array.isArray(result.data)) {
        // First map raw applications and keep candidateId
        const rawApplications = result.data.map(a => ({
          id: a.jobApplicationId || a.applicationId || a.id || Math.random().toString(36).slice(2),
          candidateId: a.candidateId,
          status: a.status === 'PENDING' ? 'Applied' : a.status,
          date: a.appliedAt || a.date || ''
        }));

        // Fetch candidate details to show candidate name and field
        const uniqueCandidateIds = Array.from(new Set(rawApplications.map(a => a.candidateId).filter(Boolean)));
        const detailsResponses = await Promise.all(uniqueCandidateIds.map(id => candidateAPI.getDetails(id)));
        const candidateInfoById = {};
        uniqueCandidateIds.forEach((id, idx) => {
          const resp = detailsResponses[idx];
          if (resp && resp.success && resp.data) {
            const data = resp.data;
            const fullName = (data.firstName && data.lastName) ? `${data.firstName} ${data.lastName}` : (data.fullName || `Candidate ${id}`);
            candidateInfoById[id] = {
              fullName,
              title: (data.ticket && data.ticket.field) || ''
            };
          }
        });

        const mapped = rawApplications.map(a => ({
          id: a.id,
          candidateId: a.candidateId,
          title: candidateInfoById[a.candidateId]?.fullName || `Candidate ${a.candidateId || ''}`.trim(),
          company: candidateInfoById[a.candidateId]?.title || jobData.ticket.field || '',
          status: a.status,
          date: a.date
        }));

        setApplications(mapped);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleRecruiterActionStatus = async (applicationId, status) => {
    try {
      const result = await recruiterAPI.updateApplicationStatus(applicationId, status);
      if (result.success) {
        setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: status === 'PENDING' ? 'Applied' : status } : a));
      }
    } catch (e) {}
  };

  const handleViewApplication = () => {};

  const handleViewCandidateProfile = (candidateId) => {
    console.log('handleViewCandidateProfile called with candidateId:', candidateId);
    setSelectedCandidateId(candidateId);
  };

  const handleCloseCandidateProfile = () => {
    setSelectedCandidateId(null);
  };
  const handleWithdrawApplication = () => {};
  const handlePrepareForInterview = () => {};
  const handleApplyAgain = () => {};

  const handleSkipCandidate = (candidateId) => {
    // Remove candidate from geminiCandidates list (convert both IDs to numbers for comparison)
    const candidateIdNum = Number(candidateId);
    setGeminiCandidates(prev => {
      const updated = prev.filter(item => {
        const itemCandidateId = Number(item.candidate?.id);
        return itemCandidateId !== candidateIdNum;
      });
      // Update localStorage
      if (job?.id) {
        try {
          const jsonString = JSON.stringify(updated);
          localStorage.setItem(`geminiCandidates_${job.id}`, jsonString);
          console.log('Updated candidates in localStorage after skipping. Remaining:', updated.length);
        } catch (e) {
          console.warn('Failed to update candidates in localStorage:', e);
        }
      }
      return updated;
    });
    toast.success('Candidate skipped');
  };

  const handleSendJobOffer = async (candidateId) => {
    if (!job?.id) {
      toast.error('Job ID is missing');
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await recruiterAPI.createJobOffer(job.id, candidateId);
      
      if (result.success) {
        toast.success('Job offer sent successfully!');
        // Remove candidate from geminiCandidates list (convert both IDs to numbers for comparison)
        const candidateIdNum = Number(candidateId);
        setGeminiCandidates(prev => {
          const updated = prev.filter(item => {
            const itemCandidateId = Number(item.candidate?.id);
            return itemCandidateId !== candidateIdNum;
          });
          // Update localStorage
          if (job?.id) {
            try {
              const jsonString = JSON.stringify(updated);
              localStorage.setItem(`geminiCandidates_${job.id}`, jsonString);
              console.log('Updated candidates in localStorage after sending offer. Remaining:', updated.length);
            } catch (e) {
              console.warn('Failed to update candidates in localStorage:', e);
            }
          }
          return updated;
        });
        // Refresh job offers list
        await handleRefreshOffers();
      } else {
        toast.error(result.message || 'Failed to send job offer');
      }
    } catch (error) {
      console.error('Error sending job offer:', error);
      toast.error('Error sending job offer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshOffers = async () => {
    if (!job?.id) return;
    try {
      const result = await recruiterAPI.getJobOffersByJobId(job.id);
      if (result.success && Array.isArray(result.data)) {
        // Fetch job details and candidate details to enrich the offers
        const enrichedOffers = await Promise.all(
          result.data.map(async (offer) => {
            // Get candidate details
            let candidateName = `Candidate ${offer.candidateId}`;
            try {
              const candidateResp = await candidateAPI.getDetails(offer.candidateId);
              if (candidateResp.success && candidateResp.data) {
                const candidate = candidateResp.data;
                candidateName = candidate.firstName && candidate.lastName 
                  ? `${candidate.firstName} ${candidate.lastName}` 
                  : candidate.firstName || candidate.lastName || candidateName;
              }
            } catch (e) {
              // Ignore errors, use default name
            }
            
            return {
              id: offer.jobOfferId,
              jobId: offer.jobId,
              candidateId: offer.candidateId,
              candidateName: candidateName,
              status: offer.status || 'Pending',
              title: jobData.title,
              company: jobData.company,
              description: jobData.description
            };
          })
        );
        setJobOffers(enrichedOffers);
      }
    } catch (error) {
      console.error('Error refreshing job offers:', error);
    }
  };

  const handleViewOffer = () => {
    // TODO: Implement view offer details
  };

  const handleEditOffer = () => {
    // TODO: Implement edit offer
  };

  const handleDeleteOffer = async (offerId) => {
    if (!window.confirm('Are you sure you want to delete this job offer?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await recruiterAPI.deleteJobOffer(offerId);
      
      if (result.success) {
        // Remove from local state
        setJobOffers(prev => prev.filter(o => o.id !== offerId));
        toast.success('Job offer deleted successfully');
      } else {
        toast.error(result.message || 'Failed to delete job offer');
      }
    } catch (error) {
      console.error('Error deleting job offer:', error);
      toast.error('Error deleting job offer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindCandidates = async () => {
    if (!job?.id) {
      alert('Missing job id');
      return;
    }
    try {
      setIsLoading(true);
      const resp = await recruiterAPI.getCandidatesForJob(job.id);
      console.log('Response from getCandidatesForJob:', resp);
      if (resp && resp.success) {
        if (resp.data && Array.isArray(resp.data) && resp.data.length > 0) {
          // Get list of candidate IDs who already have job offers
          const candidateIdsWithOffers = new Set(
            jobOffers.map(offer => Number(offer.candidateId))
          );
          
          // Parse the response - it's an array of [Candidate, JSON string]
          const allCandidatesData = resp.data.map(item => {
            const candidate = item[0];
            let scoreData = {};
            try {
              // Try to parse the JSON string from Gemini
              const jsonString = typeof item[1] === 'string' ? item[1] : JSON.stringify(item[1]);
              scoreData = JSON.parse(jsonString);
            } catch (e) {
              // If parsing fails, use the raw string as summary
              scoreData = {
                compatibility_score: 0,
                summary: typeof item[1] === 'string' ? item[1] : 'Analysis unavailable'
              };
            }
            return {
              candidate,
              score: scoreData.compatibility_score || 0,
              summary: scoreData.summary || 'No summary available',
              matchedSkills: scoreData.matched_skills || [],
              missingSkills: scoreData.missing_skills || []
            };
          });
          
          // Filter out candidates who already have job offers
          const candidatesData = allCandidatesData.filter(item => {
            const candidateId = Number(item.candidate?.id);
            return !candidateIdsWithOffers.has(candidateId);
          });
          
          // Check if all candidates were filtered out (already have offers)
          if (candidatesData.length === 0 && allCandidatesData.length > 0) {
            setGeminiCandidates([]);
            toast.info('All matching candidates already have job offers. No new candidates available at this time.', 8000);
            // Clear localStorage since there are no new candidates
            try {
              localStorage.removeItem(`geminiCandidates_${job.id}`);
            } catch (e) {
              console.warn('Failed to clear candidates from localStorage:', e);
            }
          } else {
            setGeminiCandidates(candidatesData);
            // Save to localStorage with job ID as key
            try {
              const jsonString = JSON.stringify(candidatesData);
              localStorage.setItem(`geminiCandidates_${job.id}`, jsonString);
              console.log('Saved candidates to localStorage for job:', job.id, 'Count:', candidatesData.length, '(Filtered from', allCandidatesData.length, 'total candidates)');
            } catch (e) {
              console.warn('Failed to save candidates to localStorage:', e);
            }
          }
        } else {
          // No candidates found
          setGeminiCandidates([]);
          toast.info('No matching candidates found for this job', 8000);
        }
      } else {
        toast.error(resp?.message || 'Failed to fetch candidates');
      }
    } catch (e) {
      console.error('Error fetching candidates:', e);
      toast.error('Error fetching candidates: ' + (e.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (job?.id) {
      handleRefreshApplications();
      handleRefreshOffers();
    }
  }, [job?.id]);

  // Filter out candidates who already have job offers whenever jobOffers changes
  useEffect(() => {
    if (jobOffers.length > 0 && geminiCandidates.length > 0) {
      const candidateIdsWithOffers = new Set(
        jobOffers.map(offer => Number(offer.candidateId))
      );
      
      const filteredCandidates = geminiCandidates.filter(item => {
        const candidateId = Number(item.candidate?.id);
        return !candidateIdsWithOffers.has(candidateId);
      });
      
      // Check if any candidates were filtered out
      const currentCandidateIds = new Set(
        geminiCandidates.map(item => Number(item.candidate?.id))
      );
      const filteredCandidateIds = new Set(
        filteredCandidates.map(item => Number(item.candidate?.id))
      );
      
      // Only update if the filtered list is different from current
      const hasChanges = currentCandidateIds.size !== filteredCandidateIds.size ||
        Array.from(currentCandidateIds).some(id => !filteredCandidateIds.has(id));
      
      if (hasChanges) {
        setGeminiCandidates(filteredCandidates);
        // Update localStorage
        if (job?.id) {
          try {
            const jsonString = JSON.stringify(filteredCandidates);
            localStorage.setItem(`geminiCandidates_${job.id}`, jsonString);
            console.log('Filtered candidates with existing offers. Remaining:', filteredCandidates.length);
          } catch (e) {
            console.warn('Failed to update candidates in localStorage:', e);
          }
        }
      }
    }
  }, [jobOffers, geminiCandidates, job?.id]);


  if (!job) {
    return (
      <div className="job-portal-page">
        <div className="job-portal-container">
          <div className="no-job-selected">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>No Job Selected</h2>
            <p>Please select a job to view its portal</p>
            <button className="btn-primary" onClick={onClose}>
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-portal-page">
      <div className="job-portal-container">
        <div className="job-portal-header">
          <div className="portal-title">
            <h1>Job Portal</h1>
            <p>Manage and monitor your job posting</p>
          </div>
          <button className="back-to-portal-btn" onClick={onBackToPortal}>
            <i className="fas fa-home"></i>
            Back to Portal
          </button>
        </div>

        <div className="job-portal-content">
          {renderOverviewTab()}

          <div className="main-content" id="main-content">
            <RecruiterJobOffersSection 
              jobOffers={jobOffers}
              geminiCandidates={geminiCandidates}
              title={`Candidates`}
              onViewOffer={handleViewOffer}
              onEditOffer={handleEditOffer}
              onDeleteOffer={handleDeleteOffer}
              onFindCandidates={handleFindCandidates}
              onViewCandidateProfile={handleViewCandidateProfile}
              onSendJobOffer={handleSendJobOffer}
              onSkipCandidate={handleSkipCandidate}
              isLoading={isLoading}
            />
            <div className="info-sections-row">
              <div className="section-card job-offers-section">
                <div className="section-header">
                  <h3 className="section-title">
                    Job Offers
                  </h3>
                </div>
                <div className="offers-list" id="jobOffersList">
                  {jobOffers.length === 0 ? (
                    <div className="empty-state">
                      <i className="fas fa-gift"></i>
                      <p>No job offers sent yet. Start offering positions to candidates!</p>
                    </div>
                  ) : (
                    jobOffers.map((offer) => (
                      <div key={offer.id} className="offer-item">
                        <div className="offer-header">
                          <div className="offer-title-section">
                            <h4 
                              className="offer-title candidate-name-clickable"
                              onClick={() => handleViewCandidateProfile(offer.candidateId)}
                              title="Click to view candidate profile"
                            >
                              {offer.candidateName}
                            </h4>
                          </div>
                        <div className="offer-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div 
                            className={`offer-status ${(offer.status === 'PENDING' || offer.status === 'Pending') ? 'pending' : (offer.status === 'ACCEPTED' || offer.status === 'Accepted') ? 'accepted' : 'declined'}`}
                            style={{ padding: '6px 10px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                          >
                            <i className={`fas ${(offer.status === 'PENDING' || offer.status === 'Pending') ? 'fa-clock' : (offer.status === 'ACCEPTED' || offer.status === 'Accepted') ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                            {(offer.status === 'PENDING' || offer.status === 'Pending') ? 'Pending' : (offer.status === 'ACCEPTED' || offer.status === 'Accepted') ? 'Accepted' : (offer.status === 'DENIED' || offer.status === 'Declined') ? 'Declined' : offer.status}
                            </div>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteOffer(offer.id)}
                              title="Delete job offer"
                            >
                              <i className="fas fa-trash"></i> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <ApplicationsSection 
                applications={applications}
                title={`Job Applications`}
                onViewApplication={handleViewApplication}
                onViewCandidateProfile={handleViewCandidateProfile}
                onWithdrawApplication={handleWithdrawApplication}
                onPrepareForInterview={handlePrepareForInterview}
                onApplyAgain={handleApplyAgain}
                onActionStatus={handleRecruiterActionStatus}
                recruiterMode
              />
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Profile Modal */}
      {selectedCandidateId && (
        <CandidateProfileView 
          candidateId={selectedCandidateId}
          onClose={handleCloseCandidateProfile}
        />
      )}
    </div>
  );
};

export default JobPortal;

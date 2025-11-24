const API_BASE_URL = 'http://localhost:8081/api';

// Helper function to make API calls
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Candidate API
export const candidateAPI = {
  async signIn(email) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Candidate/signin/${encodeURIComponent(email)}`);
      
      if (result === 'Candidate Not Exist' || !result) {
        return { success: false, message: 'Candidate Not Exist' };
      } else {
        // If result is not an error message, it's the user ID
        const trimmedId = (result || '').trim();
        // Make sure it's actually a number (valid ID)
        if (trimmedId && !isNaN(trimmedId)) {
          return { success: true, userId: trimmedId, message: 'Sign in successful' };
        } else {
          return { success: false, message: 'Invalid response from server' };
        }
      }
    } catch (error) {
      return { success: false, message: 'Sign in failed' };
    }
  },

  async register(candidateData) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Candidate/signup`, {
        method: 'POST',
        body: JSON.stringify(candidateData),
      });
      
      if (result === 'Success') {
        return { success: true, message: 'Registration successful' };
      } else {
        return { success: false, message: result };
      }
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    }
  },

  async getDetails(userId) {
    try {
      console.log('getDetails API called with userId:', userId);
      const result = await apiCall(`${API_BASE_URL}/Candidate/details/${userId}`);
      console.log('getDetails API result:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('getDetails API error:', error);
      return { success: false, message: 'Failed to get candidate details' };
    }
  },

  async updateTicket(userId, ticketData) {
    try {
      console.log('updateTicket API called with:', { userId, ticketData });
      const result = await apiCall(`${API_BASE_URL}/Candidate/${userId}/ticket`, {
        method: 'PUT',
        body: JSON.stringify(ticketData),
      });
      
      console.log('updateTicket API result:', result);
      
      if (result === 'Ticket updated successfully') {
        return { success: true, message: 'Ticket updated successfully' };
      } else {
        return { success: false, message: result };
      }
    } catch (error) {
      console.error('updateTicket API error:', error);
      return { success: false, message: 'Failed to update ticket' };
    }
  },

  async applyToJob({ jobId, candidateId }) {
    try {
      const payload = { jobId, candidateId };
      const result = await apiCall(`${API_BASE_URL}/Candidate/apply`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (result === 'OK') {
        return { success: true };
      }
      if (result === 'ERROR') {
        return { success: false, message: 'Application already exists or failed' };
      }
      return { success: false, message: String(result) };
    } catch (error) {
      return { success: false, message: 'Failed to apply' };
    }
  },

  async getMyApplications(candidateId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Candidate/jobapplications/${candidateId}`);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: 'Failed to load applications' };
    }
  },

  async addGitHubProject(candidateId, projectName, githubLink, technicalSkills = '') {
    try {
      let url = `${API_BASE_URL}/Candidate/${candidateId}/github-projects?projectName=${encodeURIComponent(projectName)}&githubLink=${encodeURIComponent(githubLink)}`;
      
      // Add optional parameters if provided
      if (technicalSkills) {
        url += `&resources=${encodeURIComponent(technicalSkills)}`;
      }
      
      const result = await apiCall(url, {
        method: 'POST'
      });
      return { success: true, message: result };
    } catch (error) {
      return { success: false, message: 'Failed to add GitHub project' };
    }
  },

  async updateProject(candidateId, oldProjectName, newProjectName, githubLink, technicalSkills = '') {
    try {
      let url = `${API_BASE_URL}/Candidate/${candidateId}/projects/${encodeURIComponent(oldProjectName)}`;
      
      // Add optional parameters if provided
      if (newProjectName) {
        url += `?newProjectName=${encodeURIComponent(newProjectName)}`;
      }
      if (githubLink) {
        url += `${newProjectName ? '&' : '?'}githubLink=${encodeURIComponent(githubLink)}`;
      }
      if (technicalSkills) {
        url += `${(newProjectName || githubLink) ? '&' : '?'}resources=${encodeURIComponent(technicalSkills)}`;
      }
      
      const result = await apiCall(url, {
        method: 'PUT'
      });
      return { success: true, message: result };
    } catch (error) {
      return { success: false, message: 'Failed to update project' };
    }
  },

  async deleteProject(candidateId, projectName) {
    try {
      const url = `${API_BASE_URL}/Candidate/${candidateId}/projects/${encodeURIComponent(projectName)}`;
      
      const result = await apiCall(url, {
        method: 'DELETE'
      });
      return { success: true, message: result };
    } catch (error) {
      return { success: false, message: 'Failed to delete project' };
    }
  },

  async updatePersonalInfo(candidateId, personalInfoData) {
    try {
      console.log('updatePersonalInfo API called with:', { candidateId, personalInfoData });
      const result = await apiCall(`${API_BASE_URL}/Candidate/${candidateId}/personal-info`, {
        method: 'PUT',
        body: JSON.stringify(personalInfoData),
      });
      
      console.log('updatePersonalInfo API result:', result);
      
      if (result === 'Personal information updated successfully') {
        return { success: true, message: 'Personal information updated successfully' };
      } else {
        return { success: false, message: result };
      }
    } catch (error) {
      console.error('updatePersonalInfo API error:', error);
      return { success: false, message: 'Failed to update personal information' };
    }
  },

  // CV Management API calls
  async uploadCV(candidateId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await apiCall(`${API_BASE_URL}/Candidate/${candidateId}/cv/upload`, {
        method: 'POST',
        headers: {}, // Remove Content-Type header to let browser set it for FormData
        body: formData,
      });
      
      if (result === 'CV uploaded successfully') {
        return { success: true, message: 'CV uploaded successfully' };
      } else {
        return { success: false, message: result };
      }
    } catch (error) {
      console.error('uploadCV API error:', error);
      return { success: false, message: 'Failed to upload CV' };
    }
  },

  async downloadCV(candidateId) {
    try {
      const response = await fetch(`${API_BASE_URL}/Candidate/${candidateId}/cv/download`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      return { success: true, blob };
    } catch (error) {
      console.error('downloadCV API error:', error);
      return { success: false, message: 'Failed to download CV' };
    }
  },

  async viewCV(candidateId) {
    try {
      const response = await fetch(`${API_BASE_URL}/Candidate/${candidateId}/cv/view`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      return { success: true, blob };
    } catch (error) {
      console.error('viewCV API error:', error);
      return { success: false, message: 'Failed to view CV' };
    }
  },

  async deleteCV(candidateId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Candidate/${candidateId}/cv`, {
        method: 'DELETE'
      });
      
      if (result === 'CV deleted successfully') {
        return { success: true, message: 'CV deleted successfully' };
      } else {
        return { success: false, message: result };
      }
    } catch (error) {
      console.error('deleteCV API error:', error);
      return { success: false, message: 'Failed to delete CV' };
    }
  },

  async hasCV(candidateId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Candidate/${candidateId}/cv/exists`);
      return { success: true, hasCV: result };
    } catch (error) {
      console.error('hasCV API error:', error);
      return { success: false, hasCV: false };
    }
  },

  async uploadProfilePicture(candidateId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/Candidate/${candidateId}/profile-picture/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      
      if (result === 'Profile picture uploaded successfully') {
        return { success: true, message: 'Profile picture uploaded successfully' };
      } else {
        return { success: false, message: result };
      }
    } catch (error) {
      console.error('uploadProfilePicture API error:', error);
      return { success: false, message: 'Failed to upload profile picture' };
    }
  },

  getProfilePictureUrl(candidateId) {
    return `${API_BASE_URL}/Candidate/${candidateId}/profile-picture/view`;
  },

  async hasProfilePicture(candidateId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Candidate/${candidateId}/profile-picture/exists`);
      return { success: true, hasProfilePicture: result };
    } catch (error) {
      console.error('hasProfilePicture API error:', error);
      return { success: false, hasProfilePicture: false };
    }
  },

  async deleteProfilePicture(candidateId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Candidate/${candidateId}/profile-picture`, {
        method: 'DELETE'
      });
      
      if (result === 'Profile picture deleted successfully') {
        return { success: true, message: 'Profile picture deleted successfully' };
      } else {
        return { success: false, message: result };
      }
    } catch (error) {
      console.error('deleteProfilePicture API error:', error);
      return { success: false, message: 'Failed to delete profile picture' };
    }
  },

  async withdrawApplication(applicationId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Candidate/jobapplications/${applicationId}`, {
        method: 'DELETE'
      });
      
      if (result === 'OK') {
        return { success: true, message: 'Application withdrawn successfully' };
      } else {
        return { success: false, message: 'Failed to withdraw application' };
      }
    } catch (error) {
      console.error('withdrawApplication API error:', error);
      return { success: false, message: 'Failed to withdraw application' };
    }
  },

  async getJobOffers(candidateId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Candidate/joboffers/${candidateId}`);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: 'Failed to load job offers' };
    }
  },

  async updateJobOfferStatus(jobOfferId, status) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Candidate/joboffers/${jobOfferId}/status/${encodeURIComponent(status)}`, {
        method: 'PUT'
      });
      if (result === 'OK') {
        return { success: true, message: 'Job offer status updated successfully' };
      }
      return { success: false, message: result === 'ERROR' ? 'Failed to update job offer status' : result };
    } catch (error) {
      return { success: false, message: 'Failed to update job offer status' };
    }
  }
};

// Recruiter API
export const recruiterAPI = {
  async signIn(email) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/signin/${encodeURIComponent(email)}`);
      
      if (result === 'Recruiter Not Exist' || !result) {
        return { success: false, message: 'Recruiter Not Exist' };
      } else {
        // If result is not an error message, it's the user ID
        const trimmedId = (result || '').trim();
        // Make sure it's actually a number (valid ID)
        if (trimmedId && !isNaN(trimmedId)) {
          return { success: true, userId: trimmedId, message: 'Sign in successful' };
        } else {
          return { success: false, message: 'Invalid response from server' };
        }
      }
    } catch (error) {
      return { success: false, message: 'Sign in failed' };
    }
  },

  async updatePersonalInfo(recruiterId, personalInfoData) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/${recruiterId}/personal-info`, {
        method: 'PUT',
        body: JSON.stringify(personalInfoData),
      });
      if (result === 'Personal information updated successfully') {
        return { success: true };
      }
      return { success: false, message: String(result) };
    } catch (error) {
      return { success: false, message: 'Failed to update personal information' };
    }
  },

  async register(recruiterData) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/signup`, {
        method: 'POST',
        body: JSON.stringify(recruiterData),
      });
      
      if (result === 'Success') {
        return { success: true, message: 'Registration successful' };
      } else {
        return { success: false, message: result };
      }
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    }
  },

  async getDetails(userId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/Details/${userId}`);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: 'Failed to get recruiter details' };
    }
  },

  async getMyJobs(userId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/myjobs/${userId}`);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: 'Failed to get recruiter jobs' };
    }
  },

  async getJobApplications(jobId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/jobapplications/${jobId}`);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: 'Failed to get job applications' };
    }
  },

  async updateApplicationStatus(applicationId, status) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/jobapplications/${applicationId}/status/${encodeURIComponent(status)}`, {
        method: 'PUT'
      });
      if (result === 'OK') {
        return { success: true };
      }
      return { success: false, message: String(result) };
    } catch (error) {
      return { success: false, message: 'Failed to update application status' };
    }
  },

  async createJob(jobData) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/createjob`, {
        method: 'POST',
        body: JSON.stringify(jobData),
      });
      
      if (result === 'Job created successfully') {
        return { success: true, message: 'Job created successfully' };
      } else {
        return { success: false, message: result };
      }
    } catch (error) {
      return { success: false, message: 'Failed to create job' };
    }
  },

  async updateJob(jobData) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/updatejob`, {
        method: 'PUT',
        body: JSON.stringify(jobData),
      });
      
      if (result === 'Job updated successfully') {
        return { success: true, message: 'Job updated successfully' };
      } else {
        return { success: false, message: result };
      }
    } catch (error) {
      return { success: false, message: 'Failed to update job' };
    }
  },

  async deleteJob(jobId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/deletejob/${jobId}`, {
        method: 'DELETE',
      });
      
      if (result === 'Job deleted successfully' || result === 'Job and all related applications and offers deleted successfully') {
        return { success: true, message: result };
      } else {
        return { success: false, message: result };
      }
    } catch (error) {
      return { success: false, message: 'Failed to delete job' };
    }
  },

  async toggleJobStatus(jobId, newStatus) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/togglejobstatus/${jobId}/${newStatus}`, {
        method: 'PUT',
      });
      
      if (result === 'Job status updated successfully') {
        return { success: true, message: 'Job status updated successfully' };
      } else {
        return { success: false, message: result };
      }
    } catch (error) {
      return { success: false, message: 'Failed to update job status' };
    }
  },

  // Candidate Profile API calls
  async getCandidateProfile(candidateId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/candidate/${candidateId}/profile`);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: 'Failed to load candidate profile' };
    }
  },

  async getCandidateCV(candidateId) {
    try {
      const response = await fetch(`${API_BASE_URL}/Recruiter/candidate/${candidateId}/cv`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      return { success: true, blob };
    } catch (error) {
      return { success: false, message: 'Failed to load candidate CV' };
    }
  },

  async getCandidatesForJob(jobId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/gemini/getcandidates/${jobId}`);
      if (result && Array.isArray(result)) {
        return { success: true, data: result };
      } else {
        return { success: true, data: [] };
      }
    } catch (error) {
      console.error('Error getting candidates for job:', error);
      return { success: false, message: error.message || 'Failed to get candidates for job' };
    }
  },

  async uploadProfilePicture(recruiterId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/Recruiter/${recruiterId}/profile-picture/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      
      if (result === 'Profile picture uploaded successfully') {
        return { success: true, message: 'Profile picture uploaded successfully' };
      } else {
        return { success: false, message: result };
      }
    } catch (error) {
      console.error('uploadProfilePicture API error:', error);
      return { success: false, message: 'Failed to upload profile picture' };
    }
  },

  getProfilePictureUrl(recruiterId) {
    return `${API_BASE_URL}/Recruiter/${recruiterId}/profile-picture/view`;
  },

  async hasProfilePicture(recruiterId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/${recruiterId}/profile-picture/exists`);
      return { success: true, hasProfilePicture: result };
    } catch (error) {
      console.error('hasProfilePicture API error:', error);
      return { success: false, hasProfilePicture: false };
    }
  },

  async deleteProfilePicture(recruiterId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/${recruiterId}/profile-picture`, {
        method: 'DELETE',
      });
      if (result === 'Profile picture deleted successfully') {
        return { success: true, message: 'Profile picture deleted successfully' };
      }
      return { success: false, message: result };
    } catch (error) {
      console.error('deleteProfilePicture API error:', error);
      return { success: false, message: 'Failed to delete profile picture' };
    }
  },

  async createJobOffer(jobId, candidateId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/createjoboffer`, {
        method: 'POST',
        body: JSON.stringify({ jobId, candidateId }),
      });
      if (result === 'OK') {
        return { success: true, message: 'Job offer sent successfully' };
      }
      return { success: false, message: result === 'ERROR' ? 'Job offer already exists or failed' : result };
    } catch (error) {
      return { success: false, message: 'Failed to send job offer' };
    }
  },

  async getJobOffersByJobId(jobId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/joboffers/${jobId}`);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: 'Failed to load job offers' };
    }
  },

  async deleteJobOffer(jobOfferId) {
    try {
      const result = await apiCall(`${API_BASE_URL}/Recruiter/joboffers/${jobOfferId}`, {
        method: 'DELETE'
      });
      if (result === 'OK') {
        return { success: true, message: 'Job offer deleted successfully' };
      }
      return { success: false, message: result === 'ERROR' ? 'Failed to delete job offer' : result };
    } catch (error) {
      return { success: false, message: 'Failed to delete job offer' };
    }
  }
};

// Jobs API
export const jobsAPI = {
  async getAllJobs() {
    try {
      // Backend exposes this under /Recruiter/alljobs
      const result = await apiCall(`${API_BASE_URL}/Recruiter/alljobs`);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: 'Failed to load jobs' };
    }
  }
};


// Example of how to use the Candidate API for registration

import { candidateAPI, apiUtils } from '../services/apiService';

// Example 1: Register a new candidate
export const registerCandidateExample = async () => {
  const candidateData = {
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '050-1234567',
    email: 'john.doe@example.com'
  };

  try {
    const result = await candidateAPI.register(candidateData);
    
    if (result.success) {
      console.log('Registration successful:', result.message);
      
      // Save user session
      apiUtils.saveUserSession('candidate', candidateData.email);
      
      // Redirect to user portal
      window.location.href = 'user-portal.html';
    } else {
      console.error('Registration failed:', result.message);
      // Show error message to user
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
};

// Example 2: Sign in a candidate
export const signInCandidateExample = async (email) => {
  try {
    const result = await candidateAPI.signIn(email);
    
    if (result.success) {
      console.log('Sign in successful:', result.message);
      
      // Save user session
      apiUtils.saveUserSession('candidate', email);
      
      // Redirect to user portal
      window.location.href = 'user-portal.html';
    } else {
      console.error('Sign in failed:', result.message);
      // Show error message to user
    }
  } catch (error) {
    console.error('Sign in error:', error);
  }
};

// Example 3: Get candidate details
export const getCandidateDetailsExample = async (candidateId) => {
  try {
    const result = await candidateAPI.getCandidateDetails(candidateId);
    
    if (result.success) {
      console.log('Candidate details:', result.data);
      return result.data;
    } else {
      console.error('Failed to get candidate details:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Get candidate details error:', error);
    return null;
  }
};

// Example 4: Get job applications for a candidate
export const getJobApplicationsExample = async (candidateId) => {
  try {
    const result = await candidateAPI.getJobApplications(candidateId);
    
    if (result.success) {
      console.log('Job applications:', result.data);
      return result.data;
    } else {
      console.error('Failed to get job applications:', result.message);
      return [];
    }
  } catch (error) {
    console.error('Get job applications error:', error);
    return [];
  }
};

// Example 5: Remove a project from candidate
export const removeProjectExample = async (candidateId, projectName) => {
  try {
    const result = await candidateAPI.removeProject(candidateId, projectName);
    
    if (result.success) {
      console.log('Project removed successfully:', result.message);
    } else {
      console.error('Failed to remove project:', result.message);
    }
  } catch (error) {
    console.error('Remove project error:', error);
  }
};

// Example 6: Check if user is logged in and get current user
export const checkUserSessionExample = () => {
  if (apiUtils.isLoggedIn()) {
    const currentUser = apiUtils.getCurrentUser();
    console.log('Current user:', currentUser);
    return currentUser;
  } else {
    console.log('No user logged in');
    return null;
  }
};

// Example 7: Logout user
export const logoutUserExample = () => {
  apiUtils.clearUserSession();
  console.log('User logged out');
  // Redirect to home page
  window.location.href = '/';
};

// Example 8: Complete registration flow with validation
export const completeRegistrationFlow = async (formData) => {
  // Validate form data
  if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.email) {
    return { success: false, message: 'Please fill in all fields' };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return { success: false, message: 'Please enter a valid email address' };
  }

  // Register candidate
  const result = await candidateAPI.register(formData);
  
  if (result.success) {
    // Save session and redirect
    apiUtils.saveUserSession('candidate', formData.email);
    return { success: true, message: 'Registration successful', redirectTo: 'user-portal.html' };
  } else {
    return { success: false, message: result.message };
  }
};

export default {
  registerCandidateExample,
  signInCandidateExample,
  getCandidateDetailsExample,
  getJobApplicationsExample,
  removeProjectExample,
  checkUserSessionExample,
  logoutUserExample,
  completeRegistrationFlow
};

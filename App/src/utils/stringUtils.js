/**
 * Utility functions for string manipulation
 */

/**
 * Parses a comma-separated string into an array
 * Handles both string and array inputs
 * @param {string|string[]} value - The value to parse
 * @returns {string[]} - Array of trimmed, non-empty strings
 */
export const parseCommaSeparated = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(v => v && v.trim());
  if (typeof value === 'string') {
    return value.split(',').map(item => item.trim()).filter(item => item);
  }
  return [];
};

/**
 * Formats a comma-separated string from an array
 * @param {string[]} array - Array to format
 * @returns {string} - Comma-separated string
 */
export const formatCommaSeparated = (array) => {
  if (!array || !Array.isArray(array)) return '';
  return array.filter(item => item && item.trim()).join(', ');
};

/**
 * Validates if a string is a valid URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validates if a string is a valid GitHub URL
 * Checks for:
 * - Valid URL format
 * - GitHub domain (github.com or www.github.com)
 * - Valid path format (username/repo)
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid GitHub URL
 */
export const isValidGitHubUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  // Trim whitespace
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return false;

  // Check if it's a valid URL
  if (!isValidUrl(trimmedUrl)) return false;
  
  try {
    const urlObj = new URL(trimmedUrl);
    
    // Check if it's GitHub domain
    const isValidDomain = urlObj.hostname === 'github.com' || 
                         urlObj.hostname === 'www.github.com' ||
                         urlObj.hostname.endsWith('.github.com');
    
    if (!isValidDomain) return false;
    
    // Check if path follows GitHub format: /username/repo
    // Pathname should start with / and have at least one segment
    const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
    
    // GitHub URLs should have at least username/repo (2 parts)
    // Examples: /username/repo, /username/repo/tree/branch, etc.
    if (pathParts.length < 2) return false;
    
    // Check that username and repo name are valid (alphanumeric, hyphens, underscores, dots)
    const username = pathParts[0];
    const repoName = pathParts[1];
    
    const validNamePattern = /^[a-zA-Z0-9._-]+$/;
    
    if (!validNamePattern.test(username) || !validNamePattern.test(repoName)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Provides detailed validation message for GitHub URL
 * @param {string} url - URL to validate
 * @returns {string|null} - Error message or null if valid
 */
export const getGitHubUrlValidationError = (url) => {
  if (!url || typeof url !== 'string') {
    return 'GitHub URL is required';
  }
  
  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return 'GitHub URL is required';
  }
  
  // Check basic URL format
  if (!isValidUrl(trimmedUrl)) {
    return 'Please enter a valid URL (must start with http:// or https://)';
  }
  
  try {
    const urlObj = new URL(trimmedUrl);
    
    // Check domain
    const isValidDomain = urlObj.hostname === 'github.com' || 
                         urlObj.hostname === 'www.github.com' ||
                         urlObj.hostname.endsWith('.github.com');
    
    if (!isValidDomain) {
      return 'URL must be from GitHub (github.com)';
    }
    
    // Check path
    const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
    
    if (pathParts.length < 2) {
      return 'GitHub URL must include username and repository name (e.g., https://github.com/username/repo)';
    }
    
    const username = pathParts[0];
    const repoName = pathParts[1];
    
    const validNamePattern = /^[a-zA-Z0-9._-]+$/;
    
    if (!validNamePattern.test(username)) {
      return 'Username contains invalid characters. Only letters, numbers, dots, hyphens, and underscores are allowed';
    }
    
    if (!validNamePattern.test(repoName)) {
      return 'Repository name contains invalid characters. Only letters, numbers, dots, hyphens, and underscores are allowed';
    }
    
    return null; // Valid
  } catch (error) {
    return 'Invalid URL format';
  }
};

/**
 * Validates phone number (Israeli format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Israeli phone: 9-10 digits (can start with 0 or country code)
  return cleaned.length >= 9 && cleaned.length <= 12;
};

/**
 * Formats phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    // Format: 050-123-4567
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


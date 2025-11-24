import React, { useState, useEffect } from 'react';
import TestHomePage from './components/TestHomePage';
import HomePage from './components/HomePage';
import LoggedInHomePage from './components/LoggedInHomePage';
import UserPortal from './components/UserPortal';
import UserJobs from './components/UserJobs';
import PersonalizedJobs from './components/PersonalizedJobs';
import RecruiterPortal from './components/RecruiterPortal';
import RecruiterJobs from './components/RecruiterJobs';
import PublicJobs from './components/PublicJobs';
import ToastContainer from './components/ToastContainer';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';
import './homepage.css';
import './modal.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'profile', 'jobs', 'personalized-jobs'
  const [userType, setUserType] = useState('user'); // 'user' or 'recruiter'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [ticketData, setTicketData] = useState(null); // Store ticket data for job filtering
  const [isPersonalizedJobs, setIsPersonalizedJobs] = useState(false); // Track if jobs are personalized
  const [isUpdatingURL, setIsUpdatingURL] = useState(false); // Flag to prevent URL update loops
  const [isInitialized, setIsInitialized] = useState(false); // Flag to prevent multiple initializations

  // Update URL based on current state
  const updateURL = (page, userType, isLoggedIn) => {
    // Don't update if we're already updating
    if (isUpdatingURL) return;
    
    setIsUpdatingURL(true);
    
    const baseUrl = window.location.origin;
    let newUrl = baseUrl;
    
    if (page === 'home' && isLoggedIn) {
      // Friendly URLs for logged-in users
      if (userType === 'user') {
        newUrl += '/candidate';
      } else if (userType === 'recruiter') {
        newUrl += '/recruiter';
      }
    } else if (page === 'profile') {
      if (userType === 'user') {
        newUrl += '/candidate/profile';
      } else if (userType === 'recruiter') {
        newUrl += '/recruiter/profile';
      }
    } else if (page === 'jobs') {
      if (userType === 'user') {
        newUrl += '/candidate/jobs';
      } else if (userType === 'recruiter') {
        newUrl += '/recruiter/jobs';
      }
    } else if (page === 'personalized-jobs') {
      newUrl += '/candidate/personalized-jobs';
    } else if (page === 'create-job') {
      newUrl += '/recruiter/create-job';
    } else if (page === 'public-jobs') {
      newUrl += '/jobs';
    }
    
    // Only update URL if it's different to avoid infinite loops
    if (window.location.href !== newUrl) {
      // Save current state to history for forward button support
      const historyState = {
        page: currentPage,
        userType: userType,
        isLoggedIn: isLoggedIn,
        userId: userId
      };
      window.history.pushState(historyState, '', newUrl);
    }
    
    // Reset flag immediately
    setIsUpdatingURL(false);
  };

  // Parse URL path to determine page and user type
  const parseURL = () => {
    if (isUpdatingURL || !isInitialized) return; // Prevent parsing while updating URL or before initialization
    
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 'home';
    const user = urlParams.get('user');
    
    console.log('parseURL called with path:', path, 'page:', page, 'user:', user);
    
    // Parse path-based routing
    if (path.includes('/candidate')) {
      // Check if user is actually logged in before setting candidate mode
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const storedUserType = localStorage.getItem('userType');
      const storedUserId = localStorage.getItem('userId');
      
      if (loggedIn && storedUserType === 'user' && storedUserId) {
        setUserType('user');
        setIsLoggedIn(true);
        setUserId(storedUserId);
        
        if (path.includes('/candidate/profile')) {
          setCurrentPage('profile');
        } else if (path.includes('/candidate/jobs')) {
          setCurrentPage('jobs');
        } else if (path.includes('/candidate/personalized-jobs')) {
          setCurrentPage('personalized-jobs');
        } else if (path === '/candidate' || path.endsWith('/candidate')) {
          setCurrentPage('profile'); // Default to profile for candidate
        }
      } else {
        // No valid candidate authentication found, redirect to home page
        console.log('No valid candidate authentication found, redirecting to home');
        setCurrentPage('home');
        setUserType('');
        setIsLoggedIn(false);
        // Clear the URL and redirect to home
        window.history.replaceState({}, '', window.location.origin);
        return;
      }
    } else if (path.includes('/recruiter')) {
      setUserType('recruiter');
      setIsLoggedIn(true);
      
      if (path.includes('/recruiter/profile')) {
        setCurrentPage('profile');
      } else if (path.includes('/recruiter/jobs')) {
        setCurrentPage('jobs');
      } else if (path.includes('/recruiter/create-job')) {
        setCurrentPage('create-job');
      } else if (path === '/recruiter' || path.endsWith('/recruiter')) {
        setCurrentPage('profile'); // Default to profile for recruiter
      }
    } else if (path.includes('/jobs')) {
      setCurrentPage('public-jobs');
    } else {
      // Handle legacy query parameters for backward compatibility
      if (user && (user === 'user' || user === 'candidate' || user === 'recruiter')) {
        // Map URL 'candidate' to internal 'user'
        const internalUserType = user === 'candidate' ? 'user' : user;
        setUserType(internalUserType);
        setIsLoggedIn(true);
        
        // If coming from URL with recruiter, try to get recruiterId from localStorage
        if (internalUserType === 'recruiter') {
          const recruiterId = localStorage.getItem('recruiterId') || localStorage.getItem('userId');
          if (recruiterId) {
            setUserId(recruiterId);
          }
        }
      } else if (!user && isLoggedIn) {
        // If no user in URL but we're logged in, we might be going back to home
        // Keep the current login state
      }
      
      // Always update page based on URL
      if (page !== currentPage) {
        console.log('Setting page from', currentPage, 'to', page);
        setCurrentPage(page);
      }
    }
  };

  // Check if user is logged in on component mount
  useEffect(() => {
    if (isInitialized) return; // Prevent multiple initializations
    
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUserType = localStorage.getItem('userType');
    const storedUserId = localStorage.getItem('userId');
    
    console.log('App.js useEffect - localStorage data:', { loggedIn, storedUserType, storedUserId });
    console.log('App.js useEffect - current URL:', window.location.href);
    
    // Load personalized jobs data from localStorage
    const isPersonalized = localStorage.getItem('personalizedJobs') === 'true';
    const storedTicketData = localStorage.getItem('ticketData');
    
    if (isPersonalized && storedTicketData) {
      console.log('Restoring personalized jobs from localStorage');
      setTicketData(JSON.parse(storedTicketData));
      setIsPersonalizedJobs(true);
    }
    
    // Parse URL path first
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const urlPage = urlParams.get('page') || 'home';
    const urlUser = urlParams.get('user');
    
    // Handle path-based routing
    if (path.includes('/candidate') || path.includes('/recruiter') || path.includes('/jobs')) {
      // Parse path-based routing
      if (path.includes('/candidate')) {
        // Check if user is actually logged in before setting candidate mode
        if (loggedIn && storedUserType === 'user' && storedUserId) {
          setUserType('user');
          setIsLoggedIn(true);
          setUserId(storedUserId);
          
          if (path.includes('/candidate/profile')) {
            setCurrentPage('profile');
          } else if (path.includes('/candidate/jobs')) {
            setCurrentPage('jobs');
          } else if (path.includes('/candidate/personalized-jobs')) {
            setCurrentPage('personalized-jobs');
          } else {
            setCurrentPage('profile'); // Default to profile for candidate
          }
        } else {
          // No valid candidate authentication found, redirect to home page
          console.log('No valid candidate authentication found, redirecting to home');
          setCurrentPage('home');
          setUserType('');
          setIsLoggedIn(false);
          // Clear the URL and redirect to home
          window.history.replaceState({}, '', window.location.origin);
          setIsInitialized(true);
          return;
        }
      } else if (path.includes('/recruiter')) {
        setUserType('recruiter');
        setIsLoggedIn(true);
        
        const recruiterId = localStorage.getItem('recruiterId') || localStorage.getItem('userId');
        if (recruiterId) {
          setUserId(recruiterId);
        } else {
          // No recruiter authentication found, redirect to home page
          console.log('No recruiter authentication found, redirecting to home');
          setCurrentPage('home');
          setUserType('');
          setIsLoggedIn(false);
          window.history.replaceState({}, '', window.location.pathname);
          setIsInitialized(true);
          return;
        }
        
        if (path.includes('/recruiter/profile')) {
          setCurrentPage('profile');
        } else if (path.includes('/recruiter/jobs')) {
          setCurrentPage('jobs');
        } else if (path.includes('/recruiter/create-job')) {
          setCurrentPage('create-job');
        } else {
          setCurrentPage('profile'); // Default to profile for recruiter
        }
      } else if (path.includes('/jobs')) {
        setCurrentPage('public-jobs');
      }
    } else if (loggedIn && storedUserType) {
      // Handle localStorage-based authentication for non-path URLs
      setIsLoggedIn(true);
      setUserType(storedUserType);
      setUserId(storedUserId || '');
      
      // Set page based on URL or default to profile
      if (urlPage && urlPage !== 'home') {
        setCurrentPage(urlPage);
      } else {
        setCurrentPage('profile');
      }
    } else {
      // Handle URL-based authentication with query parameters (legacy)
      if (urlUser && (urlUser === 'user' || urlUser === 'candidate' || urlUser === 'recruiter')) {
        const internalUserType = urlUser === 'candidate' ? 'user' : urlUser;
        setUserType(internalUserType);
        setIsLoggedIn(true);
        
        if (internalUserType === 'recruiter') {
          const recruiterId = localStorage.getItem('recruiterId') || localStorage.getItem('userId');
          if (recruiterId) {
            setUserId(recruiterId);
            if (!localStorage.getItem('recruiterId')) {
              localStorage.setItem('recruiterId', recruiterId);
            }
          } else {
            // No recruiter authentication found, redirect to home page
            console.log('No recruiter authentication found, redirecting to home');
            setCurrentPage('home');
            setUserType('');
            setIsLoggedIn(false);
            window.history.replaceState({}, '', window.location.pathname);
            setIsInitialized(true);
            return;
          }
        }
        
        // Set page based on URL
        if (urlPage && urlPage !== 'home') {
          setCurrentPage(urlPage);
        } else {
          setCurrentPage('profile');
        }
      } else {
        // No authentication, set to home page
        setCurrentPage('home');
      }
    }
    
    setIsInitialized(true);
  }, []); // Empty dependency array - only run once on mount

  // Update URL when state changes (but avoid infinite loops)
  // DISABLED: Automatic URL updating to prevent infinite loops
  // useEffect(() => {
  //   // Only update URL after initialization and if we're not in the middle of parsing URL
  //   if (!isInitialized || isUpdatingURL) return;
  //   
  //   // Only update URL if we're not in the middle of parsing URL from browser
  //   const currentURL = new URL(window.location.href);
  //   const urlPage = currentURL.searchParams.get('page');
  //   const urlUser = currentURL.searchParams.get('user');
  //   
  //   // Don't update URL if we're just responding to URL changes
  //   if (urlPage && urlPage === currentPage && urlUser === userType) {
  //     return;
  //   }
  //   
  //   // Only update URL for specific page changes, not for every state change
  //   if (currentPage === 'profile' || currentPage === 'jobs' || currentPage === 'create-job') {
  //     updateURL(currentPage, userType, isLoggedIn);
  //   }
  // }, [currentPage, userType, isLoggedIn, isInitialized, isUpdatingURL]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event) => {
      // Only parse URL if we're initialized and not in the middle of updating
      if (isInitialized && !isUpdatingURL) {
        
        // If we have state data from history, use it
        if (event.state && event.state.page) {
          setCurrentPage(event.state.page);
          setUserType(event.state.userType || 'user');
          setIsLoggedIn(event.state.isLoggedIn || false);
          if (event.state.userId) {
            setUserId(event.state.userId);
          }
        } else {
          // Fallback to URL parsing
          setTimeout(() => {
            parseURL();
          }, 10);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isInitialized, isUpdatingURL, currentPage, userType, isLoggedIn]);

  // Handle successful login
  const handleLoginSuccess = (type, email, userId) => {
    setUserType(type);
    setIsLoggedIn(true);
    setUserId(userId || '');
    setCurrentPage('profile');
    localStorage.setItem('userType', type);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userId', userId || '');
    // Store recruiter ID separately for recruiter portal
    if (type === 'recruiter') {
      localStorage.setItem('recruiterId', userId || '');
    }
    localStorage.setItem('isLoggedIn', 'true');
    
    // Update URL after successful login
    updateURL('profile', type, true);
  };

  const handleGoToProfile = () => {
    setCurrentPage('profile');
    updateURL('profile', userType, isLoggedIn);
  };

  const handleOpenJobs = (ticketData) => {
    console.log('handleOpenJobs called with ticketData:', ticketData);
    setTicketData(ticketData);
    setIsPersonalizedJobs(!!ticketData); // true if ticketData exists, false if not
    
    // Save to localStorage for persistence across page refreshes
    if (ticketData) {
      localStorage.setItem('personalizedJobs', 'true');
      localStorage.setItem('ticketData', JSON.stringify(ticketData));
      setCurrentPage('personalized-jobs'); // Open personalized jobs page
      updateURL('personalized-jobs', userType, isLoggedIn);
    } else {
      // Clear personalized jobs data when opening regular job list
      localStorage.removeItem('personalizedJobs');
      localStorage.removeItem('ticketData');
      setCurrentPage('jobs'); // Open regular jobs page
      updateURL('jobs', userType, isLoggedIn);
    }
  };

  const handleOpenPublicJobs = () => {
    setCurrentPage('public-jobs');
    updateURL('public-jobs', userType, isLoggedIn);
  };

  const handleOpenJobsFromHome = () => {
    if (isLoggedIn) {
      // If user is logged in, open their portal's job list
      handleOpenJobs(null); // null means regular job list, not personalized
    } else {
      // If user is not logged in, open public job list
      handleOpenPublicJobs();
    }
  };

  const handleGoToHome = () => {
    setCurrentPage('home');
    if (isLoggedIn) {
      updateURL('home', userType, isLoggedIn);
    } else {
      // Clear URL parameters when going to home page for non-logged in users
      window.history.pushState({}, '', window.location.origin + window.location.pathname);
    }
  };

  const handleGoToPortal = () => {
    setCurrentPage('profile');
    updateURL('profile', userType, isLoggedIn);
  };

  const handleCreateJob = () => {
    setCurrentPage('create-job');
    updateURL('create-job', userType, isLoggedIn);
  };


  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear user session
      localStorage.removeItem('userType');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      localStorage.removeItem('recruiterId');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('personalizedJobs');
      localStorage.removeItem('ticketData');
      setIsLoggedIn(false);
      setUserId('');
      setCurrentPage('home');
      
      // Clear URL and go to home page
      window.history.pushState({}, '', window.location.origin);
      console.log('Logged out successfully');
      
      // Refresh the page to ensure clean state
      window.location.reload();
    }
  };

  const renderCurrentPage = () => {
    if (currentPage === 'home') {
      if (isLoggedIn) {
        return <LoggedInHomePage onOpenJobs={handleOpenJobsFromHome} onGoToPortal={handleGoToPortal} onLogout={handleLogout} userType={userType} />;
      } else {
        return <HomePage onLoginSuccess={handleLoginSuccess} onOpenJobs={handleOpenPublicJobs} />;
      }
    }
    
    if (currentPage === 'public-jobs') {
      return <PublicJobs onGoToHome={handleGoToHome} hideApplyButton={userType === 'recruiter'} onLoginSuccess={handleLoginSuccess} />;
    }
    
    if (userType === 'recruiter') {
      if (currentPage === 'profile') {
        return (
          <RecruiterPortal 
            onLogout={handleLogout}
            onOpenJobs={handleOpenJobs}
            onGoToHome={handleGoToHome}
            onCreateJob={handleCreateJob}
            recruiterId={userId}
          />
        );
      } else if (currentPage === 'jobs') {
        return (
          <RecruiterJobs 
            onGoToProfile={handleGoToProfile}
            onGoToHome={handleGoToHome}
            onLogout={handleLogout}
          />
        );
      } else if (currentPage === 'create-job') {
        // Import CreateJobPage component
        const CreateJobPage = require('./components/CreateJobPage').default;
        return (
          <CreateJobPage
            onBack={() => {
              localStorage.removeItem('isOnCreateJobPage');
              setCurrentPage('profile');
              updateURL('profile', userType, isLoggedIn);
            }}
            onJobCreated={() => {
              localStorage.removeItem('isOnCreateJobPage');
              setCurrentPage('profile');
              updateURL('profile', userType, isLoggedIn);
            }}
            recruiterId={userId}
          />
        );
      }
    } else {
      if (currentPage === 'profile') {
        return (
          <UserPortal 
            onOpenJobs={handleOpenJobs}
            onLogout={handleLogout}
            onGoToHome={handleGoToHome}
            userId={userId}
          />
        );
      } else if (currentPage === 'jobs') {
        return (
          <UserJobs 
            onGoToProfile={handleGoToProfile}
            onGoToHome={handleGoToHome}
            onLogout={handleLogout}
            ticketData={ticketData}
            isPersonalizedJobs={isPersonalizedJobs}
          />
        );
      } else if (currentPage === 'personalized-jobs') {
        return (
          <PersonalizedJobs 
            onGoToProfile={handleGoToProfile}
            onGoToHome={handleGoToHome}
            onLogout={handleLogout}
            onOpenJobs={handleOpenJobs}
            ticketData={ticketData}
          />
        );
      }
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <ToastContainer />
        {renderCurrentPage()}
      </div>
    </ErrorBoundary>
  );
}

export default App;


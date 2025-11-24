import React from 'react';
import HomeHeader from './HomeHeader';
import LoggedInHeroSection from './LoggedInHeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import TestimonialsSection from './TestimonialsSection';
import HomeFooter from './HomeFooter';

const LoggedInHomePage = ({ onOpenJobs, onGoToPortal, onLogout, userType }) => {
  return (
    <div className="homepage">
      {/* Skip Links for Accessibility */}
      <a href="#hero" className="skip-link">Skip to main content</a>
      <a href="#features" className="skip-link">Skip to features</a>
      <a href="#navigation" className="skip-link">Skip to navigation</a>
      
      <HomeHeader onOpenJobs={onOpenJobs} onLogout={onLogout} isLoggedIn={true} />
      <LoggedInHeroSection onGoToPortal={onGoToPortal} userType={userType} />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <HomeFooter />
    </div>
  );
};

export default LoggedInHomePage;

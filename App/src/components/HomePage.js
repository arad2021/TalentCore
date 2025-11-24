import React from 'react';
import HomeHeader from './HomeHeader';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';
import HomeFooter from './HomeFooter';

const HomePage = ({ onLoginSuccess, onOpenJobs }) => {
  return (
    <div className="homepage">
      {/* Skip Links for Accessibility */}
      <a href="#hero" className="skip-link">Skip to main content</a>
      <a href="#features" className="skip-link">Skip to features</a>
      <a href="#navigation" className="skip-link">Skip to navigation</a>
      
      <HomeHeader onOpenJobs={onOpenJobs} />
      <HeroSection onLoginSuccess={onLoginSuccess} />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection onLoginSuccess={onLoginSuccess} />
      <HomeFooter />
    </div>
  );
};

export default HomePage;

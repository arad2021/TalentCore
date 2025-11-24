import React from 'react';

const HomeFooter = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const footerLinks = {
    jobSeekers: [
      { text: 'Find Jobs', href: 'user-portal.html' },
      { text: 'Features', href: '#features', onClick: () => scrollToSection('features') },
      { text: 'How It Works', href: '#how-it-works', onClick: () => scrollToSection('how-it-works') },
      { text: 'User Reviews', href: '#testimonials', onClick: () => scrollToSection('testimonials') }
    ],
    employers: [
      { text: 'Post Jobs', href: 'recruiter-portal.html' },
      { text: 'Recruitment Tools', href: '#features', onClick: () => scrollToSection('features') },
      { text: 'Client Reviews', href: '#testimonials', onClick: () => scrollToSection('testimonials') },
      { text: 'Contact Sales', href: '#contact', onClick: () => scrollToSection('contact') }
    ],
    support: [
      { text: 'Help Center', href: '#contact', onClick: () => scrollToSection('contact') },
      { text: 'Contact Us', href: '#contact', onClick: () => scrollToSection('contact') },
      { text: 'Privacy Policy', href: '#contact', onClick: () => scrollToSection('contact') },
      { text: 'Terms of Service', href: '#contact', onClick: () => scrollToSection('contact') }
    ]
  };

  const socialLinks = [
    { icon: 'fab fa-linkedin', href: '#', label: 'LinkedIn' },
    { icon: 'fab fa-twitter', href: '#', label: 'Twitter' },
    { icon: 'fab fa-facebook', href: '#', label: 'Facebook' },
    { icon: 'fab fa-instagram', href: '#', label: 'Instagram' }
  ];

  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <i className="fas fa-briefcase"></i>
              <span>Project Portal</span>
            </div>
            <p className="footer-description">
              Connecting talent with opportunity. Your career gateway to success.
            </p>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className="social-link" 
                  aria-label={social.label}
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">For Job Seekers</h3>
            <ul className="footer-links">
              {footerLinks.jobSeekers.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    onClick={link.onClick ? (e) => {
                      e.preventDefault();
                      link.onClick();
                    } : undefined}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">For Employers</h3>
            <ul className="footer-links">
              {footerLinks.employers.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    onClick={link.onClick ? (e) => {
                      e.preventDefault();
                      link.onClick();
                    } : undefined}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Support</h3>
            <ul className="footer-links">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    onClick={link.onClick ? (e) => {
                      e.preventDefault();
                      link.onClick();
                    } : undefined}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; 2024 Project Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;

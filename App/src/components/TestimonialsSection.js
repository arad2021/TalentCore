import React from 'react';

const TestimonialsSection = () => {

  const testimonials = [
    {
      text: "Project Portal helped me find my dream job in just two weeks! The matching system is incredible and the interface is so user-friendly.",
      author: {
        name: "Michael Chen",
        title: "Software Engineer at Google"
      }
    },
    {
      text: "As a recruiter, I've found some of the best talent through Project Portal. The quality of candidates is outstanding.",
      author: {
        name: "Sarah Williams",
        title: "HR Director at Microsoft"
      }
    },
    {
      text: "The analytics dashboard gives me great insights into my job search progress. Highly recommended!",
      author: {
        name: "David Rodriguez",
        title: "Product Manager at Amazon"
      }
    }
  ];


  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">User Reviews</h2>
          <p className="section-subtitle">What our community says about us</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">
                  *
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4 className="author-name">{testimonial.author.name}</h4>
                  <p className="author-title">{testimonial.author.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

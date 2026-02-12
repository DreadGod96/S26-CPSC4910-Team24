import React, { useState } from 'react';
import './DriverApplicationForm.css';

const DriverApplicationForm = () => {
  const [formData, setFormData] = useState({
    driverFirstName: '',
    driverLastName: '',
    driverEmail: '',
    driverPhone: '',
    applicationTitle: '',
    companyName: '',
    motivation: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.driverFirstName.trim()) {
      newErrors.driverFirstName = 'First name is required';
    }

    if (!formData.driverLastName.trim()) {
      newErrors.driverLastName = 'Last name is required';
    }

    if (!formData.driverEmail.trim()) {
      newErrors.driverEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.driverEmail)) {
      newErrors.driverEmail = 'Please enter a valid email address';
    }

    if (!formData.driverPhone.trim()) {
      newErrors.driverPhone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.driverPhone.replace(/[-\s()]/g, ''))) {
      newErrors.driverPhone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.applicationTitle.trim()) {
      newErrors.applicationTitle = 'Application title is required';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.motivation.trim()) {
      newErrors.motivation = 'Please explain why you want to join';
    } else if (formData.motivation.trim().length < 50) {
      newErrors.motivation = 'Please provide at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmitStatus({
          type: 'success',
          message: 'Application submitted successfully! A sponsor will review your application soon.'
        });
        // Reset form
        setFormData({
          driverFirstName: '',
          driverLastName: '',
          driverEmail: '',
          driverPhone: '',
          applicationTitle: '',
          companyName: '',
          motivation: ''
        });
      } else {
        const errorData = await response.json();
        setSubmitStatus({
          type: 'error',
          message: errorData.message || 'Failed to submit application. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred while submitting your application. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="driver-application-container">
      <div className="application-form-wrapper">
        <h1 className="form-title">Driver Application</h1>
        <p className="form-subtitle">
          Join our Good Driver Incentive Program and start earning points for safe driving!
        </p>

        {submitStatus && (
          <div className={`status-message ${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="application-form">
          {/* Personal Information Section */}
          <div className="form-section">
            <h2 className="section-title">Personal Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="driverFirstName">
                  First Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="driverFirstName"
                  name="driverFirstName"
                  value={formData.driverFirstName}
                  onChange={handleChange}
                  className={errors.driverFirstName ? 'error' : ''}
                  placeholder="Enter your first name"
                />
                {errors.driverFirstName && (
                  <span className="error-message">{errors.driverFirstName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="driverLastName">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="driverLastName"
                  name="driverLastName"
                  value={formData.driverLastName}
                  onChange={handleChange}
                  className={errors.driverLastName ? 'error' : ''}
                  placeholder="Enter your last name"
                />
                {errors.driverLastName && (
                  <span className="error-message">{errors.driverLastName}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="driverEmail">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="driverEmail"
                  name="driverEmail"
                  value={formData.driverEmail}
                  onChange={handleChange}
                  className={errors.driverEmail ? 'error' : ''}
                  placeholder="your.email@example.com"
                />
                {errors.driverEmail && (
                  <span className="error-message">{errors.driverEmail}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="driverPhone">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="driverPhone"
                  name="driverPhone"
                  value={formData.driverPhone}
                  onChange={handleChange}
                  className={errors.driverPhone ? 'error' : ''}
                  placeholder="(555) 123-4567"
                />
                {errors.driverPhone && (
                  <span className="error-message">{errors.driverPhone}</span>
                )}
              </div>
            </div>
          </div>

          {/* Application Details Section */}
          <div className="form-section">
            <h2 className="section-title">Application Details</h2>
            
            <div className="form-group">
              <label htmlFor="companyName">
                Company/Sponsor Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={errors.companyName ? 'error' : ''}
                placeholder="Name of the company you want to join"
              />
              {errors.companyName && (
                <span className="error-message">{errors.companyName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="applicationTitle">
                Application Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="applicationTitle"
                name="applicationTitle"
                value={formData.applicationTitle}
                onChange={handleChange}
                className={errors.applicationTitle ? 'error' : ''}
                placeholder="e.g., Experienced Long-Haul Driver"
              />
              {errors.applicationTitle && (
                <span className="error-message">{errors.applicationTitle}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="motivation">
                Why do you want to join this program? <span className="required">*</span>
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                className={errors.motivation ? 'error' : ''}
                placeholder="Tell us about your driving experience and why you want to join this incentive program (minimum 50 characters)"
                rows="5"
              />
              <span className="character-count">
                {formData.motivation.length} characters
              </span>
              {errors.motivation && (
                <span className="error-message">{errors.motivation}</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>

        <div className="form-footer">
          <p>
            <span className="required">*</span> Required fields
          </p>
          <p className="help-text">
            Need help? Contact us at support@gooddriverprogram.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverApplicationForm;
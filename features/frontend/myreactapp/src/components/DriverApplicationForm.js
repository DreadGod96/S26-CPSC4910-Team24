import React, { useState, useEffect } from 'react';
import './DriverApplicationForm.css';

const DriverApplicationForm = () => {
  const [formData, setFormData] = useState({
    driver_ID: '',
    applicationTitle: '',
    companyName: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [companies, setCompanies] = useState([]);

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

    if (!formData.driver_ID.trim()) {
      newErrors.driver_ID = 'Driver ID is required';
    }

    if (!formData.applicationTitle.trim()) {
      newErrors.applicationTitle = 'Application title is required';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
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
      const response = await fetch(process.env.REACT_APP_APPLICATION_URL || 'http://localhost:3002/api/application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driver_ID: formData.driver_ID,
          application_title: formData.applicationTitle,
          company_name: formData.companyName
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmitStatus({
          type: 'success',
          message: 'Application submitted successfully! A sponsor will review your application soon.'
        });
        // Reset form
        setFormData({
          driver_ID: '',
          applicationTitle: '',
          companyName: '',
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

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/application/companylist');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Raw response data:', data);
        
        let companyList = Array.isArray(data[0]) ? data[0] : [];
        console.log('Processed company list:', companyList);
        setCompanies(companyList);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setCompanies([]);
      }
    };

    fetchCompanies();
  }, []);

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

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="driver_ID">
                  Driver ID <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="driver_ID"
                  name="driver_ID"
                  value={formData.driver_ID}
                  onChange={handleChange}
                  className={errors.driver_ID ? 'error' : ''}
                  placeholder="Your unique driver ID"
                />
                {errors.driver_ID && (
                  <span className="error-message">{errors.driver_ID}</span>
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
              <select
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={errors.companyName ? 'error' : ''}
              >
                <option value="">-- Select a Company --</option>
                {companies && companies.length > 0 ? (
                  companies.map((company, index) => (
                    <option key={index} value={company.company_name || ''}>
                      {company.company_name || 'Unknown Company'}
                    </option>
                  ))
                ) : (
                  <option disabled>No companies available</option>
                )}
              </select>
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

import React, { useState } from 'react';
import { Log } from '../services/logger.js';

const URLForm = ({ onSubmit, loading, maxUrls = 5 }) => {
  const [urls, setUrls] = useState([{ url: '', validity: 30, shortcode: '' }]);
  const [errors, setErrors] = useState({});

  const validateUrl = (url) => {
    const urlPattern = /^https?:\/\/.+\..+/;
    return urlPattern.test(url);
  };

  const validateShortcode = (shortcode) => {
    const shortcodePattern = /^[a-zA-Z0-9]*$/;
    return shortcodePattern.test(shortcode);
  };

  const handleUrlChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);

    // Clear errors for this field
    const newErrors = { ...errors };
    delete newErrors[`${index}-${field}`];
    setErrors(newErrors);

    Log('frontend', 'info', 'component', `URL form field updated: ${field} at index ${index}`);
  };

  const addUrlField = () => {
    if (urls.length < maxUrls) {
      setUrls([...urls, { url: '', validity: 30, shortcode: '' }]);
      Log('frontend', 'info', 'component', `Added new URL field. Total: ${urls.length + 1}`);
    }
  };

  const removeUrlField = (index) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      Log('frontend', 'info', 'component', `Removed URL field at index ${index}`);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    urls.forEach((urlData, index) => {
      if (!urlData.url) {
        newErrors[`${index}-url`] = 'URL is required';
        isValid = false;
      } else if (!validateUrl(urlData.url)) {
        newErrors[`${index}-url`] = 'Please enter a valid URL';
        isValid = false;
      }

      if (urlData.validity && (isNaN(urlData.validity) || urlData.validity < 1)) {
        newErrors[`${index}-validity`] = 'Validity must be a positive number';
        isValid = false;
      }

      if (urlData.shortcode && !validateShortcode(urlData.shortcode)) {
        newErrors[`${index}-shortcode`] = 'Shortcode must be alphanumeric';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const validUrls = urls.filter(urlData => urlData.url);
      Log('frontend', 'info', 'component', `Submitting ${validUrls.length} URLs for shortening`);
      onSubmit(validUrls);
    } else {
      Log('frontend', 'warning', 'component', 'Form validation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="url-form">
      <h2>Shorten Your URLs</h2>
      <p>You can shorten up to {maxUrls} URLs at once</p>
      
      {urls.map((urlData, index) => (
        <div key={index} className="url-input-group">
          <div className="url-input-header">
            <h3>URL {index + 1}</h3>
            {urls.length > 1 && (
              <button
                type="button"
                onClick={() => removeUrlField(index)}
                className="remove-btn"
              >
                Remove
              </button>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor={`url-${index}`}>Original URL *</label>
            <input
              type="text"
              id={`url-${index}`}
              value={urlData.url}
              onChange={(e) => handleUrlChange(index, 'url', e.target.value)}
              placeholder="https://example.com/very/long/path"
              className={errors[`${index}-url`] ? 'error' : ''}
            />
            {errors[`${index}-url`] && (
              <span className="error-message">{errors[`${index}-url`]}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`validity-${index}`}>Validity (minutes)</label>
              <input
                type="number"
                id={`validity-${index}`}
                value={urlData.validity}
                onChange={(e) => handleUrlChange(index, 'validity', parseInt(e.target.value) || '')}
                min="1"
                className={errors[`${index}-validity`] ? 'error' : ''}
              />
              {errors[`${index}-validity`] && (
                <span className="error-message">{errors[`${index}-validity`]}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={`shortcode-${index}`}>Custom Shortcode (optional)</label>
              <input
                type="text"
                id={`shortcode-${index}`}
                value={urlData.shortcode}
                onChange={(e) => handleUrlChange(index, 'shortcode', e.target.value)}
                placeholder="custom123"
                className={errors[`${index}-shortcode`] ? 'error' : ''}
              />
              {errors[`${index}-shortcode`] && (
                <span className="error-message">{errors[`${index}-shortcode`]}</span>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="form-actions">
        {urls.length < maxUrls && (
          <button type="button" onClick={addUrlField} className="add-btn">
            Add Another URL
          </button>
        )}
        
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Shortening...' : 'Shorten URLs'}
        </button>
      </div>
    </form>
  );
};

export default URLForm;
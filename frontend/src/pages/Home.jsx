import React, { useState, useEffect } from 'react';
import URLForm from '../components/URLForm.jsx';
import URLResult from '../components/URLResult.jsx';
import apiService from '../services/api.js';
import { Log } from '../services/logger.js';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [sessionUrls, setSessionUrls] = useState([]);

  useEffect(() => {
    Log('frontend', 'info', 'page', 'Home page loaded');
    
    // Load session URLs from localStorage
    const savedUrls = localStorage.getItem('sessionUrls');
    if (savedUrls) {
      setSessionUrls(JSON.parse(savedUrls));
    }
  }, []);

  const handleSubmit = async (urls) => {
    setLoading(true);
    setResults([]);
    
    Log('frontend', 'info', 'page', `Processing ${urls.length} URLs for shortening`);
    
    const newResults = [];
    const newSessionUrls = [];

    for (const urlData of urls) {
      try {
        const response = await apiService.createShortUrl(urlData);
        
        const result = {
          success: true,
          data: response,
          originalUrl: urlData.url
        };
        
        newResults.push(result);
        
        // Extract shortcode from shortLink
        const shortcode = response.shortLink.split('/').pop();
        newSessionUrls.push({
          shortcode,
          originalUrl: urlData.url,
          shortLink: response.shortLink,
          expiry: response.expiry,
          createdAt: new Date().toISOString()
        });
        
        Log('frontend', 'info', 'page', `Successfully shortened URL: ${urlData.url}`);
      } catch (error) {
        const result = {
          success: false,
          error: error.response?.data?.message || error.message || 'Failed to shorten URL',
          originalUrl: urlData.url
        };
        
        newResults.push(result);
        Log('frontend', 'error', 'page', `Failed to shorten URL: ${urlData.url} - ${result.error}`);
      }
    }

    setResults(newResults);
    
    // Update session URLs
    const updatedSessionUrls = [...sessionUrls, ...newSessionUrls];
    setSessionUrls(updatedSessionUrls);
    localStorage.setItem('sessionUrls', JSON.stringify(updatedSessionUrls));
    
    setLoading(false);
    Log('frontend', 'info', 'page', `Completed processing ${urls.length} URLs`);
  };

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>URL Shortener</h1>
        <p>Transform long URLs into short, manageable links</p>
      </div>
      
      <URLForm onSubmit={handleSubmit} loading={loading} />
      <URLResult results={results} />
      
      {sessionUrls.length > 0 && (
        <div className="session-summary">
          <h2>Session Summary</h2>
          <p>You have shortened {sessionUrls.length} URLs in this session.</p>
          <p>Visit the <a href="/stats">Statistics</a> page to view detailed analytics.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
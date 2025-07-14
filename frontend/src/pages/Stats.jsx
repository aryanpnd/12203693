import React, { useState, useEffect } from 'react';
import StatsTable from '../components/StatsTable.jsx';
import apiService from '../services/api.js';
import { Log } from '../services/logger.js';

const Stats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Log('frontend', 'info', 'page', 'Stats page loaded');
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const sessionUrls = JSON.parse(localStorage.getItem('sessionUrls') || '[]');
      
      if (sessionUrls.length === 0) {
        setStats([]);
        setLoading(false);
        return;
      }
      
      Log('frontend', 'info', 'page', `Loading stats for ${sessionUrls.length} URLs`);
      
      const statsPromises = sessionUrls.map(async (url) => {
        try {
          const response = await apiService.getUrlStats(url.shortcode);
          return response;
        } catch (error) {
          Log('frontend', 'error', 'page', `Failed to load stats for ${url.shortcode}: ${error.message}`);
          return {
            shortcode: url.shortcode,
            originalUrl: url.originalUrl,
            createdAt: url.createdAt,
            expiry: url.expiry,
            clicks: 0,
            clickData: [],
            error: 'Failed to load statistics'
          };
        }
      });
      
      const statsResults = await Promise.all(statsPromises);
      setStats(statsResults);
      
      Log('frontend', 'info', 'page', `Successfully loaded stats for ${statsResults.length} URLs`);
    } catch (error) {
      setError(error.message);
      Log('frontend', 'error', 'page', `Error loading stats: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    Log('frontend', 'info', 'page', 'Refreshing statistics');
    loadStats();
  };

  const clearSession = () => {
    localStorage.removeItem('sessionUrls');
    setStats([]);
    Log('frontend', 'info', 'page', 'Session cleared');
  };

  return (
    <div className="stats-page">
      <div className="page-header">
        <h1>URL Statistics</h1>
        <p>View detailed analytics for your shortened URLs</p>
      </div>
      
      <div className="stats-actions">
        <button onClick={refreshStats} className="refresh-btn" disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Statistics'}
        </button>
        
        <button onClick={clearSession} className="clear-btn">
          Clear Session
        </button>
      </div>
      
      <StatsTable stats={stats} loading={loading} error={error} />
    </div>
  );
};

export default Stats;
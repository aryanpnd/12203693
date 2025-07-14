import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import Home from './pages/Home.jsx';
import Stats from './pages/Stats.jsx';
import { Log } from './services/logger.js';
import './styles/main.css';

function App() {
  React.useEffect(() => {
    Log('frontend', 'info', 'page', 'Application started');
  }, []);

  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
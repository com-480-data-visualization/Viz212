import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SwipeGame from './pages/SwipeGame';
import ProfileGenerator from './pages/ProfileGenerator';
import { UserJourneyProvider } from './context/UserJourneyContext';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <UserJourneyProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/swipe-game" element={<SwipeGame />} />
            <Route path="/profile-generator" element={<ProfileGenerator />} />
          </Routes>
        </Layout>
      </UserJourneyProvider>
    </Router>
  );
}

export default App;

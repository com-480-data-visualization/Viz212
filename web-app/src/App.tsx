import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SwipeGame from './pages/SwipeGame';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/swipe-game" element={<SwipeGame />} />
      </Routes>
    </Router>
  );
}

export default App;

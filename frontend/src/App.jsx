import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import { Settings, WashingMachine } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="container fade-in">
        <nav className="glass-panel" style={{ display: 'inline-flex', padding: '0.5rem', marginBottom: '2rem', position: 'relative', left: '50%', transform: 'translateX(-50%)', marginTop: '1rem' }}>
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <WashingMachine size={20} />
            Simulator
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Settings size={20} />
            Admin Config
          </NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<UserPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

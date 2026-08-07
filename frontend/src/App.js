import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddContact from './components/AddContact';
import ContactList from './components/ContactList';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';

// FIX: Dashboard is now extracted OUTSIDE of the App component
const Dashboard = ({ handleLogout }) => {
  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '50px' }}>
      <nav className="navbar navbar-expand-lg shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', padding: '15px 0' }}>
        <div className="container">
          <span className="navbar-brand fw-bold text-white d-flex align-items-center" style={{ letterSpacing: '1px' }}>
            <span className="me-2" style={{ fontSize: '1.5rem' }} role="img" aria-label="shield">🛡️</span>{' '}Secure Contact Manager
          </span>

          <div className="d-flex align-items-center">
            <span className="text-white-50 me-4 small fw-medium d-none d-md-block" style={{ letterSpacing: '0.5px' }}>
              ● Authenticated Session
            </span>

            <Link
              to="/profile"
              className="btn btn-sm btn-outline-light me-3 fw-bold rounded-pill px-3 d-flex align-items-center"
              style={{ transition: 'all 0.3s ease', textDecoration: 'none' }}
            >
              <span className="me-1" role="img" aria-label="user profile">👤</span>{' '}My Profile
            </Link>

            <button
              type="button"
              className="btn btn-sm fw-bold text-white shadow d-flex align-items-center"
              onClick={handleLogout}
              style={{ background: 'rgba(220, 53, 69, 0.9)', borderRadius: '50rem', padding: '8px 20px', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.3s ease' }}
            >
              Logout{' '}<span className="ms-1" role="img" aria-label="lock">🔒</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="mb-2 d-flex justify-content-end w-100">
          <AddContact />
        </div>
        <div>
          <ContactList />
        </div>
      </div>
    </div>
  );
};

function App() {
  const token = localStorage.getItem("jwtToken");

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    window.location.href = '/login';
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/contacts" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/contacts" /> : <Register />} />
        <Route path="/contacts" element={token ? <Dashboard handleLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/profile" element={token ? <UserProfile /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={token ? "/contacts" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
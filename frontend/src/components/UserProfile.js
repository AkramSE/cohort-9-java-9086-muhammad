import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ChangePassword from './ChangePassword';

const UserProfile = () => {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const userEmail = localStorage.getItem("email") || "User Email Not Found";

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        window.location.href = '/login';
    };

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '50px' }}>
            <nav className="navbar navbar-expand-lg shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', padding: '15px 0' }}>
              <div className="container">
                <span className="navbar-brand fw-bold text-white d-flex align-items-center" style={{ letterSpacing: '1px' }}>
                  <span className="me-2" style={{ fontSize: '1.5rem' }} role="img" aria-label="shield">🛡️</span>{' '}Secure Contact Manager
                </span>
                <div className="d-flex align-items-center">
                  <Link to="/contacts" className="btn btn-sm btn-outline-light me-3 fw-bold rounded-pill px-3 text-decoration-none">
                    ⬅ Back to Dashboard
                  </Link>
                </div>
              </div>
            </nav>

            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-body p-5 text-center">
                                
                                <div className="d-inline-flex align-items-center justify-content-center mb-4" 
                                     style={{ 
                                         width: '80px', height: '80px', 
                                         borderRadius: '50%', 
                                         background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', 
                                         color: 'white', fontSize: '36px', fontWeight: 'bold',
                                         boxShadow: '0 8px 16px rgba(30,60,114,0.2)' 
                                     }}>
                                    {userEmail !== "User Email Not Found" ? userEmail.charAt(0).toUpperCase() : "U"}
                                </div>
                                
                                <h3 className="fw-bold text-dark mb-1">My Profile</h3>
                                <p className="text-muted mb-4">{userEmail}</p>

                                <hr className="mb-4" />

                                <button 
                                    type="button"
                                    onClick={() => setShowPasswordModal(true)}
                                    className="btn w-100 fw-bold mb-3 shadow-sm"
                                    style={{ borderRadius: '10px', border: '2px solid #2a5298', color: '#2a5298', height: '50px' }}
                                >
                                    <span role="img" aria-label="key">🔑</span>{' '}Change Password
                                </button>

                                <button 
                                    type="button"
                                    onClick={handleLogout}
                                    className="btn w-100 fw-bold shadow-sm"
                                    style={{ borderRadius: '10px', background: '#dc3545', color: 'white', height: '50px', border: 'none' }}
                                >
                                    {/* FIX: Explicit spacing added to prevent ambiguous spacing error */}
                                    Logout{' '}<span role="img" aria-label="lock">🔒</span>
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ChangePassword
                showModal={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />
        </div>
    );
};

export default UserProfile;
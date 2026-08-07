import React from 'react';

const Navbar = () => {
    
    const handleLogout = () => {
        // Removes the authentication token from local storage.
        localStorage.removeItem("jwtToken");
        
        // Redirects the user back to the login page.
        window.location.href = "/login"; 
    };

    // Style handlers extracted for cleaner code and to support both mouse and keyboard events
    const handleHoverFocusIn = (e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.background = '#dc3545';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(220, 53, 69, 0.3)';
    };

    const handleHoverFocusOut = (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.background = 'rgba(220, 53, 69, 0.9)';
        e.currentTarget.style.boxShadow = 'none';
    };

    return (
        <nav className="navbar navbar-expand-lg shadow-sm" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', padding: '15px 0' }}>
            <div className="container">
                {/* Brand Logo & Name */}
                <span className="navbar-brand fw-bold text-white d-flex align-items-center" style={{ letterSpacing: '1px' }}>
                    <span className="me-2" style={{ fontSize: '1.5rem' }} role="img" aria-label="shield">🛡️</span> 
                    {' '}Secure Contact Manager
                </span>

                {/* User Info & Logout Button */}
                <div className="d-flex align-items-center">
                    <span className="text-white-50 me-4 small fw-medium" style={{ letterSpacing: '0.5px' }}>
                        ● Authenticated Session
                    </span>
                    
                    <button 
                        type="button"
                        onClick={handleLogout}
                        className="btn btn-sm fw-bold text-white shadow"
                        style={{ 
                            background: 'rgba(220, 53, 69, 0.9)', 
                            borderRadius: '50rem',
                            padding: '8px 20px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={handleHoverFocusIn}
                        onFocus={handleHoverFocusIn}
                        onMouseOut={handleHoverFocusOut}
                        onBlur={handleHoverFocusOut}
                    >
                        Logout <span role="img" aria-label="lock">🔒</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
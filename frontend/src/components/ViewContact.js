import React from 'react';

const ViewContact = ({ contact, onClose }) => {
    if (!contact) return null;

    return (
        <div 
            className="modal show d-block" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(5px)' }}
            tabIndex="-1"
            aria-modal="true"
            aria-labelledby="viewContactModalTitle"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    
                    {/* Header with Gradient */}
                    <div className="modal-header border-0 text-white" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', padding: '30px 20px 20px' }}>
                        <div className="w-100 text-center position-relative">
                            <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0" onClick={onClose} aria-label="Close"></button>
                            
                            {/* Profile Avatar */}
                            <div className="d-inline-flex align-items-center justify-content-center mb-3 bg-white" 
                                 style={{ 
                                     width: '80px', height: '80px', 
                                     borderRadius: '50%', 
                                     color: '#1e3c72', fontSize: '36px', fontWeight: 'bold',
                                     boxShadow: '0 8px 16px rgba(0,0,0,0.2)' 
                                 }}>
                                {contact.firstName ? contact.firstName.charAt(0).toUpperCase() : <span role="img" aria-label="user profile">👤</span>}
                            </div>
                            <h4 id="viewContactModalTitle" className="modal-title fw-bold m-0">{contact.title} {contact.firstName} {contact.lastName}</h4>
                        </div>
                    </div>

                    {/* Body with Contact Details */}
                    <div className="modal-body p-4 bg-light">
                        <div className="card border-0 shadow-sm rounded-4 mb-3">
                            <div className="card-body p-4">
                                
                                <div className="mb-3">
                                    <small className="text-muted fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                                        <span role="img" aria-label="email">📧</span> Email Address
                                    </small>
                                    <div className="fs-5 text-dark mt-1">
                                        {contact.emails && contact.emails.length > 0 ? contact.emails[0].emailAddress : 'No Email Provided'}
                                    </div>
                                </div>
                                
                                <hr className="text-muted opacity-25" />

                                <div>
                                    <small className="text-muted fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                                        <span role="img" aria-label="phone">📱</span> Phone Number
                                    </small>
                                    <div className="fs-5 text-dark mt-1">
                                        {contact.phones && contact.phones.length > 0 ? contact.phones[0].phoneNumber : 'No Phone Provided'}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer border-0 bg-light justify-content-center pb-4">
                        <button type="button" className="btn px-5 py-2 fw-bold text-white shadow-sm" style={{ borderRadius: '50rem', background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)' }} onClick={onClose}>
                            Close
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ViewContact;
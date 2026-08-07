import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddContact = () => {
    const [showModal, setShowModal] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);

    const handleOpen = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        setFormData({ title: '', firstName: '', lastName: '', email: '', phone: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // FIX: Decoding the token and userId using atob()
            const rawToken = localStorage.getItem("jwtToken");
            const rawUserId = localStorage.getItem("userId");
            const token = rawToken ? atob(rawToken) : "";
            const userId = rawUserId ? atob(rawUserId) : ""; 
            
            const formattedData = {
                title: formData.title,
                firstName: formData.firstName,
                lastName: formData.lastName,
                emails: [
                    { emailAddress: formData.email, label: "Personal" }
                ],
                phones: [
                    { phoneNumber: formData.phone, label: "Mobile" }
                ]
            };

            await axios.post(`https://contact-manager-api-production-0aa6.up.railway.app/users/${userId}/contacts`, formattedData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Created!',
                text: 'New contact has been added successfully.',
                timer: 1500,
                showConfirmButton: false
            });

            handleClose(); 
            setTimeout(() => { window.location.reload(); }, 1500);

        } catch (error) {
            console.error("Error adding contact", error);
            Swal.fire('Error!', 'Failed to add contact. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-4">
            <div className="d-flex justify-content-end">
                <button 
                    type="button"
                    onClick={handleOpen} 
                    className="btn btn-primary shadow-sm fw-bold d-flex align-items-center px-4 py-2"
                    style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', border: 'none' }}
                >
                    <span className="me-2 fs-5">+</span> Create New Contact
                </button>
            </div>

            {showModal && (
                <>
                    <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}></div>
                    
                    <div className="modal fade show d-block" tabIndex="-1" aria-modal="true" aria-labelledby="addContactModalTitle">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content shadow-lg border-0 rounded-4">
                                
                                <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                                    <h4 id="addContactModalTitle" className="modal-title fw-bold text-primary">
                                        <span className="me-2" role="img" aria-label="user">👤</span> Add New Contact
                                    </h4>
                                    <button type="button" className="btn-close shadow-none" onClick={handleClose} aria-label="Close"></button>
                                </div>

                                <div className="modal-body p-4">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <label htmlFor="contactTitle" className="form-label fw-semibold text-secondary small">Title</label>
                                                <select id="contactTitle" className="form-select bg-light border-0 shadow-none" name="title" value={formData.title} onChange={handleChange}>
                                                    <option value="">Select...</option>
                                                    <option value="Mr.">Mr.</option>
                                                    <option value="Ms.">Ms.</option>
                                                    <option value="Dr.">Dr.</option>
                                                </select>
                                            </div>
                                            
                                            <div className="col-md-4">
                                                <label htmlFor="firstName" className="form-label fw-semibold text-secondary small">First Name *</label>
                                                <input type="text" id="firstName" className="form-control bg-light border-0 shadow-none" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                            </div>

                                            <div className="col-md-4">
                                                <label htmlFor="lastName" className="form-label fw-semibold text-secondary small">Last Name *</label>
                                                <input type="text" id="lastName" className="form-control bg-light border-0 shadow-none" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                            </div>

                                            <div className="col-md-6 mt-4">
                                                <label htmlFor="emailAddress" className="form-label fw-semibold text-secondary small">Email Address *</label>
                                                <input type="email" id="emailAddress" className="form-control bg-light border-0 shadow-none" name="email" value={formData.email} onChange={handleChange} required placeholder="e.g. work@example.com" />
                                            </div>

                                            <div className="col-md-6 mt-4">
                                                <label htmlFor="phoneNumber" className="form-label fw-semibold text-secondary small">Phone Number *</label>
                                                <input type="tel" id="phoneNumber" className="form-control bg-light border-0 shadow-none" name="phone" value={formData.phone} onChange={handleChange} required placeholder="e.g. 03001234567" />
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-end mt-5 pt-3 border-top">
                                            <button type="button" className="btn btn-light me-2 px-4 fw-bold" onClick={handleClose}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary px-4 fw-bold" disabled={isLoading} style={{ background: '#1e3c72', border: 'none' }}>
                                                {isLoading ? 'Saving...' : 'Save Contact'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AddContact;
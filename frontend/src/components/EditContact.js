import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditContact = ({ contactToEdit, onUpdateSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let initialEmail = '';
        let initialPhone = '';
        
        if (contactToEdit?.emails && contactToEdit.emails.length > 0) {
            initialEmail = contactToEdit.emails[0].emailAddress;
        }
        if (contactToEdit?.phones && contactToEdit.phones.length > 0) {
            initialPhone = contactToEdit.phones[0].phoneNumber;
        }

        setFormData({
            title: contactToEdit?.title || '',
            firstName: contactToEdit?.firstName || '',
            lastName: contactToEdit?.lastName || '',
            email: initialEmail,
            phone: initialPhone
        });
    }, [contactToEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const updatedContact = {
            title: formData.title,
            firstName: formData.firstName,
            lastName: formData.lastName,
            emails: [{ emailAddress: formData.email, label: "Personal" }],
            phones: [{ phoneNumber: formData.phone, label: "Mobile" }]
        };

        try {
            // FIX: Decoding the token and userId using atob() before sending the API request
            const rawToken = localStorage.getItem("jwtToken");
            const rawUserId = localStorage.getItem("userId");
            const token = rawToken ? atob(rawToken) : "";
            const userId = rawUserId ? atob(rawUserId) : "";

            await axios.put(`https://contact-manager-api-production-0aa6.up.railway.app/users/${userId}/contacts/${contactToEdit.id}`, updatedContact, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Contact details have been updated successfully. 🎉',
                timer: 2000,
                showConfirmButton: false
            });

            onUpdateSuccess();
        } catch (error) {
            console.error("Update error:", error);
            Swal.fire('Error!', 'Failed to update contact. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!contactToEdit) return null;

    return (
        <>
            <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1040 }}></div>
            
            <div 
                className="modal fade show d-block" 
                tabIndex="-1" 
                aria-labelledby="editContactModalTitle"
                aria-modal="true"
                style={{ zIndex: 1050 }}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content shadow-lg border-0 rounded-4">
                        
                        <div className="modal-header text-white rounded-top-4 py-3" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', borderBottom: 'none' }}>
                            <h4 id="editContactModalTitle" className="modal-title fw-bold m-0 d-flex align-items-center">
                                <span className="me-2" role="img" aria-label="pencil">✏️</span> Update Contact
                            </h4>
                            <button type="button" className="btn-close btn-close-white shadow-none" onClick={onCancel} aria-label="Close"></button>
                        </div>

                        <div className="modal-body p-4 bg-light">
                            <form onSubmit={handleUpdate}>
                                <div className="row g-3">
                                    <div className="col-md-4 mb-2">
                                        <label htmlFor="editTitle" className="form-label fw-semibold text-secondary small">Title</label>
                                        <select 
                                            id="editTitle"
                                            className="form-select border-0 shadow-sm" 
                                            name="title" 
                                            value={formData.title} 
                                            onChange={handleChange}
                                            style={{ borderRadius: '8px' }}
                                        >
                                            <option value="">Select...</option>
                                            <option value="Mr.">Mr.</option>
                                            <option value="Ms.">Ms.</option>
                                            <option value="Dr.">Dr.</option>
                                        </select>
                                    </div>
                                    
                                    <div className="col-md-4 mb-2">
                                        <label htmlFor="editFirstName" className="form-label fw-semibold text-secondary small">First Name *</label>
                                        <input type="text" id="editFirstName" className="form-control border-0 shadow-sm" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ borderRadius: '8px' }} />
                                    </div>

                                    <div className="col-md-4 mb-2">
                                        <label htmlFor="editLastName" className="form-label fw-semibold text-secondary small">Last Name *</label>
                                        <input type="text" id="editLastName" className="form-control border-0 shadow-sm" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ borderRadius: '8px' }} />
                                    </div>

                                    <div className="col-md-6 mb-2">
                                        <label htmlFor="editEmail" className="form-label fw-semibold text-secondary small">Email Address *</label>
                                        <input type="email" id="editEmail" className="form-control border-0 shadow-sm" name="email" value={formData.email} onChange={handleChange} required placeholder="e.g. work@example.com" style={{ borderRadius: '8px' }} />
                                    </div>

                                    <div className="col-md-6 mb-2">
                                        <label htmlFor="editPhone" className="form-label fw-semibold text-secondary small">Phone Number *</label>
                                        <input type="tel" id="editPhone" className="form-control border-0 shadow-sm" name="phone" value={formData.phone} onChange={handleChange} required placeholder="e.g. 03001234567" style={{ borderRadius: '8px' }} />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                    <button type="button" className="btn btn-outline-secondary px-4 fw-bold" onClick={onCancel} disabled={isLoading} style={{ borderRadius: '8px' }}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn text-white px-4 fw-bold shadow-sm" disabled={isLoading} style={{ borderRadius: '8px', background: '#2a5298', border: 'none', transition: 'all 0.3s ease' }}>
                                        {isLoading ? 'Updating...' : 'Update Details'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditContact;
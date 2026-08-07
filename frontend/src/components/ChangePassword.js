import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ChangePassword = ({ showModal, onClose }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!showModal) return null;

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (newPassword !== confirmPassword) {
            setErrorMsg("New Password and Confirm Password do not match!");
            return;
        }

        setIsLoading(true);

        try {
            // FIX: Decoding the token and userId using atob() before API call
            const rawToken = localStorage.getItem("jwtToken");
            const rawUserId = localStorage.getItem("userId");
            const token = rawToken ? atob(rawToken) : "";
            const userId = rawUserId ? atob(rawUserId) : "";

            await axios.put(`https://contact-manager-api-production-0aa6.up.railway.app/users/${userId}/change-password`, 
            {
                oldPassword: oldPassword,
                newPassword: newPassword
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Password updated successfully!',
                timer: 2000,
                showConfirmButton: false
            });

            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
            onClose();

        } catch (error) {
            console.error("Password change failed", error);
            setErrorMsg(error.response?.data?.message || "Incorrect current password or a system error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1040 }}></div>
            
            <div className="modal fade show d-block" tabIndex="-1" aria-modal="true" aria-labelledby="changePasswordModalTitle" style={{ zIndex: 1050 }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow-lg border-0 rounded-4">
                        
                        <div className="modal-header text-white rounded-top-4 py-3" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', borderBottom: 'none' }}>
                            <h4 id="changePasswordModalTitle" className="modal-title fw-bold m-0 d-flex align-items-center">
                                <span className="me-2" role="img" aria-label="key">🔑</span> Change Password
                            </h4>
                            <button type="button" className="btn-close btn-close-white shadow-none" onClick={onClose} aria-label="Close"></button>
                        </div>

                        <div className="modal-body p-4 bg-light">
                            {errorMsg && (
                                <div className="alert alert-danger fw-medium py-2" style={{ borderRadius: '8px', fontSize: '0.9rem' }}>
                                    <span role="img" aria-label="warning">⚠️</span> {errorMsg}
                                </div>
                            )}

                            <form onSubmit={handleChangePassword}>
                                <div className="form-floating mb-3">
                                    <input 
                                        type="password" 
                                        className="form-control border-0 shadow-sm" 
                                        id="oldPassword" 
                                        placeholder="Old Password"
                                        value={oldPassword} 
                                        onChange={(e) => setOldPassword(e.target.value)} 
                                        required 
                                        style={{ borderRadius: '8px' }}
                                    />
                                    <label htmlFor="oldPassword" className="text-muted small">Current Password</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input 
                                        type="password" 
                                        className="form-control border-0 shadow-sm" 
                                        id="newPassword" 
                                        placeholder="New Password"
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        required 
                                        style={{ borderRadius: '8px' }}
                                    />
                                    <label htmlFor="newPassword" className="text-muted small">New Password</label>
                                </div>

                                <div className="form-floating mb-4">
                                    <input 
                                        type="password" 
                                        className="form-control border-0 shadow-sm" 
                                        id="confirmPassword" 
                                        placeholder="Confirm Password"
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        required 
                                        style={{ borderRadius: '8px' }}
                                    />
                                    <label htmlFor="confirmPassword" className="text-muted small">Confirm New Password</label>
                                </div>

                                <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary px-4 fw-bold" 
                                        onClick={onClose}
                                        style={{ borderRadius: '8px' }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn fw-bold text-white px-4 shadow-sm"
                                        disabled={isLoading}
                                        style={{ 
                                            borderRadius: '8px', 
                                            background: '#2a5298',
                                            border: 'none'
                                        }}
                                    >
                                        {isLoading ? 'Updating...' : 'Update Password'}
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

export default ChangePassword;
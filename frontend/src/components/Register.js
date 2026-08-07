import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            Swal.fire('Oops...', 'Passwords do not match!', 'warning');
            return;
        }

        setIsLoading(true);

        try {
            await axios.post('https://contact-manager-api-production-0aa6.up.railway.app/users/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'USER' 
            });

            Swal.fire({
                icon: 'success',
                title: 'Welcome!',
                text: 'Your account has been created successfully.',
                confirmButtonColor: '#3085d6'
            }).then(() => {
                navigate('/login');
            });

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Something went wrong. Email might already exist.';
            Swal.fire('Registration Failed!', errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <h3 className="text-primary fw-bold">Create Account</h3>
                                <p className="text-muted">Join us and manage your contacts securely</p>
                            </div>

                            <form onSubmit={handleRegister}>
                                {/* Name Input */}
                                <div className="mb-3">
                                    <label htmlFor="registerName" className="form-label fw-semibold text-secondary">Full Name</label>
                                    <input 
                                        type="text" 
                                        id="registerName"
                                        className="form-control form-control-lg bg-light border-0 shadow-none" 
                                        name="name"
                                        placeholder="e.g. Muhammad Akram" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>

                                {/* Email Input */}
                                <div className="mb-3">
                                    <label htmlFor="registerEmail" className="form-label fw-semibold text-secondary">Email Address</label>
                                    <input 
                                        type="email" 
                                        id="registerEmail"
                                        className="form-control form-control-lg bg-light border-0 shadow-none" 
                                        name="email"
                                        placeholder="name@example.com" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="mb-3">
                                    <label htmlFor="registerPassword" className="form-label fw-semibold text-secondary">Password</label>
                                    <input 
                                        type="password" 
                                        id="registerPassword"
                                        className="form-control form-control-lg bg-light border-0 shadow-none" 
                                        name="password"
                                        placeholder="••••••••" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        required 
                                        minLength="4"
                                    />
                                </div>

                                {/* Confirm Password Input */}
                                <div className="mb-4">
                                    <label htmlFor="registerConfirmPassword" className="form-label fw-semibold text-secondary">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        id="registerConfirmPassword"
                                        className="form-control form-control-lg bg-light border-0 shadow-none" 
                                        name="confirmPassword"
                                        placeholder="••••••••" 
                                        value={formData.confirmPassword} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>

                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 btn-lg shadow-sm rounded-pill fw-bold"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                                </button>
                            </form>

                            {/* Redirect to Login */}
                            <div className="text-center mt-4">
                                <span className="text-muted">Already have an account? </span>
                                <Link to="/login" className="text-primary text-decoration-none fw-bold">Log In</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
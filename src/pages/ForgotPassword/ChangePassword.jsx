import React, { useState } from 'react';
import axios from 'axios';
import './ChangePassword.css';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        username: localStorage.getItem('username') || '',
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const requestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/password/change/request`, {
                username: form.username,
                email: form.email,
            });
            alert('OTP sent to your email.');
            setStep(2);
        } catch (err) {
            console.error(err);
            alert('Failed to send OTP. Please check your info.');
            setLoading(false);
        }
    };

    const confirmPasswordChange = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/password/change/confirm`, {
                username: form.username,
                otp: form.otp,
                newPassword: form.newPassword,
                confirmPassword: form.confirmPassword,
            });
            alert('Password changed successfully!');
            setTimeout(() => {
                navigate("/account");
            }, 2000);
        } catch (err) {
            console.error(err);
            alert('Failed to reset password. Please check your OTP and input.');
        }
    };

    return (
        <div className="change-password-container container-fluid py-5 text-white">
            <div className='row'>
                <div className='spacer col-lg-4'></div>
                <div className='main-content col-lg-4'>
                    <h2 className='text-center'>Change Password</h2>
                    {message && <p style={{ color: 'red' }}>{message}</p>}

                    {step === 1 && (
                        <form onSubmit={requestOtp} className='d-flex flex-column gap-3 pt-3'>
                            <div className='d-flex flex-row w-100 gap-3 justify-content-center align-items-center'>
                                <label >Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className='d-flex justify-content-center align-items-center'>
                                <Button type={"submit"} disabled={loading} label={`${loading ? "Checking..." : "Send OTP"}`} color='gradient-blue-button' />
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={confirmPasswordChange} className='pt-3'>
                            <table className='w-100'>
                                <tbody>
                                    <tr>
                                        <td>
                                            <label style={{ color: 'white' }} htmlFor="otp">OTP:</label>
                                        </td>
                                        <td>
                                            <input
                                                id="otp"
                                                type="text"
                                                name="otp"
                                                value={form.otp}
                                                onChange={handleChange}
                                                required
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <label style={{ color: 'white' }} htmlFor="newPassword">New Password:</label>
                                        </td>
                                        <td>
                                            <input
                                                id="newPassword"
                                                type="password"
                                                name="newPassword"
                                                value={form.newPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <label style={{ color: 'white' }} htmlFor="confirmPassword">Confirm New Password:</label>
                                        </td>
                                        <td>
                                            <input
                                                id="confirmPassword"
                                                type="password"
                                                name="confirmPassword"
                                                value={form.confirmPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                            <div className='d-flex justify-content-center align-items-center pt-3'>
                                <Button type={"submit"} label={"Confirm Password Change"} color='gradient-blue-button' />
                            </div>
                        </form>
                    )}
                </div>
                <div className='spacer col-lg-4'></div>
            </div>

        </div>
    );
};

export default ChangePassword;

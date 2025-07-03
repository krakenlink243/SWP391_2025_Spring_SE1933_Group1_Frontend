import React, { useState } from 'react';
import axios from 'axios';

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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const requestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/password/change/request', {
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
            await axios.post('http://localhost:8080/api/password/change/confirm', {
                username: form.username,
                otp: form.otp,
                newPassword: form.newPassword,
                confirmPassword: form.confirmPassword,
            });
            alert('Password changed successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to reset password. Please check your OTP and input.');
        }
    };

    return (
        <div className="change-password-container">
            <h2 style={{ color: 'white' }}>Change Password</h2>
            {message && <p style={{ color: 'red' }}>{message}</p>}

            {step === 1 && (
                <form onSubmit={requestOtp}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Checking..." : "Send OTP"}
                    </button>
                    
                </form>
            )}

            {step === 2 && (
                <form onSubmit={confirmPasswordChange}>
                    <table>
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

                            <tr>
                                <td></td>
                                <td>
                                    <button type="submit">Confirm Password Change</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            )}
        </div>
    );
};

export default ChangePassword;

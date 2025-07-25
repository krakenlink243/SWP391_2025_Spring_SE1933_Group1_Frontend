import React, { useState } from 'react';
import axios from 'axios';
import './ChangePassword.css';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ChangePassword = () => {
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);


    const validateStrongPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(password);
    };

    const [form, setForm] = useState({
        username: localStorage.getItem('username') || '',
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();
    const { t } = useTranslation();
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const requestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/password/change/request`, {
                email: form.email,
            });
            alert(t('OTP sent to your email.'));
            setStep(2);
        } catch (err) {
            console.error(err);
            alert(t('Failed to send OTP. Please check your info.'));
            setLoading(false);
        }
    };

    const confirmPasswordChange = async (e) => {
        e.preventDefault();
        // Validate password strength
        if (!validateStrongPassword(form.newPassword)) {
            setMessage(t('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'));
            return;
        }

        // Check if passwords match
        if (form.newPassword !== form.confirmPassword) {
            setMessage(t('Passwords do not match.'));
            return;
        }
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/password/change/confirm`, {
                email: form.email,
                otp: form.otp,
                newPassword: form.newPassword,
                confirmPassword: form.confirmPassword,
            });
            alert(t('Password changed successfully!'));
            setTimeout(() => {
                navigate("/account");
            }, 2000);
        } catch (err) {
            console.error(err);
            alert(t('Failed to reset password. Please check your OTP and input.'));
        }
    };

    return (
        <div className="change-password-container container-fluid py-5 text-white">
            <div className='row'>
                <div className='spacer col-lg-4'></div>
                <div className='main-content col-lg-4'>
                    <h2 className='text-center'>{t('Change Password')}</h2>
                    {message && <p style={{ color: 'red' }}>{message}</p>}

                    {step === 1 && (
                        <form onSubmit={requestOtp} className='d-flex flex-column gap-3 pt-3'>
                            <div className='d-flex flex-row w-100 gap-3 justify-content-center align-items-center'>
                                <label >{t('Email')}:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className='d-flex justify-content-center align-items-center'>
                                <Button type={t('submit')} disabled={loading} label={`${loading ? t('Checking...') : t('Send OTP')}`} color='gradient-blue-button' />
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={confirmPasswordChange} className='pt-3'>
                            <table className='w-100'>
                                <tbody>
                                    <tr>
                                        <td>
                                            <label style={{ color: 'white' }} htmlFor="otp">{t('OTP')}:</label>
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
                                            <label style={{ color: 'white' }} htmlFor="newPassword">{t('New Password')}:</label>
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
                                            <label style={{ color: 'white' }} htmlFor="confirmPassword">{t('Confirm New Password')}:</label>
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
                                <Button type={t('submit')} label={t('Confirm Password Change')} color='gradient-blue-button' />
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

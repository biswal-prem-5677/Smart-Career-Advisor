
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Lock, Mail, ArrowRight, UserPlus, Key, X, CheckCircle } from 'lucide-react';

const ForgotPasswordModal = ({ onClose }) => {
    const [step, setStep] = useState(1); // 1: Email, 2: Verify OTP, 3: Reset Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await axios.post(`/api/auth/forgot-password`, { email });
            if (res.data.success) {
                setStep(2);
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError("Failed to send OTP. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await axios.post(`/api/auth/verify-otp`, { email, otp });
            if (res.data.success) {
                setStep(3);
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError("Invalid OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            const res = await axios.post(`/api/auth/reset-password`, {
                email,
                otp,
                new_password: newPassword
            });
            if (res.data.success) {
                setSuccess("Password reset successfully! Logging you out...");
                setTimeout(onClose, 2000);
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError("Failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-4">Reset Password</h2>

                {success ? (
                    <div className="text-green-400 flex flex-col items-center gap-2 py-8 animate-fade-in">
                        <CheckCircle size={48} />
                        <p>{success}</p>
                    </div>
                ) : (
                    <>
                        {step === 1 && (
                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <p className="text-slate-300 text-sm">Enter your email to receive a verification code.</p>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors">
                                    {isLoading ? 'Sending...' : 'Send OTP'}
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in-right">
                                <p className="text-slate-300 text-sm">Enter the 6-digit OTP sent to {email}.</p>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none text-center tracking-widest font-mono"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                                <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors">
                                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                                <button type="button" onClick={() => setStep(1)} className="w-full text-indigo-300 text-sm hover:text-white">Back</button>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleReset} className="space-y-4 animate-fade-in-right">
                                <p className="text-slate-300 text-sm">Set your new password.</p>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors">
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        )}

                        {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
                    </>
                )}
            </div>
        </div>
    );
};

const LoginPage = ({ onLoginSuccess }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [step, setStep] = useState('email'); // 'email', 'otp', 'password'

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill(""));

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(300);

    // Reset state when toggling mode
    useEffect(() => {
        setStep('email');
        setError('');
        setPassword('');
        setConfirmPassword('');
        setOtp(new Array(6).fill(""));
    }, [isSignUp]);

    useEffect(() => {
        let interval;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Check if user exists
            const checkRes = await axios.post(`/api/auth/check-user`, { email });
            const userExists = checkRes.data.exists;

            if (isSignUp) {
                if (userExists) {
                    setError("User already exists. Please Sign In.");
                    setIsLoading(false);
                    return;
                }
                // Send OTP for new user
                const otpRes = await axios.post(`/api/auth/send-otp`, { email });
                if (otpRes.data.success) {
                    setStep('otp');
                    setTimer(300);
                } else {
                    setError(otpRes.data.message);
                }
            } else {
                // Sign In Mode
                if (!userExists) {
                    setError("User does not exist. Please Sign Up.");
                    setIsLoading(false);
                    return;
                }
                // Proceed to Password
                setStep('password');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to connect to server.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            setError("Please enter a 6-digit code");
            return;
        }
        setIsLoading(true);
        try {
            const res = await axios.post(`/api/auth/verify-otp`, { email, otp: otpValue });
            if (res.data.success) {
                setStep('password'); // Proceed to set password
                setError('');
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError('Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isSignUp) {
                // Sign Up: Set Password
                if (password !== confirmPassword) {
                    setError("Passwords do not match");
                    setIsLoading(false);
                    return;
                }
                const otpValue = otp.join("");
                const res = await axios.post(`/api/auth/signup-complete`, {
                    email,
                    password,
                    otp: otpValue
                });

                if (res.data.success) {
                    onLoginSuccess({ name: email.split('@')[0], email: email });
                } else {
                    setError(res.data.message);
                }
            } else {
                // Sign In: Login
                const res = await axios.post(`/api/auth/login`, {
                    email,
                    password
                });

                if (res.data.success) {
                    onLoginSuccess(res.data.user);
                } else {
                    setError(res.data.message); // Should say "Incorrect password"
                }
            }
        } catch (err) {
            setError('Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
                .glass-morphism { background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.15); }
                .gradient-bg { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%); }
            `}</style>

            {/* Background */}
            <div className="absolute inset-0 gradient-bg z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md glass-morphism rounded-3xl shadow-2xl p-8 md:p-10 transition-all duration-300">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 relative animate-[float_6s_ease-in-out_infinite]">
                        <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse"></div>
                        {isSignUp ? <UserPlus className="text-white w-8 h-8 relative z-10" /> : <Lock className="text-white w-8 h-8 relative z-10" />}
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">SkillSync AI</h1>
                    <p className="text-indigo-200/80">{isSignUp ? 'Create your account' : 'Welcome back'}</p>
                </div>

                {/* Toggle */}
                <div className="flex bg-white/5 p-1 rounded-xl mb-8 relative">
                    <div className={`absolute inset-y-1 w-[calc(50%-4px)] bg-indigo-600 rounded-lg transition-all duration-300 ${isSignUp ? 'left-[calc(50%+4px)]' : 'left-1'}`}></div>
                    <button onClick={() => setIsSignUp(false)} className={`flex-1 py-2 text-sm font-medium rounded-lg relative z-10 transition-colors ${!isSignUp ? 'text-white' : 'text-indigo-200 hover:text-white'}`}>Sign In</button>
                    <button onClick={() => setIsSignUp(true)} className={`flex-1 py-2 text-sm font-medium rounded-lg relative z-10 transition-colors ${isSignUp ? 'text-white' : 'text-indigo-200 hover:text-white'}`}>Sign Up</button>
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                    {step === 'email' && (
                        <form onSubmit={handleEmailSubmit} className="space-y-6 animate-fade-in-up">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 w-5 h-5 group-focus-within:text-white transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-indigo-300/50 outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transform transition-all active:scale-[0.98] disabled:opacity-70"
                            >
                                {isLoading ? 'Checking...' : 'Continue'} <ArrowRight size={20} />
                            </button>
                        </form>
                    )}

                    {step === 'otp' && (
                        <div className="space-y-8 animate-fade-in-right">
                            <div className="text-center">
                                <p className="text-white mb-2 font-medium">Verify Email</p>
                                <p className="text-indigo-200/60 text-sm">Enter the code sent to {email}</p>
                            </div>

                            <div className="flex justify-center gap-2">
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        className="w-12 h-14 bg-white/5 border border-white/10 rounded-lg text-center text-white text-xl font-bold focus:bg-white/10 focus:border-indigo-500/50 outline-none transition-all"
                                        value={data}
                                        onChange={e => handleOtpChange(e.target, index)}
                                        onKeyDown={e => {
                                            if (e.key === 'Backspace' && !data && index > 0) {
                                                e.target.previousSibling.focus();
                                            }
                                        }}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleVerifyOtp}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                            >
                                {isLoading ? 'Verifying...' : 'Verify Code'}
                            </button>
                            <button onClick={() => setStep('email')} className="w-full text-indigo-300 text-sm hover:text-white">Back to Email</button>
                        </div>
                    )}

                    {step === 'password' && (
                        <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fade-in-right">
                            <div className="text-center mb-4">
                                <p className="text-indigo-200/80 text-sm">{isSignUp ? 'Set your password' : `Welcome back, ${email.split('@')[0]}`}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="relative group">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 w-5 h-5 group-focus-within:text-white transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-indigo-300/50 outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all font-medium"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition-colors">
                                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>

                                {isSignUp && (
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 w-5 h-5 group-focus-within:text-white transition-colors" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirm Password"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-indigo-300/50 outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all font-medium"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            {!isSignUp && (
                                <div className="flex justify-end">
                                    <button type="button" onClick={() => setShowForgotModal(true)} className="text-xs text-indigo-300 hover:text-white transition-colors">
                                        Forgot Password?
                                    </button>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transform transition-all active:scale-[0.98] disabled:opacity-70"
                            >
                                {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Login')} <ArrowRight size={20} />
                            </button>
                            <button type="button" onClick={() => setStep('email')} className="w-full text-indigo-300 text-sm hover:text-white">Back</button>
                        </form>
                    )}
                </div>

                {error && (
                    <div className="mt-6 text-red-300 text-sm text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20 animate-pulse">
                        {error}
                    </div>
                )}

            </div>

            {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />}
        </div>
    );
};

export default LoginPage;

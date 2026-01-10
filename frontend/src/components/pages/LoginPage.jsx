import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

const LoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState('login'); // 'login' or 'otp'
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(300);

    useEffect(() => {
        let interval;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // In a real app, you'd validate password here or on server. 
            // For this hackathon flow, we treat the first step as "Request OTP"
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, { email });
            if (res.data.success) {
                setStep('otp');
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError('Failed to connect to server.');
            console.error(err);
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

    const handleVerifyOtp = async () => {
        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            setError("Please enter a 6-digit code");
            return;
        }
        setIsLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, { email, otp: otpValue });
            if (res.data.success) {
                onLoginSuccess({ name: email.split('@')[0], email: email });
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError('Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
                @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); } 50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); } }
                .glass-morphism { background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.15); }
                .gradient-bg { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%); }
            `}</style>

            {/* Background */}
            <div className="absolute inset-0 gradient-bg z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md glass-morphism rounded-3xl shadow-2xl p-8 md:p-10 animate-fade-in-up">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 relative animate-[float_6s_ease-in-out_infinite]">
                        <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse"></div>
                        <Lock className="text-white w-8 h-8 relative z-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">SkillSync AI</h1>
                    <p className="text-indigo-200/80">Login to your career dashboard</p>
                </div>

                {step === 'login' ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 w-5 h-5 group-focus-within:text-white transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-indigo-300/50 outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 w-5 h-5 group-focus-within:text-white transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-indigo-300/50 outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition-colors">
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</div>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Processing...' : 'Sign In'} <ArrowRight size={20} />
                        </button>
                    </form>
                ) : (
                    <div className="space-y-8 animate-fade-in-right">
                        <div className="text-center">
                            <p className="text-white mb-2 font-medium">Enter Verification Code</p>
                            <p className="text-indigo-200/60 text-sm">We sent a 6-digit code to {email}</p>
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

                        <div className="text-center">
                            <p className="text-indigo-300 text-sm mb-4">Code expires in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
                        </div>

                        <button
                            onClick={handleVerifyOtp}
                            disabled={isLoading}
                            className="w-full bg-white text-indigo-900 font-bold py-4 rounded-xl shadow-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Verifying...' : 'Verify & Login'}
                        </button>

                        <button onClick={() => setStep('login')} className="w-full text-indigo-300 text-sm hover:text-white">Back to Login</button>
                    </div>
                )}

                {/* Social Login Divider */}
                {/* <div className="mt-8 relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-4 text-indigo-200/50 bg-transparent backdrop-blur-sm">Or continue with</span></div>
                </div> */}

                {/* <div className="mt-6 flex gap-4 justify-center">
                    <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 hover:scale-110 transition-all border border-white/5 text-white"><Github size={20} /></button>
                    <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 hover:scale-110 transition-all border border-white/5 text-white text-blue-400"><Twitter size={20} /></button>
                    <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 hover:scale-110 transition-all border border-white/5 text-white text-red-400"><Chrome size={20} /></button>
                </div> */}

            </div>
        </div>
    );
};

export default LoginPage;

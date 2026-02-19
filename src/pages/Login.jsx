import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const schema = z.object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/browse';
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        setServerError('');
        setIsLoading(true);
        try {
            await new Promise(r => setTimeout(r, 600)); // Simulate network
            login(data.email, data.password);
            navigate(from, { replace: true });
        } catch (err) {
            setServerError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Background blobs */}
            <div style={{
                position: 'fixed', top: '-20%', left: '-10%', width: '500px', height: '500px',
                background: 'radial-gradient(circle, rgba(229,9,20,0.08) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
            }} />
            <div style={{
                position: 'fixed', bottom: '-20%', right: '-10%', width: '400px', height: '400px',
                background: 'radial-gradient(circle, rgba(229,9,20,0.05) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
            }} />

            {/* Logo */}
            <Link to="/" style={{ position: 'absolute', top: '28px', left: '48px', zIndex: 2, textDecoration: 'none' }}>
                <span style={{ fontSize: '28px', fontWeight: 900, color: '#e50914', letterSpacing: '-1px', fontFamily: 'Inter, sans-serif' }}>
                    NETFLX
                </span>
            </Link>

            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', marginBottom: '8px', letterSpacing: '-0.3px' }}>
                        Sign in
                    </h1>
                    <p style={{ color: '#b3b3b3', fontSize: '14px' }}>
                        Welcome back. Enter your credentials to continue.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Server-level error banner */}
                    <AnimatePresence>
                        {serverError && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                    background: 'rgba(239,68,68,0.1)',
                                    border: '1px solid rgba(239,68,68,0.3)',
                                    borderRadius: '8px',
                                    padding: '12px 14px',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            >
                                <span style={{ fontSize: '16px' }}>⚠️</span>
                                <p style={{ color: '#f87171', fontSize: '13px', fontWeight: 500 }}>{serverError}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Email field */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#ccc', marginBottom: '8px' }}>
                            Email address
                        </label>
                        <input
                            {...register('email')}
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            className={`auth-input ${errors.email ? 'error' : ''}`}
                        />
                        <AnimatePresence>
                            {errors.email && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{ color: '#f87171', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <span>✕</span> {errors.email.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Password field */}
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 500, color: '#ccc' }}>
                                Password
                            </label>
                            <button
                                type="button"
                                style={{ background: 'none', border: 'none', color: '#e50914', fontSize: '12px', cursor: 'pointer', fontWeight: 500, padding: 0 }}
                                onClick={() => { }}
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                {...register('password')}
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                className={`auth-input ${errors.password ? 'error' : ''}`}
                                style={{ paddingRight: '48px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', color: '#999',
                                    fontSize: '18px', lineHeight: 1, padding: 0,
                                }}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        <AnimatePresence>
                            {errors.password && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{ color: '#f87171', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <span>✕</span> {errors.password.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Remember me */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                        <input
                            type="checkbox"
                            id="remember"
                            style={{ width: '16px', height: '16px', accentColor: '#e50914', cursor: 'pointer' }}
                        />
                        <label htmlFor="remember" style={{ fontSize: '13px', color: '#b3b3b3', cursor: 'pointer', userSelect: 'none' }}>
                            Remember me for 30 days
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={isLoading}
                        style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        {isLoading ? (
                            <>
                                <span style={{
                                    display: 'inline-block', width: '18px', height: '18px',
                                    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
                                    borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                                }} />
                                Signing in…
                            </>
                        ) : 'Sign in'}
                    </button>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                        <span style={{ color: '#666', fontSize: '12px' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                    </div>

                    {/* Social sign-in placeholders */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                        {[
                            { label: 'Google', icon: 'G', color: '#4285F4' },
                            { label: 'Apple', icon: '🍎', color: '#fff' },
                        ].map(({ label, icon, color }) => (
                            <button
                                key={label}
                                type="button"
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    background: 'transparent', border: '1.5px solid rgba(255,255,255,0.12)',
                                    borderRadius: '8px', padding: '11px', cursor: 'pointer',
                                    color: '#ccc', fontSize: '13px', fontWeight: 500,
                                    transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'transparent'; }}
                            >
                                <span style={{ fontWeight: 700, color }}>{icon}</span>
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Sign up link */}
                    <p style={{ textAlign: 'center', color: '#b3b3b3', fontSize: '14px' }}>
                        New to Netflx?{' '}
                        <Link to="/signup" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '1px' }}>
                            Create an account
                        </Link>
                    </p>
                </form>

                {/* Terms */}
                <p style={{ textAlign: 'center', color: '#555', fontSize: '11px', marginTop: '24px', lineHeight: 1.6 }}>
                    By signing in, you agree to our{' '}
                    <span style={{ color: '#777', cursor: 'pointer' }}>Terms of Service</span> and{' '}
                    <span style={{ color: '#777', cursor: 'pointer' }}>Privacy Policy</span>.
                </p>
            </motion.div>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(d => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

function PasswordStrength({ password }) {
    const checks = [
        { label: '8+ characters', ok: password.length >= 8 },
        { label: 'Uppercase', ok: /[A-Z]/.test(password) },
        { label: 'Number', ok: /[0-9]/.test(password) },
    ];
    const score = checks.filter(c => c.ok).length;
    const colors = ['#ef4444', '#f59e0b', '#22c55e'];
    const labels = ['Weak', 'Fair', 'Strong'];

    if (!password) return null;
    return (
        <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        flex: 1, height: '3px', borderRadius: '2px',
                        background: i < score ? colors[score - 1] : '#333',
                        transition: 'background 0.3s',
                    }} />
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {checks.map(c => (
                        <span key={c.label} style={{ fontSize: '11px', color: c.ok ? '#4ade80' : '#666', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            {c.ok ? '✓' : '○'} {c.label}
                        </span>
                    ))}
                </div>
                {score > 0 && <span style={{ fontSize: '11px', color: colors[score - 1], fontWeight: 600 }}>{labels[score - 1]}</span>}
            </div>
        </div>
    );
}

export default function Signup() {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });
    const passwordValue = watch('password', '');

    const onSubmit = async (data) => {
        setServerError('');
        setIsLoading(true);
        try {
            await new Promise(r => setTimeout(r, 600));
            registerUser({ name: data.name, email: data.email, password: data.password });
            navigate('/login');
        } catch (err) {
            setServerError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fields = [
        { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name', placeholder: 'John Doe' },
        { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email', placeholder: 'you@example.com' },
    ];

    return (
        <div className="auth-container">
            <div style={{ position: 'fixed', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(229,9,20,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

            <Link to="/" style={{ position: 'absolute', top: '28px', left: '48px', zIndex: 2, textDecoration: 'none' }}>
                <span style={{ fontSize: '28px', fontWeight: 900, color: '#e50914', letterSpacing: '-1px' }}>NETFLX</span>
            </Link>

            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                <div style={{ marginBottom: '28px' }}>
                    <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', marginBottom: '8px', letterSpacing: '-0.3px' }}>Create your account</h1>
                    <p style={{ color: '#b3b3b3', fontSize: '14px' }}>Start watching unlimited movies & shows today.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <AnimatePresence>
                        {serverError && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span>⚠️</span>
                                <p style={{ color: '#f87171', fontSize: '13px', fontWeight: 500 }}>{serverError}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {fields.map(f => (
                        <div key={f.name} style={{ marginBottom: '18px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#ccc', marginBottom: '8px' }}>{f.label}</label>
                            <input {...register(f.name)} type={f.type} autoComplete={f.autoComplete} placeholder={f.placeholder}
                                className={`auth-input ${errors[f.name] ? 'error' : ''}`} />
                            <AnimatePresence>
                                {errors[f.name] && (
                                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        style={{ color: '#f87171', fontSize: '12px', marginTop: '5px' }}>
                                        ✕ {errors[f.name].message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}

                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#ccc', marginBottom: '8px' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input {...register('password')} type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                                placeholder="Min. 8 characters" className={`auth-input ${errors.password ? 'error' : ''}`}
                                style={{ paddingRight: '48px' }} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '18px', padding: 0 }}>
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        <PasswordStrength password={passwordValue} />
                        <AnimatePresence>
                            {errors.password && (
                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    style={{ color: '#f87171', fontSize: '12px', marginTop: '5px' }}>
                                    ✕ {errors.password.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#ccc', marginBottom: '8px' }}>Confirm password</label>
                        <input {...register('confirmPassword')} type="password" autoComplete="new-password" placeholder="Repeat your password"
                            className={`auth-input ${errors.confirmPassword ? 'error' : ''}`} />
                        <AnimatePresence>
                            {errors.confirmPassword && (
                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    style={{ color: '#f87171', fontSize: '12px', marginTop: '5px' }}>
                                    ✕ {errors.confirmPassword.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    <button type="submit" className="auth-btn" disabled={isLoading}
                        style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {isLoading ? (
                            <><span style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Creating account…</>
                        ) : 'Create account'}
                    </button>

                    <p style={{ textAlign: 'center', color: '#b3b3b3', fontSize: '14px' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '1px' }}>
                            Sign in
                        </Link>
                    </p>
                </form>

                <p style={{ textAlign: 'center', color: '#555', fontSize: '11px', marginTop: '24px', lineHeight: 1.6 }}>
                    By creating an account, you agree to our{' '}
                    <span style={{ color: '#777', cursor: 'pointer' }}>Terms of Service</span> and{' '}
                    <span style={{ color: '#777', cursor: 'pointer' }}>Privacy Policy</span>.
                </p>
            </motion.div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

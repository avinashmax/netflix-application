import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ onSearch }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (searchOpen && searchRef.current) searchRef.current.focus();
    }, [searchOpen]);

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
        if (onSearch) onSearch(e.target.value);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isBrowse = location.pathname === '/browse';

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}
            style={{ background: scrolled ? 'rgba(20,20,20,0.98)' : 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}>
            {/* Logo */}
            <Link to="/browse" style={{ textDecoration: 'none', flexShrink: 0 }}>
                <span style={{ fontSize: '26px', fontWeight: 900, color: '#e50914', letterSpacing: '-1px' }}>NETFLX</span>
            </Link>

            {/* Links */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flex: 1, marginLeft: '32px' }}>
                {[['Browse', '/browse'], ['My List', '/profile']].map(([label, path]) => (
                    <Link key={path} to={path} style={{
                        color: location.pathname === path ? '#fff' : '#ccc',
                        textDecoration: 'none', fontSize: '14px', fontWeight: location.pathname === path ? 600 : 400,
                        transition: 'color 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = location.pathname === path ? '#fff' : '#ccc'}>
                        {label}
                    </Link>
                ))}
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Search */}
                {isBrowse && (
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <AnimatePresence>
                            {searchOpen && (
                                <motion.input
                                    ref={searchRef}
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 220, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    value={searchValue}
                                    onChange={handleSearch}
                                    placeholder="Titles, people, genres"
                                    onBlur={() => { if (!searchValue) setSearchOpen(false); }}
                                    style={{
                                        background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: '4px', padding: '6px 12px', color: '#fff', fontSize: '14px',
                                        outline: 'none', fontFamily: 'Inter, sans-serif',
                                    }}
                                />
                            )}
                        </AnimatePresence>
                        <button onClick={() => setSearchOpen(!searchOpen)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '18px', padding: '4px 8px' }}>
                            🔍
                        </button>
                    </div>
                )}

                {/* Notification bell */}
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '18px' }}>🔔</button>

                {/* Avatar + dropdown */}
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                    <button onClick={() => setShowDropdown(!showDropdown)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <div style={{
                            width: '34px', height: '34px', borderRadius: '6px',
                            background: 'linear-gradient(135deg, #e50914, #b00610)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 700, fontSize: '14px',
                        }}>
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span style={{ color: '#fff', fontSize: '12px', transition: 'transform 0.2s', display: 'inline-block', transform: showDropdown ? 'rotate(180deg)' : 'none' }}>▾</span>
                    </button>

                    <AnimatePresence>
                        {showDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                transition={{ duration: 0.15 }}
                                style={{
                                    position: 'absolute', top: '44px', right: 0, width: '200px',
                                    background: 'rgba(20,20,20,0.97)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '10px', overflow: 'hidden',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                                }}>
                                {/* User info */}
                                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{user?.name}</div>
                                    <div style={{ fontSize: '12px', color: '#777' }}>{user?.email}</div>
                                </div>
                                {[
                                    { label: 'Account', icon: '👤', path: '/profile' },
                                    { label: 'My List', icon: '📋', path: '/profile' },
                                    { label: 'Settings', icon: '⚙️', path: '/profile' },
                                ].map(({ label, icon, path }) => (
                                    <Link key={label} to={path} onClick={() => setShowDropdown(false)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', color: '#ccc', textDecoration: 'none', fontSize: '14px', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <span>{icon}</span> {label}
                                    </Link>
                                ))}
                                <button onClick={handleLogout}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', background: 'none', border: 'none', color: '#f87171', fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', borderTop: '1px solid rgba(255,255,255,0.08)', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <span>🚪</span> Sign out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
}

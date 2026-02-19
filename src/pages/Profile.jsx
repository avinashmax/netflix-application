import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getMovieDetails } from '../api/omdb';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

const FALLBACK = 'https://via.placeholder.com/120x180/1a1a1a/666?text=?';

function ListMovieCard({ imdbID, onRemove }) {
    const [movie, setMovie] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getMovieDetails(imdbID).then(d => d.Response === 'True' && setMovie(d)).catch(() => { });
    }, [imdbID]);

    const poster = movie?.Poster && movie.Poster !== 'N/A' ? movie.Poster : FALLBACK;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ background: '#1f1f1f', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}
        >
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate(`/movie/${imdbID}`)}>
                <img src={poster} alt={movie?.Title || '?'} onError={e => { e.target.src = FALLBACK; }}
                    style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)', opacity: 0, transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0} />
            </div>
            <div style={{ padding: '10px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {movie?.Title || '…'}
                </p>
                <p style={{ fontSize: '11px', color: '#777', marginBottom: '8px' }}>{movie?.Year}</p>
                <button onClick={() => onRemove(imdbID)}
                    style={{ width: '100%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#f87171', fontSize: '12px', padding: '6px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 500, transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}>
                    ✕ Remove
                </button>
            </div>
        </motion.div>
    );
}

export default function Profile() {
    const { user, logout, removeFromMyList } = useAuth();
    const navigate = useNavigate();
    const [toast, setToast] = useState({ message: '', type: 'success' });

    const handleLogout = () => { logout(); navigate('/'); };

    const handleRemove = (id) => {
        removeFromMyList(id);
        setToast({ message: 'Removed from My List', type: 'error' });
    };

    const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown';

    return (
        <div style={{ background: '#141414', minHeight: '100vh', paddingBottom: '80px' }}>
            <Navbar />
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: '' })} />

            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '120px 48px 0' }}>
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', gap: '32px', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap' }}>
                    {/* Avatar */}
                    <div style={{ width: '100px', height: '100px', borderRadius: '12px', background: 'linear-gradient(135deg, #e50914, #b00610)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px', fontWeight: 700, color: '#fff', flexShrink: 0, boxShadow: '0 8px 30px rgba(229,9,20,0.3)' }}>
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>{user?.name}</h1>
                        <p style={{ color: '#888', fontSize: '15px', marginBottom: '4px' }}>{user?.email}</p>
                        <p style={{ color: '#555', fontSize: '13px' }}>Member since {memberSince}</p>
                    </div>
                    <button onClick={handleLogout}
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1.5px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#f87171', padding: '11px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}>
                        🚪 Sign Out
                    </button>
                </motion.div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '48px' }}>
                    {[
                        { label: 'My List', value: user?.myList?.length || 0, icon: '📋' },
                        { label: 'Plan', value: 'Premium', icon: '⭐' },
                        { label: 'Downloads', value: '∞', icon: '⬇️' },
                        { label: 'Screens', value: '4', icon: '📺' },
                    ].map(s => (
                        <div key={s.label} style={{ background: '#1f1f1f', borderRadius: '10px', padding: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
                            <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>{s.value}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* My List */}
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#e5e5e5', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        📋 My List
                        <span style={{ fontSize: '14px', color: '#666', fontWeight: 400 }}>({user?.myList?.length || 0} titles)</span>
                    </h2>

                    {!user?.myList?.length ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{ textAlign: 'center', padding: '60px 20px', background: '#1a1a1a', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
                            <p style={{ color: '#888', fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>Your list is empty</p>
                            <p style={{ color: '#555', fontSize: '14px', marginBottom: '24px' }}>Browse movies and add them to your list</p>
                            <button onClick={() => navigate('/browse')}
                                style={{ background: '#e50914', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                Browse Movies
                            </button>
                        </motion.div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                            {user.myList.map(id => (
                                <ListMovieCard key={id} imdbID={id} onRemove={handleRemove} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

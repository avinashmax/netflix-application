import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMovieDetails } from '../api/omdb';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

const FALLBACK = 'https://via.placeholder.com/400x600/1a1a1a/666?text=No+Poster';

export default function MovieDetails() {
    const { imdbID } = useParams();
    const navigate = useNavigate();
    const { isInMyList, addToMyList, removeFromMyList } = useAuth();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState({ message: '', type: 'success' });

    useEffect(() => {
        setLoading(true);
        getMovieDetails(imdbID)
            .then(data => {
                if (data.Response === 'True') setMovie(data);
                else setError(data.Error || 'Movie not found.');
            })
            .catch(() => setError('Failed to load. Is the proxy server running?'))
            .finally(() => setLoading(false));
    }, [imdbID]);

    const handleList = () => {
        if (isInMyList(imdbID)) {
            removeFromMyList(imdbID);
            setToast({ message: 'Removed from My List', type: 'error' });
        } else {
            addToMyList(imdbID);
            setToast({ message: 'Added to My List ✓', type: 'success' });
        }
    };

    const poster = movie?.Poster && movie.Poster !== 'N/A' ? movie.Poster : FALLBACK;
    const inList = isInMyList(imdbID);

    if (loading) return (
        <div style={{ background: '#141414', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Navbar />
            <div style={{ width: '48px', height: '48px', border: '4px solid #333', borderTopColor: '#e50914', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error) return (
        <div style={{ background: '#141414', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <Navbar />
            <p style={{ color: '#f87171', fontSize: '18px' }}>{error}</p>
            <button onClick={() => navigate('/browse')} style={{ background: '#e50914', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Back to Browse</button>
        </div>
    );

    return (
        <div style={{ background: '#141414', minHeight: '100vh' }}>
            <Navbar />
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: '' })} />

            {/* Backdrop */}
            <div style={{ position: 'relative', height: '60vh', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: `url(${poster}) center/cover`, filter: 'blur(3px) brightness(0.3)', transform: 'scale(1.05)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #141414 0%, transparent 50%)' }} />
            </div>

            {/* Main content */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 48px', marginTop: '-280px', position: 'relative', zIndex: 10 }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', alignItems: 'flex-start' }}
                >
                    {/* Poster */}
                    <img src={poster} alt={movie.Title}
                        onError={e => { e.target.src = FALLBACK; }}
                        style={{ width: '240px', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', flexShrink: 0 }} />

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: '280px' }}>
                        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#fff', marginBottom: '12px', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
                            {movie.Title}
                        </h1>

                        {/* Meta row */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                            {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                                <span style={{ color: '#f5c518', fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>⭐ {movie.imdbRating}</span>
                            )}
                            {[movie.Year, movie.Runtime, movie.Rated].filter(m => m && m !== 'N/A').map(m => (
                                <span key={m} style={{ fontSize: '13px', color: '#aaa', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', padding: '3px 10px' }}>{m}</span>
                            ))}
                        </div>

                        {/* Genres */}
                        {movie.Genre && movie.Genre !== 'N/A' && (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                {movie.Genre.split(',').map(g => (
                                    <span key={g} style={{ fontSize: '12px', fontWeight: 600, color: '#e50914', border: '1px solid rgba(229,9,20,0.4)', borderRadius: '20px', padding: '3px 12px' }}>{g.trim()}</span>
                                ))}
                            </div>
                        )}

                        {/* Plot */}
                        {movie.Plot && movie.Plot !== 'N/A' && (
                            <p style={{ fontSize: '15px', color: '#ccc', lineHeight: 1.7, marginBottom: '24px' }}>{movie.Plot}</p>
                        )}

                        {/* Crew */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
                            {[['Director', movie.Director], ['Actors', movie.Actors], ['Language', movie.Language], ['Country', movie.Country]].filter(([, v]) => v && v !== 'N/A').map(([label, value]) => (
                                <div key={label}>
                                    <p style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>{label}</p>
                                    <p style={{ fontSize: '14px', color: '#ddd' }}>{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                style={{ background: '#fff', color: '#000', border: 'none', borderRadius: '8px', padding: '13px 28px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                ▶ Play
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                onClick={handleList}
                                style={{ background: inList ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.1)', color: '#fff', border: inList ? '2px solid #e50914' : '2px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '13px 24px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', backdropFilter: 'blur(4px)' }}>
                                {inList ? '✓ In My List' : '+ My List'}
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                onClick={() => navigate(-1)}
                                style={{ background: 'transparent', color: '#aaa', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '13px 20px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                ← Back
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

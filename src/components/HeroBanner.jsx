import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FALLBACK = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80';

export default function HeroBanner({ movie }) {
    const navigate = useNavigate();
    if (!movie) return null;

    const backdrop = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : FALLBACK;

    return (
        <div style={{ position: 'relative', height: '85vh', minHeight: '520px', overflow: 'hidden', marginBottom: '20px' }}>
            {/* Background */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `url(${backdrop}) center/cover no-repeat`,
                filter: 'blur(0px)',
                transform: 'scale(1.05)',
            }} />
            {/* Gradient overlays */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.6) 50%, rgba(20,20,20,0.1) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,20,20,1) 0%, transparent 40%)' }} />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ position: 'absolute', bottom: '20%', left: '48px', maxWidth: '520px', zIndex: 10 }}
            >
                {/* Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ background: '#e50914', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '3px', letterSpacing: '1px' }}>
                        FEATURED
                    </div>
                    {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                        <div style={{ color: '#f5c518', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            ⭐ {movie.imdbRating}/10
                        </div>
                    )}
                </div>

                <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.5px' }}>
                    {movie.Title}
                </h1>

                {/* Meta */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {[movie.Year, movie.Runtime, movie.Genre?.split(',')[0]].filter(Boolean).map(m => (
                        <span key={m} style={{ fontSize: '13px', color: '#ccc', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', padding: '3px 10px' }}>{m}</span>
                    ))}
                </div>

                {movie.Plot && movie.Plot !== 'N/A' && (
                    <p style={{ fontSize: '15px', color: '#ddd', lineHeight: 1.6, marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {movie.Plot}
                    </p>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(`/movie/${movie.imdbID}`)}
                        style={{ background: '#fff', color: '#000', border: 'none', borderRadius: '6px', padding: '12px 28px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif' }}>
                        ▶ Play
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(`/movie/${movie.imdbID}`)}
                        style={{ background: 'rgba(109,109,110,0.7)', color: '#fff', border: 'none', borderRadius: '6px', padding: '12px 28px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(4px)', fontFamily: 'Inter, sans-serif' }}>
                        ℹ More Info
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}

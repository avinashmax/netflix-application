import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FALLBACK = 'https://via.placeholder.com/300x450/1a1a1a/666?text=No+Image';

export default function MovieCard({ movie }) {
    const navigate = useNavigate();
    const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : FALLBACK;

    return (
        <motion.div
            onClick={() => navigate(`/movie/${movie.imdbID}`)}
            whileHover={{ scale: 1.08, zIndex: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
                flexShrink: 0, width: '160px', cursor: 'pointer',
                borderRadius: '8px', overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
        >
            <div style={{ position: 'relative', aspectRatio: '2/3' }}>
                <img
                    src={poster}
                    alt={movie.Title}
                    onError={e => { e.target.src = FALLBACK; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                />
                {/* Hover overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '10px',
                    }}
                >
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#fff', lineHeight: 1.3, margin: 0 }}>{movie.Title}</p>
                    <p style={{ fontSize: '11px', color: '#aaa', margin: '3px 0 0' }}>{movie.Year}</p>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <span style={{ fontSize: '10px', background: 'rgba(229,9,20,0.8)', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontWeight: 600 }}>▶ Play</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

import { useRef } from 'react';
import MovieCard from './MovieCard';
import SkeletonLoader from './SkeletonLoader';

export default function MovieRow({ title, movies, loading }) {
    const rowRef = useRef(null);

    const scroll = (dir) => {
        if (rowRef.current) {
            rowRef.current.scrollBy({ left: dir * 500, behavior: 'smooth' });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowRight') scroll(1);
        if (e.key === 'ArrowLeft') scroll(-1);
    };

    return (
        <div style={{ marginBottom: '40px' }} onKeyDown={handleKeyDown} tabIndex={0}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#e5e5e5', marginBottom: '12px', paddingLeft: '48px' }}>
                {title}
            </h2>
            <div style={{ position: 'relative' }}>
                {/* Left arrow */}
                <button onClick={() => scroll(-1)}
                    style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer', padding: '20px 12px', borderRadius: '0 6px 6px 0', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.9)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}>
                    ‹
                </button>

                <div
                    ref={rowRef}
                    className="movie-row-scroll"
                    style={{ display: 'flex', gap: '8px', paddingLeft: '48px', paddingRight: '48px' }}
                >
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <SkeletonLoader key={i} />)
                        : movies?.map(m => <MovieCard key={m.imdbID} movie={m} />)
                    }
                </div>

                {/* Right arrow */}
                <button onClick={() => scroll(1)}
                    style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer', padding: '20px 12px', borderRadius: '6px 0 0 6px', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.9)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}>
                    ›
                </button>
            </div>
        </div>
    );
}

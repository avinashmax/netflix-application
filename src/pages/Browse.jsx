import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import MovieCard from '../components/MovieCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { searchMovies } from '../api/omdb';

const CATEGORIES = [
    { title: '🔥 Trending Now', query: 'avengers' },
    { title: '💥 Action', query: 'mission impossible' },
    { title: '😂 Comedy', query: 'comedy 2023' },
    { title: '🎭 Drama', query: 'drama award' },
    { title: '✨ Marvel Universe', query: 'marvel' },
];

function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

export default function Browse() {
    const [rows, setRows] = useState({});
    const [loadingRows, setLoadingRows] = useState({});
    const [hero, setHero] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 400);

    // Fetch category rows on mount
    useEffect(() => {
        CATEGORIES.forEach(async ({ title, query }) => {
            setLoadingRows(prev => ({ ...prev, [title]: true }));
            try {
                const data = await searchMovies(query);
                if (data.Response === 'True' && data.Search) {
                    setRows(prev => ({ ...prev, [title]: data.Search }));
                    // Set hero from first category
                    if (title === CATEGORIES[0].title && !hero) {
                        const pick = data.Search[Math.floor(Math.random() * data.Search.length)];
                        // Try to get full details for hero
                        const { getMovieDetails } = await import('../api/omdb');
                        try {
                            const details = await getMovieDetails(pick.imdbID);
                            setHero(details.Response === 'True' ? details : pick);
                        } catch {
                            setHero(pick);
                        }
                    }
                }
            } catch {
                // silently fail per row
            } finally {
                setLoadingRows(prev => ({ ...prev, [title]: false }));
            }
        });
    }, []);

    // Search handler
    useEffect(() => {
        if (!debouncedSearch.trim()) {
            setSearchResults([]);
            setSearchError('');
            return;
        }
        setSearchLoading(true);
        setSearchError('');
        searchMovies(debouncedSearch)
            .then(data => {
                if (data.Response === 'True') {
                    setSearchResults(data.Search || []);
                } else {
                    setSearchResults([]);
                    setSearchError(data.Error || 'No results found.');
                }
            })
            .catch(() => setSearchError('Failed to fetch. Is the proxy server running?'))
            .finally(() => setSearchLoading(false));
    }, [debouncedSearch]);

    const handleSearch = useCallback((val) => setSearchQuery(val), []);

    return (
        <div style={{ background: '#141414', minHeight: '100vh' }}>
            <Navbar onSearch={handleSearch} />

            {/* Hero Banner */}
            {!searchQuery && <HeroBanner movie={hero} />}

            {/* Search results */}
            {searchQuery && (
                <div style={{ paddingTop: '100px', paddingLeft: '48px', paddingRight: '48px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#e5e5e5', marginBottom: '20px' }}>
                        {searchLoading ? 'Searching…' : searchError ? searchError : `Results for "${debouncedSearch}"`}
                    </h2>
                    {searchLoading ? (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {Array.from({ length: 10 }).map((_, i) => <SkeletonLoader key={i} />)}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                            {searchResults.map(m => <MovieCard key={m.imdbID} movie={m} />)}
                        </div>
                    )}
                </div>
            )}

            {/* Category rows */}
            {!searchQuery && (
                <div style={{ paddingTop: '16px' }}>
                    {CATEGORIES.map(({ title }) => (
                        <MovieRow
                            key={title}
                            title={title}
                            movies={rows[title] || []}
                            loading={loadingRows[title]}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

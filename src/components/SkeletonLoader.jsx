export default function SkeletonLoader() {
    return (
        <div style={{ flexShrink: 0, width: '160px', borderRadius: '8px', overflow: 'hidden', aspectRatio: '2/3' }}>
            <div className="skeleton" style={{ width: '100%', height: '100%', background: '#2a2a2a', borderRadius: '8px' }} />
        </div>
    );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
    { icon: '📺', title: 'Enjoy on your TV', desc: 'Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.' },
    { icon: '📱', title: 'Download & go', desc: 'Save your favourites easily and always have something to watch offline.' },
    { icon: '👨‍👩‍👧', title: 'Watch everywhere', desc: 'Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.' },
    { icon: '🧒', title: 'Kids profiles', desc: 'Send kids on adventures with their favourite characters in a space made just for them.' },
];

export default function Landing() {
    return (
        <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            {/* Hero */}
            <div style={{
                position: 'relative', minHeight: '100vh',
                background: 'url("https://assets.nflxext.com/ffe/siteui/vlv3/b4f8d5c7-4a1e-4bea-b52f-73c24fa7a1ef/web/IN-en-20240115-POP_SIGNUP_TWO_WEEKS-perspective_WEB_5e619a38-c54d-4e69-9a11-0fe0d2e685a2_large.jpg") center/cover no-repeat',
                display: 'flex', flexDirection: 'column',
            }}>
                {/* Gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.9) 100%)' }} />

                {/* Nav */}
                <nav style={{ position: 'relative', zIndex: 10, padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '32px', fontWeight: 900, color: '#e50914', letterSpacing: '-1px' }}>NETFLX</span>
                    <Link to="/login">
                        <button style={{ background: '#e50914', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '6px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                            Sign In
                        </button>
                    </Link>
                </nav>

                {/* Hero content */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', zIndex: 10, padding: '80px 24px' }}>
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, marginBottom: '20px', lineHeight: 1.1, letterSpacing: '-1px' }}>
                            Unlimited movies, TV shows,<br />and more.
                        </h1>
                        <p style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#e5e5e5', marginBottom: '12px', fontWeight: 400 }}>
                            Starts at ₹149. Cancel anytime.
                        </p>
                        <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#e5e5e5', marginBottom: '36px' }}>
                            Ready to watch? Create your account.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/signup">
                                <motion.button
                                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}
                                    style={{ background: '#e50914', color: '#fff', border: 'none', padding: '16px 36px', borderRadius: '8px', fontWeight: 700, fontSize: '18px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Get Started ›
                                </motion.button>
                            </Link>
                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}
                                    style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '2px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', padding: '16px 36px', borderRadius: '8px', fontWeight: 600, fontSize: '18px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                    Sign In
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Divider */}
            <div style={{ height: '8px', background: '#222' }} />

            {/* Features */}
            {features.map((f, i) => (
                <div key={f.title}>
                    <motion.div
                        initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '60px', padding: '80px 48px', flexWrap: 'wrap', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
                        <div style={{ maxWidth: '500px' }}>
                            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>{f.title}</h2>
                            <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#b3b3b3', lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                        <div style={{ fontSize: '100px', filter: 'drop-shadow(0 0 30px rgba(229,9,20,0.3))' }}>{f.icon}</div>
                    </motion.div>
                    <div style={{ height: '8px', background: '#222' }} />
                </div>
            ))}

            {/* FAQ */}
            <div style={{ padding: '80px 48px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '44px', fontWeight: 800, marginBottom: '48px' }}>Frequently Asked Questions</h2>
                {[
                    { q: 'What is Netflx?', a: 'Netflx is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more.' },
                    { q: 'How much does Netflx cost?', a: 'Watch Netflx on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from ₹149 to ₹649 a month.' },
                    { q: 'Where can I watch?', a: 'Watch anywhere, anytime. Sign in with your Netflx account to watch instantly on the web at netflx.com from your personal computer.' },
                    { q: 'How do I cancel?', a: 'Netflx is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks.' },
                ].map(({ q, a }) => (
                    <details key={q} style={{ background: '#2a2a2a', marginBottom: '2px', borderRadius: '4px', textAlign: 'left', padding: '20px 24px', cursor: 'pointer' }}>
                        <summary style={{ fontSize: '20px', fontWeight: 500, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {q} <span style={{ fontSize: '24px' }}>+</span>
                        </summary>
                        <p style={{ marginTop: '16px', fontSize: '16px', color: '#b3b3b3', lineHeight: 1.6 }}>{a}</p>
                    </details>
                ))}
            </div>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid #333', padding: '48px', color: '#666', fontSize: '13px' }}>
                <p style={{ marginBottom: '16px' }}>Questions? Call 000-800-919-1694</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px', marginBottom: '24px' }}>
                    {['FAQ', 'Investor Relations', 'Privacy', 'Speed Test', 'Help Centre', 'Jobs', 'Cookie Preferences', 'Legal Notices', 'Account', 'Ways to Watch', 'Corporate Information', 'Contact Us'].map(l => (
                        <span key={l} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{l}</span>
                    ))}
                </div>
                <p>Netflx India</p>
            </footer>
        </div>
    );
}

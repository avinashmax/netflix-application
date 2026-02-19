import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        if (!message) return;
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [message, onClose]);

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    className={`toast ${type}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    onClick={onClose}
                    style={{ cursor: 'pointer' }}
                >
                    <span style={{ fontSize: '18px' }}>{type === 'success' ? '✓' : '⚠'}</span>
                    <span>{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

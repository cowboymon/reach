import { motion } from 'motion/react';
import { Navigation } from '../components/Navigation';

export function Profile() {
  return (
    <div className="min-h-screen bg-[var(--reach-linen)] flex flex-col max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-1 px-10 pt-24 pb-28 overflow-auto"
      >
        <h1
          className="mb-16"
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--reach-ink)',
            lineHeight: 1.4,
            letterSpacing: '-0.02em',
          }}
        >Your universe</h1>
        
        <div className="space-y-12">
          <div className="border-b pb-8" style={{ borderColor: 'rgba(28, 24, 20, 0.08)' }}>
            <p
              className="mb-3"
              style={{
                fontSize: '0.875rem',
                color: 'var(--reach-ink)',
                opacity: 0.5,
                lineHeight: 1.8,
              }}
            >Stars in your constellation</p>
            <h2
              style={{
                fontSize: '3rem',
                fontWeight: 700,
                color: 'var(--reach-ink)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >24</h2>
          </div>
          
          <div className="border-b pb-8" style={{ borderColor: 'rgba(28, 24, 20, 0.08)' }}>
            <p
              className="mb-3"
              style={{
                fontSize: '0.875rem',
                color: 'var(--reach-ink)',
                opacity: 0.5,
                lineHeight: 1.8,
              }}
            >
              Conversations this month
            </p>
            <h2
              style={{
                fontSize: '3rem',
                fontWeight: 700,
                color: 'var(--reach-ink)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              17
            </h2>
          </div>
        </div>
      </motion.div>
      
      <Navigation />
    </div>
  );
}
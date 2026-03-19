import { motion } from 'motion/react';
import { Navigation } from '../components/Navigation';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { Settings } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const [showSkipMessage, setShowSkipMessage] = useState(false);
  const [deferMessage] = useState(() => {
    const messages = [
      "Some days aren't the day. Tomorrow might be.",
      "They'll still be there tomorrow.",
      "Still there. Try tomorrow."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  });
  
  const contact = {
    name: 'Sarah Chen',
    tier: 'Reconnecting',
    lastNote: 'She just started a new job in April.',
  };
  
  const handleReachOut = () => {
    navigate('/reach-out');
  };
  
  const handleNotToday = () => {
    setShowSkipMessage(true);
    setTimeout(() => {
      setShowSkipMessage(false);
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-[var(--reach-linen)] flex flex-col max-w-md mx-auto">
      {/* Header with Settings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex items-center justify-end px-6 pt-6 pb-4"
      >
        <button
          onClick={() => navigate('/settings')}
          className="transition-all duration-700 hover:opacity-100"
          style={{ color: 'var(--reach-ink)', opacity: 0.4 }}
        >
          <Settings size={24} strokeWidth={1.5} />
        </button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-1 flex flex-col items-center justify-center px-10 pb-28"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-sm"
        >
          {/* Contact Card - simple, paper-like */}
          <div className="py-12">
            <div className="text-center mb-16">
              <h1
                className="mb-3"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: 'var(--reach-ink)',
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                }}
              >
                {contact.name}
              </h1>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--reach-ink)',
                  opacity: 0.4,
                  lineHeight: 1.8,
                  marginBottom: '2rem',
                }}
              >
                {contact.tier}
              </p>
              <p
                className="italic px-4 mb-8"
                style={{
                  fontSize: '1.125rem',
                  color: 'var(--reach-ink)',
                  opacity: 0.5,
                  lineHeight: 2,
                }}
              >
                {contact.lastNote}
              </p>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--reach-ink)',
                  opacity: 0.35,
                  lineHeight: 1.8,
                }}
              >
                It's been 3 weeks
              </p>
            </div>
            
            {/* Actions - understated */}
            <div className="space-y-4">
              <button
                onClick={handleReachOut}
                className="w-full py-4 transition-all duration-700 border"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--reach-ink)',
                  fontWeight: 500,
                  borderColor: 'rgba(28, 24, 20, 0.2)',
                  borderRadius: '4px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Reach out
              </button>
              
              {/* Not today - small text link, NOT a button */}
              <button
                onClick={handleNotToday}
                className="w-full py-3 transition-all duration-700 underline"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--reach-ink)',
                  fontWeight: 400,
                  fontSize: '0.875rem',
                  opacity: 0.4,
                  border: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Not today
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      <Navigation />
      
      {showSkipMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-32 left-0 right-0 flex justify-center px-10 max-w-md mx-auto"
        >
          <p
            className="italic text-center px-8 py-6"
            style={{
              fontSize: '1.125rem',
              color: 'var(--reach-ink)',
              opacity: 0.6,
              lineHeight: 2,
              backgroundColor: 'var(--reach-kraft)',
              borderRadius: '4px',
            }}
          >
            {deferMessage}
          </p>
        </motion.div>
      )}
    </div>
  );
}
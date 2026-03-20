import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export function OnboardingThree() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  
  const handleNameChange = (value: string) => {
    setName(value);
  };
  
  const handleContinue = () => {
    navigate('/onboarding/swipe');
  };
  
  return (
    <div className="min-h-screen bg-[var(--reach-linen)] flex flex-col max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-1 flex flex-col px-10 pt-24 pb-12"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex-1 flex flex-col"
        >
          {/* Question - quiet and spacious */}
          <h1
            className="mb-8"
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--reach-ink)',
              lineHeight: 1.4,
              letterSpacing: '-0.02em',
            }}
          >
            Every constellation starts with one star. Who's yours?
          </h1>
          
          {/* Input Fields - minimal, close to headline */}
          <div className="mb-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Their first name"
                className="w-full bg-transparent border-b px-0 py-4 focus:outline-none focus:border-[var(--reach-gold)] transition-all duration-700 italic placeholder:italic placeholder:opacity-30"
                style={{
                  color: 'var(--reach-ink)',
                  lineHeight: 1.8,
                  fontSize: '1.125rem',
                  borderColor: 'rgba(28, 24, 20, 0.15)',
                  fontStyle: name ? 'normal' : undefined,
                }}
              />
            </motion.div>
          </div>
          
          {/* Continue Button - understated, activates on input */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: name.trim() ? 1 : 0.4 }}
            transition={{ duration: 1.2, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={handleContinue}
            disabled={!name.trim()}
            className="w-full py-5 transition-all duration-700 mt-16 border"
            style={{
              backgroundColor: name.trim() ? 'transparent' : 'transparent',
              color: 'var(--reach-ink)',
              fontWeight: 500,
              borderColor: name.trim() ? 'rgba(28, 24, 20, 0.2)' : 'rgba(28, 24, 20, 0.1)',
              borderRadius: '4px',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            That's the one
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
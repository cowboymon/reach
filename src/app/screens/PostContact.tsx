import { motion } from 'motion/react';
import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { useNavigate } from 'react-router';

export function PostContact() {
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const navigate = useNavigate();
  
  const feelings = ['Good', 'Quiet', 'Hard'];
  
  const handleDone = () => {
    navigate('/home');
  };
  
  return (
    <div className="min-h-screen bg-[var(--reach-linen)] flex flex-col max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-1 flex flex-col px-10 pt-24 pb-28"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex-1"
        >
          {/* Question */}
          <h2
            className="italic mb-16"
            style={{
              fontSize: '1.5rem',
              color: 'var(--reach-ink)',
              lineHeight: 1.6,
              opacity: 0.65,
              fontWeight: 400,
            }}
          >
            How did it go?
          </h2>
          
          {/* Feeling Options - simple, minimal */}
          <div className="flex gap-3 mb-16">
            {feelings.map((feeling) => (
              <button
                key={feeling}
                onClick={() => setSelectedFeeling(feeling)}
                className="flex-1 py-4 transition-all duration-700 border"
                style={{
                  backgroundColor:
                    selectedFeeling === feeling
                      ? 'var(--reach-gold)'
                      : 'transparent',
                  color: 'var(--reach-ink)',
                  fontWeight: selectedFeeling === feeling ? 600 : 400,
                  borderColor:
                    selectedFeeling === feeling
                      ? 'var(--reach-gold)'
                      : 'rgba(28, 24, 20, 0.15)',
                  borderRadius: '4px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {feeling}
              </button>
            ))}
          </div>
          
          {/* Memory Note */}
          <div>
            <label
              className="italic mb-2 block"
              style={{
                fontSize: '1.125rem',
                color: 'var(--reach-ink)',
                opacity: 0.5,
                lineHeight: 2,
              }}
            >
              What were they up to?
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="A few words. Just for you."
              maxLength={140}
              className="w-full bg-[var(--reach-kraft)] resize-none border focus:outline-none focus:border-[var(--reach-gold)] transition-all duration-700"
              rows={6}
              style={{
                color: 'var(--reach-ink)',
                lineHeight: 2,
                padding: '1.25rem',
                borderColor: 'rgba(28, 24, 20, 0.1)',
                borderRadius: '4px',
              }}
            />
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--reach-ink)',
                opacity: 0.35,
                marginTop: '0.5rem',
              }}
            >
              Optional
            </p>
          </div>
          
          {/* Done Button */}
          <button
            onClick={handleDone}
            disabled={!selectedFeeling}
            className="w-full py-4 mt-16 transition-all duration-700 border"
            style={{
              backgroundColor: selectedFeeling ? 'var(--reach-gold)' : 'transparent',
              color: 'var(--reach-ink)',
              fontWeight: selectedFeeling ? 600 : 500,
              borderColor: selectedFeeling ? 'var(--reach-gold)' : 'rgba(28, 24, 20, 0.15)',
              borderRadius: '4px',
              opacity: selectedFeeling ? 1 : 0.4,
              cursor: selectedFeeling ? 'pointer' : 'not-allowed',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Done
          </button>
        </motion.div>
      </motion.div>
      
      <Navigation />
    </div>
  );
}
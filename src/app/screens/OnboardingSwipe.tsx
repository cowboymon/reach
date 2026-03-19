import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Check } from 'lucide-react';

const suggestions = [
  { name: 'Alex Johnson', context: 'College friend' },
  { name: 'Maria Garcia', context: 'Old coworker' },
  { name: 'Ryan Thompson', context: 'Neighbor' },
  { name: 'Jessica Lee', context: 'Childhood friend' },
  { name: 'Michael Brown', context: 'Book club' },
];

export function OnboardingSwipe() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const toggleSelect = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const handleContinue = () => {
    localStorage.setItem('reach-onboarded', 'true');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[var(--reach-linen)] flex flex-col max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-1 flex flex-col px-10 pt-24 pb-12"
      >
        {/* Prompt */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 1.4,
            delay: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-16"
        >
          <h1
            className="mb-4"
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--reach-ink)',
              lineHeight: 1.4,
              letterSpacing: '-0.02em',
            }}
          >
            Who belongs in your constellation?
          </h1>
          <p
            className="italic"
            style={{
              fontSize: '1rem',
              color: 'var(--reach-ink)',
              opacity: 0.45,
              lineHeight: 1.8,
            }}
          >
            Tap anyone you want to stay close to.
          </p>
        </motion.div>

        {/* Contact list — quiet tap targets */}
        <div className="flex-1 space-y-1">
          {suggestions.map((person, index) => {
            const isSelected = selected.has(person.name);
            return (
              <motion.button
                key={person.name}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 1.0,
                  delay: 0.1 * (index + 3),
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                onClick={() => toggleSelect(person.name)}
                className="w-full flex items-center justify-between py-5 transition-all duration-700"
                style={{
                  borderBottom: '1px solid rgba(28, 24, 20, 0.06)',
                }}
              >
                <div className="text-left">
                  <span
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: isSelected ? 700 : 600,
                      color: 'var(--reach-ink)',
                      lineHeight: 1.5,
                      opacity: isSelected ? 1 : 0.7,
                      fontFamily: "'Fraunces', serif",
                    }}
                  >
                    {person.name}
                  </span>
                  <span
                    className="block"
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--reach-ink)',
                      opacity: 0.35,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      marginTop: '2px',
                    }}
                  >
                    {person.context}
                  </span>
                </div>

                {/* Check indicator */}
                <div
                  className="shrink-0 flex items-center justify-center rounded-full transition-all duration-700"
                  style={{
                    width: '28px',
                    height: '28px',
                    backgroundColor: isSelected
                      ? 'var(--reach-gold)'
                      : 'transparent',
                    border: isSelected
                      ? '2px solid var(--reach-gold)'
                      : '2px solid rgba(28, 24, 20, 0.12)',
                  }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <Check
                        size={14}
                        strokeWidth={2.5}
                        color="var(--reach-linen)"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-12 space-y-4"
        >
          <button
            onClick={handleContinue}
            disabled={selected.size === 0}
            className="w-full py-4 transition-all duration-700 border"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--reach-ink)',
              fontWeight: 500,
              borderColor:
                selected.size > 0
                  ? 'rgba(28, 24, 20, 0.2)'
                  : 'rgba(28, 24, 20, 0.1)',
              borderRadius: '4px',
              opacity: selected.size > 0 ? 1 : 0.4,
              cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {selected.size > 0
              ? `Continue with ${selected.size} ${selected.size === 1 ? 'person' : 'people'}`
              : 'Select someone'}
          </button>

          <button
            onClick={() => {
              localStorage.setItem('reach-onboarded', 'true');
              navigate('/home');
            }}
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
            I'll add people later
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
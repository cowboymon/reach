import { motion } from 'motion/react';
import { Navigation } from '../components/Navigation';
import { useNavigate } from 'react-router';

export function Rhythm() {
  const navigate = useNavigate();
  const days = [
    { label: 'Mon', name: 'Sarah Chen', feeling: 'Good' },
    { label: 'Tue', name: null, feeling: null },
    { label: 'Wed', name: 'Marcus Liu', feeling: 'Good' },
    { label: 'Thu', name: 'Elena Rodriguez', feeling: 'Quiet' },
    { label: 'Fri', name: null, feeling: null },
    { label: 'Sat', name: 'David Park', feeling: 'Good' },
    { label: 'Sun', name: null, feeling: null },
  ];

  const feelingColors: Record<string, string> = {
    Good: 'var(--reach-amber)',
    Quiet: 'var(--reach-sage)',
    Hard: 'var(--reach-rose)',
  };

  const reachedCount = days.filter((d) => d.name).length;

  return (
    <div className="min-h-screen bg-[var(--reach-linen)] flex flex-col max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-1 px-10 pt-24 pb-28 overflow-auto"
      >
        {/* Headline */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16"
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--reach-ink)',
            lineHeight: 1.4,
            letterSpacing: '-0.02em',
          }}
        >
          Your constellation this week.
        </motion.h1>

        {/* Rhythm visualization — dots and names by day */}
        <div className="mb-16">
          {days.map((day, index) => (
            <motion.div
              key={day.label}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 1.0,
                delay: 0.12 * (index + 2),
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="flex items-center gap-5"
              style={{
                paddingTop: day.name ? '1.5rem' : '0.85rem',
                paddingBottom: day.name ? '1.5rem' : '0.85rem',
                borderBottom: '1px solid rgba(28, 24, 20, 0.06)',
              }}
            >
              {/* Day label */}
              <span
                className="shrink-0"
                style={{
                  width: '2.5rem',
                  fontSize: '0.8rem',
                  color: 'var(--reach-ink)',
                  opacity: day.name ? 0.5 : 0.25,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 500,
                }}
              >
                {day.label}
              </span>

              {/* Dot */}
              <div className="shrink-0 flex items-center justify-center" style={{ width: '20px' }}>
                {day.name ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.12 * (index + 2) + 0.3,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="rounded-full"
                    style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: feelingColors[day.feeling!],
                    }}
                  />
                ) : (
                  <div
                    className="rounded-full"
                    style={{
                      width: '4px',
                      height: '4px',
                      backgroundColor: 'var(--reach-ink)',
                      opacity: 0.1,
                    }}
                  />
                )}
              </div>

              {/* Name and feeling */}
              {day.name ? (
                <button
                  onClick={() => navigate('/contact')}
                  className="flex items-baseline gap-3 text-left transition-all duration-700 hover:opacity-70"
                >
                  <span
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--reach-ink)',
                      lineHeight: 1.5,
                      fontFamily: "'Fraunces', serif",
                    }}
                  >
                    {day.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: feelingColors[day.feeling!],
                      fontWeight: 500,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {day.feeling}
                  </span>
                </button>
              ) : (
                <span
                  className="italic"
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--reach-ink)',
                    opacity: 0.2,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  rest
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Summary line */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.12 * (days.length + 3),
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="italic text-center"
          style={{
            fontSize: '1.125rem',
            color: 'var(--reach-ink)',
            opacity: 0.5,
            lineHeight: 2,
          }}
        >
          {reachedCount} people this week. A good rhythm.
        </motion.p>
      </motion.div>

      <Navigation />
    </div>
  );
}
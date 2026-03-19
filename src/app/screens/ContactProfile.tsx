import { motion } from 'motion/react';
import { Navigation } from '../components/Navigation';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

interface Interaction {
  date: string;
  feeling: string;
  note: string;
}

export function ContactProfile() {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newFeeling, setNewFeeling] = useState<string | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([
    {
      date: 'March 8',
      feeling: 'Good',
      note: 'She just started a new job in April.',
    },
    {
      date: 'February 12',
      feeling: 'Good',
      note: "Talking about her mom's visit next month.",
    },
    {
      date: 'January 28',
      feeling: 'Quiet',
      note: 'Weekend plans, mentioned yoga.',
    },
  ]);

  const profile = {
    name: 'Sarah Chen',
    tier: 'Familiar',
    tierDescription:
      "We're finding our rhythm again. No pressure, just presence.",
  };

  const tierColors = {
    Drifted: 'var(--reach-rose)',
    Reconnecting: 'var(--reach-sage)',
    Familiar: 'var(--reach-mauve)',
    Back: 'var(--reach-gold)',
  };

  const feelingColors: Record<string, string> = {
    Good: 'var(--reach-amber)',
    Quiet: 'var(--reach-sage)',
    Hard: 'var(--reach-rose)',
  };

  return (
    <div className="min-h-screen bg-[var(--reach-linen)] flex flex-col max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-1 px-10 pt-16 pb-28 overflow-auto"
      >
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 transition-all duration-700"
            style={{ color: 'var(--reach-ink)', opacity: 0.4 }}
          >
            <ArrowLeft size={20} strokeWidth={1.5} />
          </button>

          <h1
            className="mb-6"
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: 'var(--reach-ink)',
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
            }}
          >
            {profile.name}
          </h1>

          <span
            className="inline-block px-4 py-1.5 mb-3"
            style={{
              backgroundColor:
                tierColors[profile.tier as keyof typeof tierColors],
              color: 'var(--reach-linen)',
              fontWeight: 500,
              fontSize: '0.875rem',
              borderRadius: '3px',
            }}
          >
            {profile.tier}
          </span>
          <p
            className="italic"
            style={{
              fontSize: '0.875rem',
              color: 'var(--reach-ink)',
              opacity: 0.5,
              lineHeight: 1.8,
            }}
          >
            {profile.tierDescription}
          </p>
        </div>

        {/* Interactions List - journal entries with woven feelings */}
        <div className="space-y-1 mb-16">
          {/* Log a reach out */}
          {!isAdding ? (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.1 }}
              onClick={() => setIsAdding(true)}
              className="w-full text-left py-5 pl-6 border-l-2 transition-all duration-700"
              style={{
                borderColor: 'rgba(28, 24, 20, 0.15)',
                color: 'var(--reach-ink)',
                opacity: 0.5,
                fontSize: '0.875rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontStyle: 'italic',
              }}
            >
              + Log a reach out
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="border-l-2 pl-6 py-5"
              style={{ borderColor: 'rgba(28, 24, 20, 0.15)' }}
            >
              {/* Date auto-stamped */}
              <div
                className="mb-3"
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--reach-ink)',
                  opacity: 0.4,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Today
              </div>

              {/* Note input */}
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="What stuck with you?"
                rows={2}
                className="w-full bg-transparent resize-none italic focus:outline-none mb-4"
                style={{
                  fontSize: '1.125rem',
                  color: 'var(--reach-ink)',
                  opacity: 0.6,
                  lineHeight: 2,
                  border: 'none',
                  fontFamily: 'inherit',
                }}
                autoFocus
              />

              {/* Feeling selector */}
              <div className="flex gap-3 mb-5">
                {(['Good', 'Quiet', 'Hard'] as const).map((feeling) => (
                  <button
                    key={feeling}
                    onClick={() => setNewFeeling(newFeeling === feeling ? null : feeling)}
                    className="px-3 py-1.5 transition-all duration-500 border"
                    style={{
                      borderColor:
                        newFeeling === feeling
                          ? feelingColors[feeling]
                          : 'rgba(28, 24, 20, 0.1)',
                      backgroundColor:
                        newFeeling === feeling
                          ? feelingColors[feeling]
                          : 'transparent',
                      color:
                        newFeeling === feeling
                          ? 'var(--reach-linen)'
                          : 'var(--reach-ink)',
                      opacity: newFeeling === feeling ? 1 : 0.4,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      borderRadius: '3px',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {feeling}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {newNote.trim() && newFeeling && (
                  <motion.button
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    onClick={() => {
                      const today = new Date();
                      const dateStr = today.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                      });
                      setInteractions([
                        { date: dateStr, feeling: newFeeling, note: newNote.trim() },
                        ...interactions,
                      ]);
                      setNewNote('');
                      setNewFeeling(null);
                      setIsAdding(false);
                    }}
                    className="py-2.5 px-5 transition-all duration-700 border"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--reach-ink)',
                      fontWeight: 500,
                      fontSize: '0.8rem',
                      borderColor: 'rgba(28, 24, 20, 0.2)',
                      borderRadius: '4px',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    Save
                  </motion.button>
                )}
                <button
                  onClick={() => {
                    setNewNote('');
                    setNewFeeling(null);
                    setIsAdding(false);
                  }}
                  className="py-2.5 px-4 transition-all duration-700"
                  style={{
                    color: 'var(--reach-ink)',
                    opacity: 0.3,
                    fontSize: '0.8rem',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {interactions.map((interaction, index) => (
            <motion.div
              key={`${interaction.date}-${index}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.2 * index,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="border-l-2 pl-6 py-5"
              style={{
                borderColor: feelingColors[interaction.feeling] || 'rgba(28, 24, 20, 0.1)',
              }}
            >
              {/* Date and type on one line */}
              <div
                className="flex items-center gap-2 mb-3"
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--reach-ink)',
                  opacity: 0.4,
                  lineHeight: 1.8,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                <span>{interaction.date}</span>
              </div>

              {/* Note as the primary content */}
              <p
                className="italic"
                style={{
                  fontSize: '1.125rem',
                  color: 'var(--reach-ink)',
                  opacity: 0.6,
                  lineHeight: 2,
                }}
              >
                {interaction.note}
              </p>

              {/* Feeling as a subtle, colored word beneath */}
              <span
                style={{
                  fontSize: '0.75rem',
                  color: feelingColors[interaction.feeling],
                  fontWeight: 500,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  marginTop: '0.5rem',
                  display: 'inline-block',
                }}
              >
                Felt {interaction.feeling.toLowerCase()}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Edit Tier Button - quiet */}
        <button
          className="w-full py-4 transition-all duration-700 border"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--reach-ink)',
            fontWeight: 500,
            borderColor: 'rgba(28, 24, 20, 0.15)',
            borderRadius: '4px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Edit tier
        </button>
      </motion.div>

      <Navigation />
    </div>
  );
}
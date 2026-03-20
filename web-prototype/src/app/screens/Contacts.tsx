import { motion } from 'motion/react';
import { Navigation } from '../components/Navigation';
import { useNavigate } from 'react-router';
import { Plus } from 'lucide-react';

export function Contacts() {
  const navigate = useNavigate();
  
  const contacts = [
    { name: 'Sarah Chen', tier: 'Familiar', lastContact: '2 days ago', memory: 'She just started a new job in April.' },
    { name: 'Marcus Liu', tier: 'Reconnecting', lastContact: '1 week ago', memory: 'His son is learning piano now.' },
    { name: 'Elena Rodriguez', tier: 'Back', lastContact: '3 days ago' },
    { name: 'David Park', tier: 'Familiar', lastContact: '5 days ago', memory: 'Planning a trip to Portland this summer.' },
  ];
  
  const tierColors = {
    Drifted: 'var(--reach-rose)',
    Reconnecting: 'var(--reach-sage)',
    Familiar: 'var(--reach-mauve)',
    Back: 'var(--reach-gold)',
  };
  
  return (
    <div className="min-h-screen bg-[var(--reach-linen)] flex flex-col max-w-md mx-auto">
      {/* Header with Plus button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex items-center justify-end px-6 pt-6 pb-4"
      >
        <button
          className="transition-all duration-700 hover:opacity-100"
          style={{ color: 'var(--reach-ink)', opacity: 0.4 }}
        >
          <Plus size={28} strokeWidth={1.5} />
        </button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-1 px-10 pb-28 overflow-auto"
      >
        <h1
          className="mb-12"
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--reach-ink)',
            lineHeight: 1.4,
            letterSpacing: '-0.02em',
          }}
        >Your people</h1>
        
        <div className="space-y-6">
          {contacts.map((contact, index) => (
            <motion.button
              key={contact.name}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.1 * index,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              onClick={() => navigate('/contact')}
              className="w-full border-b pb-6 text-left transition-all duration-700"
              style={{
                borderColor: 'rgba(28, 24, 20, 0.08)',
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--reach-ink)',
                    lineHeight: 1.5,
                  }}
                >
                  {contact.name}
                </h3>
                <span
                  className="px-3 py-1"
                  style={{
                    backgroundColor:
                      tierColors[contact.tier as keyof typeof tierColors],
                    color: 'var(--reach-linen)',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    borderRadius: '3px',
                  }}
                >
                  {contact.tier}
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--reach-ink)',
                  opacity: 0.4,
                  lineHeight: 1.8,
                }}
              >
                {contact.lastContact}
                {contact.memory && ` · ${contact.memory}`}
              </p>
            </motion.button>
          ))}
        </div>
        
        {/* Empty state prompt - shown when 0-2 people */}
        {contacts.length <= 2 && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.1 * (contacts.length + 1),
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="w-full text-center mt-20 transition-all duration-700 hover:opacity-100"
          >
            <p
              className="italic"
              style={{
                fontSize: '1.125rem',
                color: 'var(--reach-ink)',
                opacity: 0.5,
                lineHeight: 2,
              }}
            >
              Who else belongs in your constellation?
            </p>
          </motion.button>
        )}
      </motion.div>
      
      <Navigation />
    </div>
  );
}
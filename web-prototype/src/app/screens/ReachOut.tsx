import { motion } from 'motion/react';
import { Navigation } from '../components/Navigation';
import { useNavigate } from 'react-router';
import { Phone, MessageCircle } from 'lucide-react';

export function ReachOut() {
  const navigate = useNavigate();
  
  const contact = {
    name: 'Sarah Chen',
    phone: '+1 (555) 123-4567',
  };
  
  const handleCall = () => {
    window.location.href = `tel:${contact.phone}`;
  };
  
  const handleText = () => {
    window.location.href = `sms:${contact.phone}`;
  };
  
  const handleDone = () => {
    navigate('/post-contact');
  };
  
  return (
    <div className="min-h-screen bg-[var(--reach-linen)] flex flex-col max-w-md mx-auto">
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
          {/* Header */}
          <div className="text-center mb-16">
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
              {contact.name}
            </h1>
            <p
              className="italic"
              style={{
                fontSize: '1.125rem',
                color: 'var(--reach-ink)',
                opacity: 0.5,
                lineHeight: 2,
              }}
            >
              A text, a call. Whatever comes naturally.
            </p>
          </div>
          
          {/* Contact Options */}
          <div className="space-y-4 mb-16">
            <button
              onClick={handleCall}
              className="w-full py-5 transition-all duration-700 border flex items-center justify-center gap-3"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--reach-ink)',
                fontWeight: 500,
                borderColor: 'rgba(28, 24, 20, 0.15)',
                borderRadius: '4px',
              }}
            >
              <Phone size={20} strokeWidth={1.5} />
              <span>A call</span>
            </button>
            
            <button
              onClick={handleText}
              className="w-full py-5 transition-all duration-700 border flex items-center justify-center gap-3"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--reach-ink)',
                fontWeight: 500,
                borderColor: 'rgba(28, 24, 20, 0.15)',
                borderRadius: '4px',
              }}
            >
              <MessageCircle size={20} strokeWidth={1.5} />
              <span>A message</span>
            </button>
          </div>
          
          {/* Done Button */}
          <button
            onClick={handleDone}
            className="w-full py-4 transition-all duration-700 border"
            style={{
              backgroundColor: 'var(--reach-gold)',
              color: 'var(--reach-ink)',
              fontWeight: 600,
              borderColor: 'var(--reach-gold)',
              borderRadius: '4px',
            }}
          >
            I've reached out
          </button>
        </motion.div>
      </motion.div>
      
      <Navigation />
    </div>
  );
}
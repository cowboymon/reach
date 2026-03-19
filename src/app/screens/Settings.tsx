import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function Settings() {
  const navigate = useNavigate();
  const [cadence, setCadence] = useState('Daily');
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  return (
    <div className="min-h-screen bg-[var(--reach-linen)] flex flex-col max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-1 px-10 pt-16 pb-12 overflow-auto"
      >
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="mb-12 transition-all duration-700"
          style={{ color: 'var(--reach-ink)', opacity: 0.4 }}
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        
        <h1
          className="mb-16"
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--reach-ink)',
            lineHeight: 1.4,
            letterSpacing: '-0.02em',
          }}
        >
          Settings
        </h1>
        
        {/* Settings Controls */}
        <div className="space-y-12">
          {/* Cadence */}
          <div>
            <label
              className="block mb-4"
              style={{
                fontSize: '0.875rem',
                color: 'var(--reach-ink)',
                opacity: 0.6,
                fontWeight: 500,
              }}
            >
              How often should Reach nudge you?
            </label>
            <div className="flex flex-col gap-2">
              {[
                { value: 'Daily', label: 'Every day' },
                { value: 'Every 2 days', label: 'Every couple days' },
                { value: 'Weekdays only', label: 'Weekdays only' },
                { value: 'Surprise', label: 'When it feels right' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setCadence(option.value)}
                  className="w-full py-3.5 px-4 text-left transition-all duration-700 border"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--reach-ink)',
                    fontWeight: cadence === option.value ? 600 : 400,
                    fontSize: '0.875rem',
                    borderColor:
                      cadence === option.value
                        ? 'rgba(28, 24, 20, 0.25)'
                        : 'rgba(28, 24, 20, 0.1)',
                    borderRadius: '4px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    opacity: cadence === option.value ? 1 : 0.6,
                  }}
                >
                  <span>{option.label}</span>
                  {option.value === 'Surprise' && (
                    <span
                      className="block"
                      style={{
                        fontSize: '0.75rem',
                        opacity: 0.5,
                        marginTop: '2px',
                        fontStyle: 'italic',
                      }}
                    >
                      Reach picks the rhythm for you
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Notification Time */}
          <div>
            <label
              htmlFor="notification-time"
              className="block mb-4"
              style={{
                fontSize: '0.875rem',
                color: 'var(--reach-ink)',
                opacity: 0.6,
                fontWeight: 500,
              }}
            >
              What time works best?
            </label>
            <div className="flex flex-col gap-2">
              <div
                className="border transition-all duration-700"
                style={{
                  borderColor: notificationTime !== 'surprise' ? 'rgba(28, 24, 20, 0.25)' : 'rgba(28, 24, 20, 0.1)',
                  borderRadius: '4px',
                  opacity: notificationTime !== 'surprise' ? 1 : 0.6,
                }}
              >
                <input
                  id="notification-time"
                  type="time"
                  value={notificationTime === 'surprise' ? '09:00' : notificationTime}
                  onChange={(e) => setNotificationTime(e.target.value)}
                  className="w-full bg-transparent px-4 py-3.5 focus:outline-none transition-all duration-700"
                  style={{
                    color: 'var(--reach-ink)',
                    fontSize: '0.875rem',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    border: 'none',
                  }}
                />
              </div>
              <button
                onClick={() => setNotificationTime(notificationTime === 'surprise' ? '09:00' : 'surprise')}
                className="w-full py-3.5 px-4 text-left transition-all duration-700 border"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--reach-ink)',
                  fontWeight: notificationTime === 'surprise' ? 600 : 400,
                  fontSize: '0.875rem',
                  borderColor: notificationTime === 'surprise' ? 'rgba(28, 24, 20, 0.25)' : 'rgba(28, 24, 20, 0.1)',
                  borderRadius: '4px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  opacity: notificationTime === 'surprise' ? 1 : 0.6,
                }}
              >
                <span>Whenever the moment's right</span>
                <span
                  className="block"
                  style={{
                    fontSize: '0.75rem',
                    opacity: 0.5,
                    marginTop: '2px',
                    fontStyle: 'italic',
                  }}
                >
                  Reach finds a quiet moment in your day
                </span>
              </button>
            </div>
          </div>
          
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between py-3">
            <label
              style={{
                fontSize: '0.875rem',
                color: 'var(--reach-ink)',
                opacity: 0.6,
                fontWeight: 500,
              }}
            >
              Keep me in the loop?
            </label>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className="relative transition-all duration-700"
              style={{
                width: '48px',
                height: '28px',
                backgroundColor: notificationsEnabled
                  ? 'var(--reach-gold)'
                  : 'rgba(28, 24, 20, 0.15)',
                borderRadius: '14px',
              }}
            >
              <div
                className="absolute top-1 transition-all duration-700"
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'var(--reach-linen)',
                  borderRadius: '50%',
                  left: notificationsEnabled ? '26px' : '2px',
                }}
              />
            </button>
          </div>
          
          {/* Add to Constellation */}
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
            Add to constellation
          </button>
        </div>
      </motion.div>
    </div>
  );
}
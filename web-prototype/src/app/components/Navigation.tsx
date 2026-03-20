import { Home, Users, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router';

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/home', label: 'Home' },
    { icon: Activity, path: '/rhythm', label: 'This week' },
    { icon: Users, path: '/contacts', label: 'Your people' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-[var(--reach-linen)] border-t px-6 py-4 max-w-md mx-auto"
      style={{ borderColor: 'rgba(28, 24, 20, 0.08)' }}
    >
      <div className="flex items-center justify-around">
        {navItems.map(({ icon: Icon, path, label }) => {
          const isActive = location.pathname === path || (path === '/home' && location.pathname === '/');
          return (
            <Link
              key={path}
              to={path}
              className="flex flex-col items-center gap-1.5 transition-all duration-700"
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                color={isActive ? 'var(--reach-gold)' : 'var(--reach-ink)'}
                style={{ opacity: isActive ? 1 : 0.35 }}
              />
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 500,
                  color: isActive ? 'var(--reach-gold)' : 'var(--reach-ink)',
                  opacity: isActive ? 0.8 : 0.3,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  letterSpacing: '0.03em',
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
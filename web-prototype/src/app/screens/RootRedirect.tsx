import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('reach-onboarded');
    if (hasOnboarded) {
      navigate('/home', { replace: true });
    } else {
      navigate('/onboarding', { replace: true });
    }
  }, [navigate]);

  return null;
}

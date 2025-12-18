import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Only scroll to top when clicking links (PUSH navigation)
    // Let browser handle back/forward (POP) naturally
    if (navigationType === 'PUSH') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null;
};

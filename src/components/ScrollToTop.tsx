import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  // Disable browser's automatic scroll restoration - we handle it manually
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Save scroll position on scroll
  useEffect(() => {
    const saveScrollPosition = () => {
      sessionStorage.setItem(`scrollPos-${pathname}`, String(window.scrollY));
    };

    window.addEventListener('scroll', saveScrollPosition);
    
    return () => {
      window.removeEventListener('scroll', saveScrollPosition);
      saveScrollPosition();
    };
  }, [pathname]);

  // Handle scroll based on navigation type
  useEffect(() => {
    if (navigationType === 'POP') {
      const savedPosition = sessionStorage.getItem(`scrollPos-${pathname}`);
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }
    } else if (navigationType === 'PUSH') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null;
};

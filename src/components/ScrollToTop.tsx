import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

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

  // Handle scroll restoration/reset based on navigation type
  useEffect(() => {
    if (navigationType === 'POP') {
      // Back/forward navigation - restore previous scroll position
      const savedPosition = sessionStorage.getItem(`scrollPos-${pathname}`);
      if (savedPosition) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedPosition, 10));
        }, 0);
      }
    } else if (navigationType === 'PUSH') {
      // New navigation (clicking links) - scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null;
};

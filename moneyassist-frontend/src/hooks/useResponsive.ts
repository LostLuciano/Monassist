import { useState, useEffect } from 'react';

interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}

const defaultBreakpoints: BreakpointConfig = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280
};

export const useResponsive = (breakpoints: BreakpointConfig = defaultBreakpoints) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < breakpoints.mobile;
  const isTablet = windowSize.width >= breakpoints.mobile && windowSize.width < breakpoints.tablet;
  const isDesktop = windowSize.width >= breakpoints.desktop;
  const isLaptop = windowSize.width >= breakpoints.tablet && windowSize.width < breakpoints.desktop;

  return {
    windowSize,
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    isSmallScreen: isMobile || isTablet,
    isLargeScreen: isLaptop || isDesktop
  };
};

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    typeof window !== 'undefined' && window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    window.addEventListener('resize', handleOrientationChange);
    handleOrientationChange();

    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  return orientation;
};

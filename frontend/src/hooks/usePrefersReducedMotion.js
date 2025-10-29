import { useMediaQuery } from '@mui/material';

const usePrefersReducedMotion = () => {
  return useMediaQuery('(prefers-reduced-motion: reduce)', {
    defaultMatches: false,
    noSsr: true
  });
};

export default usePrefersReducedMotion;

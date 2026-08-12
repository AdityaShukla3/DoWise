// src/utils/useGSAP.js
// Custom hook for GSAP animations

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Hook to animate elements on mount
 */
export const useGSAP = (animationFn, deps = []) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current && animationFn) {
      const animation = animationFn(elementRef.current);
      return () => {
        if (animation && animation.kill) {
          animation.kill();
        }
      };
    }
  }, deps);

  return elementRef;
};

/**
 * Hook for hover animations
 */
export const useHoverAnimation = (hoverFn, hoverOutFn) => {
  const elementRef = useRef(null);

  const handleMouseEnter = () => {
    if (elementRef.current && hoverFn) {
      hoverFn(elementRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (elementRef.current && hoverOutFn) {
      hoverOutFn(elementRef.current);
    }
  };

  return { elementRef, handleMouseEnter, handleMouseLeave };
};

/**
 * Hook for scroll-triggered animations
 */
export const useScrollAnimation = (animationFn, options = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current && animationFn) {
      const animation = animationFn(elementRef.current, options);
      return () => {
        if (animation && animation.kill) {
          animation.kill();
        }
      };
    }
  }, []);

  return elementRef;
};

export default useGSAP;


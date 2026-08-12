// src/utils/animations.js
// GSAP Animation Utilities

import { gsap } from 'gsap';

// Try to register plugins if available (they're optional)
try {
  const { ScrollTrigger } = require('gsap/ScrollTrigger');
  const { TextPlugin } = require('gsap/TextPlugin');
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
} catch (e) {
  // Plugins not installed, continue without them
  console.log('GSAP plugins not available, using core GSAP only');
}

/**
 * Fade in animation
 */
export const fadeIn = (element, options = {}) => {
  const defaults = {
    duration: 0.6,
    delay: 0,
    ease: 'power2.out',
    opacity: 0,
    y: 20
  };
  
  return gsap.fromTo(
    element,
    { opacity: defaults.opacity, y: defaults.y },
    {
      opacity: 1,
      y: 0,
      duration: options.duration || defaults.duration,
      delay: options.delay || defaults.delay,
      ease: options.ease || defaults.ease
    }
  );
};

/**
 * Slide in from direction
 */
export const slideIn = (element, direction = 'left', options = {}) => {
  const directions = {
    left: { x: -100, y: 0 },
    right: { x: 100, y: 0 },
    top: { x: 0, y: -100 },
    bottom: { x: 0, y: 100 }
  };
  
  const from = directions[direction] || directions.left;
  
  return gsap.fromTo(
    element,
    { opacity: 0, x: from.x, y: from.y },
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration: options.duration || 0.8,
      delay: options.delay || 0,
      ease: options.ease || 'power3.out'
    }
  );
};

/**
 * Scale in animation
 */
export const scaleIn = (element, options = {}) => {
  return gsap.fromTo(
    element,
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      duration: options.duration || 0.6,
      delay: options.delay || 0,
      ease: options.ease || 'back.out(1.7)'
    }
  );
};

/**
 * Stagger animation for multiple elements
 */
export const staggerFadeIn = (elements, options = {}) => {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: options.duration || 0.5,
      stagger: options.stagger || 0.1,
      ease: options.ease || 'power2.out',
      delay: options.delay || 0
    }
  );
};

/**
 * Text reveal animation
 */
export const textReveal = (element, options = {}) => {
  const text = element.textContent;
  element.textContent = '';
  
  return gsap.to(element, {
    duration: options.duration || 1,
    text: text,
    ease: 'none',
    delay: options.delay || 0
  });
};

/**
 * Button hover animation
 */
export const buttonHover = (element) => {
  return gsap.to(element, {
    scale: 1.05,
    duration: 0.2,
    ease: 'power2.out'
  });
};

export const buttonHoverOut = (element) => {
  return gsap.to(element, {
    scale: 1,
    duration: 0.2,
    ease: 'power2.out'
  });
};

/**
 * Card hover animation
 */
export const cardHover = (element) => {
  return gsap.to(element, {
    y: -8,
    scale: 1.02,
    duration: 0.3,
    ease: 'power2.out',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
  });
};

export const cardHoverOut = (element) => {
  return gsap.to(element, {
    y: 0,
    scale: 1,
    duration: 0.3,
    ease: 'power2.out',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  });
};

/**
 * Progress bar animation
 */
export const animateProgress = (element, progress, options = {}) => {
  return gsap.to(element, {
    width: `${progress}%`,
    duration: options.duration || 1,
    ease: options.ease || 'power2.out',
    delay: options.delay || 0
  });
};

/**
 * Loading spinner animation
 */
export const spinLoader = (element) => {
  return gsap.to(element, {
    rotation: 360,
    duration: 1,
    repeat: -1,
    ease: 'none'
  });
};

/**
 * Shake animation for errors
 */
export const shake = (element) => {
  return gsap.to(element, {
    x: -10,
    duration: 0.1,
    repeat: 5,
    yoyo: true,
    ease: 'power2.inOut',
    onComplete: () => {
      gsap.set(element, { x: 0 });
    }
  });
};

/**
 * Pulse animation
 */
export const pulse = (element, options = {}) => {
  return gsap.to(element, {
    scale: options.scale || 1.1,
    duration: options.duration || 0.5,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut'
  });
};

/**
 * Timeline for complex animations
 */
export const createTimeline = (options = {}) => {
  return gsap.timeline({
    defaults: {
      ease: 'power2.out',
      duration: 0.6
    },
    ...options
  });
};

/**
 * Scroll-triggered animations
 */
export const scrollReveal = (element, options = {}) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: options.duration || 0.8,
      ease: options.ease || 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  );
};

/**
 * Page transition animation
 */
export const pageTransition = (element, direction = 'in', options = {}) => {
  if (direction === 'in') {
    return gsap.fromTo(
      element,
      { opacity: 0, x: 100 },
      {
        opacity: 1,
        x: 0,
        duration: options.duration || 0.5,
        ease: options.ease || 'power3.out'
      }
    );
  } else {
    return gsap.to(element, {
      opacity: 0,
      x: -100,
      duration: options.duration || 0.3,
      ease: options.ease || 'power3.in'
    });
  }
};

/**
 * Counter animation
 */
export const animateCounter = (element, targetValue, options = {}) => {
  const obj = { value: 0 };
  
  return gsap.to(obj, {
    value: targetValue,
    duration: options.duration || 2,
    ease: options.ease || 'power2.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.value);
    }
  });
};

/**
 * Morphing background gradient
 */
export const morphGradient = (element, colors, options = {}) => {
  const tl = gsap.timeline({ repeat: -1 });
  
  colors.forEach((color, index) => {
    tl.to(element, {
      background: color,
      duration: options.duration || 3,
      ease: 'power1.inOut'
    });
  });
  
  return tl;
};

export default {
  fadeIn,
  slideIn,
  scaleIn,
  staggerFadeIn,
  textReveal,
  buttonHover,
  buttonHoverOut,
  cardHover,
  cardHoverOut,
  animateProgress,
  spinLoader,
  shake,
  pulse,
  createTimeline,
  scrollReveal,
  pageTransition,
  animateCounter,
  morphGradient
};


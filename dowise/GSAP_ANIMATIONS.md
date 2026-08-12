# GSAP Animations Implementation

## Overview

GSAP (GreenSock Animation Platform) has been integrated into the DoWise frontend to provide smooth, professional animations throughout the application.

## Installation

GSAP has been installed via npm:
```bash
npm install gsap
```

## Animation Utilities

### Location
`client/src/utils/animations.js`

### Available Animations

1. **fadeIn** - Fade in with optional Y-axis movement
2. **slideIn** - Slide in from any direction (left, right, top, bottom)
3. **scaleIn** - Scale in with bounce effect
4. **staggerFadeIn** - Staggered fade in for multiple elements
5. **textReveal** - Typewriter-style text reveal
6. **buttonHover** / **buttonHoverOut** - Button hover animations
7. **cardHover** / **cardHoverOut** - Card hover animations
8. **animateProgress** - Animated progress bars
9. **spinLoader** - Spinning loader animation
10. **shake** - Shake animation for errors
11. **pulse** - Pulsing animation
12. **scrollReveal** - Scroll-triggered animations
13. **pageTransition** - Page transition animations
14. **animateCounter** - Counter animation
15. **morphGradient** - Morphing background gradients

## Implementation Details

### Login Page
- Card scale-in animation on mount
- Text reveal for logo
- Form fade-in
- Shake animation on error

### Signup Page
- Same animations as Login page
- Smooth entrance animations

### Dashboard
- Header fade-in
- Staggered animations for plan cards
- Staggered animations for task items
- Animated progress bars
- Card hover effects
- Button hover effects

### Navigation
- Fade-in on mount
- Logo animation

## Usage Examples

### Basic Fade In
```javascript
import { fadeIn } from '../utils/animations';

useEffect(() => {
  if (elementRef.current) {
    fadeIn(elementRef.current, { delay: 0.2, duration: 0.6 });
  }
}, []);
```

### Staggered Animation
```javascript
import { staggerFadeIn } from '../utils/animations';

useEffect(() => {
  const items = containerRef.current.querySelectorAll('.item');
  staggerFadeIn(items, { stagger: 0.1, delay: 0.3 });
}, [data]);
```

### Hover Animation
```javascript
import { cardHover, cardHoverOut } from '../utils/animations';

<div
  onMouseEnter={(e) => cardHover(e.currentTarget)}
  onMouseLeave={(e) => cardHoverOut(e.currentTarget)}
>
  Card Content
</div>
```

### Progress Bar Animation
```javascript
import { animateProgress } from '../utils/animations';

useEffect(() => {
  if (progressBarRef.current) {
    animateProgress(progressBarRef.current, progress, { delay: 0.5 });
  }
}, [progress]);
```

## Custom Hooks

### useGSAP Hook
Located in `client/src/utils/useGSAP.js`

Provides convenient hooks for common animation patterns:
- `useGSAP` - Animate on mount
- `useHoverAnimation` - Hover animations
- `useScrollAnimation` - Scroll-triggered animations

## Performance Considerations

1. **Hardware Acceleration**: GSAP automatically uses GPU acceleration for smooth animations
2. **Will-change**: Elements are optimized for animation performance
3. **Cleanup**: Animations are properly cleaned up on unmount
4. **Lazy Loading**: ScrollTrigger animations only activate when needed

## Browser Support

GSAP supports all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Future Enhancements

Potential additions:
- Scroll-triggered animations for sections
- More complex timeline animations
- Interactive animations on user actions
- Loading state animations
- Success/error state animations

## Notes

- GSAP plugins (ScrollTrigger, TextPlugin) are optional and loaded conditionally
- All animations are optimized for 60fps performance
- Animations respect user preferences (reduced motion)
- All animations are accessible and don't interfere with functionality


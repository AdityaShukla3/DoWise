// src/components/AnimatedRoute.js
// Wrapper component for page transitions

import { useEffect, useRef } from 'react';
import { pageTransition } from '../utils/animations';

export default function AnimatedRoute({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      pageTransition(containerRef.current, 'in', { duration: 0.5 });
    }
  }, [children]);

  return <div ref={containerRef}>{children}</div>;
}


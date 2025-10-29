import React, { useEffect, useState, useMemo } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatter?: (value: number) => string;
  className?: string;
}

export function AnimatedCounter({ 
  value, 
  duration = 1000,
  formatter = (val) => val.toLocaleString(),
  className 
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Validate and sanitize the input value
  const sanitizedValue = useMemo(() => {
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
      return 0;
    }
    return Math.max(0, value); // Ensure non-negative
  }, [value]);

  useEffect(() => {
    // If animation is disabled (duration is 0), set value immediately
    if (duration === 0) {
      setDisplayValue(sanitizedValue);
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeOut * sanitizedValue);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [sanitizedValue, duration]);

  return (
    <span className={className}>
      {formatter(displayValue)}
    </span>
  );
}
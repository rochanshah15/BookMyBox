import { useState, useEffect, useRef } from 'react';

const useCountAnimation = (endValue, duration = 2000, startAnimation = false) => {
  const [count, setCount] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!startAnimation || endValue === undefined || endValue === null) {
      setCount(0);
      return;
    }

    // Parse the end value to handle numbers with symbols like "4.8", "500+", "10K+"
    const endStr = endValue.toString();
    let numericValue;
    let suffix = '';
    let hasDecimal = false;

    try {
      if (endStr.includes('K+')) {
        numericValue = parseFloat(endStr.replace('K+', '')) * 1000;
        suffix = 'K+';
      } else if (endStr.includes('+')) {
        numericValue = parseFloat(endStr.replace('+', ''));
        suffix = '+';
      } else if (endStr.includes('.')) {
        numericValue = parseFloat(endStr);
        hasDecimal = true;
      } else {
        numericValue = parseFloat(endStr.replace(/[^\d]/g, ''));
        suffix = endStr.replace(/[\d.]/g, '');
      }
    } catch (error) {
      console.warn('Failed to parse animation value:', endValue, error);
      numericValue = 0;
      suffix = '';
    }

    let startTime = null;
    const startValue = 0;

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easeOutQuart easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (numericValue - startValue) * easeOutQuart;

      if (hasDecimal) {
        setCount(currentValue.toFixed(1));
      } else if (suffix === 'K+') {
        const kValue = (currentValue / 1000).toFixed(0);
        setCount(kValue + 'K+');
      } else if (suffix === '+') {
        setCount(Math.floor(currentValue) + '+');
      } else {
        setCount(Math.floor(currentValue) + suffix);
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [endValue, duration, startAnimation]);

  return count;
};

export default useCountAnimation;

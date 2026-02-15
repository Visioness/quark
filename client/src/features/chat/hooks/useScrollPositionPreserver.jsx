import { useLayoutEffect, useRef } from 'react';
import { isNearBottom } from '../utils/scroll';

export function useScrollPositionPreserver(containerRef, messages) {
  const scrollInfoRef = useRef({ scrollTop: 0, scrollHeight: 0 });
  const wasNearBottomRef = useRef(true);

  const handleScroll = () => {
    if (containerRef.current) {
      const el = containerRef.current;
      scrollInfoRef.current = {
        scrollTop: el.scrollTop,
        scrollHeight: el.scrollHeight,
      };
      wasNearBottomRef.current = isNearBottom(el);
    }
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    if (scrollInfoRef.current.scrollHeight === 0) {
      // Scroll to bottom at initial load
      el.scrollTop = el.scrollHeight;
    } else if (!wasNearBottomRef.current) {
      // Shift messages when user above the threshold
      const prevDistFromBottom =
        scrollInfoRef.current.scrollHeight - scrollInfoRef.current.scrollTop;
      el.scrollTop = el.scrollHeight - prevDistFromBottom;
    } else {
      // Auto scroll to new message when user below threshold
      el.scrollTop = el.scrollHeight;
    }
  }, [containerRef, messages]);

  return handleScroll;
}

import { useRef } from "react";

export function useDebounceCallback(callback, delay) {
  const timer = useRef();

  const debouncedCallback = (...args) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedCallback;
}

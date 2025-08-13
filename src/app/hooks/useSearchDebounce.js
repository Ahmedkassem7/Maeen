import { useEffect, useRef } from "react";

export function useSearchDebounce(callback, delay, searchTerm) {
  const timeoutRef = useRef();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (searchTerm !== undefined) {
        callback(searchTerm);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, callback, delay]);
}

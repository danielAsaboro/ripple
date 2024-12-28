// File: /hooks/useClickOutside.ts
import { useEffect, useRef, MutableRefObject } from "react";

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  handler: () => void
): MutableRefObject<T | null> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handler]);

  return ref;
};

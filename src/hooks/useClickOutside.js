import { useEffect } from "react";

export default function useClickOutside(ref, enabled, onOutside) {
  useEffect(() => {
    if (!enabled) return undefined;

    const handlePointerDown = (event) => {
      const target = event.target;
      if (ref.current && !ref.current.contains(target)) {
        onOutside?.(event);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [enabled, onOutside, ref]);
}

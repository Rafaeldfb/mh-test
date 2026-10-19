import { useLayoutEffect, useRef } from "react";

export function useComposerClearance() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => document.documentElement.style.setProperty(
      "--composer-height", `${element.getBoundingClientRect().height}px`,
    );
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--composer-height");
    };
  }, []);
  return ref;
}

import { RefObject, useLayoutEffect } from 'react';

type ResizeObserverCallback = (entry: ResizeObserverEntry) => void;

export default function useResizeObserver<T extends HTMLElement>(
  elementRef: RefObject<T>,
  callback: ResizeObserverCallback,
) {
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        callback(entries[0]);
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [callback, elementRef]);
}

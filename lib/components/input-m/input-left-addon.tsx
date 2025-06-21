import { ReactNode, useRef } from 'react';

import { useInputContext } from './context';
import useResizeObserver from './hooks/use-resize-observer';

interface InputLeftAddonProps {
  children: ReactNode;
}

export default function InputLeftAddon(props: InputLeftAddonProps) {
  const { children } = props;

  const addonRef = useRef<HTMLDivElement>(null);
  const { setLeftAddonWidth } = useInputContext();

  useResizeObserver(addonRef, (entry) => {
    const divWidth = entry.contentRect.width;
    const width = divWidth ? `${divWidth + 7}px` : '0.75rem';
    setLeftAddonWidth(width);
  });

  return (
    <div ref={addonRef} className="pointer-events-none absolute inset-y-0 start-0 flex items-center">
      {children}
    </div>
  );
}

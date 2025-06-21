import { ReactNode, useRef } from 'react';

import { useInputContext } from './context';
import useResizeObserver from './hooks/use-resize-observer';

interface InputRightAddonProps {
  children: ReactNode;
}

export default function InputRightAddon(props: InputRightAddonProps) {
  const { children } = props;

  const addonRef = useRef<HTMLDivElement>(null);
  const { setRightAddonWidth } = useInputContext();

  useResizeObserver(addonRef, (entry) => {
    const divWidth = entry.contentRect.width;
    const width = divWidth ? `${divWidth + 7}px` : '0.75rem';
    setRightAddonWidth(width);
  });

  return (
    <div ref={addonRef} className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
      {children}
    </div>
  );
}

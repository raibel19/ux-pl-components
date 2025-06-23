import { forwardRef, ReactNode, useRef } from 'react';

import mergeRefs from '../../../lib/merge-refs';
import { useInputContext } from './context';
import useResizeObserver from './hooks/use-resize-observer';

interface InputRightAddonProps {
  children: ReactNode;
}

export default forwardRef<HTMLDivElement, InputRightAddonProps>(function InputRightAddon(props, ref) {
  const { children } = props;

  const addonRef = useRef<HTMLDivElement>(null);
  const { setRightAddonWidth } = useInputContext();

  useResizeObserver(addonRef, (entry) => {
    const divWidth = entry.contentRect.width;
    const width = divWidth ? `${divWidth + 16}px` : '0.75rem';
    setRightAddonWidth(width);
  });

  const mergeRef = mergeRefs(ref, addonRef);

  return (
    <div ref={mergeRef} className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
      {children}
    </div>
  );
});

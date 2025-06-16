import { useEffect, useMemo, useState } from 'react';

import { Skeleton as SkeletonShadcn } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';

import { ISkeleton } from '../interfaces/internals';

export default function Skeleton(props: ISkeleton) {
  const { className, copyCount } = props;

  const [copyCountState, setCopyCountState] = useState<number>(copyCount ?? 1);
  const copyCountValue = useMemo(() => [...Array<number>(copyCountState).keys()], [copyCountState]);

  useEffect(() => {
    setCopyCountState((prev) => {
      const newValue = copyCount ?? 1;
      if (prev !== newValue) return newValue;
      return prev;
    });
  }, [copyCount]);

  return (
    <>
      {copyCountValue.map((idx) => (
        <SkeletonShadcn
          key={idx}
          className={cn('relative h-7 rounded-sm bg-ux-skeleton/60 py-1.5 outline-none', className || null)}
        />
      ))}
    </>
  );
}

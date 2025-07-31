import { forwardRef } from 'react';

import { cn } from '../../../lib/utils';
import { Skeleton } from '../../ui/skeleton';
import { useInputActionsContext } from './context';
import useTheme from './hooks/use-theme';
import inputStyle from './input.module.css';

interface InputSkeletonProps {
  className?: string | undefined;
  classNameContainer?: string | undefined;
  show?: boolean;
}
export default forwardRef<HTMLDivElement, InputSkeletonProps>(function InputSkeleton(props, ref) {
  const { className, classNameContainer, show = true } = props;
  const { theme } = useInputActionsContext();
  const { themeCore, themeStyle } = useTheme({ style: inputStyle, theme });

  if (!show) return null;

  return (
    <div
      ref={ref}
      className={cn(
        themeCore,
        themeStyle,
        'relative flex w-full content-center items-center justify-items-center gap-1 text-center',
        classNameContainer || null,
      )}
    >
      <Skeleton className={cn('h-8 w-full rounded-sm bg-ux-skeleton', className || null)} />
    </div>
  );
});

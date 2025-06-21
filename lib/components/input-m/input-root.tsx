import { ForwardedRef, forwardRef, ReactNode, useEffect } from 'react';

import { cn } from '../../lib/utils';
import { useInputContext } from './context';
import useTheme from './hooks/use-theme';
import inputStyle from './input.module.css';

interface InputRootProps {
  children: ReactNode;
  classNameContainer?: string;
}

export default forwardRef(function InputRoot(props: InputRootProps, ref: ForwardedRef<HTMLDivElement>) {
  const { children, classNameContainer } = props;
  const { theme } = useInputContext();
  const { themeCore, themeStyle } = useTheme({ style: inputStyle, theme });

  useEffect(() => {
    console.log('Component-InputRoot');
  }, [props]);

  return (
    <div ref={ref} className={cn(themeCore, themeStyle, 'w-full space-y-1', classNameContainer)}>
      {children}
    </div>
  );
});

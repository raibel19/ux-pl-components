'use client';

import { useEffect, useRef } from 'react';

import { ILeftElementProps } from '../interfaces/internals';
import Elements from './elements';

export default function LeftElement<Data>(props: ILeftElementProps<Data>) {
  const { element, showNumericValidationErrors, showError, disable, setWidth, responseEventData } = props;

  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(
    () => {
      if (divRef.current) {
        const divWidth = divRef.current.offsetWidth;
        const width = divWidth ? `${divWidth + 7}px` : '0.75rem';
        setWidth(width, 'left');
      }
    },
    // Aunque no se use props dentro del useeffect este debería de ir en las dependencias ya que el valor del state debería de cambiar cada que cambie.
    [setWidth, props],
  );

  useEffect(() => {
    console.log('Component-LeftElement');
  }, []);

  return (
    <div ref={divRef} className="pointer-events-none absolute inset-y-0 start-0 flex items-center">
      <Elements
        disable={disable}
        element={element}
        isLastElement={false}
        position="left"
        responseEventData={responseEventData}
        showError={showError}
        showNumericValidationErrors={showNumericValidationErrors}
      />
    </div>
  );
}

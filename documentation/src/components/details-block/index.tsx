import { IbmWatsonxCodeAssistant } from '@carbon/icons-react';
import Details from '@theme/Details';
import { useMemo } from 'react';
import React from 'react';

import { cn } from '../../lib/utils';

export interface IDetailsBlockProps {
  children?: React.ReactNode | undefined;
  classNameDetails?: string;
  classNameIcon?: string;
  classNameIconContainer?: string;
  classNameSummary?: string;
  classNameTitle?: string;
  icon?: React.ReactElement | undefined;
  showIcon?: boolean;
  summary: React.ReactNode;
}

export default function DetailsBlock(props: IDetailsBlockProps) {
  const {
    children,
    summary: summaryProp,
    classNameDetails,
    classNameIcon,
    classNameIconContainer,
    classNameSummary,
    classNameTitle,
    icon,
    showIcon = true,
  } = props;

  const summaryElement = useMemo(
    () => (
      <summary className={cn('relative', classNameSummary)}>
        {!React.isValidElement(summaryProp) ? (
          <p className={cn('mt-px font-medium', classNameTitle)}>{summaryProp}</p>
        ) : (
          summaryProp
        )}
        {showIcon && (
          <span className={cn('absolute right-4 top-0', classNameIconContainer)}>
            {icon ?? <IbmWatsonxCodeAssistant size={20} className={classNameIcon} />}
          </span>
        )}
      </summary>
    ),
    [classNameIcon, classNameIconContainer, classNameSummary, classNameTitle, icon, showIcon, summaryProp],
  );

  return (
    <>
      <Details
        summary={summaryElement}
        className={cn('px-4 py-2 [&_[class^="collapsibleContent"]]:mt-2', classNameDetails)}
      >
        {children}
      </Details>
    </>
  );
}

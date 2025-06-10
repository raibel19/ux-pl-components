import CodeBlock from '@theme/CodeBlock';

import { cn } from '../../lib/utils';
import DetailsBlock, { IDetailsBlockProps } from '../details-block';

interface IObjectProps<Data extends Record<string, unknown>> extends Omit<IDetailsBlockProps, 'summary'> {
  classNameCodeBlockContainer?: string;
  objectData: Data;
  summary?: React.ReactNode;
}

export default function ObjectBlock<Data extends Record<string, unknown>>(props: IObjectProps<Data>) {
  const {
    children,
    classNameCodeBlockContainer,
    classNameDetails,
    classNameIcon,
    classNameIconContainer,
    classNameSummary,
    classNameTitle,
    icon,
    objectData,
    showIcon = false,
    summary = '{...}',
  } = props;

  const objectString = JSON.stringify(objectData, (_, value) => (value === undefined ? 'undefined' : value), 2);

  const summaryElement = <code>{summary}</code>;

  return (
    <DetailsBlock
      classNameDetails={classNameDetails}
      classNameIcon={classNameIcon}
      classNameIconContainer={classNameIconContainer}
      classNameSummary={classNameSummary}
      classNameTitle={classNameTitle}
      icon={icon}
      showIcon={showIcon}
      summary={summaryElement}
    >
      {children}
      <div className={cn('overflow-auto', classNameCodeBlockContainer)}>
        <CodeBlock language="json">{objectString}</CodeBlock>
      </div>
    </DetailsBlock>
  );
}

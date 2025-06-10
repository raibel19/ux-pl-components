import CodeBlock from '@theme/CodeBlock';

import ObjectBlock from '../object-block';

interface IDefaultValueProps<Data> {
  value: Data;
}

export default function DefaultValue<Data>(props: IDefaultValueProps<Data>) {
  const { value } = props;

  if (value === undefined || value === null) return <code>undefined</code>;

  if (typeof value === 'boolean') return <code>{value.toString()}</code>;

  if (typeof value === 'string') return <code>{`'${value}'`}</code>;

  if (typeof value === 'number') return <code>{value}</code>;

  if (Array.isArray(value)) {
    return (
      <CodeBlock language="json" metastring="{/* Array por Defecto */}">
        {JSON.stringify(value, null, 2)}
      </CodeBlock>
    );
  }

  if (typeof value === 'object')
    return (
      <ObjectBlock
        objectData={value as Record<string, unknown>}
        classNameDetails="max-w-[22rem] px-0"
        classNameSummary="mx-3.5"
        classNameCodeBlockContainer="px-1"
      />
    );

  return <code>{String(value)}</code>;
}

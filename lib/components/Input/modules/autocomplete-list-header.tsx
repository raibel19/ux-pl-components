import { Close } from '@carbon/icons-react';

import { Separator } from '@/components/ui/separator';

import { cn } from '@/lib/utils';

import { IAutocompleteListHeaderProps } from '../interfaces/internals';

export default function AautocompleteListHeader<AutoCompData extends string>(
  props: IAutocompleteListHeaderProps<AutoCompData>,
) {
  const { classNamePopoverHeader, inputSelectedValueState, messages, reset } = props;

  return (
    <>
      <div
        className={cn(
          'sticky top-0 z-10 min-h-8 content-center rounded-t-sm bg-popover px-9 py-1.5 text-xs font-medium text-foreground',
          classNamePopoverHeader?.classNameContainer || null,
        )}
        onMouseDown={(e) => e.preventDefault()}
      >
        <div className={cn('flex w-full items-center', classNamePopoverHeader?.classNameContent || null)}>
          {messages?.title}
          {inputSelectedValueState && (
            <button
              className={cn(
                'pointer-events-auto absolute right-1.5 text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70',
                classNamePopoverHeader?.classNameButton || null,
              )}
              aria-label="clear input"
              onMouseDown={(e) => e.preventDefault}
            >
              <Close
                className={classNamePopoverHeader?.classNameIcon}
                size={18}
                strokeWidth={2}
                aria-hidden="true"
                onClick={() => reset({ resetInput: true, resetOpen: true })}
              />
            </button>
          )}
        </div>
      </div>
      <Separator orientation="horizontal" className="bg-border/70" />
    </>
  );
}

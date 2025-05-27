import { Separator as SeparatorChadcn } from '@/components/ui/separator';

import { cn } from '@/lib/utils';

import { separatorVariants } from '../helpers/variants';
import { ISeparator } from '../interfaces/internals';

export default function Separator(props: ISeparator) {
  const { isError, isLastElement, show } = props;
  return (
    <>
      {show && !isLastElement ? (
        <SeparatorChadcn className={cn(separatorVariants({ isError }))} orientation="vertical" />
      ) : null}
    </>
  );
}

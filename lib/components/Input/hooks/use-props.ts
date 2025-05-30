'use client';

import { useEffect, useMemo, useRef } from 'react';
import { merge } from 'ux-pl/utils/merge';
import { equals } from 'ux-pl/utils/object';

import { DEFAULTS_PROPS_MERGE } from '../helpers/defaults';
import { IInputProps } from '../interfaces/input';

export default function useProps<Data, AutoCompData extends string>(props: IInputProps<Data, AutoCompData>) {
  const onChangeRef = useRef(props.onChange);
  const dataRef = useRef(props.data);
  const subscribeBetweenRef = useRef(props.validations?.number?.between?.subscribeBetween);
  const sanitizeOptionsRef = useRef(props.sanitize);
  const sanitizeMaxDecimalDigits = useRef(props.sanitize?.maxDecimalDigits);
  const propsRef = useRef<typeof props>(undefined);

  const defaultsProps = useMemo(() => DEFAULTS_PROPS_MERGE<Data, AutoCompData>(), []);

  const previousMergedPropsRef = useRef<IInputProps<Data, AutoCompData>>(undefined);
  const propsWithDefault = useMemo(() => {
    const isEquals = equals(propsRef.current, props);

    if (!isEquals) {
      propsRef.current = props;

      const resultMerge = merge<IInputProps<Data, AutoCompData>>(defaultsProps, props, previousMergedPropsRef.current);

      if (resultMerge !== undefined && resultMerge !== null) {
        previousMergedPropsRef.current = resultMerge;
        return resultMerge;
      }
    }
    return previousMergedPropsRef.current ?? defaultsProps;
  }, [defaultsProps, props]);

  useEffect(() => {
    dataRef.current = propsWithDefault?.data;
  }, [propsWithDefault?.data]);

  useEffect(() => {
    onChangeRef.current = propsWithDefault?.onChange;
  }, [propsWithDefault?.onChange]);

  useEffect(() => {
    subscribeBetweenRef.current = propsWithDefault?.validations?.number?.between?.subscribeBetween;
  }, [propsWithDefault?.validations?.number?.between?.subscribeBetween]);

  useEffect(() => {
    sanitizeOptionsRef.current = propsWithDefault?.sanitize;
  }, [propsWithDefault?.sanitize]);

  useEffect(() => {
    sanitizeMaxDecimalDigits.current = propsWithDefault?.sanitize?.maxDecimalDigits;
  }, [propsWithDefault?.sanitize?.maxDecimalDigits]);

  return {
    refs: {
      dataRef,
      onChangeRef,
      subscribeBetweenRef,
      sanitizeOptionsRef,
      sanitizeMaxDecimalDigits,
    },
    defaultsProps,
    propsWithDefault,
  };
}

import { useState, useMemo, useEffect } from "react";

type CB<T> = (state: T) => T;

export const useAutoState = <Type>(
  v: Type
): [Type, (data: Type | CB<Type>) => void] => {
  let [state, setState] = useState(v);
  useMemo(() => (state = v), [v]);
  useEffect(() => {
    setState(v);
  }, [v]);
  return [state, setState];
};

export const useAutoFunctionState = <Type>(
  v: () => Type,
  ...rest: any[]
): [Type, (data: Type | CB<Type>) => void] => {
  let [state, setState] = useState(v);
  useMemo(() => (state = v()), rest);
  useEffect(() => {
    setState(v);
  }, rest);
  return [state, setState];
};

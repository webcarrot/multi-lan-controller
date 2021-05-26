import { Prepare } from "./types";

const getDefault = <T>({ default: d }: { default: T }): T => d;

export const prepare: Prepare = ({ sort }) =>
  sort
    ? import("./sort").then(getDefault)
    : import("./component").then(getDefault);

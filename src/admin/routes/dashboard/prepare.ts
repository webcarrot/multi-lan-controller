import { Prepare } from "./types";

const getDefault = <T>({ default: d }: { default: T }): T => d;

export const prepare: Prepare = ({ sort }) =>
  sort
    ? import(/* webpackChunkName: "routes/dashboard/sort" */ "./sort").then(
        getDefault
      )
    : import(
        /* webpackChunkName: "routes/dashboard/component" */ "./component"
      ).then(getDefault);

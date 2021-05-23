import * as React from "react";
import { CircularProgress } from "@material-ui/core";

import { makeStyles } from "@material-ui/styles";

const IS_BROWSER = typeof window !== "undefined";

const useStyles = makeStyles({
  root: {
    height: "80vh",
    maxHeight: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

export const Loader = React.memo(() => {
  const classes = useStyles({});
  return (
    <div className={classes.root}>
      <CircularProgress size={64} />
    </div>
  );
});

export const SuspenseLoader = ({ children }: { children: React.ReactNode }) =>
  IS_BROWSER ? (
    <React.Suspense fallback={<Loader />}>{children}</React.Suspense>
  ) : (
    <Loader />
  );

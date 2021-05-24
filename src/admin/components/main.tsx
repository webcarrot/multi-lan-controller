import * as React from "react";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: {
    height: "100vh",
    display: "flex",
    overflow: "hidden",
    "@media print": {
      overflow: "visible",
      width: "auto",
      height: "auto"
    }
  }
});

export const Main = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    const classes = useStyles({});
    return <main className={classes.root}>{children}</main>;
  }
);

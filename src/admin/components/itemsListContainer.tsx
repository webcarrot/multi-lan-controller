import * as React from "react";
import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles<Theme>((theme) => ({
  root: {
    position: "relative",
    height: "100vh",
    width: "400px",
    minWidth: "400px",
    maxWidth: "50%",
    display: "flex",
    flexDirection: "column",
    borderRight: `1px solid ${theme.palette.divider}`,
    zIndex: 2,
    "@media print": {
      display: "none",
    },
  },
}));

export const ItemsListContainer = React.memo(({ children }) => {
  const classes = useStyles({});
  return <section className={classes.root}>{children}</section>;
});

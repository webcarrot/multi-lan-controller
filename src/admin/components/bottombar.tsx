import * as React from "react";
import { AppBar, Grid, GridSpacing } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  appbar: {
    top: "auto",
    bottom: 0,
    zIndex: 2,
    "@media print": {
      display: "none",
    },
  },
  toolbar: {
    position: "relative",
    padding: "8px",
  },
});

export const Bottombar = React.memo(
  ({
    position = "sticky",
    children,
    spacing = 2,
  }: {
    position?: "fixed" | "absolute" | "sticky" | "static" | "relative";
    children: React.ReactNode;
    spacing?: GridSpacing;
  }) => {
    const classes = useStyles({});
    return (
      <AppBar
        position={position}
        color="default"
        className={classes.appbar}
        component="footer"
      >
        <div className={classes.toolbar}>
          <Grid container alignItems="center" spacing={spacing}>
            {children}
          </Grid>
        </div>
      </AppBar>
    );
  }
);

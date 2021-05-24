import * as React from "react";
import { AppBar, Typography, Grid, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles<
  Theme,
  {
    position: "fixed" | "absolute" | "sticky" | "static" | "relative";
    haveTitle: boolean;
    haveContent: boolean;
  }
>((theme: Theme) => ({
  appbar: {
    zIndex: ({ position }) => (position === "sticky" ? 3 : 2),
    "@media print": {
      display: "none",
    },
  },
  toolbar: {
    position: "relative",
    padding: ({ haveTitle }) => theme.spacing(haveTitle ? 4 : 1, 2, 1, 2),
    minHeight: ({ haveContent }) => (haveContent ? "32px" : "0px"),
  },
  header: {
    position: "absolute",
    padding: theme.spacing(1, 0),
    top: ({ haveContent }) => (haveContent ? "0px" : "4px"),
    left: theme.spacing(2),
    right: theme.spacing(8),
    fontSize: "14px!important",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

export const Toolbar = React.memo(
  ({
    title,
    position = "sticky",
    children,
    allowWrap = false,
    elevation = 1,
  }: {
    title?: string;
    position?: "fixed" | "absolute" | "sticky" | "static" | "relative";
    children?: React.ReactNode;
    allowWrap?: boolean;
    elevation?: number;
  }) => {
    const classes = useStyles({
      position,
      haveTitle: !!title,
      haveContent: !!children,
    });
    return (
      <AppBar
        position={position}
        elevation={elevation}
        color="default"
        className={classes.appbar}
      >
        <div className={classes.toolbar}>
          {title ? (
            <Typography variant="h1" component="h1" className={classes.header}>
              {title}
            </Typography>
          ) : null}
          <Grid
            container
            alignItems="center"
            wrap={allowWrap ? "wrap" : "nowrap"}
          >
            {children}
          </Grid>
        </div>
      </AppBar>
    );
  }
);

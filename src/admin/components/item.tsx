import * as React from "react";
import { makeStyles } from "@material-ui/styles";
import { SuspenseLoader } from "./loader";
import { Button, Theme } from "@material-ui/core";
import { Link } from "../routes/components";

const useStyles = makeStyles({
  root: {
    height: "100vh",
    overflow: "hidden",
    flexGrow: 1,
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
  },
});

export const Item = React.memo(({ children }) => {
  const { root } = useStyles({});
  return (
    <section className={root}>
      <SuspenseLoader>{children}</SuspenseLoader>
    </section>
  );
});

const useContentStyles = makeStyles<Theme>((theme) => ({
  root: {
    padding: "8px",
    flexGrow: 1,
    overflowX: "hidden",
    overflowY: "auto",
    background: theme.palette.background.paper,
  },
}));

export const ItemContent = React.memo(({ children }) => {
  const { root } = useContentStyles({});
  return <div className={root}>{children}</div>;
});

const useAddStyles = makeStyles<Theme>((theme) => ({
  root: {
    padding: "8px",
    flexGrow: 1,
    overflowX: "hidden",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    background: theme.palette.background.paper,
  },
}));

export const ItemAdd: typeof Link = React.memo(({ children, route, match }) => {
  const { root } = useAddStyles({});
  return (
    <div className={root}>
      <Button
        component={Link}
        route={route}
        match={match}
        variant="contained"
        color="primary"
      >
        {children}
      </Button>
    </div>
  );
});

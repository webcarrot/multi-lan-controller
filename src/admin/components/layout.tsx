import * as React from "react";

import { makeStyles } from "@material-ui/styles";
import {
  Display,
  ReactRouteContext,
} from "@webcarrot/multi-lan-controller/admin/routes/components";
import { Navigation } from "./navigation";
import { UserContext } from "./userContext";
import { Theme } from "@material-ui/core";

const useStyles = makeStyles<Theme>((theme) => ({
  "@global": {
    "html,body": {
      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
      margin: 0,
      padding: 0,
      color: theme.palette.common.white,
      background: theme.palette.background.default,
    },
  },
  root: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    overflow: "hidden",
    position: "relative",
    zIndex: 0,
    color: theme.palette.common.white,
    background: theme.palette.background.default,
  },
  progress: {
    cursor: "progress",
    "& *": {
      cursor: "progress!important",
    },
  },
  wait: {
    cursor: "wait",
    "& *": {
      pointerEvents: "none",
    },
  },
  content: {
    flexGrow: 1,
    height: "100%",
    overflow: "hidden",
  },
}));

export const InProgressContext = React.createContext<() => () => void>(null);

export const Layout = React.memo(() => {
  const classes = useStyles({});
  const user = React.useContext(UserContext);
  const [waitFor, setWaitForIt] = React.useState(0);
  const { inProgress: routeInProgress } = React.useContext(ReactRouteContext);

  const setInProgress = React.useCallback(() => {
    setWaitForIt((v) => v + 1);
    return () => setWaitForIt((v) => v - 1);
  }, [setWaitForIt]);

  const wait = waitFor > 0;
  const progress = !wait && routeInProgress();

  return (
    <InProgressContext.Provider value={setInProgress}>
      <div
        className={`${classes.root} ${
          progress ? classes.progress : wait ? classes.wait : ""
        }`}
      >
        {user.type === "admin" ? <Navigation /> : null}
        <div className={classes.content}>
          <Display />
        </div>
      </div>
    </InProgressContext.Provider>
  );
});

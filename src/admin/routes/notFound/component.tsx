import * as React from "react";
import { Component as ComponentInt } from "./types";
import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
});

const Component: ComponentInt = ({ output: { title } }) => {
  const classes = useStyles({});
  return (
    <main className={classes.root}>
      <Typography variant="h1">404</Typography>
      <Typography variant="body1">{title}</Typography>
    </main>
  );
};

export default Component;

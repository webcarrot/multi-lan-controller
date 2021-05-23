import * as React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Icon,
  IconButton,
  Avatar,
  Typography,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { ReactRouteContext, Link } from "../routes/components";
import { RoutesType } from "../routes/types";
import { UserContext } from "./userContext";

const useStyles = makeStyles({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    minWidth: "230px",
    "@media print": {
      display: "none",
    },
  },
  menuPaper: {
    position: "relative",
  },
  menuText: {
    margin: 0,
  },
  list: {
    flexGrow: 1,
    overflowX: "hidden",
    overflowY: "auto",
    scrollbarVisibility: "hidden",
    scrollbarWidth: "none",
    overflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  avatarButton: {
    padding: "8px",
  },
  avatar: {
    width: "24px",
    height: "24px",
  },
  userName: {
    paddingLeft: "8px",
  },
});

const MENU_ITEMS: Array<{
  route: RoutesType["id"];
  label: string;
  Icon: React.ComponentType<any>;
}> = [
  {
    route: "dashboard",
    label: "Dashboard",
    Icon: React.memo(() => <Icon>dashboard</Icon>),
  },
  {
    route: "places",
    label: "Places",
    Icon: React.memo(() => <Icon>place</Icon>),
  },
  {
    route: "devices",
    label: "Devices",
    Icon: React.memo(() => <Icon>developer_board</Icon>),
  },
  {
    route: "users",
    label: "Users",
    Icon: React.memo(() => <Icon>manage_accounts</Icon>),
  },
];

export const Navigation = React.memo(() => {
  const classes = useStyles({});
  const user = React.useContext(UserContext);

  const handleSignOut = React.useCallback(() => {
    // FIXME
  }, []);

  const { isCurrent } = React.useContext(ReactRouteContext);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      classes={{
        root: classes.root,
        paper: classes.menuPaper,
      }}
    >
      <List className={classes.list}>
        {MENU_ITEMS.map(({ route, Icon, label }) => (
          <ListItem
            key={route}
            button
            component={Link}
            route={route}
            match={{}}
            selected={isCurrent(route)}
            divider
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText
              primary={label}
              classes={{ root: classes.menuText }}
            />
          </ListItem>
        ))}
      </List>
      <Paper square>
        <IconButton onClick={handleSignOut} className={classes.avatarButton}>
          <Avatar className={classes.avatar} />
        </IconButton>
        <Typography className={classes.userName}>{user.name}</Typography>
      </Paper>
    </Drawer>
  );
});

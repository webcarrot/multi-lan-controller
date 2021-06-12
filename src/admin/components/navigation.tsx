import * as React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { ReactRouteContext, Link } from "../routes/components";
import { RoutesType } from "../routes/types";
import { UserContext } from "./userContext";
import { SIGNOUT_ENDPOINT } from "@webcarrot/multi-lan-controller/endpoints";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PlacesIcon from "@material-ui/icons/Place";
import DevicesIcon from "@material-ui/icons/DeveloperBoard";
import ActionsIcon from "@material-ui/icons/FlashOn";
import UsersIcon from "@material-ui/icons/SupervisorAccount";
import SettingsIcon from "@material-ui/icons/Settings";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import LoggerIcon from "@material-ui/icons/ViewList";
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
    Icon: DashboardIcon,
  },
  {
    route: "places",
    label: "Places",
    Icon: PlacesIcon,
  },
  {
    route: "devices",
    label: "Devices",
    Icon: DevicesIcon,
  },
  {
    route: "actions",
    label: "Actions",
    Icon: ActionsIcon,
  },
  {
    route: "users",
    label: "Users",
    Icon: UsersIcon,
  },
  {
    route: "settings",
    label: "Settings",
    Icon: SettingsIcon,
  },
  {
    route: "logger",
    label: "Logs",
    Icon: LoggerIcon,
  },
];

export const Navigation = React.memo(() => {
  const classes = useStyles({});
  const user = React.useContext(UserContext);

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
      <Divider />
      <List>
        <ListItem button component="a" href={`/${SIGNOUT_ENDPOINT}`}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary={user.name}
            secondary="Logout"
            classes={{ root: classes.menuText }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
});

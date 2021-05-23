import * as React from "react";
import {
  Icon,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { Toolbar } from "@webcarrot/multi-lan-controller/admin/components";
import { Link } from "../components";
import { User } from "@webcarrot/multi-lan-controller/common/db/types";

const useStyles = makeStyles({
  list: {
    flexGrow: 1,
    overflowY: "auto",
    overflowX: "hidden",
  },
});

const Item = React.memo<{ item: User; selected: boolean }>(
  ({ item, selected }) => {
    return (
      <ListItem
        button
        divider
        component={Link}
        route="users"
        match={{ mode: "edit", id: item.id }}
        selected={selected}
      >
        <ListItemAvatar>
          <Icon>{item.isActive ? "public" : "public_off"}</Icon>
        </ListItemAvatar>
        <ListItemText primary={item.name} secondary={item.login} />
      </ListItem>
    );
  }
);

export const ListWrapper = React.memo<{
  currentItemId: string;
  items: ReadonlyArray<User>;
}>(({ currentItemId, items }) => {
  const classes = useStyles({});
  return (
    <>
      <Toolbar title="Users" position="static" />
      <List className={classes.list}>
        {items.map((item) => (
          <Item
            item={item}
            selected={currentItemId === item.id}
            key={item.id}
          />
        ))}
      </List>
    </>
  );
});

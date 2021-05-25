import * as React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { Toolbar } from "@webcarrot/multi-lan-controller/admin/components";
import { Link } from "../components";
import { Action } from "@webcarrot/multi-lan-controller/common/db/types";
import ActiveIcon from "@material-ui/icons/CheckBox";
import InactiveIcon from "@material-ui/icons/CheckBoxOutlineBlank";

const useStyles = makeStyles({
  list: {
    flexGrow: 1,
    overflowY: "auto",
    overflowX: "hidden",
  },
});

const Item = React.memo<{ item: Action; selected: boolean }>(
  ({ item, selected }) => {
    return (
      <ListItem
        button
        divider
        component={Link}
        route="actions"
        match={{ mode: "edit", id: item.id }}
        selected={selected}
      >
        <ListItemAvatar>
          {item.isActive ? <ActiveIcon /> : <InactiveIcon />}
        </ListItemAvatar>
        <ListItemText primary={item.name} />
      </ListItem>
    );
  }
);

export const ListWrapper = React.memo<{
  readonly currentItemId: string;
  readonly items: ReadonlyArray<Action>;
}>(({ currentItemId, items }) => {
  const classes = useStyles({});
  return (
    <>
      <Toolbar title="Actions" position="static" />
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
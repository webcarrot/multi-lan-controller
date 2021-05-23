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
import { Device, Place } from "@webcarrot/multi-lan-controller/common/db/types";

const useStyles = makeStyles({
  list: {
    flexGrow: 1,
    overflowY: "auto",
    overflowX: "hidden",
  },
});

const Item = React.memo<{ item: Device; place: Place; selected: boolean }>(
  ({ item, place, selected }) => {
    return (
      <ListItem
        button
        divider
        component={Link}
        route="devices"
        match={{ mode: "edit", id: item.id }}
        selected={selected}
      >
        <ListItemAvatar>
          <Icon>{item.isActive ? "public" : "public_off"}</Icon>
        </ListItemAvatar>
        <ListItemText
          primary={item.name}
          secondary={place ? place.name : "No place"}
        />
      </ListItem>
    );
  }
);

export const ListWrapper = React.memo<{
  readonly currentItemId: string;
  readonly items: ReadonlyArray<Device>;
  readonly places: ReadonlyArray<Place>;
}>(({ currentItemId, items, places }) => {
  const classes = useStyles({});
  return (
    <>
      <Toolbar title="Devices" position="static" />
      <List className={classes.list}>
        {items.map((item) => (
          <Item
            item={item}
            selected={currentItemId === item.id}
            place={places.find(({ id }) => id === item.placeId)}
            key={item.id}
          />
        ))}
      </List>
    </>
  );
});

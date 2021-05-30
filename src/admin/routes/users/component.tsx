import * as React from "react";
import {
  Main,
  Item,
  ItemsListContainer,
  ItemAdd,
} from "@webcarrot/multi-lan-controller/admin/components";
import { ChangeType } from "@webcarrot/router";
import { ReactRouteContext } from "@webcarrot/multi-lan-controller/admin/routes/components";
import { Component as ComponentInt } from "./types";
import { Mode } from "../types";
import { ListWrapper } from "./list";
import { Edit } from "./edit";

const Component: ComponentInt = ({ output }) => {
  let item: React.ReactNode;
  const { info, navigate } = React.useContext(ReactRouteContext);
  const handleSave = React.useCallback(
    (id: string, mode?: Mode) => {
      navigate("users", {
        match: {
          mode: "edit",
          id,
        },
        changeType: mode === "edit" ? ChangeType.REPLACE : ChangeType.PUSH,
        ignoreConfirm: true,
      });
    },
    [info, navigate]
  );
  switch (output.mode) {
    case "add":
      item = (
        <Edit
          mode="add"
          onSave={handleSave}
          title={output.title}
          places={output.places}
          actions={output.actions}
        />
      );
      break;
    case "edit":
      item = (
        <Edit
          mode={output.mode}
          item={output.item}
          onSave={handleSave}
          title={output.title}
          places={output.places}
          actions={output.actions}
        />
      );
      break;
    default:
      item = (
        <ItemAdd
          route="users"
          match={{
            mode: "add",
          }}
        >
          Add new user
        </ItemAdd>
      );
      break;
  }
  return (
    <Main>
      <ItemsListContainer>
        <ListWrapper
          currentItemId={output.item ? output.item.id : null}
          items={output.list}
        />
      </ItemsListContainer>
      <Item>{item}</Item>
    </Main>
  );
};

export default Component;

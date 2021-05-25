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
      navigate("actions", {
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
      item = <Edit mode="add" onSave={handleSave} title={output.title} />;
      break;
    case "edit":
      item = (
        <Edit
          mode={output.mode}
          item={output.item}
          onSave={handleSave}
          title={output.title}
        />
      );
      break;
    default:
      item = (
        <ItemAdd
          route="actions"
          match={{
            mode: "add",
          }}
        >
          Add new action
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

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
    (id: string | null, mode: Mode) => {
      if (!id || mode === "list") {
        navigate("devices", {
          match: {
            mode: "list",
          },
          changeType: ChangeType.REPLACE,
          ignoreConfirm: true,
        });
      } else {
        navigate("devices", {
          match: {
            mode: "edit",
            id,
          },
          changeType: mode === "edit" ? ChangeType.REPLACE : ChangeType.PUSH,
          ignoreConfirm: true,
        });
      }
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
        />
      );
      break;
    default:
      item = (
        <ItemAdd
          route="devices"
          match={{
            mode: "add",
          }}
        >
          Add new device
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
          places={output.places}
        />
      </ItemsListContainer>
      <Item>{item}</Item>
    </Main>
  );
};

export default Component;

import * as React from "react";
import { Main, Item } from "@webcarrot/multi-lan-controller/admin/components";
import { ChangeType } from "@webcarrot/router";
import { ReactRouteContext } from "@webcarrot/multi-lan-controller/admin/routes/components";
import { Component as ComponentInt } from "./types";
import { Edit } from "./edit";

const Component: ComponentInt = ({ output }) => {
  const { info, navigate } = React.useContext(ReactRouteContext);
  const handleSave = React.useCallback(() => {
    navigate("settings", {
      match: {},
      changeType: ChangeType.REPLACE,
      ignoreConfirm: true,
    });
  }, [info, navigate]);
  return (
    <Main>
      <Item>
        <Edit
          settings={output.settings}
          actions={output.actions}
          dashboard={output.dashboard}
          onSave={handleSave}
          title={output.title}
        />
      </Item>
    </Main>
  );
};

export default Component;

import { Tab, Tabs } from "@material-ui/core";
import * as React from "react";
import { Toolbar } from "../../../components";
import { LoggerRecordType } from "@webcarrot/multi-lan-controller/common/logger/types";

import { Admin } from "./admin";
import { Auth } from "./auth";
import { Status } from "./status";
import { Actions } from "./actions";

export const List = React.memo<{
  readonly title: string;
}>(({ title }) => {
  const [tab, setTab] = React.useState<LoggerRecordType>("action");

  let content: JSX.Element = null;
  switch (tab) {
    case "admin":
      content = <Admin />;
      break;
    case "auth":
      content = <Auth />;
      break;
    case "status":
      content = <Status />;
      break;
    default:
      content = <Actions />;
      break;
  }

  return (
    <>
      <Toolbar title={title}>
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          variant="standard"
        >
          <Tab value="action" label="Action" />
          <Tab value="admin" label="Admin" />
          <Tab value="status" label="Status" />
          <Tab value="auth" label="Authentication" />
        </Tabs>
      </Toolbar>
      {content}
    </>
  );
});

import { Tab, Tabs } from "@material-ui/core";

import {
  parseSettings,
  useIsValid,
  validSettingsKeys,
} from "@webcarrot/multi-lan-controller/common/db/parse";
import {
  Action,
  Settings,
} from "@webcarrot/multi-lan-controller/common/db/types";
import { DeviceStatusValues } from "@webcarrot/multi-lan-controller/common/device/types";
import * as React from "react";
import {
  SuspenseLoader,
  Toolbar,
  useAdminApiCall,
  useAutoState,
} from "../../../components";

import { DashboardPlace } from "@webcarrot/multi-lan-controller/admin/api/dashboard/types";

const EditBasic = React.lazy(() =>
  import(/* webpackChunkName: "routes/settings/edit/basic" */ "./basic").then(
    ({ EditBasic }) => ({ default: EditBasic })
  )
);

const EditCols = React.lazy(() =>
  import(/* webpackChunkName: "routes/settings/edit/cols" */ "./cols").then(
    ({ EditCols }) => ({ default: EditCols })
  )
);
const EditSort = React.lazy(() =>
  import(/* webpackChunkName: "routes/settings/edit/sort" */ "./sort").then(
    ({ EditSort }) => ({ default: EditSort })
  )
);
const EditNames = React.lazy(() =>
  import(/* webpackChunkName: "routes/settings/edit/names" */ "./names").then(
    ({ EditNames }) => ({ default: EditNames })
  )
);

const EditNotifications = React.lazy(() =>
  import(
    /* webpackChunkName: "routes/settings/edit/notifications" */ "./notifications"
  ).then(({ EditNotifications }) => ({ default: EditNotifications }))
);

export const Edit = React.memo<{
  readonly settings: Settings;
  readonly actions: ReadonlyArray<Action>;
  readonly dashboard: ReadonlyArray<DashboardPlace>;
  readonly onSave: () => void;
  readonly title: string;
}>(({ settings, onSave, title, actions, dashboard }) => {
  const [data, setData] = useAutoState<Settings>(settings);
  const adminApi = useAdminApiCall();
  const isValid = useIsValid(data, parseSettings);
  const [tab, setTab] = React.useState<
    "names" | "cols" | "sort" | "notifications" | "basic"
  >("basic");

  const handleSave = React.useCallback(() => {
    if (isValid) {
      adminApi("Settings/Save", data).then(onSave);
    }
  }, [onSave, data, isValid]);

  const [sorted, setSorted] = useAutoState(
    React.useMemo(
      () => ({
        dashboard,
        actions,
      }),
      [dashboard, actions]
    )
  );

  const handleSaveSort = React.useCallback(() => {
    adminApi("Settings/Sort", {
      actions: sorted.actions.map(({ id }) => id),
      places: sorted.dashboard.map(({ id }) => id),
      devices: sorted.dashboard.reduce<ReadonlyArray<string>>(
        (out, { devices }) => out.concat(devices.map(({ id }) => id)),
        []
      ),
    }).then(onSave);
  }, [adminApi, sorted, onSave]);

  const handleNamesChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const name = ev.target.name as DeviceStatusValues;
      const value = ev.target.value;
      if (validSettingsKeys.includes(name)) {
        setData((data) => ({
          ...data,
          [name]: value,
        }));
      }
    },
    [setData]
  );

  const handleBasicChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      switch (ev.target.name) {
        case "reverseOut": {
          const value = ev.target.checked;
          setData((data) => ({
            ...data,
            reverseOut: value,
          }));
        }
        case "statsInterval": {
          const value = ev.target.value;
          setData((data) => ({
            ...data,
            statsInterval: parseInt(value) || 0,
          }));
        }
      }
    },
    [setData]
  );

  let content: JSX.Element = null;
  switch (tab) {
    case "cols":
      content = (
        <EditCols
          data={data}
          onChange={setData}
          onSave={handleSave}
          isValid={isValid}
        />
      );
      break;
    case "sort":
      content = (
        <EditSort {...sorted} onChange={setSorted} onSave={handleSaveSort} />
      );
      break;
    case "notifications":
      content = (
        <EditNotifications
          data={data}
          onChange={setData}
          onSave={handleSave}
          isValid={isValid}
        />
      );
      break;
    case "names":
      content = (
        <EditNames
          data={data}
          onChange={handleNamesChange}
          onSave={handleSave}
          isValid={isValid}
        />
      );
      break;
    default:
      content = (
        <EditBasic
          data={data}
          onChange={handleBasicChange}
          onSave={handleSave}
          isValid={isValid}
        />
      );
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
          <Tab value="basic" label="Basic" />
          <Tab value="names" label="Names" />
          <Tab value="sort" label="Sort" />
          <Tab value="cols" label="Cols" />
          <Tab value="notifications" label="Notifications" />
        </Tabs>
      </Toolbar>
      <SuspenseLoader>{content}</SuspenseLoader>
    </>
  );
});

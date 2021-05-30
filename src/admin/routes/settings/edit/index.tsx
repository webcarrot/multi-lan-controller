import {
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

import {
  parseSettings,
  useIsValid,
  validDiKeys,
  validIaKeys,
  validMiscKeys,
  validOutKeys,
  validSecKeys,
  validSettingsKeys,
} from "@webcarrot/multi-lan-controller/common/db/parse";
import {
  Action,
  Settings,
} from "@webcarrot/multi-lan-controller/common/db/types";
import { DeviceStatusValues } from "@webcarrot/multi-lan-controller/common/device/types";
import * as React from "react";
import { ReactAdminApiContext } from "../../../api/context";
import {
  Bottombar,
  ItemContent,
  Toolbar,
  useAutoState,
} from "../../../components";

import { EditCols } from "./cols";
import { DashboardPlace } from "@webcarrot/multi-lan-controller/admin/api/dashboard/types";
import { EditSort } from "./sort";

export const Edit = React.memo<{
  readonly settings: Settings;
  readonly actions: ReadonlyArray<Action>;
  readonly dashboard: ReadonlyArray<DashboardPlace>;
  readonly onSave: () => void;
  readonly title: string;
}>(({ settings, onSave, title, actions, dashboard }) => {
  const [data, setData] = useAutoState<Settings>(settings);
  const adminApi = React.useContext(ReactAdminApiContext);
  const isValid = useIsValid(data, parseSettings);
  const [tab, setTab] = React.useState<"names" | "cols" | "sort">("sort");

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
    default:
      content = (
        <EditNames
          data={data}
          onChange={handleNamesChange}
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
          <Tab value="sort" label="Sort" />
          <Tab value="cols" label="Cols" />
          <Tab value="names" label="Names" />
        </Tabs>
      </Toolbar>
      {content}
    </>
  );
});

const EditNames = React.memo<{
  data: Settings;
  onChange: React.ChangeEventHandler;
  onSave: () => void;
  isValid: boolean;
}>(({ data, onChange, onSave, isValid }) => {
  return (
    <>
      <ItemContent>
        <EditNamesGroup
          data={data}
          onChange={onChange}
          name="OUT"
          keys={validOutKeys}
        />
        <EditNamesGroup
          data={data}
          onChange={onChange}
          name="DI"
          keys={validDiKeys}
        />
        <EditNamesGroup
          data={data}
          onChange={onChange}
          name="IA"
          keys={validIaKeys}
        />
        <EditNamesGroup
          data={data}
          onChange={onChange}
          name="SEC"
          keys={validSecKeys}
        />
        <EditNamesGroup
          data={data}
          onChange={onChange}
          name="MISC"
          keys={validMiscKeys}
        />
      </ItemContent>
      <Bottombar>
        <Grid item>
          <Button
            onClick={onSave}
            variant="contained"
            color="primary"
            disabled={!isValid}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </Grid>
      </Bottombar>
    </>
  );
});

const EditNamesGroup = React.memo<{
  data: Settings;
  onChange: React.ChangeEventHandler;
  name: string;
  keys: ReadonlyArray<DeviceStatusValues>;
}>(({ data, onChange, name, keys }) => {
  return (
    <>
      <Typography variant="h6">{name}</Typography>
      <Grid
        container
        spacing={2}
        style={{
          margin: "8px 0 16px 0",
        }}
        component={Paper}
        variant="outlined"
      >
        {keys.map((key) => (
          <Grid item xs={6} key={key}>
            <TextField
              label={`${key.toUpperCase()} name`}
              name={key}
              value={data[key]}
              onChange={onChange}
              fullWidth
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
});

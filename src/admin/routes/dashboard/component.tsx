import * as React from "react";
import { Component as ComponentInt } from "./types";
import { makeStyles } from "@material-ui/styles";
import { Main } from "../../components";
import { DashboardDevice, DashboardPlace } from "../../api/dashboard/types";
import { Button, Checkbox, Icon } from "@material-ui/core";
import { ReactAdminApiContext } from "../../api/context";

const useStyles = makeStyles({
  dashboard: {
    width: "100%",
    borderCollapse: "collapse",
  },
});

const Component: ComponentInt = ({ output: { dashboards } }) => {
  const classes = useStyles({});
  const [selected, setSelected] = React.useState<ReadonlyArray<string>>([]);
  const [data, setData] = React.useState(dashboards);
  const adminApi = React.useContext(ReactAdminApiContext);
  React.useEffect(() => {
    let onData = setData;
    let fetch = () => {
      adminApi("Dashboard/Status", null).then((data) => onData(data));
      timeout = setTimeout(fetch, 500);
    };
    let timeout = setTimeout(fetch, 500);
    return () => {
      clearTimeout(timeout);
      onData = () => {};
    };
  }, [adminApi]);
  const devicesIds = React.useMemo(
    () =>
      data.reduce(
        (out, { devices }) => out.concat(devices.map(({ id }) => id)),
        []
      ),
    data.reduce(
      (out, { devices }) => out.concat(devices.map(({ id }) => id)),
      []
    )
  );

  const allSelected = React.useMemo(() => {
    return devicesIds.reduce(
      (allSelected, id) => allSelected && selected.includes(id),
      true
    );
  }, [devicesIds, selected]);

  const handleToggle = React.useCallback(() => {
    if (allSelected) {
      setSelected((selected) =>
        selected.filter((id) => !devicesIds.includes(id))
      );
    } else {
      setSelected((selected) =>
        selected.concat(devicesIds.filter((id) => !selected.includes(id)))
      );
    }
  }, [setSelected, allSelected, devicesIds]);

  return (
    <Main>
      <table className={classes.dashboard}>
        <thead>
          <tr>
            <td>
              <Checkbox checked={allSelected} onChange={handleToggle} />
            </td>
            <th>{"FIXME"}</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td>
              <Checkbox checked={allSelected} onChange={handleToggle} />
            </td>
            <td colSpan={2} />
            <td>
              <Button></Button>
            </td>
          </tr>
        </tfoot>
        <tbody>
          {data.map((place) => (
            <Place
              key={place.id}
              {...place}
              selected={selected}
              onSelect={setSelected}
            />
          ))}
        </tbody>
      </table>
    </Main>
  );
};

const Place = React.memo<
  DashboardPlace & {
    readonly selected: ReadonlyArray<string>;
    readonly onSelect: React.Dispatch<React.SetStateAction<readonly string[]>>;
  }
>(({ name, devices, selected, onSelect }) => {
  const devicesIds = React.useMemo(
    () => devices.map(({ id }) => id),
    devices.map(({ id }) => id)
  );

  const allSelected = React.useMemo(() => {
    return devicesIds.reduce(
      (allSelected, id) => allSelected && selected.includes(id),
      true
    );
  }, [devicesIds, selected]);

  const handleToggle = React.useCallback(() => {
    if (allSelected) {
      onSelect((selected) => selected.filter((id) => !devicesIds.includes(id)));
    } else {
      onSelect((selected) =>
        selected.concat(devicesIds.filter((id) => !selected.includes(id)))
      );
    }
  }, [onSelect, allSelected, devicesIds]);

  const handleSelect = React.useCallback(
    (id: string) => {
      onSelect((selected) =>
        selected.includes(id)
          ? selected.filter((i) => i !== id)
          : [...selected, id]
      );
    },
    [onSelect]
  );
  return (
    <>
      <tr>
        <td>
          <Checkbox checked={allSelected} onChange={handleToggle} />
        </td>
        <th>{name}</th>
      </tr>
      {devices.map((device) => (
        <Device
          key={device.id}
          {...device}
          selected={selected.includes(device.id)}
          onSelect={handleSelect}
        />
      ))}
    </>
  );
});

const Device = React.memo<
  DashboardDevice & {
    readonly selected: boolean;
    readonly onSelect: (id: string) => void;
  }
>(({ id, isOnline, name, onSelect, selected }) => {
  const handleToggle = React.useCallback(() => onSelect(id), [id, onSelect]);
  return (
    <tr>
      <td>
        <Checkbox checked={selected} onChange={handleToggle} />
      </td>
      <th>{name}</th>
      <td>
        <Icon>{isOnline ? "" : ""}</Icon>
      </td>
    </tr>
  );
});

export default Component;

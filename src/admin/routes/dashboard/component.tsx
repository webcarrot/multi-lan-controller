import * as React from "react";
import { ActiveOut, Component as ComponentInt } from "./types";
import {
  Bottombar,
  Item,
  ItemContent,
  Main,
  UserContext,
} from "../../components";
import { DashboardDevice, DashboardPlace } from "../../api/dashboard/types";
import {
  Button,
  Checkbox,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { ReactAdminApiContext } from "../../api/context";
import { DeviceOutNo } from "../../device/types";
import { SIGNOUT_ENDPOINT } from "@webcarrot/multi-lan-controller/endpoints";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import OnlineIcon from "@material-ui/icons/Power";
import OfflineIconIcon from "@material-ui/icons/PowerOff";
import ActiveIcon from "@material-ui/icons/CheckBox";
import InactiveIcon from "@material-ui/icons/CheckBoxOutlineBlank";

const CHECKBOX_SIZE = 30;
const ONLINE_SIZE = 30;
const STATUS_SIZE = 150;

const Component: ComponentInt = ({ output: { dashboards, settings } }) => {
  const [selected, setSelected] = React.useState<ReadonlyArray<string>>([]);
  const [data, setData] = React.useState(dashboards);
  const adminApi = React.useContext(ReactAdminApiContext);
  const user = React.useContext(UserContext);
  React.useEffect(() => {
    let onData = setData;
    let fetch = () => {
      adminApi("Dashboard/Status", null).then((data) => onData(data));
      timeout = setTimeout(fetch, 1000);
    };
    let timeout = setTimeout(fetch, 1000);
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

  const activeOut = React.useMemo<ReadonlyArray<ActiveOut>>(
    () =>
      settings.out.reduce<Array<ActiveOut>>((out, { isActive, name }, no) => {
        if (isActive) {
          out.push({
            name,
            no: no as DeviceOutNo,
          });
        }
        return out;
      }, []),
    [settings]
  );

  const handleResetLoop = React.useCallback(() => {
    if (selected.length) {
      adminApi(
        "Dashboard/ChangeOut",
        selected.map((id) => ({
          id,
          no: [1],
          value: "toggle",
        }))
      );
    }
  }, [selected]);

  const handleETollOff = React.useCallback(() => {
    if (selected.length) {
      adminApi(
        "Dashboard/ChangeOut",
        selected.map((id) => ({
          id,
          no: [2, 4],
          value: true,
        }))
      );
    }
  }, [selected]);

  const handleETollOn = React.useCallback(() => {
    if (selected.length) {
      adminApi(
        "Dashboard/ChangeOut",
        selected.map((id) => ({
          id,
          no: [2, 4],
          value: false,
        }))
      );
    }
  }, [selected]);

  return (
    <Main>
      <Item>
        <ItemContent>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell align="center" width={CHECKBOX_SIZE}>
                    <Checkbox
                      checked={allSelected}
                      onChange={handleToggle}
                      size="small"
                    />
                  </TableCell>
                  <TableCell component="th" scope="row" align="left">
                    Wybrane
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={handleETollOn}
                      variant="contained"
                      size="small"
                      color="secondary"
                    >
                      Włącz system E-Toll
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={handleETollOff}
                      variant="contained"
                      size="small"
                      color="primary"
                    >
                      Wyłącz system E-Toll
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={handleResetLoop}
                      variant="contained"
                      size="small"
                    >
                      Reset Pętli
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {data.map((place) => (
            <Place
              key={place.id}
              {...place}
              selected={selected}
              onSelect={setSelected}
              activeOut={activeOut}
            />
          ))}
        </ItemContent>
        {user.type === "normal" ? (
          <Bottombar>
            <Grid item>
              <Button
                component="a"
                href={`/${SIGNOUT_ENDPOINT}`}
                variant="contained"
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </Grid>
          </Bottombar>
        ) : null}
      </Item>
    </Main>
  );
};

const Place = React.memo<
  DashboardPlace & {
    readonly selected: ReadonlyArray<string>;
    readonly onSelect: React.Dispatch<React.SetStateAction<readonly string[]>>;
    readonly activeOut: ReadonlyArray<ActiveOut>;
  }
>(({ name, devices, selected, onSelect, activeOut }) => {
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
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center" width={CHECKBOX_SIZE}>
              <Checkbox
                checked={allSelected}
                onChange={handleToggle}
                size="small"
              />
            </TableCell>
            <TableCell align="left">{name}</TableCell>
            <TableCell align="center" width={ONLINE_SIZE}>
              OL
            </TableCell>
            {activeOut.map(({ name, no }) => (
              <TableCell align="center" key={no} width={STATUS_SIZE}>
                {name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map((device) => (
            <Device
              key={device.id}
              {...device}
              selected={selected.includes(device.id)}
              onSelect={handleSelect}
              activeOut={activeOut}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

const Device = React.memo<
  DashboardDevice & {
    readonly selected: boolean;
    readonly onSelect: (id: string) => void;
    readonly activeOut: ReadonlyArray<ActiveOut>;
  }
>(({ id, isOnline, name, onSelect, selected, status, activeOut }) => {
  const handleToggle = React.useCallback(() => onSelect(id), [id, onSelect]);
  return (
    <TableRow>
      <TableCell align="center" width={CHECKBOX_SIZE}>
        <Checkbox checked={selected} onChange={handleToggle} size="small" />
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {name}
      </TableCell>
      <TableCell align="center" width={ONLINE_SIZE}>
        {isOnline ? (
          <OnlineIcon fontSize="small" />
        ) : (
          <OfflineIconIcon fontSize="small" />
        )}
      </TableCell>
      {activeOut.map(({ no }) => (
        <TableCell align="center" key={no} width={STATUS_SIZE}>
          {isOnline ? (
            status.out[no] ? (
              <ActiveIcon fontSize="small" />
            ) : (
              <InactiveIcon fontSize="small" />
            )
          ) : (
            <OfflineIconIcon fontSize="small" />
          )}
        </TableCell>
      ))}
    </TableRow>
  );
});

export default Component;

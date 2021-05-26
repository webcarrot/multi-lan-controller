import * as React from "react";
import { ActiveOut, Component as ComponentInt } from "./types";
import {
  Bottombar,
  Item,
  ItemContent,
  Main,
  Toolbar,
  UserContext,
} from "../../components";
import {
  DashboardAction,
  DashboardDevice,
  DashboardPlace,
} from "../../api/dashboard/types";
import {
  Button,
  Checkbox,
  Divider,
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
import { SIGNOUT_ENDPOINT } from "@webcarrot/multi-lan-controller/endpoints";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import SortIcon from "@material-ui/icons/Sort";

import OnlineIcon from "@material-ui/icons/Power";
import OfflineIconIcon from "@material-ui/icons/PowerOff";
import ActiveIcon from "@material-ui/icons/CheckBox";
import InactiveIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { DeviceOutNo } from "@webcarrot/multi-lan-controller/common/db/types";
import { Link } from "../components";

const CHECKBOX_SIZE = 40;
const ONLINE_SIZE = 40;
const STATUS_SIZE = 150;

const TABLE_STYLE = { margin: "8px 0" };

const Component: ComponentInt = ({
  output: { dashboards, settings, actions, title },
}) => {
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

  const handleCallAction = React.useCallback(
    (actionId: string) => {
      if (selected.length) {
        adminApi("Dashboard/Action", {
          actionId,
          devicesIds: selected,
        });
      }
    },
    [selected]
  );

  return (
    <Main>
      <Item>
        <Toolbar title={title}>
          <TableContainer
            component={Paper}
            style={TABLE_STYLE}
            variant="outlined"
          >
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
                  <TableCell align="left">
                    {actions.map((action) => (
                      <Action
                        key={action.id}
                        onCall={handleCallAction}
                        {...action}
                      />
                    ))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Toolbar>
        <ItemContent>
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
        <Bottombar>
          <Grid item>
            {user.type === "normal" ? (
              <Button
                component="a"
                href={`/${SIGNOUT_ENDPOINT}`}
                variant="contained"
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            ) : (
              <Button
                component={Link}
                match={{ mode: "sort" }}
                route="dashboard"
                variant="contained"
                startIcon={<SortIcon />}
              >
                Sort settings
              </Button>
            )}
          </Grid>
        </Bottombar>
      </Item>
    </Main>
  );
};

const Action = React.memo<
  DashboardAction & {
    onCall: (id: string) => void;
  }
>(({ id, name, color, textColor, onCall }) => {
  const handleCallAction = React.useCallback(() => onCall(id), [id, onCall]);
  return (
    <Button
      onClick={handleCallAction}
      variant="contained"
      size="small"
      color="secondary"
      style={{ background: color, color: textColor, marginRight: "1em" }}
    >
      {name}
    </Button>
  );
});

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
    <>
      <Divider />
      <TableContainer component={Paper} style={TABLE_STYLE} variant="outlined">
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
    </>
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

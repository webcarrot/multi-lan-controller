import * as React from "react";
import { Component as ComponentInt } from "./types";
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
  FormControlLabel,
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

import OnlineIcon from "@material-ui/icons/Power";
import OfflineIconIcon from "@material-ui/icons/PowerOff";
import ActiveIcon from "@material-ui/icons/CheckBox";
import InactiveIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import {
  Settings,
  SettingsNotificationMessageType,
} from "@webcarrot/multi-lan-controller/common/db/types";
import { DeviceStatusValues } from "@webcarrot/multi-lan-controller/common/device/types";
import { useSnackbar } from "notistack";

const CHECKBOX_SIZE = 40;
const ONLINE_SIZE = 40;
const STATUS_SIZE = 150;

const TABLE_STYLE = { margin: "8px 0" };

const AUDIO_MAP = new Map<SettingsNotificationMessageType, HTMLAudioElement>();

const prepareText = (template: string, data: { [key in string]: string }) =>
  Object.keys(data).reduce(
    (out, key) => out.replace(`%${key}%`, data[key]),
    template
  );

const Component: ComponentInt = ({
  output: { dashboards, settings, actions, title },
}) => {
  const [selected, setSelected] = React.useState<ReadonlyArray<string>>([]);
  const [data, setData] = React.useState(dashboards);
  const adminApi = React.useContext(ReactAdminApiContext);
  const user = React.useContext(UserContext);
  const notificationsState = React.useRef<Set<string>>(null);
  const [muteSound, setMuteSound] = React.useState(false);

  const handleChangeMuteSound = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const muteSound = ev.target.checked;
      setMuteSound(muteSound);
      try {
        localStorage.setItem("muteSound", muteSound ? "m" : "p");
      } catch (_) {}
    },
    []
  );

  React.useEffect(() => {
    try {
      const muteSound = localStorage.getItem("muteSound") === "m";
      if (muteSound) {
        setMuteSound(muteSound);
      }
    } catch (_) {}
  }, []);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const filteredActions = React.useMemo(
    () =>
      user.actions === "all"
        ? actions
        : actions.filter(({ id }) => user.actions.includes(id)),
    [user, actions]
  );

  const newNotificationsState = new Set<string>();
  settings.notifications.forEach((notification) => {
    switch (notification.type) {
      case "ol":
        data.forEach(({ devices }) =>
          devices.forEach(({ id, isOnline }) =>
            newNotificationsState.add(`${id}/ol/${isOnline}`)
          )
        );
        break;
      case "out": {
        const outId = `out${notification.no}` as DeviceStatusValues;
        data.forEach(({ devices }) =>
          devices
            .filter(({ isOnline }) => isOnline)
            .forEach(({ id, status }) =>
              newNotificationsState.add(`${id}/out/${status[outId]}`)
            )
        );
        break;
      }
    }
  });

  if (!notificationsState.current) {
    notificationsState.current = newNotificationsState;
  }

  const notificationsStateDiff = [...notificationsState.current.values()]
    .filter((v) => newNotificationsState.has(v))
    .concat(
      [...newNotificationsState.values()].filter((v) =>
        notificationsState.current.has(v)
      )
    )
    .join("&");

  React.useEffect(() => {
    const playSound = new Set<SettingsNotificationMessageType>();
    const toAlert: Array<{
      text: string;
      messageType: SettingsNotificationMessageType;
    }> = [];
    const toSpeak: Array<{
      text: string;
      messageType: SettingsNotificationMessageType;
    }> = [];
    settings.notifications.forEach((notification) => {
      switch (notification.type) {
        case "ol":
          data.forEach(({ devices, name: place }) =>
            devices.forEach(({ id, isOnline, name: device }) => {
              const checkKey = `${id}/ol/${isOnline}`;
              if (
                isOnline === notification.status &&
                !notificationsState.current.has(checkKey) &&
                newNotificationsState.has(checkKey)
              ) {
                const message = {
                  text: prepareText(notification.template, {
                    place,
                    device,
                  }),
                  messageType: notification.messageType,
                };
                if (notification.alert) {
                  toAlert.push(message);
                }
                if (notification.speak) {
                  toSpeak.push(message);
                }
                if (notification.playSound) {
                  playSound.add(notification.messageType);
                }
              }
            })
          );
          break;
        case "out": {
          const outId = `out${notification.no}` as DeviceStatusValues;
          data.forEach(({ devices, name: place }) =>
            devices
              .filter(({ isOnline }) => isOnline)
              .forEach(({ id, status, name: device }) => {
                const checkKey = `${id}/ol/${status[outId]}`;
                if (
                  status[outId] === notification.status &&
                  !notificationsState.current.has(checkKey) &&
                  newNotificationsState.has(checkKey)
                ) {
                  const message = {
                    text: prepareText(notification.template, {
                      place,
                      device,
                    }),
                    messageType: notification.messageType,
                  };
                  if (notification.alert) {
                    toAlert.push(message);
                  }
                  if (notification.speak) {
                    toSpeak.push(message);
                  }
                  if (notification.playSound) {
                    playSound.add(notification.messageType);
                  }
                }
              })
          );
          break;
        }
      }
    });
    if (muteSound || typeof speechSynthesis === "undefined") {
      toAlert.push(...toSpeak.filter((v) => !toAlert.includes(v)));
    } else {
      toSpeak.forEach(({ messageType, text }) => {
        const ssu = new SpeechSynthesisUtterance(text);
        switch (messageType) {
          case "error":
            ssu.pitch = 1.5;
            break;
          case "warning":
            ssu.pitch = 1.2;
            break;
        }
        speechSynthesis.speak(ssu);
      });
    }
    toAlert.forEach(({ messageType, text }) => {
      const key = enqueueSnackbar(text, {
        variant: messageType,
        onClick: () => closeSnackbar(key),
      });
    });

    if (playSound.size && !muteSound && typeof Audio !== "undefined") {
      let toPlay: SettingsNotificationMessageType = "info";
      switch (true) {
        case playSound.has("error"):
          toPlay = "error";
          break;
        case playSound.has("warning"):
          toPlay = "warning";
          break;
        case playSound.has("success"):
          toPlay = "success";
          break;
      }
      if (!AUDIO_MAP.has(toPlay)) {
        AUDIO_MAP.set(toPlay, new Audio(`/sounds/${toPlay}.oga`));
      }
      AUDIO_MAP.get(toPlay).play();
    }
    notificationsState.current = newNotificationsState;
  }, [notificationsStateDiff]);

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
      data.reduce<string[]>(
        (out, { devices }) => out.concat(devices.map(({ id }) => id)),
        []
      ),
    [
      data
        .reduce(
          (out, { devices }) => out.concat(devices.map(({ id }) => id)),
          []
        )
        .join(","),
    ]
  );

  const allSelected = React.useMemo(() => {
    return devicesIds.reduce<boolean>(
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

  const handleCallAction = React.useCallback(
    (actionId: string) => {
      if (selected.length) {
        adminApi("Dashboard/Action", {
          actionId,
          devicesIds: selected,
        }).then(
          (status) => {
            status.forEach(({ name, success }) => {
              const key = enqueueSnackbar(name, {
                variant: success ? "success" : "warning",
                onClick: () => closeSnackbar(key),
              });
            });
          },
          ({ errors }) => {
            errors.forEach(({ message }: { message: string }) => {
              const key = enqueueSnackbar(message, {
                variant: "error",
                onClick: () => closeSnackbar(key),
              });
            });
          }
        );
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
                    {filteredActions.map((action) => (
                      <Action
                        key={action.id}
                        onCall={handleCallAction}
                        disabled={!selected.length}
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
              settings={settings}
            />
          ))}
        </ItemContent>
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
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={muteSound}
                  onChange={handleChangeMuteSound}
                  name="mute"
                />
              }
              label="Mute sounds"
            />
          </Grid>
        </Bottombar>
      </Item>
    </Main>
  );
};

const Action = React.memo<
  DashboardAction & {
    onCall: (id: string) => void;
    disabled: boolean;
  }
>(({ id, name, color, textColor, onCall, disabled }) => {
  const handleCallAction = React.useCallback(() => onCall(id), [id, onCall]);
  return (
    <Button
      onClick={handleCallAction}
      variant="contained"
      size="small"
      color="secondary"
      style={
        disabled
          ? { marginRight: "1em" }
          : { background: color, color: textColor, marginRight: "1em" }
      }
      disabled={disabled}
    >
      {name}
    </Button>
  );
});

const Place = React.memo<
  DashboardPlace & {
    readonly selected: ReadonlyArray<string>;
    readonly onSelect: React.Dispatch<React.SetStateAction<readonly string[]>>;
    readonly settings: Settings;
  }
>(({ name, devices, selected, onSelect, settings }) => {
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
              {settings.cols.map((col, no) => (
                <TableCell align="center" key={no} width={STATUS_SIZE}>
                  {settings[col]}
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
                settings={settings}
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
    readonly settings: Settings;
  }
>(({ id, isOnline, name, onSelect, selected, status, settings }) => {
  const handleToggle = React.useCallback(() => onSelect(id), [id, onSelect]);
  return (
    <TableRow style={isOnline ? {} : { background: "rgba(255,64,0,0.5)" }}>
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
      {settings.cols.map((col, no) => (
        <TableCell align="center" key={no} width={STATUS_SIZE}>
          {isOnline ? (
            typeof status[col] === "boolean" ? (
              status[col] ? (
                <ActiveIcon fontSize="small" style={{ fill: "green" }} />
              ) : (
                <InactiveIcon fontSize="small" style={{ fill: "red" }} />
              )
            ) : (
              status[col]
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

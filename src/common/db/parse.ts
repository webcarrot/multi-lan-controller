import {
  string,
  array,
  shape,
  make,
  error,
  number,
  boolean,
  eq,
  oneOf,
  Parser,
  emitValue,
} from "@webcarrot/parse";
import { useMemo } from "react";
import { validate } from "uuid";
import { DeviceStatusValues } from "../device/types";
import {
  Action,
  ActionChange,
  ActionChangeType,
  Device,
  DeviceOutNo,
  Place,
  Settings,
  SettingsNotification,
  SettingsNotificationOL,
  SettingsNotificationOut,
  User,
} from "./types";

export const parseId = make<string, string>((id, path) => {
  if (validate(id)) {
    return id;
  } else {
    throw error("Invalid id", path, id);
  }
});

export const parseOptionalId = parseId.catch(
  make<string, string>((id, path) => {
    if (id) {
      throw error("Invalid id", path, id);
    } else {
      return "";
    }
  })
);

export const parseUser = shape<User>({
  id: parseOptionalId,
  login: string({ minLength: 2 }),
  name: string({ minLength: 2 }),
  password: string({ optional: true, nullable: true, default: "" }),
  places: oneOf([eq("all"), array(parseId)], { default: "all" }),
  actions: oneOf([eq("all"), array(parseId)], { default: "all" }),
  type: oneOf([eq("admin"), eq("normal")], { default: "normal" }),
  isActive: boolean({ default: true }),
}).then(
  make<User, User>((user, path) => {
    if (!user.id && !user.password) {
      throw error("Provide user password", path, "");
    }
    return user;
  })
);

export const parsePlace = shape<Place>({
  id: parseOptionalId,
  name: string({ minLength: 2 }),
  isActive: boolean({ default: true }),
});

export const parseDevice = shape<Device>({
  id: parseOptionalId,
  name: string({ minLength: 2 }),
  placeId: parseOptionalId,
  url: string({ minLength: 10 }),
  isActive: boolean({ default: true }),
  version: number({ convert: true, default: 2 })
    .catch(emitValue(2))
    .then(oneOf([eq(1), eq(2), eq(3)], { default: 2 })),
});

export const parseActionChange = shape<ActionChange>({
  out: oneOf<DeviceOutNo>([eq(0), eq(1), eq(2), eq(3), eq(4)]),
  change: oneOf<ActionChangeType>([eq("on"), eq("off"), eq("toggle")]),
});

export const parseAction = shape<Action>({
  id: parseOptionalId,
  name: string({ minLength: 2 }),
  color: string({ default: "#333333", regexp: /^#[0-9a-f]{6}/ }),
  textColor: string({ default: "#ffffff", regexp: /^#[0-9a-f]{6}/ }),
  isActive: boolean({ default: true }),
  toChange: make<ReadonlyArray<ActionChange>, ReadonlyArray<ActionChange>>(
    (data) => {
      if (!(data instanceof Array)) {
        return [];
      }
      return data.filter(({ out }) => out <= 4);
    }
  ).then(array(parseActionChange)),
});

export const validOutKeys: ReadonlyArray<DeviceStatusValues> = [
  "out0",
  "out1",
  "out2",
  "out3",
  "out4",
  "out5",
];

export const validDiKeys: ReadonlyArray<DeviceStatusValues> = [
  "di0",
  "di1",
  "di2",
  "di3",
];

export const validIaKeys: ReadonlyArray<DeviceStatusValues> = [
  "ia0",
  "ia1",
  "ia2",
  "ia3",
  "ia4",
  "ia5",
  "ia6",
  "ia7",
  "ia8",
  "ia9",
  "ia10",
  "ia11",
  "ia12",
  "ia13",
  "ia14",
  "ia15",
  "ia16",
  "ia17",
  "ia18",
  "ia19",
];

export const validSecKeys: ReadonlyArray<DeviceStatusValues> = [
  "sec0",
  "sec1",
  "sec2",
  "sec3",
  "sec4",
];

export const validMiscKeys: ReadonlyArray<DeviceStatusValues> = [
  "freq",
  "duty",
  "pwm",
];

export const validSettingsKeys: ReadonlyArray<DeviceStatusValues> = [].concat(
  validOutKeys,
  validDiKeys,
  validIaKeys,
  validSecKeys,
  validMiscKeys
);

export const parseSettingsNotificationOL = shape<SettingsNotificationOL>({
  type: eq("ol"),
  alert: boolean({ default: false }),
  playSound: boolean({ default: false }),
  speak: boolean({ default: false }),
  messageType: oneOf([eq("error"), eq("success"), eq("warning"), eq("info")], {
    default: "info",
  }),
  status: boolean({ default: false }),
  template: string(),
});

export const parseSettingsNotificationOut = shape<SettingsNotificationOut>({
  type: eq("out"),
  no: number({ convert: true, min: 0, max: 5 }).then(
    oneOf([eq(0), eq(1), eq(2), eq(3), eq(4), eq(5)])
  ),
  alert: boolean({ default: false }),
  playSound: boolean({ default: false }),
  speak: boolean({ default: false }),
  messageType: oneOf([eq("error"), eq("success"), eq("warning"), eq("info")], {
    default: "info",
  }),
  status: boolean({ default: false }),
  template: string(),
});

export const parseSettingsNotification = oneOf<SettingsNotification>([
  parseSettingsNotificationOL,
  parseSettingsNotificationOut,
]);

export const parseSettings = shape<Settings>({
  ...validSettingsKeys.reduce<{ [key in DeviceStatusValues]: Parser<string> }>(
    (out, key) => {
      out[key] = string({ default: key.toUpperCase() });
      return out;
    },
    {} as { [key in DeviceStatusValues]: Parser<string> }
  ),
  cols: array(oneOf(validSettingsKeys.map((key) => eq(key))), { default: [] }),
  reverseOut: boolean({ default: true }),
  notifications: array(parseSettingsNotification, { default: [] }),
  statsInterval: number({ default: 5000, convert: true }),
});

export const useIsValid = <T>(data: T, validator: Parser<T>) =>
  useMemo(() => {
    try {
      validator(data);
    } catch (_) {
      return false;
    }
    return true;
  }, [data, validator]);

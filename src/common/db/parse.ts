import {
  string,
  array,
  shape,
  make,
  error,
  boolean,
  eq,
  oneOf,
} from "@webcarrot/parse";
import { validate } from "uuid";
import {
  Action,
  ActionChange,
  ActionChangeType,
  Device,
  DeviceOutNo,
  OutSetting,
  Place,
  Settings,
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
  password: string({ optional: true, default: "" }),
  places: oneOf([eq("all"), array(parseId)]),
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
});

export const parseDevice = shape<Device>({
  id: parseOptionalId,
  name: string({ minLength: 2 }),
  placeId: parseOptionalId,
  url: string({ minLength: 10 }),
  isActive: boolean({ default: true }),
});

export const parseActionChange = shape<ActionChange>({
  out: oneOf<DeviceOutNo>([eq(0), eq(1), eq(2), eq(3), eq(4), eq(5)]),
  change: oneOf<ActionChangeType>([eq("on"), eq("off"), eq("toggle")]),
});

export const parseAction = shape<Action>({
  id: parseOptionalId,
  name: string({ minLength: 2 }),
  color: string({ default: "" }),
  isActive: boolean({ default: true }),
  toChange: array(parseActionChange),
});

export const parseOutSetting = shape<OutSetting>({
  isActive: boolean(),
  name: string({ minLength: 1 }),
});

export const parseSettings = shape<Settings>({
  out: array(parseOutSetting).then(
    make<
      [OutSetting, OutSetting, OutSetting, OutSetting, OutSetting, OutSetting],
      ReadonlyArray<OutSetting>
    >((data, path) => {
      if (data.length === 6) {
        return data as [
          OutSetting,
          OutSetting,
          OutSetting,
          OutSetting,
          OutSetting,
          OutSetting
        ];
      } else {
        throw error("Invalid out settings", path, data);
      }
    })
  ),
});

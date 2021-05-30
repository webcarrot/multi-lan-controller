import { DeviceStatus, DeviceStatusValues } from "../device/types";

export type DbAccess = {
  readonly read: () => Promise<Db>;
  readonly save: (cb: (data: Db) => Promise<Db>) => Promise<Db>;
  readonly status: () => { [key: string]: DeviceStatus };
};
export type DeviceOutNo = 0 | 1 | 2 | 3 | 4;

export type UserType = "admin" | "normal";

export type User = {
  readonly id: string;
  readonly login: string;
  readonly name: string;
  readonly password: string;
  readonly type: UserType;
  readonly places: ReadonlyArray<string> | "all";
  readonly actions: ReadonlyArray<string> | "all";
  readonly isActive: boolean;
};

export type Place = {
  readonly id: string;
  readonly name: string;
  readonly isActive: boolean;
};

export type Device = {
  readonly id: string;
  readonly placeId: string;
  readonly url: string;
  readonly name: string;
  readonly isActive: boolean;
};

export type ActionChangeType = "on" | "off" | "toggle";

export type ActionChange = {
  readonly out: DeviceOutNo;
  readonly change: ActionChangeType;
};

export type Action = {
  readonly id: string;
  readonly name: string;
  readonly color: string;
  readonly textColor: string;
  readonly isActive: boolean;
  readonly toChange: ReadonlyArray<ActionChange>;
};

export type Settings = {
  readonly [key in DeviceStatusValues]: string;
} & {
  readonly cols: ReadonlyArray<DeviceStatusValues>;
};

export type Db = {
  readonly users: ReadonlyArray<User>;
  readonly places: ReadonlyArray<Place>;
  readonly devices: ReadonlyArray<Device>;
  readonly actions: ReadonlyArray<Action>;
  readonly settings: Settings;
};

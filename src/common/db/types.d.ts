export type DbAccess = {
  readonly read: () => Promise<Db>;
  readonly save: (cb: (data: Db) => Promise<Db>) => Promise<Db>;
};

export type UserType = "admin" | "normal";

export type User = {
  readonly id: string;
  readonly login: string;
  readonly name: string;
  readonly password: string;
  readonly type: UserType;
  readonly places: ReadonlyArray<string> | "all";
  readonly isActive: boolean;
};

export type Place = {
  readonly id: string;
  readonly name: string;
};

export type Device = {
  readonly id: string;
  readonly placeId: string;
  readonly url: string;
  readonly name: string;
  readonly isActive: boolean;
};

export type OutSetting = {
  readonly isActive: boolean;
  readonly name: string;
};

export type Settings = {
  readonly out: [
    OutSetting,
    OutSetting,
    OutSetting,
    OutSetting,
    OutSetting,
    OutSetting
  ];
};

export type Db = {
  readonly users: ReadonlyArray<User>;
  readonly places: ReadonlyArray<Place>;
  readonly devices: ReadonlyArray<Device>;
  readonly settings: Settings;
};

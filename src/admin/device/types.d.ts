export type DeviceOutNo = 0 | 1 | 2 | 3 | 4 | 5;

export type DeviceStatus = {
  readonly out: [boolean, boolean, boolean, boolean, boolean, boolean];
};

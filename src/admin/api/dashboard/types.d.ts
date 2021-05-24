import { DeviceStatus, DeviceOutNo } from "../../device/types";

export type DashboardChangeOut = {
  readonly id: string;
  readonly no: ReadonlyArray<DeviceOutNo>;
  readonly value: boolean | "toggle";
};

export type DashboardDevice = {
  readonly id: string;
  readonly name: string;
  readonly isOnline: boolean;
  readonly status: DeviceStatus;
};

export type DashboardPlace = {
  readonly id: string;
  readonly name: string;
  readonly devices: ReadonlyArray<DashboardDevice>;
};

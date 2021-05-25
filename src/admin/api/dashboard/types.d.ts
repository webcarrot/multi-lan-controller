import { DeviceStatus } from "../../device/types";

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

export type DashboardAction = {
  readonly id: string;
  readonly name: string;
  readonly color: string;
};

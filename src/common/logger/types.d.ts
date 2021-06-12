import { DeviceStatus } from "../device/types";

export type LoggerRecordType = "status" | "action" | "auth" | "admin";

type LoggerBaseRecord<T extends LoggerRecordType, E = {}> = {
  readonly type: T;
  readonly date: number;
} & E;

export type LoggerStatusRecord = LoggerBaseRecord<
  "status",
  {
    readonly deviceId: string;
    readonly isOnline: boolean;
    readonly status: DeviceStatus;
  }
>;

export type LoggerActionRecord = LoggerBaseRecord<
  "action",
  {
    readonly deviceId: string;
    readonly actionId: string;
    readonly userId: string;
    readonly success: boolean;
  }
>;

export type LoggerAuthRecord = LoggerBaseRecord<
  "auth",
  {
    readonly userId: string;
    readonly logIn: boolean;
  }
>;

export type LoggerAdminRecordComponentType =
  | "user"
  | "settings"
  | "sort"
  | "device"
  | "place"
  | "action";

export type LoggerAdminRecord = LoggerBaseRecord<
  "admin",
  {
    readonly userId: string;
    readonly component: LoggerAdminRecordComponentType;
    readonly id: string;
  }
>;
export type LoggerRecord =
  | LoggerStatusRecord
  | LoggerActionRecord
  | LoggerAuthRecord
  | LoggerAdminRecord;

export type LoggerInfoQuery<T extends LoggerRecordType> = {
  readonly fromDate?: string;
  readonly toDate?: string;
  readonly offset?: number;
  readonly limit?: number;
  readonly type: T;
};

export type LoggerInfo<T extends LoggerRecord> = {
  readonly items: ReadonlyArray<T>;
  readonly meta: LoggerInfoQuery<LoggerRecord["type"]> & {
    readonly total: number;
  };
};

export type Logger = {
  readonly read: <T extends LoggerRecord>(
    query: LoggerInfoQuery<T["type"]>
  ) => Promise<LoggerInfo<T>>;
  readonly append: <T extends LoggerRecord>(data: Omit<T, "date">) => void;
};

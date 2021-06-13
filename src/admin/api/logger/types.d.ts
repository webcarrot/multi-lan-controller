import {
  LoggerAdminRecordChangeType,
  LoggerAdminRecordComponentType,
  LoggerRecordType,
} from "@webcarrot/multi-lan-controller/common/logger/types";

type InternalBaseLogger<
  T extends LoggerRecordType,
  I extends { readonly date: number }
> = {
  readonly type: T;
  readonly items: ReadonlyArray<I>;
  readonly meta: InternalLoggerMeta;
};

export type InternalLoggerMeta = {
  readonly fromDate?: string;
  readonly toDate?: string;
  readonly limit: number;
  readonly offset: number;
  readonly total: number;
};

export type InternalAdminLoggerRecord = {
  readonly date: number;
  readonly user: string;
  readonly component: LoggerAdminRecordComponentType;
  readonly changeType: LoggerAdminRecordChangeType;
  readonly name: string;
};

export type InternalAdminLogger = InternalBaseLogger<
  "admin",
  InternalAdminLoggerRecord
>;

export type InternalAuthLoggerRecord = {
  readonly date: number;
  readonly user: string;
  readonly logIn: boolean;
};

export type InternalAuthLogger = InternalBaseLogger<
  "auth",
  InternalAuthLoggerRecord
>;

export type InternalStatusLoggerRecord = {
  readonly date: number;
  readonly name: string;
  readonly place: string;
  readonly isOnline: boolean;
};

export type InternalStatusLogger = InternalBaseLogger<
  "status",
  InternalStatusLoggerRecord
>;

export type InternalActionLoggerRecord = {
  readonly date: number;
  readonly user: string;
  readonly device: string;
  readonly place: string;
  readonly action: string;
  readonly success: boolean;
};

export type InternalActionLogger = InternalBaseLogger<
  "action",
  InternalActionLoggerRecord
>;

export type InternalLogger =
  | InternalAdminLogger
  | InternalAuthLogger
  | InternalStatusLogger
  | InternalActionLogger;

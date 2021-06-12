import { promises } from "fs";
import { join } from "path";
import {
  Logger,
  LoggerInfoQuery,
  LoggerRecord,
  LoggerRecordType,
} from "./types";

const toStartOfDay = (date: Date) => {
  if (date && date.getTime()) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }
  return null;
};

const toEndOfDay = (date: Date) => {
  if (date && date.getTime()) {
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMilliseconds(999);
    return date;
  }
  return null;
};

const LOG_TYPES: ReadonlyArray<LoggerRecordType> = [
  "action",
  "admin",
  "auth",
  "status",
];

export const makeLogger = async (dbDir: string): Promise<Logger> => {
  const logDir = join(dbDir, "logger");
  const lastWrites = new Map<LoggerRecordType, Promise<void>>();
  for (let i = 0; i < LOG_TYPES.length; i++) {
    const type = LOG_TYPES[i];
    const logTypeDir = join(logDir, type);
    try {
      let info;
      try {
        info = await promises.stat(logTypeDir);
      } catch (_) {
        await promises.mkdir(logTypeDir, { recursive: true });
        info = await promises.stat(logTypeDir);
      }
      if (!info.isDirectory()) {
        throw new Error("Invalid log dir path");
      }
    } catch (_) {
      throw new Error("Invalid log dir path");
    }
    lastWrites.set(type, Promise.resolve());
  }

  const getRecords = async (
    query: LoggerInfoQuery<LoggerRecordType> = { type: "action" }
  ): Promise<ReadonlyArray<string>> => {
    const logTypeDir = join(logDir, query.type || "action");
    let files = (await promises.readdir(logTypeDir))
      .map<{
        readonly name: string;
        readonly date: Date;
      }>((name) => ({
        name,
        date: toStartOfDay(new Date(name.substring(0, 10))),
      }))
      .filter(({ date }) => !!date)
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    let fromDate: Date;
    if (query.fromDate) {
      fromDate = toStartOfDay(new Date(query.fromDate.substring(0, 10)));
    } else {
      fromDate = toStartOfDay(new Date());
    }
    if (fromDate) {
      files = files.filter(({ date }) => fromDate.getTime() <= date.getTime());
    }
    if (query.toDate) {
      const toDate = toEndOfDay(new Date(query.toDate.substring(0, 10)));
      if (toDate) {
        if (toDate.getTime()) {
          files = files.filter(
            ({ date }) => toDate.getTime() >= date.getTime()
          );
        }
      }
    }

    return (
      await Promise.all(
        files.map<Promise<string[]>>(async ({ name }) =>
          (
            await promises.readFile(join(logTypeDir, name), "utf-8")
          )
            .split("\n")
            .filter((v) => !!v.length)
            .reverse()
        )
      )
    ).reduce<ReadonlyArray<string>>((out, lines) => out.concat(lines), []);
  };

  const writeToLogFile = <T extends LoggerRecord>(data: Omit<T, "date">) => {
    lastWrites.set(
      data.type,
      lastWrites.get(data.type).then(async () => {
        try {
          await promises.appendFile(
            join(
              logDir,
              data.type,
              `${new Date().toISOString().substring(0, 10)}.txt`
            ),
            JSON.stringify({ date: Date.now(), ...data }) + "\n",
            "utf-8"
          );
        } catch (err) {
          console.error(err.message, data);
        }
      })
    );
  };

  return {
    read: async (query) => {
      const offset = query.offset || 0;
      const limit = query.limit || 100;
      const records = await getRecords(query);
      const items = records
        .slice(offset, offset + limit)
        .map((v) => {
          try {
            return JSON.parse(v);
          } catch (_) {
            return null;
          }
        })
        .filter((v) => !!v);
      return {
        items,
        meta: {
          ...query,
          offset,
          limit,
          total: records.length,
        },
      };
    },
    append: (data) => writeToLogFile(data),
  };
};

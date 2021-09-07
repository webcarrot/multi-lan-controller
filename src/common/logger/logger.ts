import { promises } from "fs";
import { join } from "path";
import { promisify } from "util";
import { gzip as _gzip, gunzip as _gunzip } from "zlib";
import {
  Logger,
  LoggerInfoQuery,
  LoggerRecord,
  LoggerRecordType,
  LoggerStatsRecord,
} from "./types";

const gzip = promisify(_gzip);
const gunzip = promisify(_gunzip);

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
  "stats",
];

const getDir = async (
  logDir: string,
  type: LoggerRecordType,
  deviceId?: string
): Promise<string> => {
  switch (type) {
    case "stats":
      return await ensureDir(join(logDir, type, deviceId));
    default: {
      return await ensureDir(join(logDir, type));
    }
  }
};

const getPath = async (logDir: string, data: LoggerRecord): Promise<string> => {
  switch (data.type) {
    case "stats": {
      return join(
        await getDir(logDir, data.type, data.deviceId),
        `${new Date().toISOString().substring(0, 10)}.csv.gz`
      );
    }
    default: {
      return join(
        await getDir(logDir, data.type),
        `${new Date().toISOString().substring(0, 10)}.txt`
      );
    }
  }
};

const readFile = async (file: string, type: LoggerRecordType) => {
  switch (type) {
    case "stats":
      return await (
        await gunzip(await promises.readFile(file, "binary"))
      ).toString("ascii");
    default:
      return await promises.readFile(file, "utf-8");
  }
};

const serialize = async (data: LoggerRecord): Promise<Buffer | string> => {
  switch (data.type) {
    case "stats": {
      const {
        date,
        status: {
          di0,
          di1,
          di2,
          di3,
          duty,
          freq,
          ia0,
          ia1,
          ia10,
          ia11,
          ia12,
          ia13,
          ia14,
          ia15,
          ia16,
          ia17,
          ia18,
          ia19,
          ia2,
          ia3,
          ia4,
          ia5,
          ia6,
          ia7,
          ia8,
          ia9,
          out0,
          out1,
          out2,
          out3,
          out4,
          out5,
          pwm,
          sec0,
          sec1,
          sec2,
          sec3,
          sec4,
        },
      } = data;
      return await gzip(
        Buffer.from(
          [
            date,
            di0,
            di1,
            di2,
            di3,
            duty,
            freq,
            ia0,
            ia1,
            ia10,
            ia11,
            ia12,
            ia13,
            ia14,
            ia15,
            ia16,
            ia17,
            ia18,
            ia19,
            ia2,
            ia3,
            ia4,
            ia5,
            ia6,
            ia7,
            ia8,
            ia9,
            out0,
            out1,
            out2,
            out3,
            out4,
            out5,
            pwm,
            sec0,
            sec1,
            sec2,
            sec3,
            sec4,
          ].join(",") + "\n",
          "ascii"
        )
      );
    }
    default:
      return JSON.stringify(data) + "\n";
  }
};

const parse = <T extends LoggerRecordType>(
  data: string,
  query: LoggerInfoQuery<T>
): LoggerRecord => {
  switch (query.type) {
    case "stats": {
      const [
        date,
        di0,
        di1,
        di2,
        di3,
        duty,
        freq,
        ia0,
        ia1,
        ia10,
        ia11,
        ia12,
        ia13,
        ia14,
        ia15,
        ia16,
        ia17,
        ia18,
        ia19,
        ia2,
        ia3,
        ia4,
        ia5,
        ia6,
        ia7,
        ia8,
        ia9,
        out0,
        out1,
        out2,
        out3,
        out4,
        out5,
        pwm,
        sec0,
        sec1,
        sec2,
        sec3,
        sec4,
      ] = data.split(",");

      const out: LoggerStatsRecord = {
        date: parseInt(date),
        deviceId: (query as any).statsId,
        type: "stats",
        status: {
          di0,
          di1,
          di2,
          di3,
          duty: parseInt(duty),
          freq: parseInt(freq),
          ia0: parseInt(ia0),
          ia1: parseInt(ia1),
          ia10: parseInt(ia10),
          ia11: parseInt(ia11),
          ia12: parseInt(ia12),
          ia13: parseInt(ia13),
          ia14: parseInt(ia14),
          ia15: parseInt(ia15),
          ia16: parseInt(ia16),
          ia17: parseInt(ia17),
          ia18: parseInt(ia18),
          ia19: parseInt(ia19),
          ia2: parseInt(ia2),
          ia3: parseInt(ia3),
          ia4: parseInt(ia4),
          ia5: parseInt(ia5),
          ia6: parseInt(ia6),
          ia7: parseInt(ia7),
          ia8: parseInt(ia8),
          ia9: parseInt(ia9),
          out0: out0 === "true",
          out1: out1 === "true",
          out2: out2 === "true",
          out3: out3 === "true",
          out4: out4 === "true",
          out5: out5 === "true",
          pwm: parseInt(pwm),
          sec0: parseInt(sec0),
          sec1: parseInt(sec1),
          sec2: parseInt(sec2),
          sec3: parseInt(sec3),
          sec4: parseInt(sec4),
        },
      };
      return out;
    }
    default:
      return JSON.parse(data);
  }
};

const DIR_CACHE = new Map<string, number>();

const ensureDir = async (dir: string): Promise<string> => {
  if (DIR_CACHE.has(dir) && DIR_CACHE.get(dir) > Date.now()) {
    return dir;
  }
  try {
    let info;
    try {
      info = await promises.stat(dir);
    } catch (_) {
      await promises.mkdir(dir, { recursive: true });
      info = await promises.stat(dir);
    }
    if (!info.isDirectory()) {
      throw new Error("Invalid log dir path");
    }
  } catch (_) {
    throw new Error("Invalid log dir path");
  }
  DIR_CACHE.set(dir, Date.now() + 60 * 1000);
  return dir;
};

export const makeLogger = async (dbDir: string): Promise<Logger> => {
  const logDir = join(dbDir, "logger");
  const lastWrites = new Map<LoggerRecordType, Promise<void>>();
  for (let i = 0; i < LOG_TYPES.length; i++) {
    const type = LOG_TYPES[i];
    const logTypeDir = join(logDir, type);
    await ensureDir(logTypeDir);
    lastWrites.set(type, Promise.resolve());
  }

  const getRecords = async (
    query: LoggerInfoQuery<LoggerRecordType> = { type: "action" }
  ): Promise<ReadonlyArray<string>> => {
    const logTypeDir =
      query.type === "stats"
        ? await getDir(logDir, query.type || "action", query.statsId)
        : await getDir(logDir, query.type || "action");
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
            await readFile(join(logTypeDir, name), query.type)
          )
            .split("\n")
            .filter((v) => !!v.length)
            .reverse()
        )
      )
    ).reduce<ReadonlyArray<string>>((out, lines) => out.concat(lines), []);
  };

  const writeToLogFile = (data: Omit<LoggerRecord, "date">) => {
    lastWrites.set(
      data.type,
      lastWrites.get(data.type).then(async () => {
        try {
          await promises.appendFile(
            await getPath(logDir, data as LoggerRecord),
            await serialize({ date: Date.now(), ...data } as LoggerRecord),
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
            return parse(v, query) as any;
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

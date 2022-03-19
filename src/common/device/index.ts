import {
  Action,
  Device,
} from "@webcarrot/multi-lan-controller/common/db/types";
import axios, { AxiosRequestConfig } from "axios";
import { parseStringPromise } from "xml2js";
import { DeviceStatus } from "./types";
import { Agent } from "http";

const CACHE = new Map<string, AxiosRequestConfig>();

const getConfig = (device: Device): AxiosRequestConfig => {
  if (!CACHE.has(device.id)) {
    CACHE.set(device.id, {
      timeout: 10 * 1000,
      httpAgent: new Agent({
        keepAlive: true,
        keepAliveMsecs: 60 * 1000,
        timeout: 60 * 1000,
        scheduling: "fifo",
      }),
      headers: {
        Connection: "keep-alive",
        Referer: device.url,
      },
    });
  }
  return CACHE.get(device.id);
};

const string = (v: string[] | string): string =>
  typeof v === "string" ? v : v ? v[0] : "";

const isTrue = (v: string[] | string, reverseOut: boolean): boolean =>
  string(v) === (reverseOut ? "1" : "0");

const numeric = (v: string[] | string): number => parseInt(string(v)) || 0;

const getDeviceStatusV1 = async (
  device: Device,
  reverseOut: boolean
): Promise<DeviceStatus> => {
  const { data } = await axios.get(`${device.url}/st0.xml`, getConfig(device));
  const {
    response: {
      out0,
      out1,
      out2,
      out3,
      out4,
      out5,
      di0,
      di1,
      di2,
      di3,
      ia0,
      ia1,
      ia2,
      ia3,
      ia4,
      ia5,
      ia6,
      ia7,
      ia8,
      ia9,
      ia10,
      ia11,
      ia12,
      sec0,
      sec1,
      sec2,
      sec3,
      sec4,
      freq,
      duty,
      pwm,
    },
  } = await parseStringPromise(data);

  return {
    out0: isTrue(out0, reverseOut),
    out1: isTrue(out1, reverseOut),
    out2: isTrue(out2, reverseOut),
    out3: isTrue(out3, reverseOut),
    out4: isTrue(out4, reverseOut),
    out5: isTrue(out5, reverseOut),
    di0: string(di0),
    di1: string(di1),
    di2: string(di2),
    di3: string(di3),
    ia0: numeric(ia0),
    ia1: numeric(ia1),
    ia2: numeric(ia2),
    ia3: numeric(ia3),
    ia4: numeric(ia4),
    ia5: numeric(ia5),
    ia6: numeric(ia6),
    ia7: numeric(ia7),
    ia8: numeric(ia8),
    ia9: numeric(ia9),
    ia10: numeric(ia10),
    ia11: numeric(ia11),
    ia12: numeric(ia12),
    ia13: 0,
    ia14: 0,
    ia15: 0,
    ia16: 0,
    ia17: 0,
    ia18: 0,
    ia19: 0,
    sec0: numeric(sec0),
    sec1: numeric(sec1),
    sec2: numeric(sec2),
    sec3: numeric(sec3),
    sec4: numeric(sec4),
    freq: numeric(freq),
    duty: numeric(duty),
    pwm: numeric(pwm),
  };
};

const getDeviceStatusV2 = async (
  device: Device,
  reverseOut: boolean
): Promise<DeviceStatus> => {
  const { data } = await axios.get(`${device.url}/st0.xml`, getConfig(device));
  const {
    response: {
      out0,
      out1,
      out2,
      out3,
      out4,
      out5,
      di0,
      di1,
      di2,
      di3,
      ia0,
      ia1,
      ia2,
      ia3,
      ia4,
      ia5,
      ia6,
      ia7,
      ia8,
      ia9,
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
      sec0,
      sec1,
      sec2,
      sec3,
      sec4,
      freq,
      duty,
      pwm,
    },
  } = await parseStringPromise(data);

  return {
    out0: isTrue(out0, reverseOut),
    out1: isTrue(out1, reverseOut),
    out2: isTrue(out2, reverseOut),
    out3: isTrue(out3, reverseOut),
    out4: isTrue(out4, reverseOut),
    out5: isTrue(out5, reverseOut),
    di0: string(di0),
    di1: string(di1),
    di2: string(di2),
    di3: string(di3),
    ia0: numeric(ia0),
    ia1: numeric(ia1),
    ia2: numeric(ia2),
    ia3: numeric(ia3),
    ia4: numeric(ia4),
    ia5: numeric(ia5),
    ia6: numeric(ia6),
    ia7: numeric(ia7),
    ia8: numeric(ia8),
    ia9: numeric(ia9),
    ia10: numeric(ia10),
    ia11: numeric(ia11),
    ia12: numeric(ia12),
    ia13: numeric(ia13),
    ia14: numeric(ia14),
    ia15: numeric(ia15),
    ia16: numeric(ia16),
    ia17: numeric(ia17),
    ia18: numeric(ia18),
    ia19: numeric(ia19),
    sec0: numeric(sec0),
    sec1: numeric(sec1),
    sec2: numeric(sec2),
    sec3: numeric(sec3),
    sec4: numeric(sec4),
    freq: numeric(freq),
    duty: numeric(duty),
    pwm: numeric(pwm),
  };
};

const getDeviceStatusV3 = async (
  device: Device,
  reverseOut: boolean
): Promise<DeviceStatus> => {
  const { data } = await axios.get(
    `${device.url}/json/status_per.json`,
    getConfig(device)
  );
  const {
    // uptimeSeconds,
    // uptimeMinutes,
    // uptimeHours,
    // uptimeDays,
    // time,
    // vin,
    // tem,
    // diff1,
    // diff2,
    // diff3,
    // dthTemp,
    // dthHum,
    // bm280p,
    // bm680q,
    // ds1,
    // ds2,
    // ds3,
    // ds4,
    // ds5,
    // ds6,
    // ds7,
    // ds8,
    out0,
    out1,
    out2,
    out3,
    out4,
    out5,
    // inpp1,
    // inpp2,
    // inpp3,
    // inpp4,
    // inpp5,
    // inpp6,
    pwm,
    // ind,
    // power1,
    // power2,
    // power3,
    // power4,
    // energy1,
    // energy2,
    // energy3,
    // energy4,
    // pm1,
    // pm2,
    // pm4,
    // pm10,
    // co2,
    // pwmd0,
    // pwmd1,
    // pwmd2,
    // pwmd3,
  } = data;

  return {
    out0: isTrue(out0, reverseOut),
    out1: isTrue(out1, reverseOut),
    out2: isTrue(out2, reverseOut),
    out3: isTrue(out3, reverseOut),
    out4: isTrue(out4, reverseOut),
    out5: isTrue(out5, reverseOut),
    di0: "",
    di1: "",
    di2: "",
    di3: "",
    ia0: 0,
    ia1: 0,
    ia2: 0,
    ia3: 0,
    ia4: 0,
    ia5: 0,
    ia6: 0,
    ia7: 0,
    ia8: 0,
    ia9: 0,
    ia10: 0,
    ia11: 0,
    ia12: 0,
    ia13: 0,
    ia14: 0,
    ia15: 0,
    ia16: 0,
    ia17: 0,
    ia18: 0,
    ia19: 0,
    sec0: 0,
    sec1: 0,
    sec2: 0,
    sec3: 0,
    sec4: 0,
    freq: 0,
    duty: 0,
    pwm: numeric(pwm),
  };
};

export const getDeviceStatus = async (
  device: Device,
  reverseOut: boolean
): Promise<DeviceStatus> => {
  switch (device.version) {
    case 1:
      return getDeviceStatusV1(device, reverseOut);
    case 2:
      return getDeviceStatusV2(device, reverseOut);
    case 3:
      return getDeviceStatusV3(device, reverseOut);
  }
};

export const makeQuery = (action: Action, reverseOut: boolean) => {
  const toToggle = action.toChange
    .filter(({ change }) => change === "toggle")
    .map(({ out }) => out);
  const toOn = action.toChange
    .filter(({ change }) => change === "on")
    .map(({ out }) => out);
  const toOff = action.toChange
    .filter(({ change }) => change === "off")
    .map(({ out }) => out);

  const query = [];
  if (toToggle.length) {
    query.push(`out=${toToggle.join("")}`);
  }
  if (toOn.length) {
    query.push(...toOn.map((no) => `out${no}=${reverseOut ? 1 : 0}`));
  }
  if (toOff.length) {
    query.push(...toOff.map((no) => `out${no}=${reverseOut ? 0 : 1}`));
  }

  return query.join("&");
};

export const performAction = async (device: Device, query: string) => {
  await axios.get<string>(`${device.url}/outs.cgi?${query}`, getConfig(device));
};

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
      timeout: 1000,
      httpAgent: new Agent({
        keepAlive: true,
        keepAliveMsecs: 10 * 60 * 1000,
        timeout: 1000,
      }),
      headers: {
        Connection: "keep-alive",
        Referer: device.url,
      },
    });
  }
  return CACHE.get(device.id);
};

const isTrue = (v: string): boolean => v === "1";

export const getDeviceStatus = async (
  device: Device
): Promise<DeviceStatus> => {
  const { data } = await axios.get(`${device.url}/st0.xml`, getConfig(device));
  const {
    response: { out0, out1, out2, out3, out4, out5 },
  } = await parseStringPromise(data);
  return {
    out: [
      isTrue(out0[0]),
      isTrue(out1[0]),
      isTrue(out2[0]),
      isTrue(out3[0]),
      isTrue(out4[0]),
      isTrue(out5[0]),
    ],
  };
};

export const makeQuery = (action: Action) => {
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
    query.push(...toOn.map((no) => `out${no}=1`));
  }
  if (toOff.length) {
    query.push(...toOff.map((no) => `out${no}=0`));
  }

  return query.join("&");
};

export const performAction = async (device: Device, query: string) => {
  await axios.get<string>(`${device.url}/outs.cgi?${query}`, getConfig(device));
};

import { Device } from "@webcarrot/multi-lan-controller/common/db/types";
import axios, { AxiosRequestConfig } from "axios";
import { parseStringPromise } from "xml2js";
import { DeviceOutNo, DeviceStatus } from "./types";
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

export const setOutStatus = async (
  device: Device,
  no: ReadonlyArray<DeviceOutNo>,
  value: boolean
) => {
  const status = await getDeviceStatus(device);
  const toChange = no.filter((no) => status.out[no] !== value);
  if (toChange.length) {
    await axios.get<string>(
      `${device.url}/outs.cgi?out=${toChange.join("")}`,
      getConfig(device)
    );
  }
};

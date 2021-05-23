import { Device } from "@webcarrot/multi-lan-controller/common/db/types";
import axios from "axios";
import { parseStringPromise } from "xml2js";
import { DeviceOutNo, DeviceStatus } from "./types";

const isTrue = (v: string): boolean => v === "1";

export const getDeviceStatus = async (
  device: Device
): Promise<DeviceStatus> => {
  const { data } = await axios.get(`${device.url}/st0.xml`);
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
  no: DeviceOutNo,
  value: boolean
) => {
  const { data } = await axios.get<string>(`${device.url}/outs.cgi?out=${no}`);
  if (isTrue(data) !== value) {
    await axios.get<string>(`${device.url}/outs.cgi?out=${no}`);
  }
};
